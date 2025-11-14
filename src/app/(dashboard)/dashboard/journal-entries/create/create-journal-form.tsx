"use client";

import { createJournalEntryAction } from "@/actions/journal-entry";
import BackButton from "@/components/buttons/back-button";
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
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { journalTypeOptions } from "@/interfaces/journal.dto";
import { EntryLinesData, entryLinesSchema } from "@/schemas/entry-line";
import {
  JournalEntryData,
  journalEntrySchema,
  EntryLinesArray,
} from "@/schemas/journal-entry";
import { zodResolver } from "@hookform/resolvers/zod";
import { JournalType } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EntryLinesForm } from "../entry-lines-form";
import { EntryLinesDto } from "@/interfaces/entry-line.dto";
import { createAndUpdateEntryLinesAction } from "@/actions/entry-line";

export function CreateJournalForm() {
  const { user, company } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isAmountEqual, setIsAmountEqual] = useState(true);
  const form = useForm<JournalEntryData>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      description: "",
      journalType: JournalType.GENERAL,
      date: new Date(),
      entryLines: []
    },
  });

  const handleResetEntryLines = () => {
    form.resetField("entryLines");
  };

  const handleSubmit = (data: JournalEntryData) => {
    startTransition(async () => {
      const { entryLines, ...journalEntryData } = data;
      try {
        const result = await createJournalEntryAction(
          user.id,
          company.id,
          journalEntryData
        );
        if (result.success && result.data) {
          await saveEntryLines(result.data.id, entryLines);
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const saveEntryLines = async (
    journalEntryId: string,
    entryLines: EntryLinesArray
  ) => {
    if (!isAmountEqual) {
      toast.error("The total debit and total credit should be equal");
      return;
    }
    const entryLinesDto: EntryLinesDto = {
      entryLineDtos: entryLines,
    };
    const result = await createAndUpdateEntryLinesAction(
      journalEntryId,
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
            <CardDescription>Create or update a journal entry</CardDescription>
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
                    name="journalType"
                    label="Journal Type"
                    render={(field) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value as JournalType}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a journal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {journalTypeOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
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
                </div>
                <LoadingButton
                  type="submit"
                  loading={isPending}
                  loadingText="Saving..."
                >
                  Add Journal Entry
                </LoadingButton>
                <EntryLinesForm
                  form={form}
                  onReset={handleResetEntryLines}
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
