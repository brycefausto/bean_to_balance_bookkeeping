import AccountForm from "@/app/(dashboard)/dashboard/account/account-form";
import { getUserSession } from "@/auth";
import CompanyForm from "./company-form";
import { companyService } from "@/services/company.service";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const user = await getUserSession();
  if (!user) {
    redirect("/login");
  }
  const company = await companyService.findByUserId(user.id);

  if (!company) {
    notFound();
  }

  return <CompanyForm company={company} />;
}
