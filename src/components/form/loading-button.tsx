import { cn } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";
import { VariantProps } from "class-variance-authority";
import React from "react";
import { Button, buttonVariants } from "../ui/button";

export default function LoadingButton({
  children,
  loading,
  loadingText,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    loadingText?: string;
  }) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? (
        <>
          <IconLoader
            className={cn("animate-spin", !!loadingText && "mr-2")}
            stroke={2}
          />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
