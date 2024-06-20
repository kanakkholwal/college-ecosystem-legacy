import { Course, ResultTypeWithId, Semester } from "src/models/result";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownUp, TrendingUp } from "lucide-react";

export function CgpiCard({ result }: { result: ResultTypeWithId }) {
  const maxCgpi = result.semesters?.reduce(
    (prev, curr) => Math.max(prev, curr.cgpi),
    0
  );
  const minCgpi = result.semesters?.reduce(
    (prev, curr) => Math.min(prev, curr.cgpi),
    10
  );
  const cgpi = result.semesters?.at(-1)?.cgpi ?? 0;
  return (
    <Card variant="glass" className="hover:shadow-lg animate-in popup ">
      <CardHeader className="flex-row items-center gap-2  px-3 py-4">
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-white/50 font-bold text-xl">
          <TrendingUp />
        </div>
        <div>
          <CardTitle className="text-xl">CGPI</CardTitle>
          <CardDescription className="font-semibold text-gray-700">
            Trend Analysis
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-around items-stretch gap-3 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400"> Max CGPI</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {" "}
            {maxCgpi}{" "}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">CGPI</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {cgpi}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400"> Min CGPI</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {minCgpi}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
export function RankCard({ result }: { result: ResultTypeWithId }) {
  return (
    <Card variant="glass" className="hover:shadow-lg animate-in popup ">
      <CardHeader className="flex-row items-center gap-2  px-3 py-4">
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-white/50 font-bold text-xl">
          <ArrowDownUp />
        </div>
        <div>
          <CardTitle className="text-xl">Ranking</CardTitle>
          <CardDescription className="font-semibold text-gray-700">
            Ranking Analysis
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-around items-stretch gap-3 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">College</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {result.rank.college}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Batch</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {result.rank.batch}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Branch</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {result.rank.branch}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Class</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {result.rank.class}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function SemCard({ semester }: { semester: Semester }) {
  return (
    <Card variant="glass" className="rounded-lg overflow-hidden">
      <CardHeader className="bg-primary/20 p-4">
        <CardTitle>Semester {semester.semester}</CardTitle>
        <CardDescription className="font-semibold text-gray-700">
          {semester.sgpi}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex flex-col">
        {semester.courses?.map((course: Course, index) => {
          return (
            <div
              className="flex justify-between items-center py-2 gap-2 border-b border-border last:border-b-0"
              key={index}
            >
              <div className="flex items-start flex-col">
                <h4 className="text-sm tracking-wide font-semibold text-gray-900 dark:text-white">
                  {course.name.replaceAll("&amp;", "&")}
                </h4>
                <p className="text-xs text-gray-600">{course.code}</p>
              </div>
              <div className="text-primary text-sm bg-primary/20 dark:bg-primary/10 p-3 rounded-full h-6 w-6 flex justify-center items-center">
                {course.cgpi}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
