import { getUserSession } from "@/auth";
import { BookAccountProvider } from "@/providers/book-accounts.provider";
import { bookAccountService } from "@/services/book-account.service";
import { BookAccount } from "@prisma/client";
import type React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();
  let bookAccounts: BookAccount[] = [];
  if (user?.company) {
    bookAccounts = await bookAccountService.findAll(user.company.id);
  }

  return (
    <BookAccountProvider bookAccounts={bookAccounts}>
      {children}
    </BookAccountProvider>
  );
}
