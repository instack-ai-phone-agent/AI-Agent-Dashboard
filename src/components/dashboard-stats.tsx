"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, PhoneIncoming, PhoneOutgoing, Volume2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Optional: for className conditionals
import { Calendar } from "@/components/ui/calendar"; // If you're using a custom one
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DashboardStatsProps {
  agentId: string;
}

const viewOptions = ["Daily", "Weekly", "Monthly"] as const;

export default function DashboardStats({ agentId }: DashboardStatsProps) {
  const [view, setView] = useState<typeof viewOptions[number]>("Daily");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date(),
  });

  // You would dynamically fetch stats based on `view` and `dateRange` later.
  const stats = [
    {
      icon: Clock,
      label: "Total Duration",
      value: view === "Monthly" ? "28h 20m" : view === "Weekly" ? "7h 45m" : "1h 10m",
    },
    {
      icon: PhoneIncoming,
      label: "Inbound Calls",
      value: view === "Monthly" ? "320" : view === "Weekly" ? "80" : "15",
    },
    {
      icon: PhoneOutgoing,
      label: "Outbound Calls",
      value: view === "Monthly" ? "260" : view === "Weekly" ? "65" : "12",
    },
    {
      icon: Volume2,
      label: "Total Volume",
      value: view === "Monthly" ? "580" : view === "Weekly" ? "145" : "27",
    },
    {
      icon: DollarSign,
      label: "Call Cost",
      value: view === "Monthly" ? "$382.50" : view === "Weekly" ? "$94.30" : "$18.50",
    },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* View Toggle + Date Range Picker */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          {viewOptions.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={view === option ? "default" : "outline"}
              onClick={() => setView(option)}
            >
              {option}
            </Button>
          ))}
        </div>

        {/* Date Range Picker (Simple Placeholder) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {dateRange.from.toDateString()} - {dateRange.to.toDateString()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                if (range?.from && range?.to) setDateRange({ from: range.from, to: range.to });
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="shadow-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="text-sm text-gray-500">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
              </div>
              <Icon className="w-6 h-6 text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
