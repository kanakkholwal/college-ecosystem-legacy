"use client";
import {
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type React from "react";
import { Suspense } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import type { Semester } from "src/models/result";

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
      sgpi: Number.parseFloat(semester.sgpi.toFixed(2)),
      cgpi: Number.parseFloat(semester.cgpi.toFixed(2)),
    };
  });

  const chartConfig = {
    sgpi: {
      label: "SGPI",
      color: "var(--chart-1)",
    },
    cgpi: {
      label: "CGPI",
      color: "var(--chart-2)",
    },
  } as ChartConfig;

  return (
    <>
      <Suspense fallback={<CGPIChartLoader />}>
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-video relative z-10 bg-card shadow-sm p-4 rounded-lg"
          title="SGPI and CGPI for each semester"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={true} />
            <XAxis dataKey="semester" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent  />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="sgpi" fill={chartConfig.sgpi.color} radius={4} />
            <Bar dataKey="cgpi" fill={chartConfig.cgpi.color} radius={4} />
          </BarChart>
        </ChartContainer>
      </Suspense>
    </>
  );
};

export default CGPIChart;
