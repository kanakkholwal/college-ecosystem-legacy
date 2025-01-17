export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  CR: "cr",
  FACULTY: "faculty",
  HOD: "hod",
  ASSISTANT: "assistant",
  MMCA: "mmca",
  WARDEN: "warden",
  ASSISTANT_WARDEN: "assistant_warden",
  CHIEF_WARDEN: "chief_warden",
  LIBRARIAN: "librarian",
  STAFF: "staff",
} as const;

export const ROLES_LIST: readonly string[] = Object.values(ROLES)

export const ROLES_MAP = Object.fromEntries(
  Object.entries(ROLES).map(([key, value]) => [value, key])
);
