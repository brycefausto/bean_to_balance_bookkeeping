"use server";

import { GeneralLedgerView } from "@/interfaces/general-ledger.dto";
import { createCRUDMessage } from "@/lib/string.utils";
import { generalLedgerService } from "@/services/general-ledger-service";
import { ActionResultState } from "@/types";

const dataNamePlural = "ledgers";

export async function findAllGeneralLedgersAction(
  companyId: string
): Promise<ActionResultState<GeneralLedgerView[]>> {
  try {
    const data = await generalLedgerService.findAll(companyId);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataNamePlural, "get", "failed", error.message) };
  }
}