import { Role } from "@prisma/client";
import { isArray } from "lodash";
import { auth } from "@/auth";
import { userService } from "@/services/user.service";

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
