export const ROLES = {
  STUDENT: "student",
  CR: "cr",
  ADMIN: "admin",
  FACULTY: "faculty",
  HOD: "hod",
  ASSISTANT: "assistant",
  STAFF: "staff",
  MMCA: "mmca",
  WARDEN: "warden",
  LIBRARIAN: "librarian",
  ASSISTANT_WARDEN: "assistant_warden",
  CHIEF_WARDEN: "chief_warden",
} as const;

export const ROLES_LIST = Object.values(ROLES);

export const ROLES_MAP = Object.fromEntries(
  Object.entries(ROLES).map(([key, value]) => [value, key])
);
