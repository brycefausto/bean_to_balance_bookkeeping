import AccountForm from "@/app/(dashboard)/dashboard/account/account-form";
import { getUserSession } from "@/lib/auth-utils";

export default async function Page() {
  const user = await getUserSession();

  if (!user) return;

  return <AccountForm user={user} />;
}
