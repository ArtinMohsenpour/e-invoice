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
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name cannot exceed 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name cannot exceed 50 characters" }),
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

// Profile (Personal Info)
export const ProfileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phoneNumber: z.string().optional(),
});
export type ProfileInput = z.infer<typeof ProfileSchema>;

// Organization
export const OrganizationSchema = z.object({
  name: z.string().min(2, "Company name is too short"),
  // Required for legal documents
  taxId: z.string().min(5, "Valid Tax/VAT ID required"), 
  phoneNumber: z.string().min(6, "Invalid phone number"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    zip: z.string().min(3, "Valid ZIP code required"),
    // You correctly identified the 2-letter ISO code
    country: z.string().length(2, "Must be a 2-letter ISO code"), 
  }),
  // Missing crucial field:
  billingEmail: z.string().email("Invalid billing email").optional(),
});
export type OrganizationInput = z.infer<typeof OrganizationSchema>;