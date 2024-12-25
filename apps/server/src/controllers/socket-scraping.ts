import type { Server, Socket } from 'socket.io';
import { scrapeResult } from '../lib/scrape';
import { ResultScrapingLog } from '../models/log-result_scraping';
import ResultModel from "../models/result";
import dbConnect from '../utils/dbConnect';
import { skip } from 'node:test';


const LIST_TYPE = {
    ALL: "all",
    BACKLOG: "has_backlog",
    NEW_SEMESTER: "new_semester",
} as const
const TASK_STATUS = {
    QUEUED: 'queued',
    SCRAPING: 'scraping',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    PAUSED: 'paused',
} as const;

const EVENTS = {
    TASK_STATUS: 'task_status',
    TASK_START: 'task_start',
    TASK_CANCEL: 'task_cancel',
    TASK_PAUSE: 'task_pause',
    TASK_PAUSED_RESUME: 'task_paused_resume',
    TASK_ERROR: 'task_error',
    TASK_LIST: 'task_list',
} as const;


type taskDataType = {
    processable: number,
    processed: number,
    failed: number,
    success: number,
    skipped: number,
    data: {
        roll_no: string,
        status: typeof TASK_STATUS[keyof typeof TASK_STATUS],
    }[];
    startTime: number,
    endTime: number | null,
    status: typeof TASK_STATUS[keyof typeof TASK_STATUS],
    successfulRollNos: string[];
    failedRollNos: string[];
    skippedRollNos: string[];
    list_type: listType,
};

type listType = typeof LIST_TYPE[keyof typeof LIST_TYPE]


const BATCH_SIZE = 5;

const KEY_PREFIX = 'result_scraping';




// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handler_resultScraping(io: Server) {
    return async (socket: Socket) => {
        const activeTasks = new Map<string, boolean>();
        const tasksMap = new Map<string, taskDataType>();

        await dbConnect();
        socket.on('connect', async () => {
            console.log("A user connected:", socket.id);
        });

        socket.on(EVENTS.TASK_START, async ({ list_type = "has_backlog", task_resume_id }: { list_type: listType, task_resume_id?: string }) => {
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
                    const task = await ResultScrapingLog.exists({ taskId: task_resume_id });
                    if (!task) {
                        console.error("Task not found.");
                        socket.emit(EVENTS.TASK_ERROR, "Task not found.");
                        return;
                    }
                    taskId = task_resume_id;
                } else {
                    taskId = `${KEY_PREFIX}:${list_type}:${roll_list.size}:${Date.now()}`;
                }
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
                };
                tasksMap.set(taskId, taskData);
                await ResultScrapingLog.create({ taskId: taskId, ...taskData });
                socket.emit(EVENTS.TASK_STATUS, tasksMap.get(taskId));


                const rollArray = Array.from(roll_list);

                for (let i = 0; i < rollArray.length; i += BATCH_SIZE) {
                    if (!activeTasks.get(taskId)) break; // Stop if task is cancelled

                    const batch = rollArray.slice(i, i + BATCH_SIZE);
                    const taskStatus = tasksMap.get(taskId) as taskDataType;

                    if (taskStatus) {
                        if (taskStatus.status === TASK_STATUS.PAUSED) {
                            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before checking again
                            i -= BATCH_SIZE; // Reattempt the current batch
                            continue;
                        }
                    }

                    // Execute scrapeAndSaveResult in parallel for the current batch
                    const batchResults = await Promise.allSettled(
                        batch.map(rollNo => scrapeAndSaveResult(rollNo))
                    );

                    batchResults.forEach((result, index) => {
                        const rollNo = batch[index];
                        if (result.status === 'fulfilled' && result.value.success) {
                            taskData.success++;
                            taskData.successfulRollNos.push(rollNo);
                        } else {
                            taskData.failed++;
                            taskData.failedRollNos.push(rollNo);
                        }
                        taskData.processed++;
                    });
                    tasksMap.set(taskId, taskData);
                    
                    socket.emit(EVENTS.TASK_STATUS, taskData);
                }

                taskData.endTime = Date.now();
                taskData.status = TASK_STATUS.COMPLETED;
                tasksMap.set(taskId, taskData);
                await ResultScrapingLog.updateOne({ taskId: taskId }, {
                    $set: {
                        end_time: taskData.endTime, status: TASK_STATUS.COMPLETED,
                        successfulRollNos: Array.from(taskData.successfulRollNos), failedRollNos: Array.from(taskData.failedRollNos)
                    }
                })
                activeTasks.delete(taskId);

                socket.emit(EVENTS.TASK_STATUS, taskData);
            } catch (error) {
                console.error("Task start error:", error);

                socket.emit(EVENTS.TASK_ERROR, "An error occurred while starting the task.");
            }
        });

        socket.on(EVENTS.TASK_CANCEL, async (taskId: string) => {
            activeTasks.set(taskId, false);

            const taskData = tasksMap.get(taskId);
            if (taskData) {
                taskData.endTime = Date.now();
                taskData.status = TASK_STATUS.CANCELLED;
                tasksMap.set(taskId, taskData);
                await ResultScrapingLog.updateOne({ taskId: taskId }, {
                    $set: {
                        end_time: taskData.endTime, status: TASK_STATUS.CANCELLED,
                        successfulRollNos: Array.from(taskData.successfulRollNos), failedRollNos: Array.from(taskData.failedRollNos)
                    }
                });

            }

            socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.CANCELLED });
        });

        socket.on(EVENTS.TASK_PAUSE, async (taskId: string) => {
            const taskData = await ResultScrapingLog.findOne({ taskId: taskId });
            if (taskData) {
                const parsedTask = JSON.parse(taskData);
                parsedTask.endTime = Date.now();
                parsedTask.status = TASK_STATUS.PAUSED;
                tasksMap.set(taskId, parsedTask);
                await ResultScrapingLog.updateOne({ taskId: taskId }, {
                    $set: {
                        end_time: parsedTask.endTime, status: TASK_STATUS.PAUSED,
                        successfulRollNos: Array.from(parsedTask.successfulRollNos), failedRollNos: Array.from(parsedTask.failedRollNos)
                    }
                });
            }
            activeTasks.set(taskId, false);
            socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.PAUSED });
        });

        socket.on(EVENTS.TASK_PAUSED_RESUME, async (taskId: string) => {
            const taskData = tasksMap.get(taskId);
            if (taskData) {
                if (taskData.status === TASK_STATUS.PAUSED) {
                    activeTasks.set(taskId, true);
                    taskData.status = TASK_STATUS.QUEUED;
                    tasksMap.set(taskId, taskData);


                    socket.emit(EVENTS.TASK_PAUSED_RESUME, { task_resume_id: taskId, list_type: taskId.split(":")[1] });
                }
            }
        });

        socket.on(EVENTS.TASK_LIST, async () => {
            try {
                const tasks = await ResultScrapingLog.find({}).limit(30) as taskDataType[];

                socket.emit(EVENTS.TASK_LIST, tasks);
            } catch (error) {
                console.error("Error fetching task list:", error);
                socket.emit(EVENTS.TASK_ERROR, "An error occurred while fetching the task list.");
            }
        });

        socket.on(EVENTS.TASK_STATUS, async (taskId: string) => {
            const taskData = tasksMap.get(taskId);
            if (taskData) {
                socket.emit(EVENTS.TASK_STATUS, taskData);
            }
        })

        socket.on('disconnect', async () => {
            console.log("User disconnected:", socket.id);
            for await (const taskId of activeTasks.keys()) {
                activeTasks.set(taskId, false);
                tasksMap.set(taskId, { ...tasksMap.get(taskId) as taskDataType, status: TASK_STATUS.CANCELLED });
                await ResultScrapingLog.updateOne({ taskId: taskId }, {
                    $set: {
                        status: TASK_STATUS.PAUSED,
                        successfulRollNos: Array.from(tasksMap.get(taskId)?.successfulRollNos || []),
                        failedRollNos: Array.from(tasksMap.get(taskId)?.failedRollNos || []),
                        skippedRollNos: Array.from(tasksMap.get(taskId)?.skippedRollNos || []),
                        
                    }
                });
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
            query = { "semesters.length": { $lt: 8 } };
            break;
        case LIST_TYPE.ALL:
            query = {};
            break;
        default:
            return new Set<string>();
    }
    await dbConnect();
    const results = await ResultModel.find(query).select('rollNo updatedAt').sort('updatedAt') as { rollNo: string, updatedAt: Date }[];
    return new Set(results.map(result => result.rollNo))

}


async function scrapeAndSaveResult(rollNo: string) {
    try {
        const result = await scrapeResult(rollNo);
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