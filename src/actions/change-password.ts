"use server";

import { RESET_PASSWORD_TEMPLATE } from "@/lib/constants/templates";
import { sendMail } from "@/lib/email.utils";
import { hashPassword } from "@/lib/password.utils";
import prisma from "@/lib/prisma";
import { userService } from "@/services/user.service";
import { ActionResultState } from "@/types";

export async function changePasswordAction(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<ActionResultState> {
  try {
    const user = await userService.findByIdAndPassword(userId, oldPassword);

    if (!user) {
      throw new Error("Invalid Password");
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await sendMail(user.email, "Password Reset", RESET_PASSWORD_TEMPLATE, {
      name: user.name,
    });

    return {
      success: true,
      message: "Password change successful",
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      message: error.message,
    };
  }
}
