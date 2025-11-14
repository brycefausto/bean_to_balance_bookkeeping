import { cn } from "@/lib/utils";
import MessageAlert, { MessageAlertProps } from "./message-alert";

export default function ErrorAlert({
  className,
  message,
  setMessage,
}: Omit<MessageAlertProps, "variant">) {
  return (
    <MessageAlert
      className={cn("border border-red-500", className)}
      variant={"destructive"}
      message={message}
      setMessage={setMessage}
    />
  );
}
