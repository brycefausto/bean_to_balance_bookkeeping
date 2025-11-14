import { getUserSession } from "@/auth";
import { bookAccountService } from "@/services/book-account.service";
import AccountsList from "./accounts-list";
import { ParamsWithQuery } from "@/types";
import { parseSearchParams } from "@/lib/paramUtils";

export default async function Page({ searchParams }: ParamsWithQuery) {
  const user = await getUserSession();
  const params = await searchParams;
  const { search } = parseSearchParams(params)
  
  if (!user?.company) {
    throw new Error("Company is undefined");
  }

  const bookAccounts = await bookAccountService.findAll(user.company.id, search);
  return <AccountsList accounts={bookAccounts} />;
}
