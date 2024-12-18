import type { Socket } from 'socket.io';
import {
    getListOfRollNos,
    type listType,
    scrapeAndSaveResult
} from '../controllers/socker-scraping';

import { redisClient } from "../utils/redis";

// Define task status constants
const TASK_STATUS = {
    QUEUED: 'queued',
    SCRAPING: 'scraping',
    // UPDATING: 'updating',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
} as const

const EVENTS = {
    TASK_STATUS: 'task-status',
    TASK_START: 'task-start',
} as const

type taskDataType = {
    total_processable: number,
    total_processed: number,
    total_failed: number,
    total_success: number,
    total_skipped: number,
    data: {
        roll_no: string,
        status: typeof TASK_STATUS[keyof typeof TASK_STATUS],
    }[]
}


export async function socketServer(socket: Socket) {
    console.log('A user connected');
    // Connect to Redis
    // Start task processing on socket connection
    socket.on(EVENTS.TASK_START, async (list_type: listType = "has_backlog") => {
        const list = await getListOfRollNos(list_type);
        const taskData: taskDataType = {
            total_processable: list.length,
            total_processed: 0,
            total_failed: 0,
            total_success: 0,
            total_skipped: 0,
            data: []
        };

        // Store task metadata in Redis
        const taskId = `scraping:${list_type}:${Date.now()}`;
        await redisClient.set(taskId, JSON.stringify({ startTime: Date.now(), listType: list_type }));

        let batchCount = 0;
        const batchSize = 10;

        // Process the list of roll numbers
        for (const rollNo of list) {
            const redisPipeline = redisClient.pipeline();
            redisPipeline.get(`scraping:${list_type}:cancelled`);
            redisPipeline.get(`scraping:${list_type}:${rollNo.rollNo}`);

            const results = await redisPipeline.exec();
            if (!results) {
                console.error('Error occurred while fetching data from Redis');
                console.log(results);
                break;
            }
            const cancelled = results[0][1];  // Access the result (not the error) for the cancellation check
            const isProcessed = results[1][1];  // Access the result (not the error) for the processed status

            if (cancelled) {
                socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.CANCELLED });
                break;
            }

            if (isProcessed) {
                taskData.total_skipped++;
                if (++batchCount % batchSize === 0 || rollNo === list[list.length - 1]) {
                    socket.emit(EVENTS.TASK_STATUS, taskData);
                }
                continue;
            }

            taskData.total_processed++;
            taskData.data.push({ roll_no: rollNo.rollNo, status: TASK_STATUS.SCRAPING });
            if (++batchCount % batchSize === 0 || rollNo === list[list.length - 1]) {
                socket.emit(EVENTS.TASK_STATUS, taskData);
            }

            try {
                const response = await scrapeAndSaveResult(rollNo.rollNo);
                if (!response.success) {
                    taskData.data[taskData.data.length - 1].status = TASK_STATUS.FAILED;
                    taskData.total_failed++;
                } else {
                    taskData.data[taskData.data.length - 1].status = TASK_STATUS.COMPLETED;
                    taskData.total_success++;
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                }
                taskData.data[taskData.data.length - 1].status = TASK_STATUS.FAILED;
                taskData.total_failed++;
            }

            await redisClient.set(`scraping:${list_type}:${rollNo.rollNo}`, "true");

            // Emit task status for every batch
            if (++batchCount % batchSize === 0 || rollNo === list[list.length - 1]) {
                socket.emit(EVENTS.TASK_STATUS, taskData);
            }
        }

        // Store task completion metadata
        await redisClient.set(taskId, JSON.stringify({ ...taskData, endTime: Date.now() }));
    });


    // Example: emitting an event to the client
    socket.emit('welcome', '{status: "OK", message: "Welcome to the server"}');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
}

type SocketServer = Record<string, {
    path: string,
    handler: (socket: Socket) => Promise<void>
}>;

const socketServers: SocketServer = {
    result_scraping: {
        path: '/ws/results-scraping',
        handler: socketServer,
    },
};

export default socketServers;
