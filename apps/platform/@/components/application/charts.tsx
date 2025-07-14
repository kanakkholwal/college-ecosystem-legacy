"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis
} from "recharts";

import { changeCase } from "~/utils/string";

/**
 * Base properties for chart components.
 * @template TData - The type of data used in the chart.
 * @template TConfig - The type of configuration for the chart.
 */
interface BaseChartProps<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
> {
  data: TData[];
  config: TConfig;
  dataKey: keyof TData;
  nameKey: keyof TData;
  className?: string;
}

interface ChartBarProps<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
> extends BaseChartProps<TData, TConfig> {
  orientation?: "horizontal" | "vertical";
  showLabel?: boolean;
}

interface ChartRadialProps<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
> extends BaseChartProps<TData, TConfig> {
  innerRadius?: number;
  outerRadius?: number;
}

interface PieDonutTextProps<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
> extends BaseChartProps<TData, TConfig> {
  valueLabel?: string;
  innerRadius?: number;
  outerRadius?: number;
  strokeWidth?: number;
}

interface ChartLineMultipleProps<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
> extends BaseChartProps<TData, TConfig> {
  lineKeys: Array<keyof TData>;
  colors?: Record<string, string>;
}

const ChartErrorFallback = ({ className }: { className?: string }) => (
  <div className={cn("flex h-full w-full flex-col items-center justify-center", className)}>
    <h6 className="text-base text-destructive">Error loading chart</h6>
    <p className="text-sm text-destructive/80">Please try again later.</p>
  </div>
);

const ChartLoadingFallback = ({ className }: { className?: string }) => (
  <div className={cn("flex h-full w-full flex-col items-center justify-center", className)}>
    <LoaderCircle className="size-6 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">Loading chart...</p>
  </div>
);

/**
 * Bar chart component with horizontal or vertical orientation
 */
export function ChartBar<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
>({
  data,
  config,
  dataKey,
  nameKey,
  orientation = "horizontal",
  className = "mx-auto h-[250px] w-full",
  showLabel = true,
}: ChartBarProps<TData, TConfig>) {
  const chartData = React.useMemo(() => (
    data.map((item) => ({
      ...item,
      fill: `var(--color-${String(item[nameKey]).replace(/\s+/g, "_").toLowerCase()})`,
    }))
  ), [data, nameKey]);

  return (
    <ErrorBoundaryWithSuspense
      fallback={<ChartErrorFallback className={className} />}
      loadingFallback={<ChartLoadingFallback className={className} />}
    >
      <ChartContainer config={config} className={className}>
        <ResponsiveContainer width="100%" height="100%">
          {orientation === "vertical" ? (
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ right: 20, left: 20 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey={nameKey.toString()}
                type="category"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                tickFormatter={(value) => changeCase(value, "title")}
              />
              <XAxis dataKey={dataKey.toString()} type="number" hide />
              <ChartTooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    nameKey={nameKey.toString()}
                    labelKey={dataKey.toString()}
                    label={String(dataKey).replace(/([A-Z])/g, " $1").trim()}
                  />
                }
              />
              <Bar
                dataKey={dataKey.toString()}
                fill="var(--color-primary)"
                radius={[0, 4, 4, 0]}
              >
                {showLabel && (
                  <LabelList
                    dataKey={dataKey.toString()}
                    position="right"
                    offset={8}
                    className="fill-foreground text-xs"
                  />
                )}
              </Bar>
            </BarChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={nameKey.toString()}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => changeCase(value, "title")}
              />
              <YAxis hide />
              <ChartTooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    nameKey={nameKey.toString()}
                    labelKey={dataKey.toString()}
                    label={String(dataKey).replace(/([A-Z])/g, " $1").trim()}
                  />
                }
              />
              <Bar
                dataKey={dataKey.toString()}
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              >
                {showLabel && (
                  <LabelList
                    dataKey={dataKey.toString()}
                    position="top"
                    offset={12}
                    className="fill-foreground text-xs"
                  />
                )}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>
    </ErrorBoundaryWithSuspense>
  );
}

/**
 * Radial/Donut chart component
 */
export function ChartRadialStacked<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
>({
  data,
  config,
  dataKey,
  nameKey,
  className = "mx-auto h-[250px] w-full",
  innerRadius = 80,
  outerRadius = 130,
}: ChartRadialProps<TData, TConfig>) {
  const totalValue = React.useMemo(() => (
    data.reduce((acc, curr) => acc + (curr[dataKey] as number), 0)
  ), [data, dataKey]);

  const chartData = React.useMemo(() => (
    data.map((item, idx) => ({
      ...item,
      fill: `var(--color-${idx + 1})`,
    }))
  ), [data]);

  return (
    <ErrorBoundaryWithSuspense
      fallback={<ChartErrorFallback className={className} />}
      loadingFallback={<ChartLoadingFallback className={className} />}
    >
      <ChartContainer config={config} className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  nameKey={nameKey.toString()}
                  labelKey={dataKey.toString()}
                />
              }
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey={dataKey.toString()}
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ErrorBoundaryWithSuspense>
  );
}

