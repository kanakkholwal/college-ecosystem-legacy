import type { Request, Response } from "express";
import mongoose from "mongoose";
import { scrapeResult } from "../lib/scrape";
import type { taskDataType } from "../models/log-result_scraping";
import { ResultScrapingLog } from "../models/log-result_scraping";
import ResultModel from "../models/result";
import dbConnect from "../utils/dbConnect";

import { EVENTS, LIST_TYPE, TASK_STATUS, type listType } from "../constants/result_scraping";

const BATCH_SIZE = 10; // Number of roll numbers to process in each batch



const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// helper
const sendEvent = (res: Response, event: string, data: {
  data: taskDataType | null,
  error?: string | null,
}) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const activeSSEConnections = new Map<string, Response>(); // Map<IP, Response>

const checkAndRegisterSSE = (ip: string, res: Response): boolean => {
  if (activeSSEConnections.has(ip)) {
    console.log(`Rejected: IP ${ip} already has an active SSE connection.`);
    return false;
  }

  activeSSEConnections.set(ip, res);
  console.log(`Registered SSE connection for IP ${ip}`);

  // Cleanup on disconnect
  res.on('close', () => {
    activeSSEConnections.delete(ip);
    console.log(`SSE connection closed by IP ${ip}`);
  });

  return true;
};

const isValidActionType = (actionType: string): actionType is (typeof EVENTS)[keyof typeof EVENTS] => {
  return Object.values(EVENTS).includes(actionType as (typeof EVENTS)[keyof typeof EVENTS]);
};

const isValidListType = (listType: string): listType is listType => {
  return Object.values(LIST_TYPE).includes(listType as listType);
};

