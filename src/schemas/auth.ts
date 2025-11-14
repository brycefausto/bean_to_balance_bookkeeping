import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim(),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }).trim(),
    name: z.string().min(2, "Name should be at least 2 characters.").max(50),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
    confirmPassword: z.string().max(25),
    phone: z.string().max(25).optional(),
    address: z.string().max(100).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterData = z.infer<typeof registerSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Current password is required",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim(),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
