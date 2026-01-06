import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const signupSchema = z.object({
  companyName: z
    .string()
    .min(1, { message: "Company name is required" })
    .max(100, { message: "Company name cannot exceed 100 characters" })
    .min(2, { message: "Company name must be at least 2 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;