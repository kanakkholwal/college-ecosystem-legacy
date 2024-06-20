"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { LineChart } from "@tremor/react";
import React, { Suspense } from "react";

import { Semester } from "src/models/result";

export const CGPIChartLoader: React.FC = () => {
  return (
    <div className="w-full relative">
      <Skeleton className="w-full h-full min-h-64" />
    </div>
  );
};

interface CGPIChartProps {
  semesters: Semester[];
}

export const CGPIChart: React.FC<CGPIChartProps> = ({ semesters }) => {
  const chartData = semesters.map((semester: Semester) => {
    return {
      semester: `Semester ${semester.semester}`,
      sgpi: semester.sgpi.toFixed(2),
      cgpi: semester.cgpi.toFixed(2),
      Sgpi: semester.sgpi.toFixed(2),
      Cgpi: semester.cgpi.toFixed(2),
    };
  });

  return (
    <>
      <Suspense fallback={<CGPIChartLoader />}>
        <LineChart
          className="w-full aspect-video relative z-10"
          yAxisWidth={65}
          categories={["Sgpi", "Cgpi"]}
          colors={["indigo", "cyan"]}
          data={chartData}
          title="CGPI Progress"
          index="semester"
        />
      </Suspense>
    </>
  );
};

export default CGPIChart;
