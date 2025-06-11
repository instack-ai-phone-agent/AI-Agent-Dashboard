"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import RecentCallsTable from "@/components/recent-calls-table";
import RecentChats from "@/components/recent-chats";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { RefreshCw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import CallDetailModal from "@/components/Call-Detail-Modal";

export default function HistoryPage() {
  const [tab, setTab] = useState("calls");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  const agentId = "sidebar-selected-agent";

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  const renderCommandItem = (label: string, value: string, count?: number) => (
    <CommandItem
      key={value}
      value={value}
      onSelect={() => toggleFilter(value)}
      className="flex justify-between items-center gap-2"
    >
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 flex items-center justify-center border rounded-sm">
          {selectedFilters.includes(value) && <Check className="w-3 h-3" />}
        </div>
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span className="ml-auto text-xs font-mono text-muted-foreground">{count}</span>
      )}
    </CommandItem>
  );

  return (
    <DashboardShell>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Call History</h1>
        </div>

        <div className="items-left mb-6 flex flex-col justify-between gap-2 px-4 sm:flex-row md:px-0">
          <div className="flex flex-1 flex-col justify-start gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-2">
              <Calendar selected={dateRange} onSelect={setDateRange} />

              <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 px-3 text-sm font-normal border border-input"
                  >
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search filters..." />
                    <CommandList>
                      <CommandEmpty>No filters found.</CommandEmpty>
                      <CommandGroup heading="Ended Reason">
                        {renderCommandItem("Call Transfer", "call-transfer", 6)}
                        {renderCommandItem("Silence Timeout", "silence-timeout", 9)}
                        {renderCommandItem("Max Duration", "max-duration")}
                        {renderCommandItem("Voicemail", "voicemail")}
                        {renderCommandItem("Phonely Ended Call", "phonely-ended")}
                        {renderCommandItem("Customer Ended", "customer-ended", 82)}
                      </CommandGroup>
                      <div className="h-[1px] w-full bg-muted my-1" />
                      <CommandGroup heading="Unread">
                        {renderCommandItem("Read", "read")}
                        {renderCommandItem("Unread", "unread")}
                      </CommandGroup>
                      <div className="h-[1px] w-full bg-muted my-1" />
                      <CommandGroup heading="Call Type">
                        {renderCommandItem("Inbound", "inbound", 97)}
                        {renderCommandItem("Outbound", "outbound")}
                        {renderCommandItem("Web Call", "web-call", 3)}
                        {renderCommandItem("Warm Transfer", "warm-transfer")}
                      </CommandGroup>
                    </CommandList>
                    {selectedFilters.length > 0 && (
                      <div className="border-t border-muted p-2 text-sm">
                        <Button
                          variant="ghost"
                          onClick={clearFilters}
                          className="w-full"
                        >
                          Clear filters
                        </Button>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>

              <Input
                placeholder="Search phone number ..."
                className="h-9 w-full sm:w-[200px] text-sm"
              />

              <Button
                variant="outline"
                className="h-9 px-3 text-sm font-normal"
                onClick={() => {
                  // trigger refresh logic here
                }}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              {selectedFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 text-sm text-muted-foreground"
                >
                  <X className="h-4 w-4" /> Reset
                </Button>
              )}
            </div>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="hidden md:flex">
            <TabsList>
              <TabsTrigger value="calls">Calls</TabsTrigger>
              <TabsTrigger value="chats">Chats</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {tab === "calls" && (
          <RecentCallsTable
            agentId={agentId}
            dateRange={dateRange}
            filters={selectedFilters}
            showMockData={true}
            onRowClick={(callId: string) => setSelectedCallId(callId)}
          />
        )}
        {tab === "chats" && <RecentChats agentId={agentId} />}

        <CallDetailModal
          open={!!selectedCallId}
          callId={selectedCallId || ""}
          onClose={() => setSelectedCallId(null)}
        />
      </div>
    </DashboardShell>
  );
}
