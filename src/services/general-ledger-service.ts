import {
  JournalEntryFilter,
  UpdateJournalEntryDto,
} from "@/interfaces/journal.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class GeneralLedgerService {
  async postLedgerEntry(
    bookAccountId: string,
    entry: {
      id: string;
      date: Date;
      item: string;
      postRef: string;
      debit?: number;
      credit?: number;
      ledgerCategory?: "JOURNAL_ENTRY" | "ADJUSTMENT" | "CLOSING";
    }
  ) {
    // 1️⃣ Get the account info
    const account = await prisma.bookAccount.findUnique({
      where: { id: bookAccountId },
    });
    if (!account) throw new Error("Book account not found");

    // 2️⃣ Get the latest balance for this account
    const lastLedger = await prisma.generalLedger.findFirst({
      where: { bookAccountId },
      orderBy: { date: "desc" },
    });

    const previousBalance = lastLedger?.balance ?? 0;
    const debit = entry.debit ?? 0;
    const credit = entry.credit ?? 0;

    // 3️⃣ Compute new balance based on normal side
    let newBalance: number;
    if (account.normalSide === "DEBIT") {
      newBalance = previousBalance + debit - credit;
    } else {
      newBalance = previousBalance - debit + credit;
    }

    const updateLedgerDto = {
      date: entry.date,
      item: entry.item,
      postRef: entry.postRef,
      debit,
      credit,
      balance: newBalance,
      ledgerCategory: entry.ledgerCategory ?? "JOURNAL_ENTRY",
      bookAccountId,
    };

    const createLedgerDto = {
      ...updateLedgerDto,
      entryId: entry.id,
    };

    // 4️⃣ Create the new ledger entry
    const newEntry = await prisma.generalLedger.upsert({
      where: { entryId: entry.id },
      create: createLedgerDto,
      update: updateLedgerDto,
    });

    return newEntry;
  }

  async findByAccount(
    accountName: string,
    companyId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const account = await prisma.bookAccount.findFirst({
      where: { name: accountName, companyId },
    });

    if (!account) throw new Error("Account not found");

    const ledgerEntries = await prisma.generalLedger.findMany({
      where: {
        bookAccountId: account.id,
        date: {
          gte: startDate ?? new Date("1900-01-01"),
          lte: endDate ?? new Date(),
        },
      },
      orderBy: { date: "asc" },
      include: {
        bookAccount: true,
      },
    });

    return { account, ledgerEntries };
  }

  async find(
    companyId: string,
    search: string = "",
    filter?: JournalEntryFilter,
    page: number = 1,
    pageSize: number = 10
  ) {
    const skip = (page - 1) * pageSize;
    const { journalType, date } = filter || {};

    const data = await prisma.journalEntry.findMany({
      where: {
        companyId,
        ...(date ? { date: date } : {}),
        OR: [
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          ...(journalType ? [{ journalType }] : []),
          ...(date ? [{ date }] : []),
        ],
      },
      skip,
      take: pageSize,
    });

    const total = await prisma.journalEntry.count();

    return {
      data,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }

  async findAll(companyId: string) {
    return prisma.generalLedger.findMany({
      where: {
        bookAccount: {
          companyId,
        },
      },
      include: {
        bookAccount: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.journalEntry.findUnique({
      where: { id },
      include: {
        entries: {
          include: {
            bookAccount: true,
          },
        },
      },
    });
  }

  // UPDATE
  async update(id: string, data: UpdateJournalEntryDto) {
    return prisma.journalEntry.update({
      where: { id },
      data,
    });
  }

  // DELETE
  async delete(id: string) {
    await prisma.generalLedger.delete({
      where: { id },
    });
  }

  async deleteByEntryLine(entryId: string) {
    await prisma.generalLedger.delete({
      where: { entryId },
    });
  }

  async deleteByEntryLines(entryIds: string[]) {
    await prisma.generalLedger.deleteMany({
      where: { entryId: { in: entryIds } },
    });
  }
}

// singleton instance
export const generalLedgerService = new GeneralLedgerService();
