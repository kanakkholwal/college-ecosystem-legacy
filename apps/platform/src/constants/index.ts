import { z } from "zod";
import { orgConfig } from "~/project.config";

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
  GUARD: "guard",
} as const;

export const ROLES_LIST: readonly string[] = Object.values(ROLES);

export const ROLES_MAP = Object.fromEntries(
  Object.entries(ROLES).map(([key, value]) => [value, key])
);

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  NOT_SPECIFIED: "not_specified",
};

export const emailSchema = z
  .string()
  .email()
  .refine((val) => val.endsWith(`@${orgConfig.domain}`), {
    message: `Email must end with @${orgConfig.domain}`,
  });
