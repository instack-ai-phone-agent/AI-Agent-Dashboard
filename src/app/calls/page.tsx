"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const mockCalls = [
  { id: "1", caller: "John Smith", time: "2025-05-18 10:22", duration: "2:34", status: "Completed", agent: "agent1" },
  { id: "2", caller: "Mary Johnson", time: "2025-05-18 11:01", duration: "0:47", status: "Missed", agent: "agent2" },
  { id: "3", caller: "Alex Brown", time: "2025-05-18 11:45", duration: "1:15", status: "Completed", agent: "agent1" },
  { id: "4", caller: "Emma Davis", time: "2025-05-18 13:09", duration: "3:02", status: "Voicemail", agent: "agent2" },
  { id: "5", caller: "Daniel Lee", time: "2025-05-18 14:22", duration: "1:50", status: "Completed", agent: "agent1" },
  // ... more mock data
];

const agents = [
  { id: "all", name: "All Agents" },
  { id: "agent1", name: "Alice" },
  { id: "agent2", name: "Bob" },
];

const statuses = [
  { id: "all", label: "All Statuses" },
  { id: "Completed", label: "Completed" },
  { id: "Missed", label: "Missed" },
  { id: "Voicemail", label: "Voicemail" },
];

export default function CallHistoryPage() {
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Filter calls based on selected agent, status, and search
  const filteredCalls = mockCalls.filter((call) => {
    const matchesAgent = selectedAgent === "all" || call.agent === selectedAgent;
    const matchesStatus = selectedStatus === "all" || call.status === selectedStatus;
    const matchesSearch = call.caller.toLowerCase().includes(search.toLowerCase());
    return matchesAgent && matchesStatus && matchesSearch;
  });

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Call History</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Agent Filter */}
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Input */}
          <Input
            placeholder="Search by caller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caller</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalls.length > 0 ? (
                filteredCalls.map((call) => (
                  <TableRow key={call.id} className="hover:bg-gray-50 cursor-pointer">
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
                    <TableCell>{agents.find((a) => a.id === call.agent)?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Call Back</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No calls found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* TODO: Add pagination controls if needed */}
    </DashboardShell>
  );
}
