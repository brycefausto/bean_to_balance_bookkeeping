"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import ErrorAlert from "@/components/alert/error-alert";
import { FormFieldInput } from "@/components/form/form-field-input";
import LoadingButton from "@/components/form/loading-button";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { RegisterData, registerSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormStore } from "./store";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    },
  });
  const formStore = useFormStore();

  function onSubmit(data: RegisterData) {
    startTransition(async () => {
      try {
        // const result = await registerAction(data);

        // if (result.data) {
        //   router.push("/dashboard");
        // } else {
        //   throw Error(result.message);
        // }
        console.log("submit clicked");
        formStore.setUserData(data);
        formStore.nextStep();
      } catch (error: any) {
        setError(error.message);
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Get started with your new account</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorAlert message={error} setMessage={setError} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormFieldInput
                  control={form.control}
                  name="name"
                  label="Full Name"
                >
                  <Input placeholder="Your Full Name" />
                </FormFieldInput>
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
                  <PasswordInput placeholder="Password" autoComplete="new-password" />
                </FormFieldInput>
                <FormFieldInput
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                >
                  <PasswordInput placeholder="Confirm Password" />
                </FormFieldInput>
                <FormFieldInput
                  control={form.control}
                  name="phone"
                  label="Phone"
                >
                  <Input placeholder="Phone" />
                </FormFieldInput>
                <FormFieldInput
                  control={form.control}
                  name="address"
                  label="Address"
                >
                  <Input placeholder="Address" />
                </FormFieldInput>
                <div className="flex flex-col gap-3">
                  <LoadingButton
                    loading={isPending}
                    type="submit"
                    className="w-full"
                  >
                    Next
                  </LoadingButton>
                  {/* <Button variant="outline" className="w-full">
                    Sign Up with Google
                  </Button> */}
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
