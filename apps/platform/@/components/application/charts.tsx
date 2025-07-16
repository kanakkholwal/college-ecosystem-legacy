"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Pie,
  PieChart,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { changeCase } from "~/utils/string";

/**
 * Base properties for chart components.
 * @template TData - The type of data used in the chart.
 * @template TConfig - The type of configuration for the chart.
 * @property {TData[]} data - The data to be displayed in the chart.
 * @property {TConfig} config - The configuration for the chart.
 * @property {keyof TData} dataKey - The key in the data that represents the value to be plotted.
 * @property {keyof TData} nameKey - The key in the data that represents the name or label for each data point.
 * @property {string=} [className] - Optional additional CSS class names for styling the chart container.
 */

interface BaseProps<
  TData extends Record<string, any>,
  TConfig extends ChartConfig,
> {
  data: TData[];
  config: TConfig;
  dataKey: keyof TData;
  nameKey: keyof TData;
  className?: string;
}
interface ChartBarProps<
  TData extends Record<string, any>,
  TConfig extends ChartConfig,
> extends BaseProps<TData, TConfig> {
  orientation?: "horizontal" | "vertical";
  tooltipProps?: React.ComponentProps<typeof ChartTooltip>;
  tooltipContentProps?: React.ComponentProps<typeof ChartTooltipContent>;
}

interface ChartRadialProps<
  TData extends Record<string, any>,
  TConfig extends ChartConfig,
> extends BaseProps<TData, TConfig> {
  dataKey: keyof TData;
  nameKey: keyof TData;
}

export function ChartBar<
  TData extends Record<string, any>,
  TConfig extends ChartConfig,
>({
  data,
  config,
  dataKey,
  nameKey,
  orientation = "horizontal",
  className = "mx-auto aspect-square max-h-[250px]",
  tooltipProps,
  tooltipContentProps,
}: ChartBarProps<TData, TConfig>) {
  const chartData = data.map((item) => ({
    ...item,
    fill: item?.fill || `var(--color-${item[nameKey].replace(" ", "_").toLowerCase()})`, // Ensure the nameKey is formatted correctly for CSS variable
  }));

  return (
    <ErrorBoundaryWithSuspense
      fallback={
        <div
          className={cn(
            "flex h-full w-full items-center justify-center",
            className
          )}
        >
          <h6 className="text-base text-destructive">Error loading chart</h6>
          <p className="text-sm text-destructive/80">Please try again later.</p>
        </div>
      }
      loadingFallback={
        <div
          className={cn(
            "flex h-full w-full items-center justify-center",
            className
          )}
        >
          <LoaderCircle className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        </div>
      }
    >
      <ChartContainer
        config={config}
        className={cn("mx-auto w-full max-h-[250px]", className)}
      >
        {orientation === "vertical" ? (
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 5,
            }}
            compact={true}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey={nameKey.toString()}
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => changeCase(value, "title")}
            // hide
            />
            <XAxis dataKey={dataKey.toString()} type="number" hide />
            <ChartTooltip
              cursor={false}
              {...tooltipProps}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  nameKey={dataKey.toString()}
                  labelKey={nameKey.toString()}
                  label={nameKey
                    .toString()
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                  {...tooltipContentProps}
                />
              }
            />
            <Bar
              dataKey={dataKey.toString()}
              fill="var(--color-primary)"
              radius={4}
            >
              <LabelList
                dataKey={dataKey.toString()}
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        ) : (
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={nameKey.toString()}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => changeCase(value, "title")}
            />
            <ChartTooltip
              cursor={true}
              {...tooltipProps}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  nameKey={dataKey.toString()}
                  labelKey={nameKey.toString()}
                  label={nameKey
                    .toString()
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                  {...tooltipContentProps}
                />
              }
            />
            <Bar
              dataKey={dataKey.toString()}
              fill="var(--color-primary)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        )}
      </ChartContainer>
    </ErrorBoundaryWithSuspense>
  );
}

