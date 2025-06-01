"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

interface Tab {
    id: string
    label: string
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    tabs: Tab[]
    activeTab?: string
    onTabChange?: (tabId: string) => void
}

const VercelTabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, tabs, activeTab, onTabChange, ...props }, ref) => {
        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
        const [activeIndex, setActiveIndex] = useState(0)
        const [hoverStyle, setHoverStyle] = useState({})
        const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
        const tabRefs = useRef<(HTMLDivElement | null)[]>([])

        useEffect(() => {
            if (hoveredIndex !== null) {
                const hoveredElement = tabRefs.current[hoveredIndex]
                if (hoveredElement) {
                    const { offsetLeft, offsetWidth } = hoveredElement
                    setHoverStyle({
                        left: `${offsetLeft}px`,
                        width: `${offsetWidth}px`,
                    })
                }
            }
        }, [hoveredIndex])

        useEffect(() => {
            const activeElement = tabRefs.current[activeIndex]
            if (activeElement) {
                const { offsetLeft, offsetWidth } = activeElement
                setActiveStyle({
                    left: `${offsetLeft}px`,
                    width: `${offsetWidth}px`,
                })
            }
        }, [activeIndex])

        useEffect(() => {
            requestAnimationFrame(() => {
                const firstElement = tabRefs.current[0]
                if (firstElement) {
                    const { offsetLeft, offsetWidth } = firstElement
                    setActiveStyle({
                        left: `${offsetLeft}px`,
                        width: `${offsetWidth}px`,
                    })
                }
            })
        }, [])

        return (
            <div
                ref={ref}
                className={cn(className, "relative")}
                {...props}
            >
                <div className="relative">
                    {/* Hover Highlight */}
                    <div
                        className="absolute h-[30px] transition-all duration-300 ease-out bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center"
                        style={{
                            ...hoverStyle,
                            opacity: hoveredIndex !== null ? 1 : 0,
                        }}
                    />
                    {/* Active Indicator */}
                    <div
                        className="absolute top-auto -bottom-1.5 h-1 bg-primary rounded-xl transition-all duration-300 ease-out"
                        style={activeStyle}
                    />

                    {/* Tabs */}
                    <div className="relative flex space-x-[6px] items-center">
                        {tabs.map((tab, index) => (
                            <div
                                key={tab.id}
                                ref={(el) => { tabRefs.current[index] = el; }}
                                className={cn(
                                    "px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px]",
                                    activeIndex === index
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground/80"
                                )}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {
                                    setActiveIndex(index)
                                    onTabChange?.(tab.id)
                                }}
                            >
                                <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full">
                                    {tab.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
)
VercelTabs.displayName = "VercelTabs"

export { VercelTabs }

