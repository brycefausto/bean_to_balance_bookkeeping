"use server";

import { checkAuth } from "@/auth";
import { createCRUDMessage } from "@/lib/string.utils";
import { UpdateCompanyData } from "@/schemas/company";
import { companyService } from "@/services/company.service";
import { ActionResultState } from "@/types";
import { Company, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

const dataName = "company";

export async function updateCompanyAction(
  id: string,
  data: UpdateCompanyData
): Promise<ActionResultState<Company>> {
  try {
    await checkAuth(Role.ADMIN);
    const company = await companyService.update(id, {
      ...data,
    });
    revalidatePath("/company");

    return {
      success: true,
      data: company,
      message: createCRUDMessage(dataName, "create", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "create", "failed", error.message) };
  }
}

export async function deleteCompanyAction(
  id: string
): Promise<ActionResultState> {
  try {
    await checkAuth(Role.ADMIN);
    await companyService.delete(id);
    revalidatePath("/companies");

    return {
      success: true,
      message: createCRUDMessage(dataName, "delete", "success"),
    };
  } catch (error: any) {
    return { message: createCRUDMessage(dataName, "delete", "failed", error.message) };
  }
}
