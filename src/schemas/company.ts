import { z } from "zod"

export const createCompanySchema = z.object({
  name: z.string().min(3).max(50),
  email: z.email({ message: "Invalid email address" }).trim(),
  phone: z.string().max(25),
  address: z.string().max(100),
})

export type CreateCompanyData = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = z.object({
  name: z.string().min(3).max(50),
  email: z.email({ message: "Invalid email address" }).trim(),
  phone: z.string().max(25),
  address: z.string().max(100),
})

export type UpdateCompanyData = z.infer<typeof updateCompanySchema>;

