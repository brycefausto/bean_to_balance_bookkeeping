import { ConfirmDialog, ConfirmDialogProps } from "./ConfirmDialog";

export interface DeleteDialogProps
  extends Omit<ConfirmDialogProps, "isDelete"> {}

export function DeleteDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      {...{
        title,
        description,
        open,
        onOpenChange,
        onConfirm,
        onCancel,
        isDelete: true,
      }}
    />
  );
}
