import CourseCard from "@/components/application/course-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { getCourses } from "~/actions/course";
import Pagination from "./components/pagination";
import SearchBox from "./components/search";

type Props = {
  params: Promise<{
    moderator: string;
  }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
    department?: string;
    type?: string;
  }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `Courses | ${params.moderator} Dashboard | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    description:
      "Search for courses based on their name, code, department, and type.",
  };
}

export default async function CoursesPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const filter = {
    department: searchParams?.department || "",
    type: searchParams?.type || "",
  };
  const { courses, departments, types, totalPages } = await getCourses(
    query,
    currentPage,
    filter
  );
  // console.log(courses, departments, types);

  return (
    <>
      <div className="relative mb-28" id="home">
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
          <div className="relative pt-36 ml-auto">
            <div className="lg:w-3/4 text-center mx-auto">
              <h1 className="text-gray-900 dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl">
                Courses <span className="text-primary">Search</span>
              </h1>

              <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                <Suspense
                  key="SearchBox"
                  fallback={<Skeleton className="h-12 w-full " />}
                >
                  <SearchBox departments={departments} types={types} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-32 max-w-[144rem] grid lg:mb-0 lg:w-full mx-auto grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4 text-left gap-4">
        <Suspense
          key="Courses"
          fallback={
            <>
              <Skeleton className="h-12 w-full " />
              <Skeleton className="h-12 w-full " />
              <Skeleton className="h-12 w-full " />
            </>
          }
        >
          {courses.map((course) => {
            return (
              <CourseCard
                key={course.id}
                course={course}
                authorized_role={params.moderator}
              />
            );
          })}
        </Suspense>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6 mt-5">
        <Suspense
          key="Pagination"
          fallback={<Skeleton className="h-12 w-full " />}
        >
          {courses.length > 0 ? <Pagination totalPages={totalPages} /> : null}
        </Suspense>
      </div>
    </>
  );
}
