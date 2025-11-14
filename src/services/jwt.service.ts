// lib/services/userService.ts
import { SECRET_KEY } from "@/config/env";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { userService } from "./user.service";

const prisma = new PrismaClient();
export interface ResetPasswordDto {
  token: string;
  password: string;
}
export interface TokenPayload {
  userId: string;
}
export class InvalidTokenError extends Error {
  constructor() {
    super();
    this.message = "Invalid token or expired";
  }
}
export class JWTService {
  createToken(userId: string) {
    const payload: TokenPayload = {
      userId,
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  }

  async verifyToken(token: string) {
    return new Promise<TokenPayload | undefined>((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decoded as TokenPayload | undefined);
      });
    });
  }

  async getUserFromToken(token: string) {
    try {
      const payload: TokenPayload | undefined = await this.verifyToken(token);

      if (payload) {
        const user = await userService.findById(payload.userId);

        return user;
      } else {
        return;
      }
    } catch (error: any) {
      console.log(error.message);
      return;
    }
  }
}

// singleton instance
export const jwtService = new JWTService();
