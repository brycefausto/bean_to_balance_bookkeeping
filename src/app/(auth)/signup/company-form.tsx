"use client";

import { FormFieldInput } from "@/components/form/form-field-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateCompanyData, createCompanySchema } from "@/schemas/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useFormStore } from "./store";

export function CompanyForm() {
  const { companyData, setCompanyData, nextStep, prevStep } = useFormStore();

  const form = useForm<CreateCompanyData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: companyData,
    mode: "onChange",
  });
  const {
    formState: { isValid },
  } = form;

  function onSubmit(data: CreateCompanyData) {
    setCompanyData(data);
    nextStep();
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Information
        </CardTitle>
        <CardDescription>
          Enter your company details to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-6">
              <FormFieldInput
                className="space-y-2"
                control={form.control}
                name="name"
                label="Company Name"
              >
                <Input />
              </FormFieldInput>
              <FormFieldInput
                className="space-y-2"
                control={form.control}
                name="email"
                label="Email Address"
              >
                <Input />
              </FormFieldInput>
              <FormFieldInput
                className="space-y-2"
                control={form.control}
                name="phone"
                label="Phone"
              >
                <Input />
              </FormFieldInput>
              <FormFieldInput
                className="space-y-2"
                control={form.control}
                name="address"
                label="Address"
              >
                <Input />
              </FormFieldInput>
            </div>

            <div className="flex flex-row gap-4">
              <Button className="flex-1" type="button" variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button className="flex-1" type="submit" disabled={!isValid}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
