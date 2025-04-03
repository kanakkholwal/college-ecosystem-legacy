import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import type { courses } from "src/db/schema";
import type { Session } from "~/lib/auth-client";

// Infer types for courses
type CourseSelect = InferSelectModel<typeof courses>;

type Props = {
  course: CourseSelect;
  className?: string;
  authorized_role?:
    | Session["user"]["role"]
    | Session["user"]["other_roles"][number];
  style?: React.CSSProperties;
};

export default function CourseCard({
  course,
  className,
  authorized_role,
  style,
}: Props) {
  return (
    <Card
      variant="glass"
      className={cn("hover:shadow-lg animate-in popup", className)}
      style={style}
    >
      <CardHeader className="p-3">
        <h5 className="text-base font-semibold">{course.name}</h5>
        <p className="max-w-[30ch] text-sm opacity-80 text-pretty font-semibold">
          {course.code}
        </p>
      </CardHeader>
      <CardContent className="flex justify-around items-stretch gap-3 text-center p-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {course.type}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white"></p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Credits</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {course.credits}
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-end p-3">
        {authorized_role && (
          <Button size="sm" variant="link" effect="hoverUnderline" asChild>
            <Link href={`/${authorized_role}/courses/${course.code}`}>
              Edit Course
            </Link>
          </Button>
        )}
        <Button
          size="sm"
          variant="default_light"
          rounded="full"
          effect="gooeyRight"
          asChild
        >
          <Link href={`/syllabus/${course.code}`} target="_blank">
            View Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
