"use client";

import { createUserAction } from "@/actions/user";
import { FormFieldInput } from "@/components/form/form-field-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userRoleOptions } from "@/interfaces/user.dto";
import { CreateUserData, createUserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { IconUserPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "OWNER",
    },
  });

  // Handle form submission
  const onSubmit = async (data: CreateUserData) => {
    setIsSubmitting(true);
    try {
      const result = await createUserAction(data);

      if (!result.success) {
        throw new Error(result.message || "Failed to create user");
      }

      toast.success(result.message || "User created successfully");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <IconUserPlus size={18} />
          <span className="hidden sm:inline">Add User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to your organization. They will receive an email to
            set up their account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldInput control={form.control} name="name" label="Name">
              <Input placeholder="John Doe" />
            </FormFieldInput>
            <FormFieldInput control={form.control} name="email" label="Email">
              <Input type="email" placeholder="john@example.com" />
            </FormFieldInput>
            <FormFieldInput
              control={form.control}
              name="password"
              label="Password"
            >
              <PasswordInput placeholder="••••••••" />
            </FormFieldInput>
            <FormFieldInput
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
            >
              <PasswordInput placeholder="••••••••" />
            </FormFieldInput>
            <FormFieldInput
              control={form.control}
              name="role"
              label="Role"
              render={(field) => (
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoleOptions.map(({ value, label }) => (
                      <SelectItem value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
