"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DateRange } from "react-day-picker";
import { Download, Eye, EyeOff } from "lucide-react";

interface RecentCallsTableProps {
  agentId: string;
  dateRange?: DateRange;
  filters?: string[];
  showMockData?: boolean;
  onRowClick: (callId: string) => void;
}

interface Call {
  id: string;
  name: string;
  time: string;
  phone: string;
  duration: string;
  topic: string;
  endedReason: string;
  outcome: string;
  agentId: string;
}

const mockCalls: Call[] = [
  {
    id: "1",
    name: "John Smith",
    time: "2025-06-10T14:30:00",
    phone: "+61 400 123 456",
    duration: "3m 21s",
    topic: "Product Inquiry",
    endedReason: "Customer Ended",
    outcome: "Follow-up scheduled",
    agentId: "agent-1",
  },
  {
    id: "2",
    name: "Emily Brown",
    time: "2025-06-10T10:05:00",
    phone: "+61 421 987 654",
    duration: "2m 15s",
    topic: "Support Request",
    endedReason: "Silence Timeout",
    outcome: "Escalated to Tier 2",
    agentId: "agent-1",
  },
  {
    id: "3",
    name: "Michael Chen",
    time: "2025-06-09T16:45:00",
    phone: "+61 433 456 789",
    duration: "4m 58s",
    topic: "Billing Issue",
    endedReason: "Max Duration",
    outcome: "Resolved",
    agentId: "agent-1",
  },
  {
    id: "4",
    name: "Lisa Kumar",
    time: "2025-06-08T11:22:00",
    phone: "+61 490 321 888",
    duration: "1m 39s",
    topic: "Voicemail",
    endedReason: "Voicemail",
    outcome: "Message left",
    agentId: "agent-2",
  },
];

export default function RecentCallsTable({
  agentId,
  dateRange,
  filters,
  showMockData,
  onRowClick,
}: RecentCallsTableProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filtered.map((c) => c.id));
    } else {
      setSelectedIds([]);
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

  const filtered = mockCalls
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
      if (!filters?.length) return true;
      return filters.some((f) => {
        const val = f.toLowerCase();
        return (
          call.endedReason.toLowerCase().includes(val) ||
          call.outcome.toLowerCase().includes(val)
        );
      });
    });

  return (
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
        </div>
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={selectedIds.length === filtered.length}
                onChange={selectAll}
              />
            </TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Ended Reason</TableHead>
            <TableHead>Outcome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((call) => (
            <TableRow
              key={call.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onRowClick(call.id)}
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
    </div>
  );
}
