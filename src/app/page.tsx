"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import AgentFilter from "@/components/agent-filter";
import DashboardStats from "@/components/dashboard-stats";
import DashboardChart from "@/components/dashboard-chart";
import RecentCallsTable from "@/components/recent-calls-table";
import RecentChats from "@/components/recent-chats";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

export default function HomePage() {
  const [selectedAgentId, setSelectedAgentId] = useState("all");
  const [timeframe, setTimeframe] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const mockAgents = [
    { id: "all", name: "All Agents" },
    { id: "agent1", name: "SalesBot" },
    { id: "agent2", name: "SupportBot" },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <AgentFilter
            agents={mockAgents}
            value={selectedAgentId}
            onChange={setSelectedAgentId}
          />
          <Calendar selected={dateRange} onSelect={setDateRange} />
        </div>
      </div>

      <Tabs
        defaultValue="Daily"
        value={timeframe}
        onValueChange={(val) =>
          setTimeframe(val as "Daily" | "Weekly" | "Monthly")
        }
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="Daily">Daily</TabsTrigger>
          <TabsTrigger value="Weekly">Weekly</TabsTrigger>
          <TabsTrigger value="Monthly">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>

      <DashboardStats
        agentId={selectedAgentId}
        timeframe={timeframe}
        dateRange={dateRange}
      />
      <DashboardChart
        agentId={selectedAgentId}
        timeframe={timeframe}
        dateRange={dateRange}
      />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <RecentCallsTable agentId={selectedAgentId} onRowClick={function (callId: string): void {
          throw new Error("Function not implemented.");
        } } />
        <RecentChats agentId={selectedAgentId} />
      </div>
    </DashboardShell>
  );
}
