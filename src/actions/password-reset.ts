"use server";

import { BASE_URL } from "@/config/env";
import {
  REQUEST_RESET_PASSWORD_TEMPLATE,
  RESET_PASSWORD_TEMPLATE,
} from "@/lib/constants/templates";
import { sendMail } from "@/lib/email.utils";
import { hashPassword } from "@/lib/password.utils";
import prisma from "@/lib/prisma";
import { InvalidTokenError, jwtService } from "@/services/jwt.service";
import { userService } from "@/services/user.service";
import { ActionResultState } from "@/types";

export async function requestPasswordResetAction(
  email: string
): Promise<ActionResultState> {
  try {
    const user = await userService.findByEmail(email);

    if (user) {
      const token = jwtService.createToken(user.id);
      const url = `${BASE_URL}/reset-password/${token}`;
      await sendMail(
        user.email,
        "Password Reset Request",
        REQUEST_RESET_PASSWORD_TEMPLATE,
        { name: user.name, url }
      );
    }
  } catch (error: any) {
    return {
      message: error.message,
    };
  }

  return {
    success: true,
    message: "If an account exists, we sent an email",
  };
}

export async function resetPasswordAction(
  token: string,
  password: string
): Promise<ActionResultState> {
  try {
    const user = await jwtService.getUserFromToken(token);

    if (!user) {
      throw new InvalidTokenError();
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await sendMail(user.email, "Password Reset", RESET_PASSWORD_TEMPLATE, {
      name: user.name,
    });

    return {
      success: true,
      message: "Password reset successful",
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      message: error.message,
    };
  }
}
