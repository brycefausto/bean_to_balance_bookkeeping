import { userService } from "@/services/user.service";
import CompanyList from "./company-list";
import { ParamsWithQuery } from "@/types";
import { parseSearchParams } from "@/lib/paramUtils";
import { companyService } from "@/services/company.service";

export default async function Page({ searchParams }: ParamsWithQuery) {
  const params = await searchParams;
  const { page, search } = parseSearchParams(params);
  const { data, totalPages } = await companyService.find({ page, search });

  return <CompanyList companies={data} totalPages={totalPages} />;
}
