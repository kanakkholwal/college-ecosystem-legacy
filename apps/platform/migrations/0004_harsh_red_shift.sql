CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'not_specified');--> statement-breakpoint
ALTER TYPE "public"."user_roles_enum" ADD VALUE 'staff';--> statement-breakpoint
ALTER TYPE "public"."user_roles_enum" ADD VALUE 'assistant';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "gender" SET DATA TYPE user_gender_enum;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'not_specified';