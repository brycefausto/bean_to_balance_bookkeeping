"use server";

import { checkAuth, checkSelfAuthOrAdmin } from "@/lib/auth-utils";
import { createCRUDMessage } from "@/lib/string.utils";
import { CreateUserData, UpdateUserData } from "@/schemas/user";
import { userService } from "@/services/user.service";
import { ActionResultState } from "@/types";
import { Role, User } from "@prisma/client";
import _ from "lodash";
import { revalidatePath } from "next/cache";

const dataName = "user";

export async function createUserAction(
  data: CreateUserData
): Promise<ActionResultState<User>> {
  try {
    checkAuth(Role.ADMIN);
    const createDto = _.omit(data, ["confirmPassword"]);
    const user = await userService.create(createDto);

    revalidatePath("/users");

    return {
      success: true,
      data: user,
      message: createCRUDMessage(dataName, "create", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      message: createCRUDMessage(dataName, "create", "failed", error.message),
    };
  }
}

export async function updateUserAction(
  id: string,
  data: UpdateUserData
): Promise<ActionResultState<User>> {
  try {
    checkSelfAuthOrAdmin(id);
    const user = await userService.update(id, {
      ...data,
    });
    revalidatePath("/users");
    revalidatePath("/account");

    return {
      success: true,
      data: user,
      message: createCRUDMessage(dataName, "update", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "update", "failed", error.message) };
  }
}

export async function toggleUserActivationAction(
  id: string,
): Promise<ActionResultState<User>> {
  try {
    checkSelfAuthOrAdmin(id);
    const user = await userService.toggleActivation(id);
    revalidatePath("/users");
    revalidatePath("/account");

    return {
      success: true,
      data: user,
      message: createCRUDMessage(dataName, "update", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "update", "failed", error.message) };
  }
}

export async function deleteUserAction(id: string): Promise<ActionResultState> {
  try {
    checkSelfAuthOrAdmin(id);
    await userService.delete(id);
    revalidatePath("/users");

    return {
      success: true,
      message: createCRUDMessage(dataName, "delete", "success"),
    };
  } catch (error: any) {
    return { message: createCRUDMessage(dataName, "delete", "failed", error.message) };
  }
}
