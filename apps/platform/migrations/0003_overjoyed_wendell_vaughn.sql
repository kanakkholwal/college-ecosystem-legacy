ALTER TABLE "public"."timetables" ALTER COLUMN "department_code" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."department_code_enum";--> statement-breakpoint
CREATE TYPE "public"."department_code_enum" AS ENUM('cse', 'ece', 'ee', 'me', 'ce', 'che', 'mse', 'mnc', 'arc', 'phy');--> statement-breakpoint
ALTER TABLE "public"."timetables" ALTER COLUMN "department_code" SET DATA TYPE "public"."department_code_enum" USING "department_code"::"public"."department_code_enum";--> statement-breakpoint
ALTER TABLE "public"."users" ALTER COLUMN "department" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."department_name_enum";--> statement-breakpoint
CREATE TYPE "public"."department_name_enum" AS ENUM('Staff', 'Computer Science and Engineering', 'Electronics and Communication Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Materials Science and Engineering', 'Mathematics & Scientific Computing', 'Architecture', 'Engineering Physics');--> statement-breakpoint
ALTER TABLE "public"."users" ALTER COLUMN "department" SET DATA TYPE "public"."department_name_enum" USING "department"::"public"."department_name_enum";