"use client";

import { changePasswordAction } from "@/actions/change-password";
import { FormFieldInput } from "@/components/form/form-field-input";
import LoadingButton from "@/components/form/loading-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { ChangePasswordData, ChangePasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ChangePasswordDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({
  user,
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: ChangePasswordData) {
    startTransition(async () => {
      try {
        const { currentPassword, newPassword } = data;

        const result = await changePasswordAction(
          user?.id ?? "",
          currentPassword,
          newPassword
        );

        if (result.success) {
          toast.success(
            result.message || "Password has been changed successfully"
          );
          form.reset();
        } else {
          toast.error(result.message || "Something went wrong");
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your password</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:max-w-md lg:max-w-lg space-y-6"
          >
            <FormFieldInput
              className="space-y-2"
              control={form.control}
              name="currentPassword"
              label="Current Password"
            >
              <PasswordInput placeholder="••••••••" />
            </FormFieldInput>
            <FormFieldInput
              className="space-y-2"
              control={form.control}
              name="newPassword"
              label="New Password"
            >
              <PasswordInput placeholder="••••••••" />
            </FormFieldInput>
            <FormFieldInput
              className="space-y-2"
              control={form.control}
              name="confirmPassword"
              label="Confirm New Password"
            >
              <PasswordInput placeholder="••••••••" />
            </FormFieldInput>
            <LoadingButton
              disabled={isPending}
              type="submit"
              className="w-full h-10 mt-2"
            >
              Change Password
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
