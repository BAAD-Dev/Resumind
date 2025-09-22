import { z } from "zod";

// Define the validation schema for registration
export const registerSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

// Create a TypeScript type from the schema above
export type RegisterUserInput = z.infer<typeof registerSchema>;

// Do the same for login for consistency
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginUserInput = z.infer<typeof loginSchema>;
