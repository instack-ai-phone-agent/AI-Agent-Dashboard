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

// Add this interface
interface RecentCallsTableProps {
  agentId: string;
}

const mockCalls = [
  { id: "1", caller: "John Smith", time: "2025-05-18 10:22", duration: "2:34", status: "Completed", agentId: "agent-1" },
  { id: "2", caller: "Mary Johnson", time: "2025-05-18 11:01", duration: "0:47", status: "Missed", agentId: "agent-2" },
  { id: "3", caller: "Alex Brown", time: "2025-05-18 11:45", duration: "1:15", status: "Completed", agentId: "agent-1" },
  { id: "4", caller: "Emma Davis", time: "2025-05-18 13:09", duration: "3:02", status: "Voicemail", agentId: "agent-3" },
  { id: "5", caller: "Daniel Lee", time: "2025-05-18 14:22", duration: "1:50", status: "Completed", agentId: "agent-2" },
  { id: "6", caller: "Sophia White", time: "2025-05-18 15:33", duration: "0:38", status: "Missed", agentId: "agent-1" },
  { id: "7", caller: "Liam Martin", time: "2025-05-18 16:07", duration: "2:10", status: "Completed", agentId: "agent-3" },
  { id: "8", caller: "Olivia Walker", time: "2025-05-18 17:12", duration: "3:25", status: "Voicemail", agentId: "agent-2" },
];

const PAGE_SIZE = 5;

export default function RecentCallsTable({ agentId }: RecentCallsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filter by caller and agent
  const filteredCalls = mockCalls
    .filter((call) =>
      call.caller.toLowerCase().includes(search.toLowerCase())
    )
    .filter((call) => !agentId || call.agentId === agentId);

  const totalPages = Math.ceil(filteredCalls.length / PAGE_SIZE);
  const paginatedCalls = filteredCalls.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Recent Calls</h2>
        <Input
          placeholder="Search by caller..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-64"
        />
      </div>

      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-left">Caller</TableHead>
            <TableHead className="text-left">Time</TableHead>
            <TableHead className="text-left">Duration</TableHead>
            <TableHead className="text-left">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCalls.map((call) => (
            <TableRow
              key={call.id}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <TableCell>{call.caller}</TableCell>
              <TableCell>{call.time}</TableCell>
              <TableCell>{call.duration}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    call.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : call.status === "Missed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {call.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
          {paginatedCalls.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
