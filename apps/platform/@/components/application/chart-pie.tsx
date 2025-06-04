"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart with text"

interface PieDonutTextProps<TData extends Record<string, any>, TConfig extends ChartConfig> {
    data: TData[]
    config: TConfig
    dataKey: keyof TData
    nameKey: keyof TData
    valueLabel?: string
    innerRadius?: number
    strokeWidth?: number
    className?: string
}

export function ChartPieDonutText<TData extends Record<string, any>, TConfig extends ChartConfig>({
    data,
    config,
    dataKey,
    nameKey,
    valueLabel = "Total",
    innerRadius = 60,
    strokeWidth = 5,
    className = "mx-auto aspect-square max-h-[250px]",
}: PieDonutTextProps<TData, TConfig>) {
    const totalValue = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + (curr[dataKey] as number), 0)
    }, [data, dataKey])

    return (
        <ChartContainer
            config={config}
            className={className}
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={data}
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
                                            {totalValue.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            {valueLabel}
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    )
}

// Example usage with the original data and config
/*
const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-3)",
    },
    edge: {
        label: "Edge",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

function ExampleUsage() {
    return (
        <ChartPieDonutText
            data={chartData}
            config={chartConfig}
            dataKey="visitors"
            nameKey="browser"
            valueLabel="Visitors"
        />
    )
}
*/