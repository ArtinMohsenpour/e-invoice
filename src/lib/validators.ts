import { z } from "zod";

// Common email validation
export const emailValidation = z
  .string()
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email cannot exceed 255 characters" });

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
  email: emailValidation,
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
  email: emailValidation,
  password: passwordValidation,
});
export type SignupInput = z.infer<typeof SignupSchema>;

// Forgot Password
export const ForgotPasswordSchema = z.object({
  email: emailValidation,
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
  firstName: z
    .string()
    .min(1, "Required")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Required")
    .max(60, "Last name cannot exceed 60 characters"),
  phoneNumber: z
    .string()
    .max(20, "Phone number cannot exceed 20 characters")
    .optional(),
});
export type ProfileInput = z.infer<typeof ProfileSchema>;

// Team Invite
export const TeamInviteSchema = z.object({
  email: emailValidation,
  orgRole: z.enum(["manager", "accountant"], {
    message: "Invalid role",
  }),
});
export type TeamInviteInput = z.infer<typeof TeamInviteSchema>;

// Organization
export const OrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Company name is too short")
    .max(100, "Company name cannot exceed 100 characters"),
  // Required for legal documents
  taxId: z
    .string()
    .min(5, "Valid Tax/VAT ID required")
    .max(50, "Tax/VAT ID cannot exceed 50 characters"),
  phoneNumber: z
    .string()
    .min(6, "Invalid phone number")
    .max(20, "Phone number cannot exceed 20 characters")
    .optional(),
  address: z.object({
    street: z
      .string()
      .min(1, "Street is required")
      .max(100, "Street cannot exceed 100 characters"),
    city: z
      .string()
      .min(1, "City is required")
      .max(50, "City cannot exceed 50 characters"),
    zip: z
      .string()
      .min(3, "Valid ZIP code required")
      .max(10, "ZIP code cannot exceed 10 characters"),
    // You correctly identified the 2-letter ISO code
    country: z.string().length(2, "Must be a 2-letter ISO code"),
  }),
  // Missing crucial field:
  billingEmail: emailValidation.optional(),
});
export type OrganizationInput = z.infer<typeof OrganizationSchema>;