export async function resultScrapingSSEHandler(req: Request, res: Response) {
  const list_type = req.query.list_type as string || LIST_TYPE.BACKLOG;
  const actionType = req.query.action as string | undefined;
  const task_resume_id = req.query.task_resume_id as string | undefined;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;


  if (!actionType || !isValidActionType(actionType)) {
    return res.status(400).json({
      data: null,
      error: "Invalid or missing action type",
    });
  }

  try {

    // res.setHeader("Access-Control-Allow-Origin", "*");
    await dbConnect();
    if (actionType === EVENTS.TASK_GET_LIST) {
      const tasks = await ResultScrapingLog.find({}).sort({ startTime: -1 });

      return res.status(200).json({
        data: JSON.parse(JSON.stringify(tasks)),
        error: null,
      });
    }
    if (actionType === EVENTS.TASK_CLEAR_ALL) {
      await ResultScrapingLog.deleteMany({});

      return res.status(200).json({
        data: [],
        error: null,
      });
    }
    if (actionType === EVENTS.TASK_DELETE) {
      if (!req.query.deleteTaskId) {
        return res.status(400).send("Task ID is required");
      }
      await ResultScrapingLog.deleteOne({ taskId: req.query.deleteTaskId as string });

      return res.status(200).json({
        data: [],
        error: null,
      });
    }

    console.log("ip", ip)
    if (!ip) {
      return res.status(400).send("IP address not found");
    }
    if (!checkAndRegisterSSE(ip as string, res)) {
      return res.status(429).end('SSE already active from this IP');
    }

    let taskId = `result_scraping:${list_type}:${Date.now()}`;
    let taskData: taskDataType = {
      processable: 0, // will be set later based on roll numbers
      processed: 0,
      failed: 0,
      success: 0,
      data: [],
      startTime: new Date(),
      endTime: null,
      status: TASK_STATUS.SCRAPING,
      successfulRollNos: [],
      failedRollNos: [],
      queue: [],
      list_type,
      taskId,
      _id: new mongoose.Types.ObjectId().toString(), // generate a new ObjectId for the task
    };
    // If task_resume_id is provided, resume the task
    let roll_list: Set<string> = new Set<string>();

    if (actionType === EVENTS.TASK_RETRY_FAILED || actionType === EVENTS.TASK_PAUSED_RESUME) {
      if (!task_resume_id) {
        return res.status(400).send("Task ID is required ");
      }
      const task = await ResultScrapingLog.findOne({ _id: task_resume_id });
      if (!task) {
        return res.status(200).json({
          data: null,
          error: "Task not found",
        });
      }
      // if (actionType === EVENTS.TASK_PAUSED_RESUME && task.processed >= task.processable) {
      //   return res.status(200).json({
      //     data: null,
      //     error: "Task has already been processed",
      //   });
      // }
      taskData = {
        ...task.toObject(),
        endTime: null,
        status: TASK_STATUS.SCRAPING,
      };
      taskId = task_resume_id;
      if (actionType === EVENTS.TASK_PAUSED_RESUME) {
        roll_list = new Set(taskData.queue);
        // If resuming from a paused task, we need to reset the processed count
        taskData.processable -= taskData.queue.length; // reduce processable count by the number of roll numbers in the queue
      }
      else if (actionType === EVENTS.TASK_RETRY_FAILED)  // retry failed task
      {
        roll_list = new Set(taskData.failedRollNos);
        taskData.processable = taskData.failedRollNos.length; // set processable count to the number of failed roll numbers
      }
      if (roll_list.size === 0) {
        return res.status(200).json({
          data: null,
          error: actionType === EVENTS.TASK_PAUSED_RESUME ? "No roll numbers to resume from paused task." : "No failed roll numbers to retry.",
        });
      }
    }
    if (actionType === EVENTS.STREAM_SCRAPING) {
      if (!isValidListType(list_type)) {
        return res.status(200).json({
          data: null,
          error: "Invalid list type provided",
        });
      }

      roll_list = await getListOfRollNos(list_type); // should return Set<string>
      if (!roll_list || roll_list.size === 0) {
        return res.status(200).json({
          data: null,
          error: "No roll numbers found for the selected list type.",
        });
      }
      taskData.processable = roll_list.size; // set processable count based on roll numbers
      taskData.queue = Array.from(roll_list); // convert Set to Array for queue
      taskData.startTime = new Date(); // set start time to now

      const task = await ResultScrapingLog.create(taskData);
      taskId = task._id.toString(); // ensure taskId is a string
      taskData = task.toObject() as taskDataType; // convert to taskDataType
      console.log("Starting result scraping for list type:", list_type, "actionType:", actionType, "task_resume_id:", task_resume_id);
    }

    // Set headers for SSE
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });
    res.flushHeaders();
    // Send initial task status
    if (taskData === null) {
      console.log(taskData, "taskData is null");
      sendEvent(res, "error", {
        data: taskData,
        error: "Task data not assigned correctly",
      });
      return;
    }

    sendEvent(res, "task_status", {
      data: taskData,
      error: null,
    });
    // Handle client disconnection
    let isConnectionAlive = true;
    req.on('close', async () => {
      if (!isConnectionAlive) return;
      isConnectionAlive = false;

      console.log('Client disconnected');
      await ResultScrapingLog.updateOne(
        { taskId },
        { $set: { ...taskData, endTime: Date.now(), status: TASK_STATUS.CANCELLED } }
      );

      try {
        sendEvent(res, "task_status", { data: taskData, error: null });
        // res.write("event: task_cancelled\n");
      } catch (e) {
        console.error("Error sending event:", e);
        console.log('Client already disconnected');
      }
      res.end();
    });

    // Process roll numbers in batches
    const rollNoQueue = new Set<string>(taskData.queue); // use Set to avoid duplicates
    const rollArray = Array.from(rollNoQueue);
    for (let i = 0; i < rollArray.length; i += BATCH_SIZE) {
      if (!isConnectionAlive) break; // Exit loop if connection closed
      const batch = rollArray.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((rollNo) => scrapeAndSaveResult(rollNo))
      );

      for (const [idx, result] of results.entries()) {
        if (!isConnectionAlive) break; // Exit loop if connection closed

        // previous approach
        const rollNo = batch[idx];
        if (result.status === "fulfilled" && result.value.success) {
          taskData.success++;
          taskData.successfulRollNos.push(rollNo);
          if(actionType === EVENTS.TASK_RETRY_FAILED){
            taskData.failedRollNos = taskData.failedRollNos.filter(r => r !== rollNo);
            taskData.failed--;
          }
        } else {
          taskData.failed++;
          taskData.failedRollNos.push(rollNo);

          taskData.data.push({
            roll_no: rollNo,
            reason: result.status === "fulfilled" ? result.value.error : result.reason || "Unknown error",
          });
        }
        if (taskData.queue.length === 0) {
          console.log("All roll numbers processed, breaking the loop");
          break; // Exit the loop if all roll numbers are processed
        }
        taskData.processed++;
        rollNoQueue.delete(rollNo); // Remove processed roll number from queue
        taskData.queue = Array.from(rollNoQueue); // Update queue in taskData
      }
      // Update taskData in the database after each batch
      taskData.queue = Array.from(rollNoQueue); // Update queue in taskData
      await ResultScrapingLog.updateOne(
        { taskId: taskData.taskId },
        {
          $set: {
            processed: taskData.processed,
            queue: taskData.queue,
            failed: taskData.failed,
            success: taskData.success,
            successfulRollNos: taskData.successfulRollNos,
            failedRollNos: taskData.failedRollNos,
            status: TASK_STATUS.SCRAPING,
            data: taskData.data,
          },
        }
      );

      sendEvent(res, "task_status", {
        data: taskData,
        error: null,
      });
      await sleep(1000);
      req.on('close', async () => {
        console.log('Client disconnected');
        taskData.status = TASK_STATUS.CANCELLED;
        taskData.endTime = new Date();
        await ResultScrapingLog.updateOne(
          { taskId },
          {
            $set: {
              endTime: taskData.endTime,
              status: TASK_STATUS.CANCELLED,
              processable: taskData.processable,
              processed: taskData.processed,
              failed: taskData.failed,
              success: taskData.success,
              successfulRollNos: taskData.successfulRollNos,
              failedRollNos: taskData.failedRollNos,
              data: taskData.data,
              queue: taskData.queue,
            },
          }
        );
        sendEvent(res, "task_status", {
          data: taskData,
          error: null,
        });
        res.write("event: task_cancelled\n");
        res.write("data: null\n");
        // break;
        res.end();
      });
    }

    taskData.status = TASK_STATUS.COMPLETED;
    taskData.endTime = new Date();

    await ResultScrapingLog.updateOne(
      { taskId: taskData.taskId },
      {
        $set: {
          ...taskData, // spread the taskData to update all fields
        },
      }
    );

    sendEvent(res, "task_status", {
      data: taskData,
      error: null,
    });
    res.write("event: task_completed\n");
    res.end();

  } catch (error) {
    console.error("Error in SSE handler:", error);
    res.status(500).send("Internal Server Error");
  }
}
async function getListOfRollNos(list_type: listType): Promise<Set<string>> {
  let query = {};
  switch (list_type) {
    case LIST_TYPE.BACKLOG:
      query = { "semesters.courses.cgpi": 0 };
      break;
    case LIST_TYPE.NEW_SEMESTER:
      // has less than 8 semesters
      query = {
        $expr: {
          $lt: [
            { $size: "$semesters" },
            {
              $switch: {
                branches: [
                  { case: { $eq: ["$programme", "B.Tech"] }, then: 8 },
                  { case: { $eq: ["$programme", "B.Arch"] }, then: 10 },
                  { case: { $eq: ["$programme", "Dual Degree"] }, then: 12 }
                ],
                default: 0 // exclude if programme is none of these
              }
            }
          ]
        }
      };
      break;
    case LIST_TYPE.DUAL_DEGREE:
      // has more than 6 semesters
      query = { programme: "Dual Degree", $expr: { $gt: [{ $size: "$semesters" }, 6] } };
      break;
    case LIST_TYPE.ALL:
      query = {};
      break;
    default:
      return new Set<string>();
  }
  await dbConnect();
  const results = (await ResultModel.find(query)
    .select("rollNo updatedAt")
    .sort("updatedAt")) as { rollNo: string; updatedAt: Date }[];
  return new Set(results.map((result) => result.rollNo));
}

async function scrapeAndSaveResult(rollNo: string) {
  try {
    const result = await scrapeResult(rollNo);
    await sleep(500);
    //  check if scraping was failed
    if (result.error || result.data === null) {
      return { rollNo, success: false, error: result.error || "Scraping failed" };
    }
    // check if result already exists
    const existingResult = await ResultModel.findOne({ rollNo });
    if (existingResult) {
      existingResult.semesters = result.data.semesters;
      await existingResult.save();
      return { rollNo, success: true, error: null };
    }
    // create new result if not exists
    await ResultModel.create(result.data);
    return { rollNo, success: true, error: null };
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return { rollNo, success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}