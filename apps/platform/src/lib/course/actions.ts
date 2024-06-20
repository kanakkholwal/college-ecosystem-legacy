"use server";
import dbConnect from "src/lib/dbConnect";
import CourseModel, { CourseType, CourseTypeWithId } from "src/models/course";
import { getSession } from "../auth";
// Path: src/lib/course/actions.ts

export async function getCourses(
  query: string,
  currentPage: number,
  filter: {
    department?: string;
    type?: string;
  }
) {
  await dbConnect();

  const resultsPerPage = 32;
  const skip = currentPage * resultsPerPage - resultsPerPage;

  const filterQuery = {
    $or: [
      { code: { $regex: query, $options: "i" } },
      { name: { $regex: query, $options: "i" } },
    ],
  } as unknown as any;

  // Apply filters if provided and not equal to "all"
  if (filter.department && filter.department !== "all") {
    filterQuery["department"] = filter.department;
  }

  if (filter.type && filter.type !== "all") {
    filterQuery["type"] = filter.type;
  }

  const courses = await CourseModel.find(filterQuery)
    .skip(skip)
    .limit(resultsPerPage)
    .exec();

  const departments = await CourseModel.distinct("department");
  const types = await CourseModel.distinct("type");

  const totalPages = Math.ceil(
    (await CourseModel.countDocuments(filterQuery)) / resultsPerPage
  );

  return {
    courses: JSON.parse(JSON.stringify(courses)) as CourseTypeWithId[],
    totalPages,
    types,
    departments,
  };
}
export async function getCourseByCode(code: string) {
  await dbConnect();
  const course = await CourseModel.findOne({ code }).lean().exec();
  return JSON.parse(JSON.stringify(course)) as CourseTypeWithId;
}
export async function getCourseById(id: string) {
  await dbConnect();
  const course = await CourseModel.findById(id).exec();
  return JSON.parse(JSON.stringify(course)) as CourseTypeWithId;
}
export async function createCourse(course: CourseType) {
  await dbConnect();
  const newCourse = await CourseModel.create(course);
  return JSON.parse(JSON.stringify(newCourse)) as CourseTypeWithId;
}
export async function updateCourseByCr(course: CourseTypeWithId) {
  const session = await getSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  if (
    !(session.user.roles.includes("cr") || session.user.roles.includes("admin"))
  ) {
    throw new Error(
      "User not authorized , only cr,faculty and admin can update courses"
    );
  }
  await dbConnect();
  const updatedCourse = await CourseModel.findByIdAndUpdate(
    course._id,
    course,
    { new: true }
  ).exec();
  return updatedCourse as CourseTypeWithId;
}
export async function updateBooksAndRefPublic(course: CourseTypeWithId) {
  await dbConnect();
  //  append new books and references to the existing ones
  const updatedCourse = await CourseModel.findByIdAndUpdate(
    course._id,
    {
      $set: {
        books_and_references: course.books_and_references,
      },
    },
    { new: true }
  ).exec();
  return JSON.parse(JSON.stringify(updatedCourse)) as CourseTypeWithId;
}
export async function updatePrevPapersPublic(course: CourseTypeWithId) {
  await dbConnect();
  //  append new prev papers to the existing ones
  const updatedCourse = await CourseModel.findByIdAndUpdate(
    course._id,
    {
      $set: {
        prev_papers: course.prev_papers,
      },
    },
    { new: true }
  ).exec();
  return updatedCourse;
}
export async function deleteCourse(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  if (
    !(session.user.roles.includes("cr") || session.user.roles.includes("admin"))
  ) {
    throw new Error(
      "User not authorized , only cr,faculty and admin can delete courses"
    );
  }
  await dbConnect();
  const deletedCourse = await CourseModel.findByIdAndDelete(id).exec();
  return deletedCourse;
}
