"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export interface DatePickerProps {
  defaultDate: Date;
  onChangeDate?: (date?: Date) => void;
  hasLabel?: boolean;
}

export function DatePicker({
  defaultDate,
  onChangeDate,
  hasLabel,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const dateValue = date ?? defaultDate;

  return (
    <div className="flex flex-row gap-2">
      {hasLabel && (
        <Label htmlFor="date" className="px-1">
          Select Date
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
              onChangeDate?.(date);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
