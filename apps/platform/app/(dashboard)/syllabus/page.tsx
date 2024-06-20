import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCourses } from "src/lib/course/actions";
import Pagination from "./components/pagination";
import SearchBox from "./components/search";

export const metadata: Metadata = {
  title: "Syllabus Search",
  description: "Search for syllabus of any course in NITH",
  keywords: [
    "NITH",
    "Syllabus",
    "Courses",
    "NITH Courses",
    "NITH Syllabus",
    "Syllabus Search",
    "NITH Syllabus Search",
    "NITH Courses Search",
  ],
};
export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    department?: string;
    type?: string;
  };
}) {
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
  console.log(courses, departments, types);

  return (
    <>
      <section
        id="hero"
        className="z-10 w-full max-w-6xl relative flex flex-col items-center justify-center  py-24 max-h-80 text-center"
      >
        <h2
          className="text-2xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap"
          data-aos="fade-up"
        >
          Syllabus <span className="text-primary">Search</span>
        </h2>
        <p
          className="mt-4 text-neutral-700 dark:text-neutral-300"
          data-aos="zoom-in"
        >
          Search for syllabus of any course in NITH
        </p>
        <div
          className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6 w-full mx-auto max-w-2xl"
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
        >
          <Suspense
            fallback={
              <>
                <Skeleton className="h-12 w-full " />
              </>
            }
          >
            <SearchBox departments={departments} types={types} />
          </Suspense>
        </div>
      </section>
      <div className="max-w-[1440px] w-full xl:px-6 grid gap-4 grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @5xl:grid-cols-4">
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
          {courses.map((course, i) => {
            return (
              <Card
                variant="glass"
                key={course._id}
                className="hover:shadow-lg animate-in popup flex flex-col items-stretch justify-between"
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <CardHeader className="px-3 py-4">
                  <CardTitle className="text-xl">{course.name}</CardTitle>
                  <CardDescription className="font-semibold text-gray-700">
                    {course.code}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="justify-between p-3">
                  <Button
                    size="sm"
                    variant="default_light"
                    className="uppercase"
                  >
                    {course.type}
                  </Button>
                  <Button size="sm" variant="default" asChild>
                    <Link href={`/syllabus/${course.code}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </Suspense>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
        {courses.length > 0 ? <Pagination totalPages={totalPages} /> : null}
      </div>
    </>
  );
}
