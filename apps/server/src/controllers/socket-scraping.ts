import type { Server, Socket } from "socket.io";
import { scrapeResult } from "../lib/scrape";
import { ResultScrapingLog } from "../models/log-result_scraping";
import ResultModel from "../models/result";
import dbConnect from "../utils/dbConnect";

const LIST_TYPE = {
  ALL: "all",
  BACKLOG: "has_backlog",
  NEW_SEMESTER: "new_semester",
  DUAL_DEGREE: "dual_degree",
} as const;

const TASK_STATUS = {
  QUEUED: "queued",
  SCRAPING: "scraping",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  PAUSED: "paused",
} as const;

const EVENTS = {
  TASK_STATUS: "task_status",
  TASK_START: "task_start",
  TASK_CANCEL: "task_cancel",
  TASK_PAUSE: "task_pause",
  TASK_PAUSED_RESUME: "task_paused_resume",
  TASK_ERROR: "task_error",
  TASK_LIST: "task_list",
  TASK_DELETE_CANCELLED: "task_delete_cancelled",
  TASK_RESUME_LAST: "task_resume_last",
  TASK_RETRY_FAILED: "task_retry_failed",
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

type listType = (typeof LIST_TYPE)[keyof typeof LIST_TYPE];

const BATCH_SIZE = 5;

const KEY_PREFIX = "result_scraping";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handler_resultScraping(io: Server) {
  return async (socket: Socket) => {
    const activeTasks = new Map<string, boolean>();
    const tasksMap = new Map<string, taskDataType>();

    await dbConnect();
    socket.on("connect", () => {
      console.log("A user connected:", socket.id);
    });

    socket.on(
      EVENTS.TASK_START,
      async ({
        list_type = "has_backlog",
        task_resume_id,
      }: {
        list_type: listType;
        task_resume_id?: string;
      }) => {
        try {
          console.log(`Starting task for list type: ${list_type}`);
          const roll_list = await getListOfRollNos(list_type);
          if (!roll_list || roll_list.size === 0) {
            console.error("Empty roll list.");
            socket.emit(EVENTS.TASK_ERROR, "No roll numbers to process.");
            return;
          }

          let taskId: string;
          if (task_resume_id) {
            const task = await ResultScrapingLog.findOne({
              taskId: task_resume_id,
            });
            if (!task) {
              console.error("Task not found.");
              socket.emit(EVENTS.TASK_ERROR, "Task not found.");
              return;
            }
            console.log("Resuming task:", task_resume_id);
            taskId = task_resume_id;
            activeTasks.set(taskId, true);
            const taskData: taskDataType = {
              processable: roll_list.size,
              processed: task.processed,
              failed: task.failed,
              success: task.success,
              skipped: task.skipped,
              data: [],
              startTime: task.startTime,
              endTime: null,
              status: TASK_STATUS.QUEUED,
              successfulRollNos: task.successfulRollNos,
              failedRollNos: task.failedRollNos,
              skippedRollNos: task.skippedRollNos,
              list_type,
              taskId: task_resume_id,
            };
            tasksMap.set(taskId, taskData);
            task.status = TASK_STATUS.SCRAPING;
            await task.save();
          } else {
            taskId = `${KEY_PREFIX}:${list_type}:${roll_list.size}:${Date.now()}`;
            activeTasks.set(taskId, true);

            const taskData: taskDataType = {
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
            tasksMap.set(taskId, taskData);
            await ResultScrapingLog.create({ ...taskData });
          }
          const taskData = tasksMap.get(taskId) as taskDataType;
          socket.emit(EVENTS.TASK_STATUS, tasksMap.get(taskId));

          const rollArray = Array.from(roll_list);

          for (let i = 0; i < rollArray.length; i += BATCH_SIZE) {
            if (!activeTasks.get(taskId)) break; // Stop if task is cancelled

            const batch = rollArray.slice(i, i + BATCH_SIZE);
            const taskStatus = tasksMap.get(taskId) as taskDataType;

            if (taskStatus) {
              if (taskStatus.status === TASK_STATUS.PAUSED) {
                await sleep(1000);
                i -= BATCH_SIZE; // Reattempt the current batch
                continue;
              }
            }
            taskStatus.status = TASK_STATUS.SCRAPING;

            // Execute scrapeAndSaveResult in parallel for the current batch
            const batchResults = await Promise.allSettled(
              batch.map((rollNo) => scrapeAndSaveResult(rollNo))
            );

            batchResults.forEach((result, index) => {
              const rollNo = batch[index];
              if (result.status === "fulfilled" && result.value.success) {
                taskData.success++;
                taskData.successfulRollNos = [
                  ...taskData.successfulRollNos,
                  rollNo,
                ];
              } else {
                taskData.failed++;
                taskData.failedRollNos = [...taskData.failedRollNos, rollNo];
              }
              if (taskData.processable > taskData.processed)
                taskData.processed += 1;
            });
            tasksMap.set(taskId, taskData);
            console.log(
              EVENTS.TASK_START,
              `Task ${taskId}: Processed ${taskData.processed} of ${taskData.processable} roll numbers.`
            );
            await ResultScrapingLog.updateOne(
              { taskId: taskId },
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
            socket.emit(EVENTS.TASK_STATUS, tasksMap.get(taskId));
            // 2 seconds delay between each batch
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          taskData.endTime = Date.now();
          taskData.status = TASK_STATUS.COMPLETED;
          tasksMap.set(taskId, taskData);
          await ResultScrapingLog.updateOne(
            { taskId: taskId },
            {
              $set: {
                endTime: taskData.endTime,
                status: TASK_STATUS.COMPLETED,
                successfulRollNos: taskData.successfulRollNos,
                failedRollNos: taskData.failedRollNos,
              },
            }
          );
          activeTasks.delete(taskId);

          socket.emit(EVENTS.TASK_STATUS, taskData);
        } catch (error) {
          console.error("Task start error:", error);

          socket.emit(
            EVENTS.TASK_ERROR,
            "An error occurred while starting the task."
          );
        }
      }
    );

    socket.on(EVENTS.TASK_CANCEL, async (taskId: string) => {
      console.log("Cancelling task:", taskId);
      activeTasks.set(taskId, false);

      const taskData = await ResultScrapingLog.findOne({ taskId });
      if (taskData) {
        taskData.endTime = Date.now();
        taskData.status = TASK_STATUS.CANCELLED;
        tasksMap.set(taskId, taskData);
        await ResultScrapingLog.updateOne(
          { taskId: taskId },
          {
            $set: {
              endTime: taskData.endTime,
              status: TASK_STATUS.CANCELLED,
              successfulRollNos: taskData.successfulRollNos,
              failedRollNos: taskData.failedRollNos,
            },
          }
        );
        const tasks = (await ResultScrapingLog.find({}).limit(
          30
        )) as taskDataType[];
        socket.emit(EVENTS.TASK_LIST, tasks);
      } else {
        socket.emit(EVENTS.TASK_ERROR, "Task not found.");
      }
    });

    socket.on(EVENTS.TASK_PAUSE, async (taskId: string) => {
      console.log("Pausing task:", taskId);
      const taskData = await ResultScrapingLog.findOne({ taskId: taskId });
      if (taskData) {
        taskData.endTime = Date.now();
        taskData.status = TASK_STATUS.PAUSED;
        tasksMap.set(taskId, taskData);
        await ResultScrapingLog.updateOne(
          { taskId: taskId },
          {
            $set: {
              endTime: taskData.endTime,
              status: TASK_STATUS.PAUSED,
              successfulRollNos: taskData.successfulRollNos,
              failedRollNos: taskData.failedRollNos,
            },
          }
        );
        activeTasks.set(taskId, false);
        socket.emit(EVENTS.TASK_STATUS, tasksMap.get(taskId));
      } else {
        socket.emit(EVENTS.TASK_ERROR, "Task not found.");
      }
    });

    socket.on(EVENTS.TASK_PAUSED_RESUME, async (taskId: string) => {
      console.log("Resuming task:", taskId);
      const taskData = await ResultScrapingLog.findOne({ taskId });
      if (!taskData) {
        socket.emit(EVENTS.TASK_ERROR, "Task not found.");
        return;
      }
      if (
        taskData.status === TASK_STATUS.PAUSED ||
        taskData.status === TASK_STATUS.QUEUED ||
        taskData.status === TASK_STATUS.SCRAPING
      ) {
        activeTasks.set(taskId, true);
        taskData.status = TASK_STATUS.QUEUED;
        tasksMap.set(taskId, taskData);
        console.log("Task resumed:", taskId);
        socket.emit(EVENTS.TASK_PAUSED_RESUME, {
          task_resume_id: taskId,
          list_type: taskId.split(":")[1],
        });
      } else {
        socket.emit(EVENTS.TASK_ERROR, "Task not paused.");
      }
    });

    socket.on(EVENTS.TASK_RESUME_LAST, async () => {
      const lastTask = (await ResultScrapingLog.findOne({}).sort({
        startTime: -1,
      })) as taskDataType | null;
      if (!lastTask) {
        socket.emit(EVENTS.TASK_ERROR, "No task to resume.");
        return;
      }
      socket.emit(EVENTS.TASK_PAUSED_RESUME, {
        task_resume_id: lastTask.taskId,
        list_type: lastTask.list_type,
      });
    });

    socket.on(EVENTS.TASK_LIST, async () => {
      try {
        console.log("Fetching task list");
        const tasks = (await ResultScrapingLog.find({}).limit(
          30
        )) as taskDataType[];
        // Add tasks to tasksMap
        for await (const task of tasks) {
          if (!tasksMap.has(task.taskId)) tasksMap.set(task.taskId, task);
        }
        socket.emit(EVENTS.TASK_LIST, JSON.parse(JSON.stringify(tasks)));
        console.log("Task list fetched.");
      } catch (error) {
        console.log("Error fetching task list:", error);
        socket.emit(
          EVENTS.TASK_ERROR,
          "An error occurred while fetching the task list."
        );
      }
    });

    socket.on(EVENTS.TASK_STATUS, async (taskId: string) => {
      const task = await ResultScrapingLog.findOne({ taskId: taskId });
      if (!task) {
        socket.emit(EVENTS.TASK_ERROR, "Task not found.");
        return;
      }
      if (!tasksMap.has(task.taskId)) tasksMap.set(task.taskId, task);
      socket.emit(EVENTS.TASK_STATUS, tasksMap.get(taskId));
    });

    socket.on(EVENTS.TASK_DELETE_CANCELLED, async () => {
      try {
        await ResultScrapingLog.deleteMany({ status: TASK_STATUS.CANCELLED });
        // remove cancelled tasks from tasksMap
        for await (const taskId of activeTasks.keys()) {
          if (tasksMap.get(taskId)?.status === TASK_STATUS.CANCELLED) {
            tasksMap.delete(taskId);
          }
        }
        const tasks = await ResultScrapingLog.find({})
          .limit(30)
          .sort({ startTime: -1 });
        console.log("Deleted cancelled tasks.");
        socket.emit(EVENTS.TASK_LIST, tasks);
        socket.emit(EVENTS.TASK_STATUS, { taskId: "" });
      } catch (error) {
        console.log("Error deleting cancelled tasks:", error);
        socket.emit(
          EVENTS.TASK_ERROR,
          "An error occurred while deleting cancelled tasks.",
          error
        );
      }
    });

    socket.on(EVENTS.TASK_RETRY_FAILED, async (taskId: string) => {
      try {
        console.log(EVENTS.TASK_RETRY_FAILED, taskId);
        const task = (await ResultScrapingLog.findOne({
          taskId: taskId,
        })) as taskDataType | null;
        if (!task) {
          console.log("Task not found.");
          socket.emit(EVENTS.TASK_ERROR, "Task not found.");
          return;
        }
        const failedRollNos = task.failedRollNos;
        if (failedRollNos.length === 0) {
          console.log("No failed roll numbers to retry.");
          socket.emit(EVENTS.TASK_ERROR, "No failed roll numbers to retry.");
          return;
        }
        activeTasks.set(task.taskId, true);
        tasksMap.set(task.taskId, { ...task, status: TASK_STATUS.SCRAPING });

        socket.emit(EVENTS.TASK_STATUS, tasksMap.get(task.taskId));
        console.log(`Retrying failed roll numbers for task: ${task.taskId}`);
        await ResultScrapingLog.updateOne(
          { taskId: task.taskId },
          {
            $set: {
              status: TASK_STATUS.SCRAPING,
            },
          }
        );
        const rollArray = Array.from(new Set(failedRollNos));
        for (let i = 0; i < rollArray.length; i += BATCH_SIZE) {
          if (!activeTasks.get(task.taskId)) break; // Stop if task is cancelled

          const batch = rollArray.slice(i, i + BATCH_SIZE);
          const taskData = tasksMap.get(task.taskId) as taskDataType;

          if (taskData) {
            if (taskData.status === TASK_STATUS.PAUSED) {
              await sleep(1000);
              i -= BATCH_SIZE; // Reattempt the current batch
              continue;
            }
          }
          taskData.status = TASK_STATUS.SCRAPING;

          // Execute scrapeAndSaveResult in parallel for the current batch
          const batchResults = await Promise.allSettled(
            batch.map((rollNo) => scrapeAndSaveResult(rollNo))
          );

          batchResults.forEach((result, index) => {
            const rollNo = batch[index];
            if (result.status === "fulfilled" && result.value.success) {
              taskData.success++;
              taskData.failedRollNos = taskData.failedRollNos.filter(
                (roll) => roll !== rollNo
              );
              taskData.failed -= 1;
              taskData.successfulRollNos = [
                ...taskData.successfulRollNos,
                rollNo,
              ];
            }
            if (taskData.processable > taskData.processed) taskData.processed++;
          });
          tasksMap.set(task.taskId, taskData);
          console.log(
            `Task ${task.taskId}: Processed ${taskData.processed} of ${taskData.processable} roll numbers.`
          );
          await ResultScrapingLog.updateOne(
            { taskId: task.taskId },
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
          socket.emit(EVENTS.TASK_STATUS, tasksMap.get(task.taskId));
          // 2 seconds delay between each batch
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error("Task retry failed error:", error);
        socket.emit(
          EVENTS.TASK_ERROR,
          "An error occurred while retrying failed roll numbers."
        );
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      for await (const taskId of activeTasks.keys()) {
        activeTasks.set(taskId, false);
        tasksMap.set(taskId, {
          ...(tasksMap.get(taskId) as taskDataType),
          status: TASK_STATUS.PAUSED,
        });
        await ResultScrapingLog.updateOne(
          { taskId: taskId },
          {
            $set: {
              status: TASK_STATUS.PAUSED,
              successfulRollNos: tasksMap.get(taskId)?.successfulRollNos || [],
              failedRollNos: tasksMap.get(taskId)?.failedRollNos || [],
              skippedRollNos: tasksMap.get(taskId)?.skippedRollNos || [],
            },
          }
        );
      }
    });
  };
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
