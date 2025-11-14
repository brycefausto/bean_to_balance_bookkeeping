import { RoleGuard } from "@/components/role-guard";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRoles={["OWNER", "BOOKKEEPER"]}>{children}</RoleGuard>;
}
