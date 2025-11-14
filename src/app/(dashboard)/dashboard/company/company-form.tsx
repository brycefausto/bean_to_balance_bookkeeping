"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTransition } from "react";

import { updateCompanyAction } from "@/actions/company";
import { FormFieldInput } from "@/components/form/form-field-input";
import LoadingButton from "@/components/form/loading-button";
import { Form } from "@/components/ui/form";
import { UpdateCompanyData, updateCompanySchema } from "@/schemas/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CompanyForm({ company }: { company: Company }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateCompanyData>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      name: company.name ?? "",
      email: company.email ?? "",
      phone: company.phone ?? "",
      address: company.address ?? "",
    },
  });

  function onSubmit(data: UpdateCompanyData) {
    startTransition(async () => {
      try {
        const result = await updateCompanyAction(company.id, data);
        const updatedCompany = result.data;

        if (result.success && updatedCompany) {
          toast.success(result.message || "Company updated successfully");
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
        <h1 className="text-xl sm:text-2xl font-medium">Company Setting</h1>
        <p className="text-sm text-muted-foreground mb-3">
          Edit your company information
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
              <FormFieldInput control={form.control} name="phone" label="Phone">
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
      </div>
    </div>
  );
}
