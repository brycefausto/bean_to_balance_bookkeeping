"use server";

import { createCRUDMessage } from "@/lib/string.utils";
import { CreateUserData, UpdateUserData } from "@/schemas/user";
import { userService } from "@/services/user.service";
import { ActionResultState } from "@/types";
import { User } from "@prisma/client";
import _ from "lodash";
import { revalidatePath } from "next/cache";

const dataName = "user";

export async function createUserAction(
  data: CreateUserData
): Promise<ActionResultState<User>> {
  try {
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
    return { message: createCRUDMessage(dataName, "create", "failed") };
  }
}

export async function updateUserAction(
  id: string,
  data: UpdateUserData
): Promise<ActionResultState<User>> {
  try {
    const user = await userService.update(id, {
      ...data,
    });
    revalidatePath("/users");

    return {
      success: true,
      data: user,
      message: createCRUDMessage(dataName, "update", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "update", "failed") };
  }
}

export async function deleteUserAction(id: string): Promise<ActionResultState> {
  try {
    await userService.delete(id);
    revalidatePath("/users");

    return {
      success: true,
      message: createCRUDMessage(dataName, "delete", "success"),
    };
  } catch (error) {
    return { message: createCRUDMessage(dataName, "delete", "failed") };
  }
}
