"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordData, resetPasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { resetPasswordAction } from "@/actions/password-reset";
import { FormFieldInput } from "@/components/form/form-field-input";
import LoadingButton from "@/components/form/loading-button";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorAlert from "@/components/alert/error-alert";
import SuccessAlert from "@/components/alert/success-alert";

export interface ResetPasswordFormProps {
  token: string | undefined;
  isTokenValid: boolean;
}

export function ResetPasswordForm({
  token,
  isTokenValid,
}: ResetPasswordFormProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: ResetPasswordData) {
    const { password } = data;
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    startTransition(async () => {
      try {
        const result = await resetPasswordAction(token, password);
        if (result.success) {
          setSuccess(
            result.message + " Redirecting to login page after 2 seconds..."
          );
          form.reset();
          // Redirect to login page after 2 seconds
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          throw new Error(result?.message);
        }
      } catch (error: any) {
        setError(error.message || "Something went wrong. Please try again.");
      }
    });
  }

  if (!token || !isTokenValid) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Invalid or expired reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border border-red-500" variant="destructive">
              <AlertDescription>
                The reset link is invalid or has expired. Please request a new
                one.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center text-sm">
              <Link
                href="/forgot-password"
                className="underline underline-offset-4"
              >
                Back to forgot password
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorAlert message={error} setMessage={setError} />
          <SuccessAlert message={success} setMessage={setSuccess} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormFieldInput
                  control={form.control}
                  name="password"
                  label="New Password"
                >
                  <PasswordInput placeholder="New Password" />
                </FormFieldInput>
                <FormFieldInput
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                >
                  <PasswordInput placeholder="Confirm Password" />
                </FormFieldInput>
                <div className="flex flex-col gap-3">
                  <LoadingButton
                    loading={isPending}
                    type="submit"
                    className="w-full"
                  >
                    Reset Password
                  </LoadingButton>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                <Link href="/login" className="underline underline-offset-4">
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
