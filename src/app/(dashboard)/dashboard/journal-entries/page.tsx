import { getUserSession } from "@/auth";
import { fromISODate } from "@/lib/date.utils";
import { parseSearchParams } from "@/lib/paramUtils";
import { journalService } from "@/services/journal.service";
import { ParamsWithQuery } from "@/types";
import { JournalType } from "@prisma/client";
import JournalList from "./journal-list";

export default async function Page({ searchParams }: ParamsWithQuery) {
  const user = await getUserSession();
  const params = await searchParams;
  const { page, search } = parseSearchParams(params);
  const journalType = params.journalType as JournalType | undefined;
  const dateString = params.date as string | undefined;
  let date: Date | undefined;

  if (dateString) {
    try {
      date = fromISODate(dateString);
    } catch (error) {}
  }

  if (!user?.company) {
    throw new Error("Company is undefined");
  }

  const { data, totalPages } = await journalService.find(
    user.company.id,
    search,
    { journalType, date },
    page
  );
  return <JournalList journalEntries={data} companyId={user.company.id} totalPages={totalPages} />;
}
