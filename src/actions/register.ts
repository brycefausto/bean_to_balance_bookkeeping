"use server";

import { signIn } from "@/auth";
import { RegisterData } from "@/schemas/auth";
import { CreateCompanyData } from "@/schemas/company";
import { bookAccountService } from "@/services/book-account.service";
import { ActionResultState } from "@/types";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function registerAction(
  registerData: RegisterData,
  companyData: CreateCompanyData
): Promise<ActionResultState<User>> {
  const { email, password, name } = registerData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return {
      message: "User already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  const company = await prisma.company.create({
    data: {
      ...companyData,
      user: {
        connect: { id: user.id },
      },
    },
  });

  await bookAccountService.createDefaultAccounts(user.id, company.id);

  await signIn("credentials", {
    email,
    password,
    redirect: false
  });

  return {
    success: true,
    data: user,
  };
}
