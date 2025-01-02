export const ROLES = {
  STUDENT: "student",
  CR: "cr",
  ADMIN: "admin",
  FACULTY: "faculty",
  HOD: "hod",
  MODERATOR: "moderator",
  STAFF: "staff",
} as const;

export const ROLES_LIST = Object.values(ROLES);

export const ROLES_MAP = Object.fromEntries(
  Object.entries(ROLES).map(([key, value]) => [value, key])
);
