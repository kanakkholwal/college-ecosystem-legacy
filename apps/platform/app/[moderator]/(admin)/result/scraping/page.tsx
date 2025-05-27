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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";

import EmptyArea from "@/components/common/empty-area";
import { Label } from "@/components/ui/label";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import ConditionalRender from "@/components/utils/conditional-render";
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { formatRelative } from 'date-fns/formatRelative';
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { scrapingApi } from "./utils";
const BASE_SERVER_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL;


import { NumberTicker } from "@/components/animation/number-ticker";
import type { taskDataType } from "./types";
import { EVENTS, LIST_TYPE, TASK_STATUS } from "./types";


const sseEndpoint = new URL(`${BASE_SERVER_URL}/api/results/scrape-sse`);


export default function ScrapeResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const task_resume_id = searchParams.get("task_resume_id");
  const eventSourceRef = useRef<EventSource | null>(null);

  const [listType, setListType] = useState<
    (typeof LIST_TYPE)[keyof typeof LIST_TYPE]
  >(LIST_TYPE.BACKLOG);

  const [streaming, setStreaming] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [taskList, setTaskList] = useState<taskDataType[]>([]);

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
    _id: "",
  });


  const handleAction = (id: string, type: string) => {
    const [_1, listType, ...rest] = id.split(":");
    console.log("Action triggered", id, type);

    handleStartScraping({
      listType: listType as (typeof LIST_TYPE)[keyof typeof LIST_TYPE],
      actionType: type,
      task_resume_id: id,
    });

  }

  const handleStartScraping = (payload?: {
    listType: (typeof LIST_TYPE)[keyof typeof LIST_TYPE],
    actionType: string,
    task_resume_id: string,
  } | undefined) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    console.log("payload:", payload);
    setError(null);

    if (payload) {
      setListType(payload.listType);
      sseEndpoint.searchParams.set("list_type", payload.listType);
      sseEndpoint.searchParams.set("action", payload.actionType);
      if (payload.task_resume_id) {
        sseEndpoint.searchParams.set("task_resume_id", payload.task_resume_id);
      }
      console.log("Using provided payload:", payload);
    } else {
      sseEndpoint.searchParams.set("list_type", listType);
      sseEndpoint.searchParams.delete("task_resume_id");
      sseEndpoint.searchParams.set("action", EVENTS.STREAM_SCRAPING);
      console.log("No payload provided, using default listType:", listType);
    }
    router.push(`?${sseEndpoint.searchParams.toString()}`);

    setStreaming(true);

    eventSourceRef.current = new EventSource(sseEndpoint.toString(), {
      withCredentials: true,
    });
    console.log(eventSourceRef.current);

    eventSourceRef.current.onopen = () => {
      console.log("SSE connection opened");
    };


    // In startScraping function:
    eventSourceRef.current.addEventListener('task_status', (event) => {
      console.log("Received task status update");
      const data = JSON.parse(event.data);
      console.log("Task status data:", data);
      setTaskData(data.data);
    });

    eventSourceRef.current.addEventListener('task_list', (event) => {
      console.log("Received task list update");
      const data = JSON.parse(event.data);
      console.log("Task list data:", data);
      setTaskList(data.data);
    });

    eventSourceRef.current.addEventListener('task_completed', (event) => {
      console.log("Received task completed update");
      const data = JSON.parse(event.data);
      console.log("Task completed data:", data);
      toast.success("Scraping task completed successfully.");
      setStreaming(false);
      eventSourceRef.current?.close(); // ✅ explicitly close the SSE connection
    });

    eventSourceRef.current.addEventListener('error', (event) => {
      console.log("SSE error:", event);
      const { data } = JSON.parse(JSON.stringify(event));
      console.log("SSE error data:", data);
      setError(data?.error || "An error occurred while processing the request.");
      toast.error(data?.error || "An error occurred while processing the request.");
      setStreaming(false);
      eventSourceRef.current?.close(); // ✅ explicitly close the SSE connection
    });

    return () => {
      setStreaming(false);
      eventSourceRef.current?.removeEventListener('task_status', () => {});
      eventSourceRef.current?.removeEventListener('task_list', () => {});
      eventSourceRef.current?.removeEventListener('task_completed', () => {});
      eventSourceRef.current?.removeEventListener('error', () => {});
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      console.log("SSE connection closed");
    };
  };

  useEffect(() => {
    scrapingApi.getTaskList()
      .then(({ data: response }) => {
        if (!response || response.error) {
          console.log("Error fetching task list", response);
          return;
        }
        console.log("Fetched task list", response);
        setTaskList(response.data || []);
      })
      .catch((error) => {
        setError(error.message);
      });
    return () => {
      // Cleanup on component unmount
      eventSourceRef.current?.close();
      setStreaming(false);
    };
  }, []);


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
          className="flex items-center flex-wrap gap-2"
        >

          <Select
            value={listType}
            onValueChange={(value) =>
              setListType(value as (typeof LIST_TYPE)[keyof typeof LIST_TYPE])
            }
          >
            <SelectTrigger data-size="sm" className="w-[180px]">
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
              handleStartScraping();
            }}
            disabled={streaming}
          >
            {streaming ? " (Running)" : "Start new Scraping Task"}
          </Button>
          {streaming && (<Button
            size="sm"
            variant="warning_light"
            onClick={() => {
              eventSourceRef.current?.close();
            }}
          >
            Cancel Scraping
          </Button>)}
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
        <ConditionalRender condition={taskData._id !== ""}>
          <Alert variant="default" className="w-full" id="task-status">
            <AlertTitle className="flex items-center flex-wrap gap-1.5 whitespace-pre-wrap">
              <span className="text-card-foreground text-sm font-medium">
                ID: {taskData._id}
              </span>

            </AlertTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 pb-4">
              <div className="flex items-center flex-col">
                <Label className="text-sm">Processable</Label>
                <NumberTicker className="ml-2 text-sm font-medium text-stone-500" value={taskData.processable} />
              </div>
              <div className="flex items-center flex-col">
                <Label className="text-sm">Processed</Label>
                <NumberTicker className="ml-2 text-sm font-medium text-blue-500" value={taskData.processed} />
              </div>
              <div className="flex items-center flex-col">
                <Label className="text-sm">Success</Label>
                <NumberTicker className="ml-2 text-sm font-medium text-green-500" value={taskData.success} />
              </div>
              <div className="flex items-center flex-col">
                <Label className="text-sm">Failed</Label>
                <NumberTicker className="ml-2 text-sm font-medium text-red-500" value={taskData.failed} />
              </div>


            </div>
            <p className="text-sm text-muted-foreground space-x-1.5 space-y-1.5">

              <Badge size="sm">
                {taskData.skipped} skipped
              </Badge>
              {taskData.status && (
                <Badge size="sm">
                  {taskData.status}
                </Badge>
              )}
              <Badge size="sm">
                {taskData.list_type}
              </Badge>
              <Badge size="sm">
                {formatRelative(new Date(taskData?.startTime), new Date())}
              </Badge>
              {taskData?.endTime && (
                <Badge size="sm">
                  {`- ${formatDistanceToNow(new Date(taskData.endTime)
                  )}`}
                </Badge>
              )}
              <ResponsiveDialog
                btnProps={{
                  variant: "link",
                  size: "sm",
                  children: "View Failed",
                }}
                title="Failed Roll Numbers"
                description="This task has failed to process some roll numbers. Please review the details below."
              >
                <Label>
                  Failed Roll Numbers
                </Label>
                <FailedRollNumbers task={taskData} />
              </ResponsiveDialog>
            </p>
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
              <Badge variant="default_light" size="sm" className="ml-2">
                {taskList.length}
              </Badge>
            )}
            <Button
              variant="destructive_light"
              size="sm"
              className="ml-2"
              disabled={taskList.length === 0}
              onClick={() => {
                scrapingApi.clearAllTasks()
                  .then(({ data: response }) => {
                    setTaskList([]);
                    toast.success("All tasks cleared successfully.");
                  })
                  .catch((error) => {
                    toast.error(error.message);
                  });
              }}>
              Clear All Tasks
            </Button>
          </div>

        </div>
        <ConditionalRender condition={taskList.length === 0}>
          <EmptyArea
            title="No tasks found"
            description="There are no tasks available. Please start a new scraping task."
          />
        </ConditionalRender>
        <ConditionalRender condition={taskList.length > 0}>
          <Table>
            <TableCaption>A list of your recent tasks.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Task ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Start - End Time</TableHead>
                <TableHead>Processable</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Skipped</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskList.map((task) => {
                return (
                  <DisplayTask
                    task={task}
                    key={task.startTime}
                    actionFunction={handleAction}
                    deleteTask={(updatedTask) => setTaskList((prev) =>
                      prev.filter((t) => t._id !== updatedTask._id)
                    )}
                  />
                );
              })}
            </TableBody>
          </Table>
        </ConditionalRender>

      </section>
    </>
  );
}

