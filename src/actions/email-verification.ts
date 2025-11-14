"use server";
import { BASE_URL } from "@/config/env";
import { VERIFY_EMAIL_TEMPLATE } from "@/lib/constants/templates";
import { sendMail } from "@/lib/email.utils";
import prisma from "@/lib/prisma";
import { InvalidTokenError, jwtService } from "@/services/jwt.service";
import { userService } from "@/services/user.service";
import { ActionResultState } from "@/types";

export async function requestEmailVerificationAction(
  email: string
): Promise<ActionResultState> {
  try {
    const user = await userService.findByEmail(email);

    if (user) {
      const token = jwtService.createToken(user.id);
      const url = `${BASE_URL}/verify-email/${token}`;
      await sendMail(user.email, "Verify Email", VERIFY_EMAIL_TEMPLATE, {
        name: user.name,
        url,
      });
    }
  } catch (error: any) {
    return {
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Successfully sent email",
  };
}

export async function verifyEmailAction(
  token: string
): Promise<ActionResultState> {
  try {
    const user = await jwtService.getUserFromToken(token);

    if (!user) {
      throw new InvalidTokenError();
    }

    if (user.emailVerified) {
      throw new Error("The email is already verified");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    return {
      success: true,
      message: "Successfully verified email",
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      message: error.message,
    };
  }
}
