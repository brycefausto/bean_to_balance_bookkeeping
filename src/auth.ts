import { PrismaAdapter } from "@auth/prisma-adapter";
import { Company, Role } from "@prisma/client";
import { isArray } from "lodash";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./lib/password.utils";
import prisma from "./lib/prisma";
import { userService } from "./services/user.service";

declare module "next-auth" {
  interface User {
    id: string;
    role?: Role;
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
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              company: true,
            },
          });

          if (!user || !user.password) {
            console.log("Invalid Credentials");
            throw new CustomAuthError("Invalid Credentials");
          }
          const isValid = await comparePassword(password, user.password);
          if (!isValid) throw new CustomAuthError("Invalid Credentials");

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            company: user.company ?? undefined,
          };
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

function checkRoles(role: Role, requiredRoles?: Role | Role[]) {
  if (isArray(requiredRoles)) {
    return requiredRoles.includes(role);
  } else {
    return requiredRoles == role;
  }
}

export async function checkAuth(...requiredRoles: Role[]) {
  const session = await auth();
  const checkRole =
    requiredRoles && session?.user?.role
      ? checkRoles(session?.user?.role, requiredRoles)
      : true;

  if (!session || !checkRole) {
    throw new Error("Unauthorized");
  }
}

export async function getUserSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const user = await userService.findById(session.user.id);
  if (user == null) {
    console.log("The user is null");
    return null;
  }

  return user;
}
