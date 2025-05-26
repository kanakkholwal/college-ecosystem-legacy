import type { Request, Response } from "express";
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
const TASK_STATUS = {
  QUEUED: "queued",
  SCRAPING: "scraping",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  PAUSED: "paused",
} as const;
type taskDataType = {
  processable: number;
  processed: number;
  failed: number;
  success: number;
  skipped: number;
  data: {
    roll_no: string;
    status: (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
  }[];
  startTime: number;
  endTime: number | null;
  status: (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
  successfulRollNos: string[];
  failedRollNos: string[];
  skippedRollNos: string[];
  list_type: listType;
  taskId: string;
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

const BATCH_SIZE = 10; // Number of roll numbers to process in each batch


export async function resultScrapingSSEHandler(req: Request, res: Response) {
  const list_type = req.query.list_type as string || LIST_TYPE.BACKLOG;
  const task_resume_id = req.query.task_resume_id as string | undefined;

  if (Object.values(LIST_TYPE).indexOf(list_type) === -1) {
    return res.status(400).send("Invalid list type");
  }

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  res.flushHeaders();
  try {

    // res.setHeader("Access-Control-Allow-Origin", "*");
    await dbConnect();
    const roll_list = await getListOfRollNos(list_type); // should return Set<string>
    if (!roll_list || roll_list.size === 0) {
      sendEvent(res, "error", {
        data: null,
        error: "No roll numbers found for the selected list type.",
      });
      res.end();
      return;
    }

    let taskId: string;
    let taskData: taskDataType;

    if (task_resume_id) {
      const task = await ResultScrapingLog.findOne({ taskId: task_resume_id });
      if (!task) {
        sendEvent(res, "error", {
          data: null,
          error: "Task not found.",
        });
        res.end();
        return;
      }

      taskId = task_resume_id;
      task.status = TASK_STATUS.SCRAPING;
      await task.save();

      taskData = {
        ...task.toObject(),
        endTime: null,
        status: TASK_STATUS.SCRAPING,
      };
    } else {
      taskId = `result_scraping:${list_type}:${roll_list.size}:${Date.now()}`;
      taskData = {
        processable: roll_list.size,
        processed: 0,
        failed: 0,
        success: 0,
        skipped: 0,
        data: [],
        startTime: Date.now(),
        endTime: null,
        status: TASK_STATUS.QUEUED,
        successfulRollNos: [],
        failedRollNos: [],
        skippedRollNos: [],
        list_type,
        taskId,
      };
      await ResultScrapingLog.create(taskData);
    }

    sendEvent(res, "task_status", {
      data: taskData,
      error: null,
    });

    const rollArray = Array.from(roll_list);
    for (let i = 0; i < rollArray.length; i += BATCH_SIZE) {
      const batch = rollArray.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((rollNo) => scrapeAndSaveResult(rollNo))
      );

      results.forEach((result, idx) => {
        const rollNo = batch[idx];
        if (result.status === "fulfilled" && result.value.success) {
          taskData.success++;
          taskData.successfulRollNos.push(rollNo);
        } else {
          taskData.failed++;
          taskData.failedRollNos.push(rollNo);
        }
        taskData.processed++;
      });

      await ResultScrapingLog.updateOne(
        { taskId },
        {
          $set: {
            processed: taskData.processed,
            failed: taskData.failed,
            success: taskData.success,
            successfulRollNos: taskData.successfulRollNos,
            failedRollNos: taskData.failedRollNos,
            status: TASK_STATUS.SCRAPING,
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
        res.end();
      });
    }

    taskData.status = TASK_STATUS.COMPLETED;
    taskData.endTime = Date.now();

    await ResultScrapingLog.updateOne(
      { taskId },
      {
        $set: {
          endTime: taskData.endTime,
          status: TASK_STATUS.COMPLETED,
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
      query = { $expr: { $gt: [{ $size: "$semesters" }, 8] } };
      break;
    case LIST_TYPE.DUAL_DEGREE:
      // has less than 8 semesters
      query = { programme: "Dual Degree" };
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
      return { rollNo, success: false };
    }
    // check if result already exists
    const existingResult = await ResultModel.findOne({ rollNo });
    if (existingResult) {
      existingResult.semesters = result.data.semesters;
      await existingResult.save();
      return { rollNo, success: true };
    }
    // create new result if not exists
    await ResultModel.create(result.data);
    return { rollNo, success: true };
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return { rollNo, success: false };
  }
}