import accountsJSON from "@/data/chart_of_accounts.json";
import {
  CreateBookAccountDto,
  getAccountType,
  getNormalSide,
  UpdateBookAccountDto,
} from "@/interfaces/book-account.dto";
import { AccountType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class BookAccountService {
  async create(userId: string, companyId: string, data: CreateBookAccountDto) {
    const { code } = data;
    const existingBookAccount = await prisma.bookAccount.findFirst({
      where: { code, companyId },
    });

    if (existingBookAccount) {
      await prisma.bookAccount.update({
        where: { id: existingBookAccount.id },
        data,
      });
    }
    return prisma.bookAccount.create({
      data: {
        ...data,
        user: {
          connect: { id: userId },
        },
        company: {
          connect: { id: companyId },
        },
      },
    });
  }

  async createDefaultAccounts(userId: string, companyId: string) {
    const accountsDto = accountsJSON.map(({ type, ...rest }) => ({
      ...rest,
      accountType: getAccountType(type),
      normalSide: getNormalSide(type),
      userId,
      companyId,
    }));
    return await prisma.bookAccount.createManyAndReturn({
      data: accountsDto,
    });
  }

  async find(
    companyId: string,
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    accountType?: AccountType
  ) {
    const skip = (page - 1) * pageSize;

    const data = await prisma.bookAccount.findMany({
      where: {
        companyId,
        OR: [
          {
            code: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          ...(accountType ? [{ accountType }] : []),
        ],
      },
      skip,
      take: pageSize,
      orderBy: {
        code: "asc",
      },
    });

    const total = await prisma.bookAccount.count();

    return {
      data,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }

  async findAll(
    companyId: string,
    search: string = "",
    accountType?: AccountType
  ) {
    const searchLowerCase = search.trim().toLowerCase();
    return await prisma.bookAccount.findMany({
      where: {
        companyId,
        OR: [
          {
            code: {
              contains: searchLowerCase,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: searchLowerCase,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchLowerCase,
              mode: "insensitive",
            },
          },
          ...(accountType ? [{ accountType }] : []),
        ],
      },
      orderBy: {
        code: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.bookAccount.findUnique({
      where: { id },
    });
  }

  async findByCode(companyId: string, code: string) {
    return prisma.bookAccount.findFirst({
      where: { companyId, code },
    });
  }

  // UPDATE
  async update(id: string, data: UpdateBookAccountDto) {
    return prisma.bookAccount.update({
      where: { id },
      data,
    });
  }

  // DELETE
  async delete(id: string) {
    return prisma.bookAccount.delete({
      where: { id },
    });
  }
}

// singleton instance
export const bookAccountService = new BookAccountService();
