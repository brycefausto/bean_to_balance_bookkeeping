"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState, useTransition } from "react";

import { updateUserAction } from "@/actions/user";
import { FormFieldInput } from "@/components/form/form-field-input";
import LoadingButton from "@/components/form/loading-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  UpdateAccountData,
  updateAccountSchema,
} from "@/schemas/update-account";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChangePasswordDialog } from "./change-password-dialog";
import EmailVerificationButton from "./email-verification-button";
import { Label } from "@/components/ui/label";
import _ from "lodash";

export default function AccountForm({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { data: session, update } = useSession();

  const form = useForm<UpdateAccountData>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: "",
      address: "",
    },
  });

  function onSubmit(data: UpdateAccountData) {
    startTransition(async () => {
      try {
        const result = await updateUserAction(user.id, data);
        const updatedUser = result.data;

        if (result.success && updatedUser) {
          await update({
            user: {
              ...session?.user,
              name: updatedUser.name,
              email: updatedUser.email,
            },
          });
          toast.success(result.message || "User updated successfully");
        } else {
          toast.error(result.message || "Something went wrong");
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-3xl">
        <h1 className="text-xl sm:text-2xl font-medium">Account Setting</h1>
        <p className="text-sm text-muted-foreground mb-3">
          Edit your account information
        </p>
        <Separator className="mb-6" />
        <Form {...form}>
          <form
            className="w-full md:max-w-md lg:max-w-lg"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              <FormFieldInput
                className="grid gap-3"
                control={form.control}
                name="name"
                label="Full Name"
              >
                <Input placeholder="Your Full Name" />
              </FormFieldInput>
              <FormFieldInput
                className="grid gap-3"
                control={form.control}
                name="email"
                label="Email"
              >
                <Input type="email" placeholder="youremail@example.com" />
              </FormFieldInput>
              <div className="grid gap-3">
                <Label>Role</Label>
                <span className="text-lg font-medium">{_.capitalize(user.role)}</span>
              </div>

              <EmailVerificationButton user={user} />

              <div className="flex flex-col gap-3">
                <LoadingButton
                  disabled={isPending}
                  type="submit"
                  className="w-full h-10 mt-2"
                >
                  Save
                </LoadingButton>
              </div>
            </div>
          </form>
        </Form>

        <div className="mt-12 mb-8">
          <h2 className="text-xl sm:text-2xl font-medium">Change Password</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Update your password
          </p>
          <Separator className="mb-6" />

          <Button
            className="h-10 mt-2"
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            Change Password
          </Button>
          <ChangePasswordDialog
            user={user}
            open={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
          />

          <div className="mt-6 text-center text-sm sm:text-base">
            Forgot your password?{" "}
            <Link
              href="/forgot-password"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Reset password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
