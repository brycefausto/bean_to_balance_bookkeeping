import { SearchIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface SearchInputProps {
  className?: string;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export default function SearchInput({
  className,
  value,
  onClick,
  onChange,
  onKeyDown,
}: SearchInputProps) {
  return (
    <Input
      className={className}
      name="search"
      placeholder="Search"
      value={value}
      endContent={
        <Button variant="ghost" onClick={onClick}>
          <SearchIcon />
        </Button>
      }
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}
