"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCallHistories } from "@/lib/api";

interface Call {
  id: string;
  time: string;
  phone: string;
  duration: string;
  topic: string;
  endedReason: string;
  outcome: string;
  agentId: string;
}

interface Props {
  agentId: string;
  onRowClick: (callId: string) => void;
  limit?: number;
}

export default function RecentCallsTable({ agentId, onRowClick, limit = 5 }: Props) {
  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const allCalls = await getCallHistories();
        const mappedCalls: Call[] = allCalls.map((c: any) => ({
          id: c.id.toString(),
          time: c.data_and_time,
          phone: c.phone_number || "Unknown",
          duration: c.duration || "-",
          topic: c.topic || "-",
          endedReason: c.ended_reason || "-",
          outcome: c.outcome || "-",
          agentId: c.voice_agent_id?.toString() || "",
        }));

        const filtered = mappedCalls.filter((call) => call.agentId === agentId);
        setCalls(filtered.slice(0, limit));
      } catch (err) {
        console.error("Failed to fetch call histories:", err);
      }
    };
    fetchCalls();
  }, [agentId, limit]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Calls</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Topic</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onRowClick(call.id)}>
              <TableCell>
                <div className="text-sm font-medium">
                  {new Date(call.time).toLocaleDateString("en-AU")}
                </div>
              </TableCell>
              <TableCell>{call.phone}</TableCell>
              <TableCell>{call.duration}</TableCell>
              <TableCell>{call.topic}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
