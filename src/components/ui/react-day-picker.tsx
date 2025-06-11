// components/ui/date-range-calendar.tsx
"use client";

import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import "react-day-picker/dist/style.css";

export function DateRangeCalendar() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:max-w-[240px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range?.from && range?.to
            ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
            : "Select date range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          defaultMonth={range?.from}
        />
      </PopoverContent>
    </Popover>
  );
}