/**
 * Pie/Donut chart with centered text
 */
export function ChartPieDonutText<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
>({
  data,
  config,
  dataKey,
  nameKey,
  valueLabel = "Total",
  innerRadius = 60,
  outerRadius = 80,
  strokeWidth = 2,
  className = "mx-auto h-[250px] w-full",
}: PieDonutTextProps<TData, TConfig>) {
  const totalValue = React.useMemo(() => (
    data.reduce((acc, curr) => acc + (curr[dataKey] as number), 0)
  ), [data, dataKey]);

  const processedData = React.useMemo(() => (
    data.map((item) => ({
      ...item,
      // Use color prop if exists, otherwise fall back to CSS variable
      fill: (item as any).color || `var(--color-${String(item[nameKey]).replace(/\s+/g, "_").toLowerCase()})`,
    }))
  ), [data, nameKey]);

  return (
    <ErrorBoundaryWithSuspense
      fallback={<ChartErrorFallback className={className} />}
      loadingFallback={<ChartLoadingFallback className={className} />}
    >
      <ChartContainer config={config} className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={processedData}
              dataKey={dataKey.toString()}
              nameKey={nameKey.toString()}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              strokeWidth={strokeWidth}
              paddingAngle={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {valueLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ErrorBoundaryWithSuspense>
  );
}


interface BasePieChartProps<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
> {
  data: TData[];
  config: TConfig;
  dataKey: keyof TData;
  nameKey: keyof TData;
  className?: string;
  showLabel?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export function ChartPie<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
>({
  data,
  config,
  dataKey,
  nameKey,
  className = "mx-auto h-[300px] w-full",
  showLabel = true,
  innerRadius = 0,
  outerRadius = 80,
}: BasePieChartProps<TData, TConfig>) {
  
  const processedData = data.map((item) => ({
    ...item,
    fill: `var(--color-${String(item[nameKey]).replace(/\s+/g, "_").toLowerCase()}`,
  }));

  return (
    <ErrorBoundaryWithSuspense
      fallback={<ChartErrorFallback className={className} />}
      loadingFallback={<ChartLoadingFallback className={className} />}
    >
      <ChartContainer config={config} className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey={nameKey.toString()}
                  labelKey={dataKey.toString()}
                />
              }
            />
            <Pie
              data={processedData}
              dataKey={dataKey.toString()}
              nameKey={nameKey.toString()}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              label={showLabel ? ({
                name,
                percent
              }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ErrorBoundaryWithSuspense>
  );
}
/**
 * Single line chart component
 */
export function ChartLineSingle<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
>({
  data,
  config,
  dataKey,
  nameKey,
  className = "mx-auto h-[250px] w-full",
}: BaseChartProps<TData, TConfig>) {
  return (
    <ErrorBoundaryWithSuspense
      fallback={<ChartErrorFallback className={className} />}
      loadingFallback={<ChartLoadingFallback className={className} />}
    >
      <ChartContainer config={config} className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={nameKey.toString()}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey={nameKey.toString()}
                  labelKey={dataKey.toString()}
                />
              }
            />
            <Line
              type="monotone"
              dataKey={dataKey.toString()}
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ErrorBoundaryWithSuspense>
  );
}

/**
 * Multiple line chart component
 */
export function ChartLineMultiple<
  TData extends Record<string, unknown>,
  TConfig extends ChartConfig,
>({
  data,
  config,
  nameKey,
  lineKeys,
  colors,
  className = "mx-auto h-[250px] w-full",
}: ChartLineMultipleProps<TData, TConfig>) {
  return (
    <ErrorBoundaryWithSuspense
      fallback={<ChartErrorFallback className={className} />}
      loadingFallback={<ChartLoadingFallback className={className} />}
    >
      <ChartContainer config={config} className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={nameKey.toString()}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey={nameKey.toString()}
                  labelFormatter={(value) => changeCase(value, "title")}
                />
              }
            />
            {lineKeys.map((key) => (
              <Line
                key={key.toString()}
                type="monotone"
                dataKey={key.toString()}
                stroke={colors?.[key.toString()] || `var(--color-${key.toString().toLowerCase()})`}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ErrorBoundaryWithSuspense>
  );
}