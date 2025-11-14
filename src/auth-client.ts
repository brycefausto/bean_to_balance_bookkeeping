"use client";

import { useSession } from "next-auth/react";

export function getUserFromSession() {
  const { data } = useSession();

  if (!data?.user) {
    throw new Error("Unauthorized");
  }

  return data.user;
}
