"use server";
import dbConnect from "src/lib/dbConnect";
import CourseModel from "src/models/course";

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

  return { courses, totalPages, types, departments };
}
