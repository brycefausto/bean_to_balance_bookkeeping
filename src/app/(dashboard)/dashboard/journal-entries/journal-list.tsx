"use client";

import {
  deleteJournalEntryAction,
  updateJournalEntryAction,
} from "@/actions/journal-entry";
import { AppPagination } from "@/components/app-pagination";
import { DatePicker } from "@/components/inputs/date-picker";
import SearchInput from "@/components/inputs/search-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import usePageUtils from "@/hooks/use-page-utils";
import { getJournalTypeName } from "@/interfaces/journal.dto";
import { toDateString, toISODate } from "@/lib/date.utils";
import { JournalEntryData } from "@/schemas/journal-entry";
import { JournalEntry, JournalType } from "@prisma/client";
import { error } from "console";
import {
  ArrowRightFromLine,
  BookOpen,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export interface JournalListProps {
  journalEntries: JournalEntry[];
  companyId: string;
  totalPages: number;
}

export default function JournalList({
  journalEntries,
  companyId,
  totalPages,
}: JournalListProps) {
  const [editingJournalEntry, setEditingJournalEntry] =
    useState<JournalEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const user = useAuth();
  const {
    page,
    searchValue,
    handleSearchClick,
    handleSearchChange,
    handleSearchEnter,
    changeParam,
  } = usePageUtils();

  const handleChangeDate = (date?: Date) => {
    const dateString = date ? toISODate(date) : undefined;

    changeParam("date", dateString);
  };

  const handleEdit = (account: JournalEntry) => {
    setEditingJournalEntry(account);
  };

  const handleUpdate = async (data: JournalEntryData) => {
    if (editingJournalEntry) {
      try {
        const result = await updateJournalEntryAction(
          editingJournalEntry.id,
          data
        );
        if (result.success) {
          toast.success(result.message);
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        toast.error(error.message);
      }

      setEditingJournalEntry(null);
    }
  };

  const handleDelete = async (code: string) => {
    try {
      const result = await deleteJournalEntryAction(code);
      if (result.success) {
        toast.success(result.success);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message)
    }
    setDeletingId(null);
  };

  const getTypeBadgeVariant = (type: JournalType) => {
    switch (type) {
      case JournalType.CASH_DISBURSEMENT:
        return "destructive";
      case JournalType.CASH_RECEIPT:
        return "secondary";
      case JournalType.PURCHASE:
        return "outline";
      case JournalType.SALES:
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Journal Entries
              </h1>
              <p className="text-muted-foreground">
                Manage your journal entries
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <SearchInput
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleSearchEnter}
              onClick={handleSearchClick}
            />
            <Button asChild size="lg">
              <Link href={`/dashboard/journal-entries/create`}>
                <Plus className="h-4 w-4" />
                Add Journal Entry
              </Link>
            </Button>
            <DatePicker
              defaultDate={new Date()}
              onChangeDate={handleChangeDate}
            />
            <Button asChild size="lg">
              <Link href={`/api/export/journal-entries/${companyId}`} download>
                <ArrowRightFromLine className="h-4 w-4" />
                Export
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Date</TableHead>
                <TableHead className="w-50">Journal Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journalEntries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No journal entries found.
                  </TableCell>
                </TableRow>
              ) : (
                journalEntries.map((journalEntry) => (
                  <TableRow key={journalEntry.id}>
                    <TableCell className="font-mono font-medium">
                      {toDateString(journalEntry.date)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge
                        variant={getTypeBadgeVariant(journalEntry.journalType)}
                        className="font-mono text-xs"
                      >
                        {getJournalTypeName(journalEntry.journalType)}
                      </Badge>
                    </TableCell>
                    <TableCell>{journalEntry.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <Link href={`/dashboard/journal-entries/edit/${journalEntry.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit journal entry</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(journalEntry.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete journal entry</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <AppPagination initialPage={page} total={totalPages} />
        </div>

        <AlertDialog
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                account from the chart of accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingId && handleDelete(deletingId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
