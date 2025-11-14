import { Role } from "@prisma/client";
import * as z from "zod";

export const createUserSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }).trim(),
    name: z.string().min(2, "Name should be at least 2 characters.").max(50),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
    confirmPassword: z.string().max(25),
    role: z.enum(Role),
    phone: z.string().max(25).optional(),
    address: z.string().max(100).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateUserData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim(),
  name: z.string().min(2, "Name should be at least 2 characters.").max(50),
  role: z.enum(Role).optional(),
  phone: z.string().max(25).optional(),
  address: z.string().max(100).optional(),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;
