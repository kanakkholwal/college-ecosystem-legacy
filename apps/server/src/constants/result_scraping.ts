
export const LIST_TYPE = {
  ALL: "all",
  BACKLOG: "has_backlog",
  NEW_SEMESTER: "new_semester",
  DUAL_DEGREE: "dual_degree",
}
export type listType = typeof LIST_TYPE[keyof typeof LIST_TYPE];

export const EVENTS = {
  TASK_STATUS: "task_status",

  TASK_PAUSED_RESUME: "task_paused_resume",

  STREAM_SCRAPING: "stream_scraping",

  TASK_DELETE: "delete_task",
  TASK_CLEAR_ALL: "clear_all_tasks",
  TASK_GET_LIST: "task_list",
  TASK_RETRY_FAILED: "task_retry_failed",

} as const;


export const TASK_STATUS = {
  SCRAPING: "scraping",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;