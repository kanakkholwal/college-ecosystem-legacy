import { BaseHeroSection } from "@/components/application/base-hero";
import CourseCard from "@/components/application/course-card";
import Pagination from "@/components/application/course-pagination";
import SearchBox from "@/components/application/course-search";
import { ResponsiveContainer } from "@/components/common/container";
import { HeaderBar } from "@/components/common/header-bar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ButtonLink } from "@/components/utils/link";
import { ArrowUpRight, Plus } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { LuBookA } from "react-icons/lu";
import { getCourses } from "~/actions/common.course";

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
    title: `Courses | ${(await parent).title}`,
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
      <HeaderBar
        Icon={LuBookA}
        titleNode={
          <>
            Manage Courses <Badge size="sm">{courses.length} found</Badge>
          </>
        }
        descriptionNode={
          <>Here you can create new courses or view existing ones.</>
        }
        actionNode={
          <>
            <ButtonLink
              variant="dark"
              size="sm"
              effect="shineHover"
              disabled
              href={`/${params.moderator}/courses/create`}
            >
              <Plus />
              New Course
            </ButtonLink>
            <ButtonLink
              variant="light"
              size="sm"
              effect="shineHover"
              href={`/syllabus`}
              target="_blank"
            >
              View Course
              <ArrowUpRight />
            </ButtonLink>
          </>
        }
      />
      <BaseHeroSection
        title="Courses Search"
        description="Search for courses based on their name, code, department, and type."
      >
        <Suspense
          key="SearchBox"
          fallback={<Skeleton className="h-12 w-full " />}
        >
          <SearchBox departments={departments} types={types} />
        </Suspense>
      </BaseHeroSection>

      <ResponsiveContainer>
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
      </ResponsiveContainer>
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
