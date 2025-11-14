import { JournalType } from "@prisma/client";
import { EntryLineView } from "./entry-line.dto";

export interface CreateJournalEntryDto {
  description: string;
  journalType: JournalType;
  date?: Date;
}

export interface UpdateJournalEntryDto {
  description: string;
  date?: Date;
}

export interface JournalEntryDto {
  id: string;
  description?: string | null;
  journalType: JournalType;
  date: Date;
  entries: EntryLineView[];
}

export function getJournalTypeName(journalType: JournalType): string {
  switch (journalType) {
    case "CASH_DISBURSEMENT":
      return "Cash Disbursement Journal";
    case "CASH_RECEIPT":
      return "Cash Receipt Journal";
    case "PURCHASE":
      return "Purchase Journal";
    case "SALES":
      return "Sales Journal";
    default:
      return "General Journal";
  }
}

export const journalTypeOptions = Object.values(JournalType).map((value) => ({
  value,
  label: getJournalTypeName(value),
}));

export interface JournalEntryFilter {
  journalType?: JournalType;
  date?: Date;
}
