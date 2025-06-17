"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard-shell";
import RecentChats from "@/components/recent-chats";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { RefreshCw, Check, X, Download, EyeOff, Trash2 } from "lucide-react";
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
import CallDetailModal from "@/components/call-detail-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCallHistories, deleteCallHistory } from "@/lib/api";

interface Call {
  id: string;
  name: string;
  time: string;
  phone: string;
  duration: string;
  topic: string;
  sentiment: string;
  endedReason: string;
  outcome: string;
  agentId: string;
}

export default function HistoryPage() {
  const [tab, setTab] = useState("calls");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const agentId = "sidebar-selected-agent";

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const allCalls = await getCallHistories();
        const mappedCalls: Call[] = allCalls.map((c: any) => ({
          id: c.id.toString(),
          name: c.name || "Unknown",
          time: c.data_and_time,
          phone: c.phone_number || "Unknown",
          duration: c.duration || "-",
          topic: c.topic || "-",
          sentiment: c.sentiment || "-",
          endedReason: c.ended_reason || "-",
          outcome: c.outcome || "-",
          agentId: c.voice_agent_id?.toString() || "",
        }));
        setCalls(mappedCalls);
      } catch (err) {
        console.error("Failed to fetch call histories:", err);
      }
    };
    fetchCalls();
  }, [dateRange, filtersOpen, selectedFilters, search]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
    setPage(1);
  };

  const clearFilters = () => setSelectedFilters([]);
  
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.checked) {
    setSelectedIds((prev) => [...new Set([...prev, ...paginated.map(c => c.id)])]);
  } else {
    setSelectedIds((prev) => prev.filter(id => !paginated.map(c => c.id).includes(id)));
  }
};

  const exportSelected = () => {
    const data = filtered.filter((c) => selectedIds.includes(c.id));
    const csv = [
      [
        "Date",
        "Time",
        "Phone",
        "Duration",
        "Topic",
        "Ended Reason",
        "Outcome",
      ],
      ...data.map((call) => [
        new Date(call.time).toLocaleDateString("en-AU"),
        new Date(call.time).toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        call.phone,
        call.duration,
        call.topic,
        call.endedReason,
        call.outcome,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calls_export.csv";
    link.click();
  };

  const deleteSelected = async () => {
    for (const id of selectedIds) {
      await deleteCallHistory(Number(id));
    }
    setCalls((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
  };

  const filtered = calls
    .filter((call) =>
      call.name.toLowerCase().includes(search.toLowerCase()) ||
      call.phone.includes(search)
    )
    .filter((call) => !agentId || call.agentId === agentId)
    .filter((call) => {
      if (!dateRange?.from || !dateRange?.to) return true;
      const callDate = new Date(call.time);
      return callDate >= dateRange.from && callDate <= dateRange.to;
    })
    .filter((call) => {
      if (!selectedFilters?.length) return true;
      return selectedFilters.some((f) => {
        const val = f.toLowerCase();
        return (
          call.endedReason.toLowerCase().includes(val) ||
          call.outcome.toLowerCase().includes(val)
        );
      });
    });

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);  
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full sm:w-[200px] text-sm"
              />

              <Button
                variant="outline"
                className="h-9 px-3 text-sm font-normal"
                onClick={() => window.location.reload()}
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedIds.length === 0}
                  onClick={exportSelected}
                >
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedIds.length === 0}
                  onClick={() => setSelectedIds([])}
                >
                  <EyeOff className="h-4 w-4 mr-2" /> Mark as Read
                </Button>
                <Button variant="outline" size="sm" disabled={selectedIds.length === 0} onClick={deleteSelected}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={paginated.every(call => selectedIds.includes(call.id)) && paginated.length > 0}
                      onChange={selectAll}
                    />
                  </TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Ended Reason</TableHead>
                  <TableHead>Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((call) => (
                  <TableRow
                    key={call.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedCallId(call.id)}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(call.id)}
                        onChange={() => toggleSelect(call.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {new Date(call.time).toLocaleDateString("en-AU", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(call.time).toLocaleTimeString("en-AU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>{call.phone}</TableCell>
                    <TableCell>{call.duration}</TableCell>
                    <TableCell>{call.topic}</TableCell>
                    <TableCell>{call.sentiment}</TableCell>
                    <TableCell>{call.endedReason}</TableCell>
                    <TableCell>{call.outcome}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                      No matching calls found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
  <span className="text-sm text-muted-foreground">
    Page {page} of {totalPages}
  </span>
  <div className="space-x-2">
    <Button
      variant="outline"
      size="sm"
      disabled={page === 1}
      onClick={() => setPage((prev) => prev - 1)}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      disabled={page === totalPages}
      onClick={() => setPage((prev) => prev + 1)}
    >
      Next
    </Button>
  </div>
</div>

          </div>
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
