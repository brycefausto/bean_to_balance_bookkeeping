import {
  CreateJournalEntryDto,
  JournalEntryFilter,
  UpdateJournalEntryDto,
} from "@/interfaces/journal.dto";
import { checkAuth } from "@/lib/auth-utils";
import { getStartOfDay } from "@/lib/date.utils";
import { PrismaClient, Role } from "@prisma/client";
import { entryLineService } from "./entry-line.service";

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

  async count(companyId: string) {
    const data = await prisma.journalEntry.count({
      where: {
        companyId,
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
    await entryLineService.deleteAllByJournalEntry(id);
    await prisma.journalEntry.delete({
      where: { id },
    });
  }
}

// singleton instance
export const journalService = new JournalService();
