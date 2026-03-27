"use client";

import { toggleUserActivationAction } from "@/actions/user";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

interface ToggleActivateUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToggleActivateUserDialog({
  user,
  open,
  onOpenChange,
}: ToggleActivateUserDialogProps) {
  const [isLoading, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await toggleUserActivationAction(user.id);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete user");
      }

      toast.success(
        `User ${user.deactivated ? "activated" : "deactivated"} successfully`
      );
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error.message ||
          `Failed to ${user.deactivated ? "activate" : "deactivate"} user`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Are you sure?"
      description={
        user.deactivated ? (
          <>
            Reactivating the user{" "}
            <span className="font-medium">{user.name}</span> will continue
            service.
          </>
        ) : (
          <>
            Deactivating the user{" "}
            <span className="font-medium">{user.name}</span> will discontinue
            service.
          </>
        )
      }
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
}
