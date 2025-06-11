"use client";

import * as React from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

export function Calendar({
  selected,
  onSelect,
  className,
  ...props
}: {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const formattedRange =
    selected?.from && selected?.to
      ? `${format(selected.from, "MMM dd")} - ${format(selected.to, "MMM dd, yyyy")}`
      : "Select date range";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "inline-flex items-center justify-between whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 min-h-[40px] w-full sm:max-w-[200px]",
            className
          )}
        >
          <span>{formattedRange}</span>
          <CalendarIcon className="ml-2 opacity-50 size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="range"
          selected={selected}
          onSelect={onSelect}
          numberOfMonths={2}
          defaultMonth={selected?.from ?? new Date()}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
