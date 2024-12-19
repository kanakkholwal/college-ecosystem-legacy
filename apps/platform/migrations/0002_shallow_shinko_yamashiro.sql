ALTER TYPE "public"."user_roles_enum" ADD VALUE 'cr';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';