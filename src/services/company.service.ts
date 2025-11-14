import { CreateCompanyDto, UpdateCompanyDto } from "@/interfaces/company.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class CompanyService {
  async create(data: CreateCompanyDto) {
    const { userId, ...companyData } = data;
    return prisma.company.create({
      data: {
        ...companyData,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async find(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const data = await prisma.company.findMany({
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.company.count();

    return {
      data,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }

  async findById(id: string) {
    return prisma.company.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string) {
    return prisma.company.findUnique({
      where: { userId: userId },
    });
  }

  async update(id: string, data: UpdateCompanyDto) {
    return prisma.company.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.company.delete({
      where: { id },
    });
  }
}

export const companyService = new CompanyService();
