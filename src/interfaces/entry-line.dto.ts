import { BookAccount, EntryLine } from "@prisma/client";

export interface EntryLineView extends EntryLine {
  bookAccount: BookAccount;
}

export interface EntryLineDto {
  id?: string;
  date: Date;
  bookAccountId: string;
  bookAccountCode: string;
  description: string | null;
  debit?: number;
  credit?: number;
  inventoryId?: string;
  postRef?: string;
}

export interface EntryLinesDto {
  entryLineDtos: EntryLineDto[];
  deletedEntryLineIds?: string[];
}

export interface EntryLineFilter {
  date?: Date;
  description?: string;
  particulars?: string;
}
