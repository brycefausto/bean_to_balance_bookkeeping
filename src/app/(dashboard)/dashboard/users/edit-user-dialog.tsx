"use client";

import { updateUserAction } from "@/actions/user";
import { FormFieldInput } from "@/components/form/form-field-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userRoleOptions } from "@/interfaces/user.dto";
import { UpdateUserData, updateUserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role, User } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultValues = {
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: !!user.emailVerified,
  };

  // Initialize form
  const form = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
  });

  // Reset form values when user prop changes
  React.useEffect(() => {
    form.reset(defaultValues);
  }, [user, form]);

  // Handle form submission
  const onSubmit = async (data: UpdateUserData) => {
    setIsSubmitting(true);
    try {
      const result = await updateUserAction(user.id, data);

      if (!result.success) {
        throw new Error(result.message || "Failed to create user");
      }

      toast.success(result.message || "User updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldInput control={form.control} name="name" label="Name">
              <Input />
            </FormFieldInput>
            <FormFieldInput control={form.control} name="email" label="Email">
              <Input type="email" />
            </FormFieldInput>
            <FormFieldInput control={form.control} name="role" label="Role">
              <Select
                defaultValue={form.getValues("role") as Role}
                onValueChange={(value) => form.setValue("role", value as Role)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {userRoleOptions.map(({ value, label }) => (
                    <SelectItem value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldInput>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