export function ChartRadialStacked<
  TData extends Record<string, any>,
  TConfig extends ChartConfig,
>({
  data,
  config,
  dataKey,
  nameKey,
  className = "mx-auto aspect-square max-h-[250px]",
}: ChartRadialProps<TData, TConfig>) {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr[dataKey] as number), 0);
  }, [data, dataKey]);
  const chartData = data.map((item, idx) => ({
    ...item,
    fill: `var(--color-${idx + 1})`, // Ensure the nameKey is formatted correctly for CSS variable
  }));
  return (
    <ErrorBoundaryWithSuspense
      fallback={
        <div
          className={cn(
            "flex h-full w-full items-center justify-center",
            className
          )}
        >
          <h6 className="text-base text-destructive">Error loading chart</h6>
          <p className="text-sm text-destructive/80">Please try again later.</p>
        </div>
      }
      loadingFallback={
        <div
          className={cn(
            "flex h-full w-full items-center justify-center",
            className
          )}
        >
          <LoaderCircle className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        </div>
      }
    >
      <ChartContainer
        config={config}
        className={cn("mx-auto aspect-square max-h-[250px]", className)}
      >
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={80}
          outerRadius={130}
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
                      {/* <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 4}
                                            className="fill-muted-foreground"
                                        >
                                            {dataKey.toString().replace(/([A-Z])/g, ' $1').trim()}
                                        </tspan> */}
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey={nameKey.toString()}
            stackId="a"
            cornerRadius={5}
            fill="var(--color-primary)"
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </ErrorBoundaryWithSuspense>
  );
}

interface PieDonutTextProps<
  TData extends Record<string, any>,
  TConfig extends ChartConfig,
> extends BaseProps<TData, TConfig> {
  // Additional properties specific to Pie/Donut charts
  textLabel?: string;
  textValue: string | number;
  innerRadius?: number;
  strokeWidth?: number;
  className?: string;
  tooltipProps?: React.ComponentProps<typeof ChartTooltip>;
  tooltipContentProps?: React.ComponentProps<typeof ChartTooltipContent>;
}

export function ChartPieDonutText<
  TData extends Record<string, any>,
  TConfig extends ChartConfig,
