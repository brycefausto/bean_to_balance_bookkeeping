"use client";

import { deleteUserAction } from "@/actions/user";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  userId,
  userName,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteUserAction(userId);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Are you sure?"
      description={
        <>
          This will permanently delete the user{" "}
          <span className="font-medium">{userName}</span>.
        </>
      }
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  );
}
