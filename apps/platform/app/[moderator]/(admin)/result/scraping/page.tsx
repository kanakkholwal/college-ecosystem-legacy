"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSocketStatus, useSocketStatus } from "@/hooks/useSocketStatus";
import { Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from "react";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL;
const EVENTS = {
  TASK_STATUS: "task-status",
  TASK_START: "task-start",
} as const;

const LIST_TYPE = {
  ALL: "all",
  BACKLOG: "has_backlog",
  NEW_SEMESTER: "new_semester",
} as const;

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
    });
  }, [socket]);

  return (
    <>
      <Alert>
        {_status.connected ? <Wifi className="size-6 !text-green-500" /> : <WifiOff className="size-6 !text-red-500" />}
        <AlertTitle>
          Connection 
        </AlertTitle>
        <AlertDescription>
          <Badge className="flex gap-2 max-w-content" variant={status.variant} size="sm">
            {status.text}
          </Badge>
          {Object.entries(status).map(([key, value]) => {
            if (key === "text" || key === "variant") return null;
            return (
              <Badge key={key} className="flex gap-2 max-w-content" variant="secondary" size="sm">
                {key}: {value}
              </Badge>
            );
          })}

        </AlertDescription>

      </Alert>

      <Button
        onClick={() => socket?.emit(EVENTS.TASK_START, LIST_TYPE.BACKLOG)}
      >
        Start Scraping
      </Button>
    </>
  );
}
