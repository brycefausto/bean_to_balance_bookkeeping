import AccountForm from "@/app/(dashboard)/dashboard/account/account-form";
import { getUserSession } from "@/auth";

export default async function Page() {
  const user = await getUserSession();

  if (!user) return;

  return <AccountForm user={user} />;
}
