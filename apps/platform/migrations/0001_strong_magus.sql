CREATE TYPE "public"."user_roles_enum" AS ENUM('admin', 'student', 'faculty', 'hod');--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "roles" TO "role";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "other_roles" "user_roles_enum"[] DEFAULT '{}' NOT NULL;