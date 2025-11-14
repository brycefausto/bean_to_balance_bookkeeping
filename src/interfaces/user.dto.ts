import { Role } from "@prisma/client";
import _ from "lodash";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  image?: string;
  role: Role;
  phone?: string;
  address?: string;
}

export interface UpdateUserDto {
  name: string;
  email: string;
  image?: string;
  role?: Role;
  phone?: string;
  address?: string;
  emailVerified?: null;
}

export const userRoleOptions = Object.values(Role).map((value) => ({
  value,
  label: _.capitalize(value),
}));
