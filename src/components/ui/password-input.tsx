import * as React from "react";

import { Input } from "./input";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  style?: React.CSSProperties;
}>(({ endContent, type, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <Input
      type={visible ? "text" : "password"}
      ref={ref}
      endContent={
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible(!visible)}
          className="focus:outline-none bg-transparent border-0 p-0 m-0 flex items-center mr-3"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

