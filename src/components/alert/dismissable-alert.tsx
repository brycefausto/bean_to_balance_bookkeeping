import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Alert } from "../ui/alert";

export interface DismissableAlertProps
  extends PropsWithChildren,
    React.ComponentProps<"div"> {
  className?: string;
  variant?: "default" | "destructive" | null | undefined;
  show?: boolean;
  setShow?: (show: boolean) => void;
}

export default function DismissableAlert({
  className,
  variant,
  children,
  show,
  setShow,
}: DismissableAlertProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setShow?.(false), 300); // match Tailwind duration
  };

  useEffect(() => {
    if (show == true) setClosing(false);
  }, [show]);

  if (!show) return null;

  return (
    <Alert
      className={cn(
        "transition-opacity duration-300",
        closing ? "opacity-0" : "opacity-100",
        className
      )}
      variant={variant}
    >
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        aria-label="Close alert"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </Alert>
  );
}
