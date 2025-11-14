"use client";

import { FormFieldInput } from "@/components/form/form-field-input";
import { BookAccountSelect } from "@/components/inputs/book-account-select";
import { DatePicker } from "@/components/inputs/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/string.utils";
import { cn } from "@/lib/utils";
import { JournalEntryData } from "@/schemas/journal-entry";
import { IconExclamationCircle } from "@tabler/icons-react";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

export interface EntryLinesFormProps {
  form: UseFormReturn<JournalEntryData>;
  onReset: () => void;
  deletedIds?: string[];
  setDeletedIds?: (deletedIds: string[]) => void;
  setIsAmountEqual: (isAmountEqual: boolean) => void;
}

export function EntryLinesForm({
  form,
  onReset,
  deletedIds = [],
  setDeletedIds,
  setIsAmountEqual,
}: EntryLinesFormProps) {
  const { company } = useAuth();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entryLines",
    keyName: "fieldId",
  });

  const handleDeleteEntryLine = (idx: number) => {
    remove(idx);
    if (fields[idx] && fields[idx].id) {
      deletedIds.push(fields[idx].id);
      setDeletedIds?.([...deletedIds]);
    }
  };

  const handleReset = () => onReset();

  const watchedEntries = form.watch("entryLines");
  const getTotal = (fieldName: "debit" | "credit") => {
    return watchedEntries.reduce(
      (total, entryLine) =>
        total + parseFloat((entryLine[fieldName] || 0) + ""),
      0
    );
  };
  const totalDebit = getTotal("debit");
  const totalCredit = getTotal("credit");
  const isAmountEqual = totalDebit == totalCredit;

  useEffect(() => setIsAmountEqual(isAmountEqual), [isAmountEqual]);

  return (
    <div className="mt-2 relative w-full mx-auto">
      <div className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Date</TableHead>
              <TableHead className="w-50">Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Post Ref.</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No entry lines found.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {fields.map((field, idx) => (
                  <TableRow
                    key={field.fieldId}
                    className="border rounded p-4 mb-2 space-y-2"
                  >
                    <TableCell>
                      <FormFieldInput
                        control={form.control}
                        name={`entryLines.${idx}.date`}
                        render={(field) => (
                          <DatePicker
                            defaultDate={field.value as Date}
                            onChangeDate={field.onChange}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormFieldInput
                        control={form.control}
                        name={`entryLines.${idx}.bookAccountId`}
                        render={(field) => (
                          <BookAccountSelect
                            companyId={company.id}
                            value={field.value as string}
                            onValueChange={(value) => {
                              if (value) {
                                field.onChange(value.id);
                                form.setValue(
                                  `entryLines.${idx}.bookAccountCode`,
                                  value.code
                                );
                              }
                            }}
                          />
                        )}
                      />
                      <FormFieldInput
                        control={form.control}
                        name={`entryLines.${idx}.bookAccountCode`}
                        render={(field) => (
                          <input type="hidden" value={field.value as string} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormFieldInput
                        control={form.control}
                        name={`entryLines.${idx}.description`}
                      >
                        <Input placeholder="Description" />
                      </FormFieldInput>
                    </TableCell>
                    <TableCell>
                      <FormFieldInput
                        control={form.control}
                        name={`entryLines.${idx}.postRef`}
                      >
                        <Input placeholder="Post Reference" />
                      </FormFieldInput>
                    </TableCell>
                    <TableCell>
                      <FormFieldInput
                        control={form.control}
                        name={`entryLines.${idx}.debit`}
                        render={(field) => (
                          <Input
                            startContent={
                              <div className="pointer-events-none px-2">
                                <span className="text-default-400 text-small">
                                  ₱
                                </span>
                              </div>
                            }
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            min={0}
                            value={Number((field.value || 0) + "")}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormFieldInput
                        control={form.control}
                        name={`entryLines.${idx}.credit`}
                        render={(field) => (
                          <Input
                            startContent={
                              <div className="pointer-events-none px-2">
                                <span className="text-default-400 text-small">
                                  ₱
                                </span>
                              </div>
                            }
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            min={0}
                            value={Number((field.value || 0) + "")}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEntryLine(idx)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove entry line</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border rounded p-4 mb-2 space-y-2">
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {!isAmountEqual && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block mr-2">
                            <IconExclamationCircle
                              className="text-red-500 hover:text-red-100"
                              width={25}
                              height={25}
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total debit and total credit should be equal!</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <span
                      className={cn(
                        `font-medium text-lg`,
                        isAmountEqual ? " text-green-500" : " text-red-500"
                      )}
                    >
                      {"Total Debit: " + formatPrice(totalDebit)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        `font-medium text-lg`,
                        isAmountEqual ? " text-green-500" : " text-red-500"
                      )}
                    >
                      {"Total Credit: " + formatPrice(totalCredit)}
                    </span>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
        <div className="flex flex-row gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({
                date: new Date(),
                bookAccountId: "",
                bookAccountCode: "",
                description: "",
                postRef: "",
                debit: 0,
                credit: 0,
              })
            }
          >
            Add Entry Line
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => handleReset()}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
