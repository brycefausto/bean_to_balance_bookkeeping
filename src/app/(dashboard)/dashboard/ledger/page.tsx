import { getUserSession } from "@/auth";
import { generalLedgerService } from "@/services/general-ledger-service";
import { ParamsWithQuery } from "@/types";
import LedgerPage from "./ledger-page";

export default async function Page({ searchParams }: ParamsWithQuery) {
  const user = await getUserSession();
  if (!user?.company) {
    throw new Error("Company is undefined");
  }

  const data = await generalLedgerService.findAll(user.company.id);
  return <LedgerPage data={data} />;
}
