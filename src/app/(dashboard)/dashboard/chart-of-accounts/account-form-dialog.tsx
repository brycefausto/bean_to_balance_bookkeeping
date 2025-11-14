"use client";

import {
  createBookAccountAction,
  findBookAccountAction,
  updateBookAccountAction,
} from "@/actions/book-account";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { FormFieldInput } from "@/components/form/form-field-input";
import LoadingButton from "@/components/form/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  accountTypeOptions,
  getNormalSide,
  normalSideLabels,
} from "@/interfaces/book-account.dto";
import {
  type BookAccountData,
  bookAccountSchema,
  FINANCIAL_REPORTS,
} from "@/schemas/book-account";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookAccount, NormalSide } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: BookAccount;
  onSetAccount?: (account: BookAccount | null) => void;
  mode: "add" | "edit";
}

export function AccountFormDialog({
  open,
  onOpenChange,
  account,
  onSetAccount,
  mode,
}: AccountFormDialogProps) {
  const { user, company } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [bookAccountData, setBookAccountData] =
    useState<BookAccountData | null>();
  const defaultValues: BookAccountData = account
    ? {
        code: account.code,
        name: account.name,
        description: account.description ?? "",
        accountType: account.accountType,
        financialReport: account.financialReport ?? "",
        normalSide: account.normalSide,
      }
    : {
        code: "",
        name: "",
        description: "",
        accountType: "ASSET",
        financialReport: "Balance Sheet",
        normalSide: getNormalSide("ASSET"),
      };
  const form = useForm<BookAccountData>({
    resolver: zodResolver(bookAccountSchema),
    defaultValues,
  });

  const handleSubmit = (data: BookAccountData) => {
    startTransition(async () => {
      try {
        const result = await findBookAccountAction(
          user.company?.id || "",
          data.code
        );
        if (mode == "add" && result.data) {
          setIsConfirmDialogOpen(true);
          setBookAccountData(data);
        } else {
          await handleConfirmSubmit(data);
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };

  const handleConfirmSubmit = async (data: BookAccountData) => {
    try {
      if (mode == "add") {
        const result = await createBookAccountAction(user.id, company.id, data);
        if (result.success) {
          toast.success(result.message);
        } else {
          throw new Error(result.message);
        }
      } else {
        if (account) {
          try {
            const result = await updateBookAccountAction(account.id, data);
            if (result.success) {
              toast.success(result.message);
            } else {
              throw new Error(result.message);
            }
          } catch (error: any) {
            toast.error(error.message);
          }

          onSetAccount?.(null);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    form.reset();
    onOpenChange(false);
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [account]);

  const accountType = form.watch("accountType");
  const normalSide = form.watch("normalSide") as NormalSide;

  useEffect(() => {
    form.setValue("normalSide", getNormalSide(accountType));
  }, [accountType]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add New Account" : "Edit Account"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Create a new account in the chart of accounts."
                : "Update the account details."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormFieldInput
                  control={form.control}
                  name="code"
                  label="Account Code"
                >
                  <Input placeholder="111" />
                </FormFieldInput>
                <FormFieldInput
                  control={form.control}
                  name="accountType"
                  label="Account Type"
                  render={(field) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountTypeOptions.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <FormFieldInput
                control={form.control}
                name="name"
                label="Account Name"
              >
                <Input placeholder="Cash" />
              </FormFieldInput>
              <FormFieldInput
                control={form.control}
                name="description"
                label="Description"
              >
                <Input placeholder="Money available on hand or in bank" />
              </FormFieldInput>
              <FormFieldInput
                control={form.control}
                name="financialReport"
                label="Financial Report"
                render={(field) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select financial report" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FINANCIAL_REPORTS.map((report) => (
                        <SelectItem key={report} value={report}>
                          {report}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="p-2">
                <span>
                  <span className="text-sm font-medium">Balance Type:</span>{" "}
                  {normalSideLabels[normalSide]}
                </span>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  loading={isPending}
                  loadingText="Saving..."
                >
                  {mode === "add" ? "Add Account" : "Save Changes"}
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="The account code already exists."
        description="The account code already exists in the list. Do you want to overwrite the account?"
        onConfirm={() => {
          if (bookAccountData) {
            handleConfirmSubmit(bookAccountData);
            setBookAccountData(null);
          }
        }}
      />
    </>
  );
}
