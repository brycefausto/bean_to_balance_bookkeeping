"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getNormalSide, normalSideLabels } from "@/interfaces/book-account.dto";
import { cn } from "@/lib/utils";
import { useBookAccountsContext } from "@/store/book-accounts.store";
import { BookAccount } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

interface BookAccountSelectProps {
  companyId: string;
  value?: string;
  onValueChange?: (value?: BookAccount) => void;
  maxOptions?: number;
}

export function BookAccountSelect({
  companyId,
  value,
  onValueChange,
  maxOptions = 20,
}: BookAccountSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { bookAccounts } = useBookAccountsContext();

  const filteredAccounts = useMemo(() => {
    return bookAccounts
      .filter((account) =>
        `${account.code} ${account.name}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
      .slice(0, maxOptions);
  }, [searchValue, maxOptions, bookAccounts]);

  const selectedAccount = bookAccounts.find((it) => it.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {value && selectedAccount
            ? `${selectedAccount.code} - ${selectedAccount.name} - (${normalSideLabels[selectedAccount.normalSide]})`
            : "Select account..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search accounts..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>No account found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {filteredAccounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={account.id}
                  onSelect={(currentValue) => {
                    if (currentValue !== value) {
                      onValueChange?.(
                        bookAccounts.find((it) => it.id === currentValue)
                      );
                    }
                    setOpen(false);
                    setSearchValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === account.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">
                      {account.code} - {account.name} - ({normalSideLabels[account.normalSide]})
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {account.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