>({
  data,
  config,
  dataKey,
  nameKey,
  textLabel = "Total",
  textValue = "Total",
  innerRadius = 60,
  strokeWidth = 5,
  className = "mx-auto aspect-square max-h-[250px]",
  tooltipProps,
  tooltipContentProps,
}: PieDonutTextProps<TData, TConfig>) {
  


  return (
    <ChartContainer config={config} className={className}>
      <PieChart>
        <ChartTooltip
          cursor={false}
          {...tooltipProps}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  nameKey={nameKey.toString()}
                  labelKey={nameKey.toString()}
                  label={nameKey
                    .toString()
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                  {...tooltipContentProps}
                />
              }
        />
        <Pie
          data={data.map((item,idx) => ({
            ...item,
            fill: item?.fill || `var(--color-${idx + 1})`, // Ensure the nameKey is formatted correctly for CSS variable
          }))}
          dataKey={dataKey.toString()}
          nameKey={nameKey.toString()}
          innerRadius={innerRadius}
          strokeWidth={strokeWidth}
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
                      {textValue}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {textLabel}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

// export function ChartPieLabelList<TData extends Record<string, any>, TConfig extends ChartConfig>({
//     data,
//     config,
//     dataKey,
//     nameKey,
//     valueLabel = "Total",
//     innerRadius = 60,
//     strokeWidth = 5,
//     className = "mx-auto aspect-square max-h-[250px]",
// }: PieDonutTextProps<TData, TConfig>) {

//     console.log("ChartPieLabelList", config, data.map((data) => {
//         return {
//             ...data,
//             fill: `var(--color-${data[nameKey].replace(" ", '_').toLowerCase()})`,
//         }
//     }))
//     return (<ChartContainer
//         config={config}
//         className={cn("mx-auto aspect-square max-h-[250px]", className)}
//     >
//         <PieChart>
//             <ChartTooltip
//                 content={<ChartTooltipContent nameKey={nameKey.toString()} hideLabel />}
//             />
//             <Pie data={data.map((data) => {
//                 return {
//                     ...data,
//                     fill: `var(--color-${data[nameKey].replace(" ", '_').toLowerCase()})`,
//                 }
//             })} dataKey={dataKey.toString()}
//                 nameKey={nameKey.toString()}
//                 innerRadius={innerRadius}
//                 strokeWidth={strokeWidth}

//             >
//                 <LabelList
//                     dataKey={dataKey.toString()}
//                     className="fill-background"
//                     stroke="none"
//                     fontSize={12}
//                     formatter={(value: keyof typeof config) =>
//                         config[value]?.label
//                     }
//                 />
//             </Pie>
//         </PieChart>
//     </ChartContainer>

//     )
// }

// export function ChartPieSimple<TData extends Record<string, any>, TConfig extends ChartConfig>({
//     data,
//     config,
//     dataKey,
//     nameKey,
//     valueLabel = "Total",
//     innerRadius = 60,
//     strokeWidth = 5,
//     className = "mx-auto aspect-square max-h-[250px]",
// }: PieDonutTextProps<TData, TConfig>) {
//     console.log("ChartPieSimple", config, data.map((data) => {
//         return {
//             ...data,
//             fill: `var(--color-${data[nameKey].replace(" ", '_').toLowerCase()})`,
//         }
//     }))

//     return (
//         <ChartContainer
//             config={config}
//             className={cn("mx-auto aspect-square max-h-[250px]", className)}
//         >

//             <PieChart>
//                 <ChartTooltip
//                     cursor={false}
//                     content={<ChartTooltipContent hideLabel />}
//                 />
//                 <Pie data={data.map((data) => {
//                     return {
//                         ...data,
//                         fill: `var(--color-${data[nameKey].replace(" ", '_').toLowerCase()})`,
//                     }
//                 })} dataKey={dataKey.toString()} nameKey={nameKey.toString()}
//                     innerRadius={innerRadius}
//                     strokeWidth={strokeWidth}
//                 />
//             </PieChart>
//         </ChartContainer>

//     )
// }
// export function ChartRadar<TData extends Record<string, any>, TConfig extends ChartConfig>({
//     data,
//     config,
//     dataKey,
//     nameKey,
//     valueLabel = "Total",
//     innerRadius = 60,
//     strokeWidth = 5,
//     className = "mx-auto aspect-square max-h-[250px]",
// }: PieDonutTextProps<TData, TConfig>) {
//     console.log("ChartRadar", config, data.map((data) => {
//         return {
//             ...data,
//             fill: `var(--color-${data[nameKey].replace(" ", '_').toLowerCase()})`,
//         }
//     }))

//     return (
//         <ChartContainer
//             config={config}
//             className={cn("mx-auto aspect-square max-h-[250px]", className)}
//         >
//             <RadarChart data={data.map((data) => {
//                 return {
//                     ...data,
//                     fill: `var(--color-${data[nameKey].replace(" ", '_').toLowerCase()})`,
//                 }
//             })}>
//                 <ChartTooltip
//                     cursor={false}
//                     content={<ChartTooltipContent hideLabel />}
//                 />

//                 <PolarAngleAxis dataKey={nameKey.toString()} />
//                 <Radar
//                     dataKey={dataKey.toString()}
//                     fill={`var(--color-primary)`}
//                     fillOpacity={0.6}
//                     dot={{
//                         r: 4,
//                         fillOpacity: 1,
//                     }}
//                 />
//             </RadarChart>
//         </ChartContainer>

//     )
// }

