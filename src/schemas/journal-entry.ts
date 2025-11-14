import { JournalType } from "@prisma/client";
import { z } from "zod";

export const entryLineSchema = z.object({
  id: z.string().optional(),
  description: z
    .string()
    .max(100, "Description should be maximum of 10 characters"),
  bookAccountId: z.string().min(1, "Account is required"),
  bookAccountCode: z.string(),
  postRef: z.string().max(10, "Post Ref should be maximum of 10 characters"),
  debit: z.number(),
  credit: z.number(),
  date: z.date(),
});

export const entryLinesSchema = z.array(entryLineSchema);

export type EntryLinesArray = z.infer<typeof entryLinesSchema>;

export const journalEntrySchema = z.object({
  description: z
    .string()
    .max(100, "Description must be 100 characters or less"),
  journalType: z.enum(JournalType),
  date: z.date(),
  entryLines: entryLinesSchema,
});

export type JournalEntryData = z.infer<typeof journalEntrySchema>;
