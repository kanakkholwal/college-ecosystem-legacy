import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  collegeId: z.string().email("Invalid email").refine(email => email.endsWith("@nith.ac.in"), {
    message: "Must be a valid NITH email"
  }),
  collegeYear: z.enum(["1st", "2nd", "3rd", "4th"]),
  workLinks: z.array(
    z.string().url("Invalid URL format")
  ).min(1, "At least one work link is required"),
  bestProject: z.string().optional(),
  bestHack: z.string().optional()
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;