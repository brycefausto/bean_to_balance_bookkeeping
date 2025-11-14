// model Entry {
//   id              String       @id @default(cuid())
//   journalEntryId  String
//   journalEntry    JournalEntry @relation(fields: [journalEntryId], references: [id])
//   bookAccountCode String
//   bookAccount     BookAccount  @relation(fields: [bookAccountCode], references: [id])
//   debit           Float        @default(0)
//   credit          Float        @default(0)
//   ARLedger        ARLedger[]
//   APLedger        APLedger[]
//   Inventory       Inventory?   @relation(fields: [inventoryId], references: [id])
//   inventoryId     String?
//   Payroll         Payroll[]
//   createdAt       DateTime     @default(now())
//   updatedAt       DateTime     @updatedAt

//   userId String @map("userId")
//   user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
// }

import { z } from "zod";

export const entryLineSchema = z.object({
  id: z.string().optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description should be maximum of 10 characters"),
  bookAccountId: z.string().min(1, "Account is required"),
  bookAccountCode: z.string(),
  postRef: z.string().max(10, "Post Ref should be maximum of 10 characters"),
  balanceType: z.string().optional(),
  debit: z.number(),
  credit: z.number(),
  date: z.date(),
});

export const entryLinesSchema = z.object({
  entryLines: z.array(entryLineSchema),
});

export type EntryLinesData = z.infer<typeof entryLinesSchema>;
