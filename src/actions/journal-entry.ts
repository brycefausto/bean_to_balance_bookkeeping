"use server";

import {
  CreateJournalEntryDto,
  JournalEntryDto,
  UpdateJournalEntryDto,
} from "@/interfaces/journal.dto";
import { createCRUDMessage } from "@/lib/string.utils";
import { journalService } from "@/services/journal.service";
import { ActionResultState } from "@/types";
import { JournalEntry } from "@prisma/client";
import { revalidatePath } from "next/cache";

const dataName = "journal entry";
const dataNamePlural = "journal entries";

export async function createJournalEntryAction(
  userId: string,
  companyId: string,
  data: CreateJournalEntryDto
): Promise<ActionResultState<JournalEntry>> {
  try {
    const journalEntry = await journalService.create(userId, companyId, data);

    revalidatePath("/journal-entries");

    return {
      success: true,
      data: journalEntry,
      message: createCRUDMessage(dataName, "create", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "create", "failed") };
  }
}

export async function updateJournalEntryAction(
  id: string,
  data: UpdateJournalEntryDto
): Promise<ActionResultState<JournalEntry>> {
  try {
    const journalEntry = await journalService.update(id, data);
    revalidatePath("/journal-entries");

    return {
      success: true,
      data: journalEntry,
      message: createCRUDMessage(dataName, "update", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "update", "failed") };
  }
}

// export async function findBookAccountAction(
//   companyId: string,
//   code: string
// ): Promise<ActionResultState<JournalEntry>> {
//   try {
//     const journalEntry = await journalService.findByCode(companyId, code);

//     if (journalEntry) {
//       return {
//         success: true,
//         data: journalEntry,
//       };
//     } else {
//       return {
//         message: "Journal Entry  not found",
//       };
//     }
//   } catch (error: any) {
//     console.log(error.message);
//     return { message: "Failed to find book account" };
//   }
// }

export async function findAllAction(
  companyId: string
): Promise<ActionResultState<JournalEntryDto[]>> {
  try {
    const data = await journalService.findAll(companyId);

    if (data) {
      return {
        success: true,
        data,
      };
    } else {
      return {
        message: "Journal Entry  not found",
      };
    }
  } catch (error: any) {
    console.log(error.message);
    return { message: "Failed to find book account" };
  }
}

export async function deleteJournalEntryAction(
  id: string
): Promise<ActionResultState> {
  try {
    await journalService.delete(id);
    revalidatePath("/journal-entries");

    return {
      success: true,
      message: createCRUDMessage(dataName, "delete", "success"),
    };
  } catch (error: any) {
    console.log(error.message);
    return { message: createCRUDMessage(dataName, "delete", "failed") };
  }
}
