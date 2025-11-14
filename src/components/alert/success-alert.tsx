import { cn } from "@/lib/utils";
import MessageAlert, { MessageAlertProps } from "./message-alert";

export default function SuccessAlert({
  className,
  message,
  setMessage,
}: Omit<MessageAlertProps, "variant">) {
  return (
    <MessageAlert
      className={cn("border border-green-500", className)}
      message={message}
      setMessage={setMessage}
    />
  );
}
