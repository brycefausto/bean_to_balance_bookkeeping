import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";

type Role = "BOOKKEEPER" | "OWNER" | "ADMIN"
type Company = {
    name: string;
    id: string;
    email: string | null;
    image: string | null;
    phone: string | null;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}
declare module "next-auth" {
  interface User {
    id: string;
    role?: "BOOKKEEPER" | "OWNER" | "ADMIN";
    company?: Company;
  }
}
export class CustomAuthError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

          const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // Edge runtime supports body for POST
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          // ❌ Invalid credentials → redirect
          if (!res.ok) {
            throw new CustomAuthError("Invalid Credentials");
          }

          return data.user;
        } catch (error: any) {
          throw new CustomAuthError(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      // If the user object exists on sign-in, add the user ID to the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.company = user.company;
      }
      if (trigger === "update" && session) {
        // Logic to update JWT based on new user data
        token.name = session.user.name as string;
        token.email = session.user.email;
        // ... other updates
      }
      return token;
    },
    async session({ session, token }) {
      // Add the user ID from the token to the session object
      session.user.id = token.id as string;
      session.user.name = token.name;
      session.user.email = token.email as string;
      session.user.role = token.role as Role;
      session.user.company = token.company as Company;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  logger: {
    error(error) {
      // Auth.js v5 logger passes an Error, not (code, metadata)
      if (String(error?.message || "").includes("CredentialsSignin")) {
        console.warn("[Auth] Sign-in failed: Invalid email or password");
        return;
      }
      console.error("[Auth]", error);
    },
    warn(code) {
      console.warn("[Auth][warn]", code);
    },
    debug(code) {
      // Quiet noisy debug output
    },
  },
});
