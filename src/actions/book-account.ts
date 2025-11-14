"use server";

import { checkAuth } from "@/auth";
import { createCRUDMessage } from "@/lib/string.utils";
import { BookAccountData } from "@/schemas/book-account";
import { bookAccountService } from "@/services/book-account.service";
import { ActionResultState } from "@/types";
import { BookAccount, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

const dataName = "book account";
const dataNamePlural = "book accounts";

export async function createBookAccountAction(
  userId: string,
  companyId: string,
  data: BookAccountData
): Promise<ActionResultState<BookAccount>> {
  try {
    await checkAuth(Role.OWNER, Role.BOOKKEEPER);
    const bookAccount = await bookAccountService.create(
      userId,
      companyId,
      data
    );

    revalidatePath("/chart-of-accounts");

    return {
      success: true,
      data: bookAccount,
      message: createCRUDMessage(dataName, "create", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "create", "failed", error.message) };
  }
}

export async function updateBookAccountAction(
  id: string,
  data: BookAccountData
): Promise<ActionResultState<BookAccount>> {
  try {
    await checkAuth(Role.OWNER, Role.BOOKKEEPER);
    const bookAccount = await bookAccountService.update(id, data);
    revalidatePath("/chart-of-accounts");

    return {
      success: true,
      data: bookAccount,
      message: createCRUDMessage(dataName, "update", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "update", "failed", error.message) };
  }
}

export async function findBookAccountAction(
  companyId: string,
  code: string
): Promise<ActionResultState<BookAccount>> {
  try {
    const bookAccount = await bookAccountService.findByCode(companyId, code);

    if (bookAccount) {
      return {
        success: true,
        data: bookAccount,
      };
    } else {
      return {
        message: createCRUDMessage(dataName, "find", "not found"),
      };
    }
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "find", "failed", error.message) };
  }
}

export async function findAllBookAccountsAction(
  companyId: string
): Promise<ActionResultState<BookAccount[]>> {
  try {
    const bookAccounts = await bookAccountService.findAll(companyId);

    return {
      success: true,
      data: bookAccounts,
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataNamePlural, "get", "failed", error.message) };
  }
}

export async function deleteBookAccountAction(
  id: string
): Promise<ActionResultState> {
  try {
    await checkAuth(Role.OWNER, Role.BOOKKEEPER);
    await bookAccountService.delete(id);
    revalidatePath("/chart-of-accounts");

    return {
      success: true,
      message: createCRUDMessage(dataName, "delete", "success"),
    };
  } catch (error: any) {
    return { message: createCRUDMessage(dataName, "delete", "failed", error.message) };
  }
}