function DisplayTask({
  task,
  actionFunction,
  deleteTask,
}: {
  task: taskDataType;
  actionFunction?: (id: string, type: string) => void;
  deleteTask?: (updatedTask: taskDataType) => void;
}) {
  const [_1, listType, _2, timestamp] = task.taskId.split(":");
  return (
    <>
      <TableRow>
        <TableCell className="font-medium whitespace-nowrap">
          {timestamp || task._id}
        </TableCell>
        <TableCell>{listType}</TableCell>

        <TableCell className="whitespace-nowrap">
          {formatRelative(new Date(task?.startTime), new Date())}
          {task.endTime && (
            <span className="ml-2">
              {`- ${formatDistanceToNow(new Date(task.endTime))} ago`}
            </span>
          )}
        </TableCell>
        <TableCell>{task.processable}</TableCell>
        <TableCell>{task.processed}</TableCell>
        <TableCell>{task.failed}</TableCell>
        <TableCell>{task.success}</TableCell>
        <TableCell>{task.skipped}</TableCell>
        <TableCell>
          <ResponsiveDialog
            btnProps={{
              variant: "outline",
              size: "sm",
              children: "View Failed"
            }}
            title="Failed Roll Numbers"
            description="Details of the task including roll numbers and their statuses."
          >
            <Label>
              Failed Roll Numbers
            </Label>
            <FailedRollNumbers task={task} />
          </ResponsiveDialog>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex gap-2 ml-auto">
            {actionFunction &&

              task.status !== TASK_STATUS.COMPLETED && task.processed < task.processable && (
                <Button
                  size="sm"
                  variant="default_light"
                  onClick={() =>
                    actionFunction(task._id, EVENTS.TASK_PAUSED_RESUME)
                  }
                >
                  Resume
                </Button>

              )}
            {actionFunction && task.status === TASK_STATUS.COMPLETED && (
              <Button
                size="sm"
                variant="default_light"
                onClick={() =>
                  actionFunction(task._id, EVENTS.TASK_RETRY_FAILED)
                }
              >
                Retry failed
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive_light"
              onClick={() => {
                scrapingApi.deleteTask(task._id)
                  .then(() => {
                    toast.success("Task deleted successfully.");
                    deleteTask?.(task);
                  })
                  .catch((error) => {
                    toast.error(error.message);
                  });
              }}
            >
              Delete
            </Button>
          </div>
        </TableCell>
      </TableRow>



    </>
  );
}


function FailedRollNumbers({
  task,
}: {
  task: taskDataType;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {task.failedRollNos.map((item, index) => {
        if (index > 10) return null;
        return (
          <Badge
            key={item}
            size="sm"
            variant="destructive"
          >
            {item}
          </Badge>
        );
      })}
      {task.failedRollNos.length > 10 && (
        <Badge size="sm" variant="destructive">
          +{task.failedRollNos.length - 10} more
        </Badge>
      )}
    </div>
  );
}