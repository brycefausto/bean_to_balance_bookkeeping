import { CompanyQueryParams, CreateCompanyDto, UpdateCompanyDto } from "@/interfaces/company.dto";
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

  async find({ page = 0, limit = 10, search = "" }: CompanyQueryParams) {
    const skip = (page - 1) * limit;

    const data = await prisma.company.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.company.count();

    return {
      data,
      totalPages: Math.ceil(total / limit),
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
    await prisma.company.delete({
      where: { id },
    });
  }
}

export const companyService = new CompanyService();
