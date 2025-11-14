import { z } from "zod";

export const LedgerCategorySchema = z.enum(["JOURNAL_ENTRY", "ADJUSTMENT", "CLOSING"]);
export type LedgerCategory = z.infer<typeof LedgerCategorySchema>;

export const generalLedgerSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  item: z.string().optional().nullable(),
  postRef: z.string().optional().nullable(),
  debit: z.number().optional().default(0),
  credit: z.number().optional().default(0),
  balance: z.number().optional().default(0),
  bookAccountId: z.string(),
  ledgerCategory: LedgerCategorySchema,
  createdAt: z.date().optional(),
});

export type GeneralLedgerData = z.infer<typeof generalLedgerSchema>;
