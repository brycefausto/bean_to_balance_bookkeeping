"use client";

import {
  createBookAccountAction,
  deleteBookAccountAction,
  updateBookAccountAction,
} from "@/actions/book-account";
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
import { BookAccountData } from "@/schemas/book-account";
import { BookAccount } from "@prisma/client";
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
import { AccountFormDialog } from "./account-form-dialog";
import { normalSideLabels, getNormalSide } from "@/interfaces/book-account.dto";

export interface AccountsListProps {
  accounts: BookAccount[];
}

export default function AccountsList({
  accounts,
}: AccountsListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BookAccount | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user, company } = useAuth();
  const {
    searchValue,
    handleSearchClick,
    handleSearchChange,
    handleSearchEnter,
  } = usePageUtils();

  const handleEdit = (account: BookAccount) => {
    setEditingAccount(account);
  };

  const handleUpdate = async (data: BookAccountData) => {
    if (editingAccount) {
      try {
        const result = await updateBookAccountAction(editingAccount.id, data);
        if (result.success) {
          toast.success(result.message);
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        toast.error(error.message);
      }

      setEditingAccount(null);
    }
  };

  const handleDelete = (code: string) => {
    deleteBookAccountAction(code);
    setDeletingId(null);
  };

  const getTypeBadgeVariant = (type: string) => {
    if (type.includes("ASSET")) return "default";
    if (type.includes("LIABILITY")) return "destructive";
    if (type.includes("EQUITY")) return "secondary";
    if (type.includes("REVENUE")) return "outline";
    if (type.includes("EXPENSE")) return "outline";
    return "default";
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
                Chart of Accounts
              </h1>
              <p className="text-muted-foreground">
                Manage your accounting structure with {accounts.length} accounts
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
            <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
            <Button asChild size="lg">
              <Link
                href={`/api/export/chart-of-accounts/${company.id}`}
                download
              >
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
                <TableHead className="w-24">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-40">Type</TableHead>
                <TableHead className="w-40">Financial Report</TableHead>
                <TableHead className="w-40">Balance Type</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No accounts found. Add your first account to get started.
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.code}>
                    <TableCell className="font-mono font-medium">
                      {account.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {account.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {account.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getTypeBadgeVariant(account.accountType)}
                        className="font-mono text-xs"
                      >
                        {account.accountType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {account.financialReport}
                    </TableCell>
                    <TableCell className="text-sm">
                      {normalSideLabels[account.normalSide]}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(account)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit account</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(account.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete account</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AccountFormDialog
          open={!!editingAccount}
          onOpenChange={(open) => !open && setEditingAccount(null)}
          account={editingAccount || undefined}
          onSetAccount={setEditingAccount}
          mode="edit"
        />

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

        <AccountFormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          mode="add"
        />
      </div>
    </div>
  );
}
