import { createCourse } from "src/lib/course/actions";
import dbConnect from "src/lib/dbConnect";
import { CourseType } from "src/models/course";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import ResultModel from "src/models/result";
import NewCourseForm from "./form";

export const metadata: Metadata = {
  title: "New Course | Admin",
  description: "Create a new course",
};

export default async function CoursesPage() {
  await dbConnect();
  const branches = await ResultModel.distinct("branch");

  async function saveCourse(courseData: CourseType) {
    "use server";
    const course = await createCourse(courseData);
    revalidatePath("/admin/courses");

    return course;
  }

  return (
    <>
      <Card className="m-4 mt-10">
        <CardHeader>
          <CardTitle>New Course</CardTitle>
          <CardDescription>Create a new course</CardDescription>
        </CardHeader>
        <NewCourseForm departments={branches} saveCourse={saveCourse} />
      </Card>
    </>
  );
}
