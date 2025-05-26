"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";

import { useEffect, useState } from "react";

import EmptyArea from "@/components/common/empty-area";
import { Separator } from "@/components/ui/separator";
import ConditionalRender from "@/components/utils/conditional-render";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL;



const EVENTS = {
  TASK_STATUS: "task_status",
  TASK_START: "task_start",
  TASK_CANCEL: "task_cancel",
  TASK_PAUSE: "task_pause",
  TASK_PAUSED_RESUME: "task_paused_resume",
  TASK_DELETE_CANCELLED: "task_delete_cancelled",
  TASK_RESUME_LAST: "task_resume_last",
  TASK_RETRY_FAILED: "task_retry_failed",
} as const;

const TASK_STATUS = {
  IDLE: "idle",
  QUEUED: "queued",
  SCRAPING: "scraping",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  PAUSED: "paused",
} as const;

const LIST_TYPE = {
  ALL: "all",
  BACKLOG: "has_backlog",
  NEW_SEMESTER: "new_semester",
} as const;
type listType = (typeof LIST_TYPE)[keyof typeof LIST_TYPE];

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


const sseEndpoint = new URL(`${BASE_SERVER_URL}/api/results/scrape-sse`);


export default function ScrapeResultPage() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const taskType = searchParams.get("list_type");
  const action = searchParams.get("action");

  const [listType, setListType] = useState<
    (typeof LIST_TYPE)[keyof typeof LIST_TYPE]
  >(LIST_TYPE.BACKLOG);

  const [streaming, setStreaming] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [taskList, setTaskList] = useState<taskDataType[]>([]);
  const [taskAction, setTaskAction] = useState<string | null>(action || null);

  const [taskData, setTaskData] = useState<taskDataType>({
    processable: 0,
    status: TASK_STATUS.IDLE,
    processed: 0,
    failed: 0,
    success: 0,
    skipped: 0,
    data: [],
    startTime: Date.now(),
    endTime: null,
    successfulRollNos: [],
    failedRollNos: [],
    skippedRollNos: [],
    list_type: listType,
    taskId: "",
  });


  const startScraping = (taskType: string, taskId: string) => {
    if (taskId) {
      sseEndpoint.searchParams.append("task_resume_id", taskId);
    }
    if (!taskType) {
      toast.error("Please select a list type");
      return;
    }
    sseEndpoint.searchParams.append("list_type", taskType);
    const eventSource = new EventSource(sseEndpoint.toString(), {
      withCredentials: true,
    });
    eventSource.onopen = () => {
      console.log("SSE connection opened");
      setStreaming(true);
    };
    eventSource.onmessage = (event) => {
      setStreaming(true);
      console.log("SSE data", event);

      const data = JSON.parse(event.data);
      if (data.event === "task_list") {
        setTaskList(data.data);
      } else if (data.event === "task_status") {
        setTaskData(data.data);
      } else if (data.event === "error") {
        setError(data.error);
        toast.error(data.error);
        setStreaming(false);
      }
    };
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      setError("An error occurred while processing the request.");
      setStreaming(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  };
  const handleAction = (id: string, type: string) => {
    console.log("Action triggered", id, type);
    setTaskAction(type);
    sseEndpoint.searchParams.append("taskId", id);
    sseEndpoint.searchParams.append("action", type);
    startScraping(listType, id);

  }
  useEffect(() => {
    if (!taskId || !taskAction) return;

    sseEndpoint.searchParams.append("taskId", taskId);
    sseEndpoint.searchParams.append("action", taskAction);

    const eventSource = new EventSource(sseEndpoint.toString(), {
      withCredentials: true,
    });
    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("SSE data", event);
      if (data.event === "task_list") {
        setTaskList(data.data);
      } else if (data.event === "task_status") {
        setTaskData(data.data.data);
      } else if (data.event === "error") {
        setError(data.error);
        toast.error(data.error);
        setStreaming(false);
      }
    };
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      setError("An error occurred while processing the request.");
    };
    return () => {
      setStreaming(false);
      eventSource.close();
    };

  }, [taskId, taskAction]);


  return (
    <>
      <section className="p-6 border border-border rounded-lg shadow space-y-4 bg-card">
        <div>
          <h3 className="text-lg font-semibold">
            Scrape Result
          </h3>
        </div>

        <div
          aria-label="footer"
          className="flex items-center space-x-2"
        >

          <Select
            value={listType}
            onValueChange={(value) =>
              setListType(value as (typeof LIST_TYPE)[keyof typeof LIST_TYPE])
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="List Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LIST_TYPE).map(([key, value]) => {
                return (
                  <SelectItem key={key} value={value}>
                    {key}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={() => {
              console.log("start scraping", listType);
              startScraping(listType, taskId || "");
            }}
          >
            Start new Scraping Task
          </Button>
        </div>
        <ConditionalRender condition={streaming}>
          <Alert variant="info" className="w-full">
            <LoaderCircle className="h-4 w-4 animate-spin mr-2 text-primary" />
            <AlertTitle>Scraping in progress</AlertTitle>
            <AlertDescription>
              Scraping is in progress. Please wait for it to complete.
            </AlertDescription>
          </Alert>
        </ConditionalRender>
        <ConditionalRender condition={!!error}>
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </ConditionalRender>
        <ConditionalRender condition={!streaming && !error}>
          <Alert variant="default" className="w-full">
            <AlertTitle>Idle</AlertTitle>
            <AlertDescription>
              No scraping task is currently running.
            </AlertDescription>
          </Alert>
        </ConditionalRender>
        <ConditionalRender condition={taskData.taskId !== ""}>
          <Alert variant="default" className="w-full" id="task-status">
            <AlertTitle>
              Task ID: {taskData.taskId}
              <Separator orientation="vertical" className="mx-2" />
              {taskData.status && (
                <span className="text-sm font-medium">
                  {taskData.status}
                </span>
              )}
            </AlertTitle>
            <AlertDescription>

            </AlertDescription>
            {format(
              new Date(taskData.startTime),
              "dd/MM/yyyy HH:mm:ss"
            )}
            {taskData.endTime && (
              <span className="ml-2">
                {` - ${format(
                  new Date(taskData.endTime),
                  "dd/MM/yyyy HH:mm:ss"
                )}`}
              </span>
            )}
          </Alert>
        </ConditionalRender>

      </section>


      <section className="p-4 border border-border rounded-lg shadow bg-card space-y-4">
        <div
          aria-label="header"
          className="text-base font-medium"
        >
          <div>
            Task List{" "}
            {taskList.length > 0 && (
              <Badge variant="info" className="ml-2">
                {taskList.length}
              </Badge>
            )}
          </div>

        </div>
        {taskList.length === 0 && (
          <EmptyArea
            title="No tasks found"
            description="There are no tasks available at the moment."
          />
        )}
        {taskList.map((task) => {
          return (
            <DisplayTask
              task={task}
              key={task.startTime}
              actionFunction={handleAction}
            />
          );
        })}
      </section>
    </>
  );
}

function DisplayTask({
  task,
  actionFunction,
}: {
  task: taskDataType;
  actionFunction?: (id: string, type: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 bg-card p-3 rounded-md shadow">
      <div className="flex gap-4">
        <span className="text-xs lowercase font-medium">
          #{task.taskId.toLowerCase()}
        </span>
        {actionFunction &&
          task.status !== TASK_STATUS.CANCELLED &&
          task.status !== TASK_STATUS.COMPLETED && (
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                variant="default_light"
                onClick={() =>
                  actionFunction(task.taskId, EVENTS.TASK_PAUSED_RESUME)
                }
              >
                Resume
              </Button>
              <Button
                size="sm"
                variant="destructive_light"
                onClick={() => actionFunction(task.taskId, EVENTS.TASK_CANCEL)}
              >
                Cancel
              </Button>
            </div>
          )}
        {actionFunction && task.status === TASK_STATUS.COMPLETED && (
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="default_light"
              onClick={() =>
                actionFunction(task.taskId, EVENTS.TASK_RETRY_FAILED)
              }
            >
              Retry failed
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-6 border rounded-md p-2">
        <div className="whitespace-nowrap font-semibold text-base border-b p-2 text-center text-gray-800">
          Status
        </div>
        <div className="whitespace-nowrap font-semibold text-base border-b p-2 text-center text-gray-800">
          Processable
        </div>
        <div className="whitespace-nowrap font-semibold text-base border-b p-2 text-center text-gray-800">
          Processed
        </div>
        <div className="whitespace-nowrap font-semibold text-base border-b p-2 text-center text-gray-800">
          Failed
        </div>
        <div className="whitespace-nowrap font-semibold text-base border-b p-2 text-center text-gray-800">
          Success
        </div>
        <div className="whitespace-nowrap font-semibold text-base border-b p-2 text-center text-gray-800">
          Skipped
        </div>
        <div className="text-center p-2">
          <Badge variant="info">{task.status}</Badge>
        </div>
        <div className="text-center p-2">
          <Badge variant="info">{task.processable}</Badge>
        </div>
        <div className="text-center p-2">
          <Badge variant="info">{task.processed}</Badge>
        </div>
        <div className="text-center p-2">
          <Badge variant="info">{task.failed}</Badge>
        </div>
        <div className="text-center p-2">
          <Badge variant="info">{task.success}</Badge>
        </div>
        <div className="text-center p-2">
          <Badge variant="info">{task.skipped}</Badge>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {task.data
          .sort((a, b) => {
            if (a.status === TASK_STATUS.FAILED) return 1;
            if (b.status === TASK_STATUS.FAILED) return -1;
            return 0;
          })
          .map((item, index) => {
            if (index > 10) return null;
            return (
              <Badge
                key={item.roll_no}
                variant={
                  item.status === TASK_STATUS.FAILED ? "destructive" : "success"
                }
              >
                {item.roll_no} - {item.status}
              </Badge>
            );
          })}
      </div>
    </div>
  );
}
