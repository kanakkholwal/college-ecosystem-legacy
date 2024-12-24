import type { Server, Socket } from 'socket.io';
import { scrapeResult } from '../lib/scrape';
import ResultModel from "../models/result";
import dbConnect from '../utils/dbConnect';


import { redisClient } from "../utils/redis";

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
    successfulRollNos: Set<string>,
    failedRollNos: Set<string>,
};

type listType = typeof LIST_TYPE[keyof typeof LIST_TYPE]


const BATCH_SIZE = 5;

const KEY_PREFIX = 'result_scraping';




export function handler_resultScraping(io: Server) {
    return async (socket: Socket) => {
        const activeTasks = new Map<string, boolean>();

        socket.on('connect', async () => {
            console.log("A user connected:", socket.id);
        });

        socket.on(EVENTS.TASK_START, async ({list_type="has_backlog",task_resume_id}:{list_type:listType,task_resume_id?:string}) => {
            try {
                console.log(`Starting task for list type: ${list_type}`);
                const roll_list = await getListOfRollNos(list_type);
                if (!roll_list || roll_list.size === 0) {
                    console.error("Empty roll list.");
                    socket.emit(EVENTS.TASK_ERROR, "No roll numbers to process.");
                    return;
                }

                const taskId = task_resume_id ? task_resume_id :`${KEY_PREFIX}:${list_type}:${roll_list.size}:${Date.now()}`;
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
                    successfulRollNos: new Set<string>(),
                    failedRollNos: new Set<string>(),
                };

                await redisClient.set(taskId, JSON.stringify(taskData));
                socket.emit(EVENTS.TASK_STATUS, taskData);


                // Loop through each roll number one by one
                for (const rollNo of roll_list) {
                    if (!activeTasks.get(taskId)) break;  // Stop processing if task is canceled

                    const taskStatus = await redisClient.get(taskId);
                    if (taskStatus) {
                        const parsedStatus = JSON.parse(taskStatus);
                        if (parsedStatus.status === TASK_STATUS.PAUSED) {
                            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait if paused
                            continue;
                        }
                    }

                    const isProcessed = await redisClient.get(`scraping:${list_type}:${rollNo}`);
                    if (isProcessed) {
                        taskData.skipped++;
                        await redisClient.set(taskId, JSON.stringify(taskData));
                        continue; // Skip if already processed
                    }

                    try {
                        const response = await scrapeAndSaveResult(rollNo);
                        if (response.success) {
                            taskData.success++;
                            taskData.successfulRollNos.add(rollNo);
                        } else {
                            taskData.failed++;
                            taskData.failedRollNos.add(rollNo);
                        }
                    } catch (error) {
                        console.error("Error during scraping:", error);
                        taskData.failed++;
                    }

                    taskData.processed++;
                    socket.emit(EVENTS.TASK_STATUS, taskData);
                    await redisClient.set(`scraping:${list_type}:${rollNo}`, "true");

                    // Save task data after processing each roll number
                    await redisClient.set(taskId, JSON.stringify(taskData));
                }

                taskData.endTime = Date.now();
                taskData.status = TASK_STATUS.COMPLETED;
                await redisClient.set(taskId, JSON.stringify(taskData));
                activeTasks.delete(taskId);

                socket.emit(EVENTS.TASK_STATUS, taskData);
            } catch (error) {
                console.error("Task start error:", error);
                socket.emit(EVENTS.TASK_ERROR, "An error occurred while starting the task.");
            }
        });

        socket.on(EVENTS.TASK_CANCEL, async (taskId: string) => {
            activeTasks.set(taskId, false);
            await redisClient.set(`${taskId}:cancelled`, "true");

            const taskData = await redisClient.get(taskId);
            if (taskData) {
                const parsedTask = JSON.parse(taskData);
                parsedTask.endTime = Date.now();
                parsedTask.status = TASK_STATUS.CANCELLED;
                await redisClient.set(taskId, JSON.stringify(parsedTask));
            }

            socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.CANCELLED });
        });

        socket.on(EVENTS.TASK_PAUSE, async (taskId: string) => {
            const taskData = await redisClient.get(taskId);
            if (taskData) {
                const parsedTask = JSON.parse(taskData);
                parsedTask.endTime = Date.now();
                parsedTask.status = TASK_STATUS.PAUSED;
                await redisClient.set(taskId, JSON.stringify(parsedTask));
            }
            activeTasks.set(taskId, false);
            socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.PAUSED });
        });

        socket.on(EVENTS.TASK_PAUSED_RESUME, async (taskId: string) => {
            const taskData = await redisClient.get(taskId);
            if (taskData) {
                const parsedTask = JSON.parse(taskData);
                if (parsedTask.status === TASK_STATUS.PAUSED) {
                    activeTasks.set(taskId, true);
                    
                    socket.emit(EVENTS.TASK_PAUSED_RESUME, { task_resume_id: taskId,list_type:taskId.split(":")[1] });
                }
            }
        });

        socket.on(EVENTS.TASK_LIST, async () => {
            try {
                // Get all the task keys that are stored in Redis (these keys could follow a specific pattern like 'scraping:*')
                const taskKeys = await redisClient.keys(`${KEY_PREFIX}:*`);  // Adjust the pattern as per your task keys structure
                console.log("Task keys:", taskKeys);
                // Fetch the task data for all keys
                const tasks = await Promise.all(
                    taskKeys.map(async (key) => {
                        const taskData = await redisClient.get(key);
                        if (taskData) {
                            return JSON.parse(taskData);
                        }
                        return null;
                    })
                );

                // Filter out any null values (if some tasks don't have data in Redis)
                const validTasks = tasks.filter(task => task !== null);

                // Emit the list of valid tasks to the client
                socket.emit(EVENTS.TASK_LIST, validTasks);
            } catch (error) {
                console.error("Error fetching task list:", error);
                socket.emit(EVENTS.TASK_ERROR, "An error occurred while fetching the task list.");
            }
        });
        
        // socket.on(EVENTS.TASK_STATUS, async (taskId: string) => {
        //     const taskData = await redisClient.get(taskId);
        //     if (taskData) {
        //         const parsedTask = JSON.parse(taskData);
        //         socket.emit(EVENTS.TASK_STATUS, parsedTask);
        //     }
        // })

        socket.on('disconnect', async () => {
            console.log("User disconnected:", socket.id);
            for (const taskId of activeTasks.keys()) {
                activeTasks.set(taskId, false);
                await redisClient.set(`${taskId}:paused`, "true");
            }
        });


        function iterateRollNo(rollNo:string){
            
        }
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