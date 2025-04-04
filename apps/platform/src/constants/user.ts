import { z } from "zod";
import { ORG_DOMAIN } from "~/project.config";

export const ROLES = [
  "student",
  "faculty",
  "hod",
  "cr",
  "staff",
  "assistant",
  "mmca",
  "warden",
  "librarian",
  "assistant_warden",
  "chief_warden",
  "guard",
] as const;

export const genderSchema = z.enum(["male", "female", "not_specified"]);

export const emailSchema = z
  .string()
  .email({ message: "Invalid email format" })
  .min(5, { message: "Email must be at least 5 characters long" })
  .max(100, { message: "Email cannot exceed 100 characters" })
  .refine((val) => val.endsWith(`@${ORG_DOMAIN}`), {
    message: `Email must end with @${ORG_DOMAIN}`,
  });
