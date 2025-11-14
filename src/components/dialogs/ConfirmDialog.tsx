import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

export interface ConfirmDialogProps {
  title: string;
  description: string | React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isDelete?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isLoading,
  isDelete,
}: ConfirmDialogProps) {
  const handleOnCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleOnCancel}>
            {!!onConfirm ? "Cancel" : "Close"}
          </AlertDialogCancel>
          {!!onConfirm && (
            <AlertDialogAction
              className={
                isDelete
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              disabled={isLoading}
            >
              {isDelete
                ? isLoading
                  ? "Deleting..."
                  : "Delete"
                : isLoading
                ? "Confirming..."
                : "Confirm"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
