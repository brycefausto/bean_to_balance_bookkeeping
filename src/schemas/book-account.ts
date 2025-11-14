import { AccountType, NormalSide } from "@prisma/client";
import { z } from "zod";

export const FINANCIAL_REPORTS = [
  "Balance Sheet",
  "Income Statement",
  "Not in FS (closing )",
] as const;

export const bookAccountSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(4, "Code must be 4 characters or less"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description must be 100 characters or less"),
  accountType: z.enum(AccountType),
  financialReport: z.string().min(1, "Financial report is required"),
  normalSide: z.enum(NormalSide),
});

export type BookAccountData = z.infer<typeof bookAccountSchema>;
