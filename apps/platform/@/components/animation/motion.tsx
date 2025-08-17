"use client"
import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

type StaggerChildrenContainerProps = React.ButtonHTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div"> & {
    children: React.ReactNode;
    className?: string;
};

export function StaggerChildrenContainer({
    children,
    className = "",
    ...props
}: StaggerChildrenContainerProps) {
    return (
        <motion.div
            className={cn(className)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            {...props}
        >
            {children}
        </motion.div>
    );
}