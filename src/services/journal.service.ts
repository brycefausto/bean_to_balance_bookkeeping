import { checkAuth } from "@/auth";
import {
  CreateJournalEntryDto,
  JournalEntryFilter,
  UpdateJournalEntryDto,
} from "@/interfaces/journal.dto";
import { getStartOfDay } from "@/lib/date.utils";
import { JournalEntry, JournalType, PrismaClient, Role } from "@prisma/client";
import { DateTime } from "luxon";

const prisma = new PrismaClient();
export class JournalService {
  async create(userId: string, companyId: string, data: CreateJournalEntryDto) {
    await checkAuth(Role.OWNER, Role.BOOKKEEPER);
    const { date, ...rest } = data;
    return prisma.journalEntry.create({
      data: {
        ...rest,
        date: getStartOfDay(date),
        user: {
          connect: { id: userId },
        },
        company: {
          connect: { id: companyId },
        },
      },
    });
  }

  async createAllJournals(
    userId: string,
    companyId: string,
    date: Date,
    isCopy: boolean
  ) {
    await checkAuth(Role.OWNER, Role.BOOKKEEPER);
    const journalTypes = Object.values(JournalType);
    const newJournalEntries: JournalEntry[] = [];

    for (let journalType of journalTypes) {
      let description: string | null = null;
      if (isCopy) {
        const existingJournalEntry = await prisma.journalEntry.findFirst({
          where: { journalType, companyId },
        });

        if (existingJournalEntry) {
          description = existingJournalEntry.description;
        }
      }

      const journalEntry = await prisma.journalEntry.create({
        data: {
          description,
          journalType,
          date: date
            ? DateTime.fromJSDate(date).startOf("day").toJSDate()
            : DateTime.now().startOf("day").toJSDate(),
          user: {
            connect: { id: userId },
          },
          company: {
            connect: { id: companyId },
          },
        },
      });
      newJournalEntries.push(journalEntry);
    }

    return newJournalEntries;
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
    const data = await prisma.journalEntry.findMany({
      where: {
        companyId,
      },
      include: {
        entries: {
          include: {
            bookAccount: true,
          },
        },
      },
    });

    return data;
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
    await checkAuth(Role.OWNER, Role.BOOKKEEPER);
    return prisma.journalEntry.update({
      where: { id },
      data,
    });
  }

  // DELETE
  async delete(id: string) {
    await checkAuth(Role.OWNER, Role.BOOKKEEPER);
    return prisma.journalEntry.delete({
      where: { id },
    });
  }
}

// singleton instance
export const journalService = new JournalService();
