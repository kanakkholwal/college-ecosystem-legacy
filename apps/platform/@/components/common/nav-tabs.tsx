"use client"

import { cn } from "@/lib/utils"
import Link, { type LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

interface NavLink extends LinkProps {
    id: string
    children: React.ReactNode
    href: string
    notificationCount?: number
}

interface NavTabsProps extends React.HTMLAttributes<HTMLDivElement> {
    navLinks: NavLink[]
    activeTab?: string
}

const NavTabs = React.forwardRef<HTMLDivElement, NavTabsProps>(
    ({ className, navLinks, activeTab, ...props }, ref) => {
        const pathname = usePathname();
        const defaultIndex = navLinks.findIndex(link => pathname.startsWith(link.href)) === -1 ? 0 : navLinks.findIndex(link => pathname.startsWith(link.href));

        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
        const [activeIndex, setActiveIndex] = useState<number>(defaultIndex)
        const [hoverStyle, setHoverStyle] = useState({})
        const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
        const tabRefs = useRef<(HTMLAnchorElement | null)[]>([])

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
                    {navLinks.map((navLink, index) => (
                        <Link
                            href={navLink.href}
                            key={navLink.id}
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
                                // onTabChange?.(navLink.id)
                            }}
                        >
                            <div className="text-xs font-medium leading-5 whitespace-nowrap flex items-center gap-2 justify-center h-full [&>svg]:size-4">
                                {navLink?.children}
                                {navLink.notificationCount && navLink.notificationCount > 0 ? (
                                    <span className="inline-flex items-center justify-center size-4 text-xs font-medium text-primary bg-primary/10 rounded-full">
                                        {navLink.notificationCount}
                                    </span>
                                ) : null}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }
)
NavTabs.displayName = "NavTabs"

export { NavTabs }

