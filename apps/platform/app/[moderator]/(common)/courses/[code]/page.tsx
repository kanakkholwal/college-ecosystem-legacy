import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getCourseByCode, updateCourseByCr } from "src/lib/course/actions";
import dbConnect from "src/lib/dbConnect";
import { CourseTypeWithId } from "src/models/course";
import ResultModel from "src/models/result";
import { EditCourseForm } from "./form";

export default async function Page({ params }: { params: { code: string } }) {
  await dbConnect();
  const course = await getCourseByCode(params.code);
  if (!course) {
    return notFound();
  }
  console.log(course);
  const branches = await ResultModel.distinct("branch");
  async function updateCourse(courseData: CourseTypeWithId & { _id: string }) {
    "use server";
    const res = await updateCourseByCr(courseData);
    if (courseData.code !== params.code) {
      redirect("/admin/courses/" + courseData.code);
    }
    // revalidatePath("/admin/courses/[code]", "page");
    return res;
  }

  return (
    <>
      <Card className="m-4 mt-10">
        <CardHeader>
          <CardTitle>Edit Course - {course.code}</CardTitle>
          <CardDescription>Edit an existing course</CardDescription>
        </CardHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <EditCourseForm
            departments={branches}
            course={course}
            saveCourse={updateCourse}
          />
        </Suspense>
      </Card>
    </>
  );
}
