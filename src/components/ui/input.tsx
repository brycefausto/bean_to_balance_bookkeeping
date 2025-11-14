import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}>(({
  className,
  type,
  startContent,
  endContent,
  ...props
}, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {startContent && (
        <span className="absolute left-0 flex items-center text-muted-foreground">
          {startContent}
        </span>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          startContent ? "pl-10" : "",
          endContent ? "pr-10" : "",
          className
        )}
        ref={ref}
        {...props}
      />
      {endContent && (
        <span className="absolute right-0 flex items-center text-muted-foreground">
          {endContent}
        </span>
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input }
