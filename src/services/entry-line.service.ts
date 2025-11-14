import { checkAuth } from "@/auth";
import { EntryLineFilter, EntryLinesDto } from "@/interfaces/entry-line.dto";
import { getStartOfDay } from "@/lib/date.utils";
import { EntryLine, PrismaClient, Role } from "@prisma/client";
import { generalLedgerService } from "./general-ledger-service";

const prisma = new PrismaClient();
export class EntryLineService {
  async createAndUpdate(
    journalEntryId: string,
    userId: string,
    data: EntryLinesDto
  ) {
    await checkAuth(Role.OWNER, Role.BOOKKEEPER);
    const { entryLineDtos: entryLinesDto, deletedEntryLineIds } = data;
    const entryLines: EntryLine[] = [];
    const totalDebit = entryLinesDto.reduce((current, entryLine) => current + (entryLine.debit ?? 0), 0);
    const totalCredit = entryLinesDto.reduce((current, entryLine) => current + (entryLine.credit ?? 0), 0);
    if (totalDebit !== totalCredit) {
      throw new Error("Total debit and total credit is not balanced");
    }
    for (let entryLineDto of entryLinesDto) {
      const { id, date, bookAccountId, inventoryId, ...rest } = entryLineDto;
      console.log({ entryLineDto });
      if (!id) {
        const entryLine = await prisma.entryLine.create({
          data: {
            ...rest,
            date: getStartOfDay(date),
            journalEntry: {
              connect: { id: journalEntryId },
            },
            user: {
              connect: { id: userId },
            },
            bookAccount: {
              connect: { id: bookAccountId },
            },
          },
        });
        generalLedgerService.postLedgerEntry(bookAccountId, {
          date: getStartOfDay(date),
          item: rest.description ?? "",
          postRef: rest.postRef ?? "",
          debit: rest.debit, 
          credit: rest.credit, 
          ledgerCategory: "JOURNAL_ENTRY", 
        })
        entryLines.push(entryLine);
      } else {
        const entryLine = await prisma.entryLine.update({
          where: { id },
          data: {
            ...rest,
            date: getStartOfDay(date),
            journalEntry: {
              connect: { id: journalEntryId },
            },
            user: {
              connect: { id: userId },
            },
            bookAccount: {
              connect: { id: bookAccountId },
            },
          },
        });
        entryLines.push(entryLine);
      }
    }

    if (deletedEntryLineIds) {
      await prisma.entryLine.deleteMany({
        where: { id: { in: data.deletedEntryLineIds } },
      });
    }

    return entryLines;
  }

  async find(
    journalEntryId: string,
    search: string = "",
    filter?: EntryLineFilter,
    page: number = 1,
    pageSize: number = 10
  ) {
    const skip = (page - 1) * pageSize;
    const { date } = filter || {};

    const data = await prisma.entryLine.findMany({
      where: {
        journalEntryId,
        ...(date ? { date: date } : {}),
        OR: [
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          ...(date ? [{ date }] : []),
        ],
      },
      skip,
      take: pageSize,
    });

    const total = await prisma.entryLine.count();

    return {
      data,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }

  async findById(id: string) {
    return prisma.entryLine.findUnique({
      where: { id },
    });
  }

  // DELETE
  async delete(id: string) {
    await checkAuth(Role.OWNER, Role.BOOKKEEPER);
    return prisma.entryLine.delete({
      where: { id },
    });
  }
}

// singleton instance
export const entryLineService = new EntryLineService();
