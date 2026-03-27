import { checkAuth } from "@/lib/auth-utils";
import { CreateUserDto, UpdateUserDto } from "@/interfaces/user.dto";
import { hashPassword } from "@/lib/password.utils";
import { QueryParams } from "@/types";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();
export class UserService {
  // CREATE
  async create(data: CreateUserDto) {
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
  async update(
    id: string,
    { emailVerified: emailVerifiedBoolean, ...data }: UpdateUserDto
  ) {
    // Unverify email when the email is updated
    const user = await prisma.user.findUnique({
      where: { id, email: data.email },
    });
    let emailVerified = emailVerifiedBoolean ? new Date() : null;
    if (!user && !emailVerifiedBoolean) {
      emailVerified = null;
    }
    if (data.email) {
      const updateUserDto = {
        ...data,
        emailVerified,
      };
      return prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    }
  }

  async toggleActivation(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      return prisma.user.update({
        where: { id },
        data: { deactivated: !!user.deactivated },
      });
    }
  }

  // DELETE
  async delete(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }
}

// singleton instance
export const userService = new UserService();
