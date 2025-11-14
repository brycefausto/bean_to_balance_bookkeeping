"use client";

import { createAndUpdateEntryLinesAction } from "@/actions/entry-line";
import { updateJournalEntryAction } from "@/actions/journal-entry";
import { FormFieldInput } from "@/components/form/form-field-input";
import LoadingButton from "@/components/form/loading-button";
import { DatePicker } from "@/components/inputs/date-picker";
import FormLayout from "@/components/layouts/FormLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { EntryLinesDto } from "@/interfaces/entry-line.dto";
import { getJournalTypeName, JournalEntryDto } from "@/interfaces/journal.dto";
import {
  EntryLinesArray,
  JournalEntryData,
  journalEntrySchema,
} from "@/schemas/journal-entry";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EntryLinesForm } from "../../entry-lines-form";

export interface EditJournalFormProps {
  journalEntry: JournalEntryDto;
}

export function EditJournalForm({ journalEntry }: EditJournalFormProps) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isAmountEqual, setIsAmountEqual] = useState(true);
  const form = useForm<JournalEntryData>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      description: journalEntry.description ?? undefined,
      date: journalEntry.date,
      journalType: journalEntry.journalType,
      entryLines: journalEntry.entries.map((entryLine) => ({
        ...entryLine,
        debit: entryLine.debit ?? 0,
        credit: entryLine.credit ?? 0,
        description: entryLine.description ?? undefined,
        postRef: entryLine.postRef ?? undefined,
      })),
    },
  });

  const handleResetEntryLines = () => {
    form.resetField("entryLines");
  };

  const handleSubmit = (data: JournalEntryData) => {
    startTransition(async () => {
      const { entryLines, ...journalEntryData } = data;
      try {
        if (!_.isEqual(form.formState.defaultValues, journalEntryData)) {
          const result = await updateJournalEntryAction(
            journalEntry.id,
            journalEntryData
          );
          if (!result.success) {
            throw new Error(result.message);
          }
        }
        await saveEntryLines(entryLines);
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const saveEntryLines = async (entryLines: EntryLinesArray) => {
    if (!isAmountEqual) {
      toast.error("The total debit and total credit should be equal");
      return;
    }
    const entryLinesDto: EntryLinesDto = {
      entryLineDtos: entryLines,
      deletedEntryLineIds: deletedIds,
    };
    const result = await createAndUpdateEntryLinesAction(
      journalEntry.id,
      user.id,
      entryLinesDto
    );
    if (result.success) {
      toast.success(result.message);
    } else {
      throw new Error(result.message);
    }
  };

  return (
    <FormLayout>
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Journal Entry</CardTitle>
            <CardDescription>Update a journal entry</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-row gap-4">
                  <FormFieldInput
                    control={form.control}
                    name="description"
                    label="Description"
                  >
                    <Input placeholder="Description" className="max-w-100" />
                  </FormFieldInput>
                  <FormFieldInput
                    control={form.control}
                    name="date"
                    label="Date"
                    render={(field) => (
                      <DatePicker
                        defaultDate={field.value as Date}
                        onChangeDate={field.onChange}
                      />
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">Journal Type: </span>
                    <span>{getJournalTypeName(journalEntry.journalType)}</span>
                  </div>
                </div>
                <div>
                  <span>
                    {Object.values(form.formState.errors).map(
                      (it) => it.message
                    )}
                  </span>
                </div>
                <LoadingButton
                  type="submit"
                  loading={isPending}
                  loadingText="Saving..."
                >
                  Update Journal Entry
                </LoadingButton>
                <EntryLinesForm
                  form={form}
                  onReset={handleResetEntryLines}
                  deletedIds={deletedIds}
                  setDeletedIds={setDeletedIds}
                  setIsAmountEqual={setIsAmountEqual}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </FormLayout>
  );
}
