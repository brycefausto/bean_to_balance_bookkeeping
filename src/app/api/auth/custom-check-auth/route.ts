import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const isLoggedIn = !!session;
 
  return Response.json({ isLoggedIn })
}