"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoginData, loginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorAlert from "@/components/alert/error-alert";
import { FormFieldInput } from "@/components/form/form-field-input";
import LoadingButton from "@/components/form/loading-button";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginData) {
    startTransition(async () => {
      const { email, password } = data;
      try {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (!res.error) {
          router.push("/dashboard");
        } else {
          throw new Error(res.code);
        }
      } catch (error: any) {
        setError(error.message);
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorAlert message={error} setMessage={setError} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormFieldInput
                  control={form.control}
                  name="email"
                  label="Email"
                >
                  <Input type="email" placeholder="youremail@example.com" />
                </FormFieldInput>
                <FormFieldInput
                  control={form.control}
                  name="password"
                  label="Password"
                >
                  <PasswordInput placeholder="Password" />
                </FormFieldInput>
                <div className="flex items-center">
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  <LoadingButton
                    loading={isPending}
                    type="submit"
                    className="w-full"
                  >
                    Login
                  </LoadingButton>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
