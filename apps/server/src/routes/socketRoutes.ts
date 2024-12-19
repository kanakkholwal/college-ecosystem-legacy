import type { Socket } from 'socket.io';
import {
    getListOfRollNos,
    type listType,
    scrapeAndSaveResult
} from '../controllers/socket-scraping';

import { redisClient } from "../utils/redis";

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
} as const;

type taskDataType = {
    total_processable: number,
    total_processed: number,
    total_failed: number,
    total_success: number,
    total_skipped: number,
    data: {
        roll_no: string,
        status: typeof TASK_STATUS[keyof typeof TASK_STATUS],
    }[];
};

export async function socketServer(socket: Socket) {
    console.log('A user connected');

    const activeTasks = new Map<string, boolean>(); // To track task states (paused/cancelled)

    socket.on(EVENTS.TASK_START, async (list_type: listType = "has_backlog") => {
        const list = await getListOfRollNos(list_type);
        const taskId = `scraping:${list_type}:${Date.now()}`;
        activeTasks.set(taskId, true);

        const taskData: taskDataType = {
            total_processable: list.length,
            total_processed: 0,
            total_failed: 0,
            total_success: 0,
            total_skipped: 0,
            data: []
        };

        await redisClient.set(taskId, JSON.stringify({ startTime: Date.now(), listType: list_type }));

        let batchCount = 0;
        const batchSize = 10;

        for (const rollNo of list) {
            if (!activeTasks.get(taskId)) {
                socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.CANCELLED, data: taskData });
                break;
            }

            const isPaused = await redisClient.get(`${taskId}:paused`);
            if (isPaused) {
                socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.PAUSED, data: taskData });
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before resuming
                continue;
            }

            const redisPipeline = redisClient.pipeline();
            redisPipeline.get(`scraping:${list_type}:${rollNo.rollNo}`);
            const pipelineResults = await redisPipeline.exec();
            const isProcessedResult = pipelineResults?.[0];
            const isProcessed = isProcessedResult ? isProcessedResult[1] : null;


            if (isProcessed) {
                taskData.total_skipped++;
                if (++batchCount % batchSize === 0 || rollNo === list[list.length - 1]) {
                    socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.SCRAPING, data: taskData });
                }
                continue;
            }

            taskData.total_processed++;
            taskData.data.push({ roll_no: rollNo.rollNo, status: TASK_STATUS.SCRAPING });

            if (++batchCount % batchSize === 0 || rollNo === list[list.length - 1]) {
                socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.SCRAPING, data: taskData });
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
                console.error(error instanceof Error ? error.message : error);
                taskData.data[taskData.data.length - 1].status = TASK_STATUS.FAILED;
                taskData.total_failed++;
            }

            await redisClient.set(`scraping:${list_type}:${rollNo.rollNo}`, "true");

            if (++batchCount % batchSize === 0 || rollNo === list[list.length - 1]) {
                socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.SCRAPING, data: taskData });
            }
        }

        await redisClient.set(taskId, JSON.stringify({ ...taskData, endTime: Date.now() }));
        activeTasks.delete(taskId);
    });

    socket.on(EVENTS.TASK_CANCEL, async (taskId: string) => {
        activeTasks.set(taskId, false);
        await redisClient.set(`${taskId}:cancelled`, "true");
        socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.CANCELLED });
    });

    socket.on(EVENTS.TASK_PAUSE, async (taskId: string) => {
        await redisClient.set(`${taskId}:paused`, "true");
        socket.emit(EVENTS.TASK_STATUS, { status: TASK_STATUS.PAUSED });
    });

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
