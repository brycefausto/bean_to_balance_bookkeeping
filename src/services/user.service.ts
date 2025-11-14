import { checkAuth } from "@/auth";
import { CreateUserDto, UpdateUserDto } from "@/interfaces/user.dto";
import { hashPassword } from "@/lib/password.utils";
import { QueryParams } from "@/types";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();
export class UserService {
  // CREATE
  async create(data: CreateUserDto) {
    await checkAuth(Role.ADMIN);
    return prisma.user.create({
      data,
    });
  }

  // READ (users by page)
  async find({ page = 0, limit = 10, search = "" }: QueryParams) {
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: search,
            },
          },
          {
            name: {
              contains: search,
            },
          },
        ],
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.user.count();

    return {
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  // READ (single user)
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByIdAndPassword(id: string, password: string) {
    const hashedPassword = await hashPassword(password);
    return prisma.user.findUnique({
      where: { id, password: hashedPassword },
    });
  }

  // UPDATE
  async update(id: string, data: UpdateUserDto) {
    await checkAuth(Role.ADMIN);
    // Unverify email when the email is updated
    const user = await prisma.user.findUnique({
      where: { id, email: data.email },
    });
    if (!user) {
      data.emailVerified = null;
    }
    if (data.email)
      return prisma.user.update({
        where: { id },
        data,
      });
  }

  // DELETE
  async delete(id: string) {
    await checkAuth(Role.ADMIN);
    return prisma.user.delete({
      where: { id },
    });
  }
}

// singleton instance
export const userService = new UserService();
