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
import { Checkbox } from "@/components/ui/checkbox";

interface RecentCallsTableProps {
  agentId: string;
  dateRange?: DateRange;
  filters?: string[];
  showMockData?: boolean;
  onRowClick: (callId: string) => void;
}

const mockCalls = [
  {
    id: "1",
    name: "John Smith",
    time: "2025-06-10T14:30:00",
    phone: "+61 400 123 456",
    duration: "3m 21s",
    topic: "Product Inquiry",
    endedReason: "Customer Ended",
    outcome: "Follow-up scheduled",
    agentId: "sidebar-selected-agent",
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
    agentId: "sidebar-selected-agent",
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
    agentId: "sidebar-selected-agent",
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
    agentId: "sidebar-selected-agent",
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

  const filtered = mockCalls
    .filter((call) =>
      call.name.toLowerCase().includes(search.toLowerCase()) ||
      call.phone.includes(search)
    )
    .filter((call) => !agentId || call.agentId === agentId)
    .filter((call) => {
      if (!dateRange?.from || !dateRange?.to) return true;
      const callDate = new Date(call.time);
      return callDate >= new Date(dateRange.from) && callDate <= new Date(dateRange.to);
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

  const isSelected = (id: string) => selectedIds.includes(id);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const exportSelected = () => {
    const selectedData = mockCalls.filter((call) => selectedIds.includes(call.id));
    console.log("Exporting:", selectedData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Calls</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          {selectedIds.length > 0 && (
            <Button size="sm" onClick={exportSelected} variant="outline">
              Export selected
            </Button>
          )}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selectedIds.length === filtered.length}
                onCheckedChange={(checked) =>
                  setSelectedIds(checked ? filtered.map((c) => c.id) : [])
                }
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
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={isSelected(call.id)}
                  onCheckedChange={() => toggleSelect(call.id)}
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
