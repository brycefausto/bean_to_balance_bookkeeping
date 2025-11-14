import { jwtService } from "@/services/jwt.service";

export async function validateToken(token: string) {
  try {
    return await jwtService.getUserFromToken(token);
  } catch (error: any) {
    console.log(error.message);
    return;
  }
}
