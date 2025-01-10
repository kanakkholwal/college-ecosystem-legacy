import { z } from "zod"

export const createHostelSchema = z.object({
    name: z.string(),
    slug: z.string(),
    email: z.string(),
    gender: z.enum(["male","female"]),
    administrators: z.array(z.object({
        email: z.string().email(),
        role: z.enum(['warden', 'mmca', 'assistant_warden']),
        userId: z.string()
    })),
    warden: z.object({
        name: z.string(),
        email: z.string().email(),
        userId: z.string()
    }),
    students: z.array(z.string())
    
})

export const createHostelStudentSchema = z.object({
    rollNumber: z.string(),
    userId: z.string(),
    name: z.string(),
    email: z.string().email(),
    gender: z.enum(["male","female"]),
    hostel: z.string(),
    roomNumber: z.string(),
    phoneNumber: z.string(),
    banned: z.boolean(),
    bannedTill: z.date().nullable(),
    bannedReason: z.string().nullable()

})