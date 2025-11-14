"use server";

import { EntryLinesDto } from "@/interfaces/entry-line.dto";
import { createCRUDMessage } from "@/lib/string.utils";
import { entryLineService } from "@/services/entry-line.service";
import { ActionResultState } from "@/types";
import { EntryLine } from "@prisma/client";
import { revalidatePath } from "next/cache";

const dataName = "journal entry";

export async function createAndUpdateEntryLinesAction(
  journalId: string,
  userId: string,
  data: EntryLinesDto
): Promise<ActionResultState<EntryLine[]>> {
  try {
    const entryLines = await entryLineService.createAndUpdate(
      journalId,
      userId,
      data
    );

    revalidatePath(`/journal-entries/${journalId}`);

    return {
      success: true,
      data: entryLines,
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
// ): Promise<ActionResultState<EntryLine>> {
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
