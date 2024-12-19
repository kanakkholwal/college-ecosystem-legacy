"use client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    useSocketStatus
    , getSocketStatus
} from '@/hooks/useSocketStatus';
import { useEffect, useState } from 'react';

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL
const EVENTS = {
    TASK_STATUS: 'task-status',
    TASK_START: 'task-start',
} as const


const LIST_TYPE = {
    ALL: "all",
    BACKLOG: "has_backlog",
    NEW_SEMESTER: "new_semester",
} as const


export default function ScrapeResultPage() {

    const [_status, socket] = useSocketStatus(BASE_SERVER_URL, {
        path: "/ws/results-scraping",
    });
    const status = getSocketStatus(_status);
    const [data, setData] = useState([]);

    useEffect(() => {

        // socket?.emit(EVENTS.TASK_START, { list_type: "all" });
        socket?.on(EVENTS.TASK_STATUS, (data) => {
            console.log(data);
        })
    }, [socket])

    return (<>
        <div className="w-full flex gap-4 p-4">
            Connection
            <Badge className="flex gap-2" variant={status.variant} size="sm">
                {status.text}
            </Badge>

        </div>
        <Button onClick={() => socket?.emit(EVENTS.TASK_START, LIST_TYPE.BACKLOG)}>
            Start Scraping
        </Button>

    </>)
}