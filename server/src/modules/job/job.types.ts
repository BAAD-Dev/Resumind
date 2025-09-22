import { z } from "zod";

export const createJobFromTextSchema = z.object({
  jobText: z.string().min(50, "Job description text is required and must be at least 50 characters."),
});

export type CreateJobFromTextInput = z.infer<typeof createJobFromTextSchema>;