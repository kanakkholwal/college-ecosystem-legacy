import { z } from "zod";
import { ORG_DOMAIN } from "~/project.config";


export const outPassSchema = z.object({
    studentId: z.string(),
    outTime: z.string(),
    inTime: z.string(),
    reason: z.string(),
    status: z.enum(["pending", "approved", "rejected"]),
    approvedBy: z.string(),
    approvedAt: z.string(),
    remarks: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})


export const CONSTANTS = {
    outPassStatus: {
        PENDING: "pending",
        APPROVED: "approved",
        REJECTED: "rejected",
    },
    outPassStatusColor: {
        pending: "yellow",
        approved: "green",
        rejected: "red",
    },
    outPassStatusText: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
    },
    outPassStatusIcon: {
        pending: "clock",
        approved: "check",
        rejected: "x",
    },
    outPassTimings: {
        outTime: "17:00",
        inTime: "20:00",
    }
} as const;