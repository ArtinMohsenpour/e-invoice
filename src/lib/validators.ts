import { z } from "zod";

// Common password validation
const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(100, { message: "Password cannot exceed 100 characters" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character",
  });

// Login
export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email cannot exceed 255 characters" }),
  password: z.string().min(1, { message: "Password is required" }).max(100),
});
export type LoginInput = z.infer<typeof LoginSchema>;

// Signup
export const SignupSchema = z.object({
  companyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(100, { message: "Company name cannot exceed 100 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email cannot exceed 255 characters" }),
  password: passwordValidation,
});
export type SignupInput = z.infer<typeof SignupSchema>;

// Forgot Password
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email cannot exceed 255 characters" }),
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

// Reset Password
export const ResetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
