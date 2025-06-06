import type { Request, Response } from "express";
import mongoose from "mongoose";
import { scrapeResult } from "../lib/scrape";
import { ResultScrapingLog } from "../models/log-result_scraping";
import ResultModel from "../models/result";
import dbConnect from "../utils/dbConnect";

const LIST_TYPE = {
  ALL: "all",
  BACKLOG: "has_backlog",
  NEW_SEMESTER: "new_semester",
  DUAL_DEGREE: "dual_degree",
}
type listType = typeof LIST_TYPE[keyof typeof LIST_TYPE];

export const EVENTS = {
  TASK_STATUS: "task_status",

  TASK_PAUSED_RESUME: "task_paused_resume",

  STREAM_SCRAPING: "stream_scraping",

  TASK_DELETE: "delete_task",
  TASK_CLEAR_ALL: "clear_all_tasks",
  TASK_GET_LIST: "task_list",
  TASK_RETRY_FAILED: "task_retry_failed",

} as const;

const BATCH_SIZE = 10; // Number of roll numbers to process in each batch



const TASK_STATUS = {
  SCRAPING: "scraping",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

type taskDataType = {
  processable: number;
  processed: number;
  failed: number;
  success: number;
  skipped: number;
  data: {
    roll_no: string;
    reason: string;
  }[];
  startTime: number;
  endTime: number | null;
  status: (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
  successfulRollNos: string[];
  failedRollNos: string[];
  skippedRollNos: string[];
  list_type: listType;
  taskId: string;
  _id: string;
};

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


export async function resultScrapingSSEHandler(req: Request, res: Response) {
  const list_type = req.query.list_type as string || LIST_TYPE.BACKLOG;
  const actionType = req.query.action as string | undefined;
  const task_resume_id = req.query.task_resume_id as string | undefined;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;


  if (!actionType || Object.values(EVENTS).indexOf(actionType as typeof EVENTS[keyof typeof EVENTS]) === -1) {
    return res.status(400).send("Invalid action type");
  }

  try {

    // res.setHeader("Access-Control-Allow-Origin", "*");
    await dbConnect();
    if (actionType === EVENTS.TASK_GET_LIST) {
      const tasks = await ResultScrapingLog.find({ list_type }).sort({ startTime: -1 });

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
      skipped: 0,
      data: [],
      startTime: Date.now(),
      endTime: null,
      status: TASK_STATUS.SCRAPING,
      successfulRollNos: [],
      failedRollNos: [],
      skippedRollNos: [],
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
        return res.status(404).send("Task not found");
      }
      if (task.processed >= task.processable) {
        return res.status(400).send("Task has already been processed");
      }
      taskData = {
        ...task.toObject(),
        endTime: null,
        status: TASK_STATUS.SCRAPING,
      };
      taskId = task_resume_id;
      roll_list = new Set(task.failedRollNos); // retry only failed roll numbers
      if (roll_list.size === 0) {
        return res.status(400).send("No failed roll numbers to retry");
      }
    }
    if (actionType === EVENTS.STREAM_SCRAPING) {
      if (Object.values(LIST_TYPE).indexOf(list_type) === -1) {
        return res.status(400).send("Invalid list type");
      }

      roll_list = await getListOfRollNos(list_type); // should return Set<string>
      if (!roll_list || roll_list.size === 0) {
        return res.status(404).json({
          data: null,
          error: "No roll numbers found for the selected list type.",
        });
      }
      taskData.processable = roll_list.size; // set processable count based on roll numbers


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
    const rollArray = Array.from(roll_list);
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
        } else {
          taskData.failed++;
          taskData.failedRollNos.push(rollNo);

          taskData.data.push({
            roll_no: rollNo,
            reason: result.status === "fulfilled" ? result.value.error : result.reason || "Unknown error",
          });
        }
        if (taskData.processed >= taskData.processable) {
          console.log("All roll numbers processed, breaking the loop");
          break; // Exit the loop if all roll numbers are processed
        }
        taskData.processed++;
      }

      await ResultScrapingLog.updateOne(
        { taskId: taskData.taskId },
        {
          $set: {
            processed: taskData.processed,
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
        taskData.endTime = Date.now();
        await ResultScrapingLog.updateOne(
          { taskId },
          {
            $set: {
              endTime: taskData.endTime,
              status: TASK_STATUS.CANCELLED,
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
    taskData.endTime = Date.now();

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
          $or: [
            {
              $and: [
                { $lt: [{ $size: "$semesters" }, 8] }, // less than 8 semesters
                { programme: "B.Tech" } 
              ]
            },
            {
              $and: [
                { $lt: [{ $size: "$semesters" }, 10] }, // less than 10 semesters
                { programme: "B.Arch" } 
              ]
            },
            {
              $and: [
                { $lt: [{ $size: "$semesters" }, 12] }, // less than 12 semesters
                { programme: "Dual Degree" } 
              ]
            },
          ]
        }
      };
      break;
    case LIST_TYPE.DUAL_DEGREE:
      // has less than 8 semesters
      query = { programme: "Dual Degree", $expr: { $lt: [{ $size: "$semesters" }, 12] } };
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