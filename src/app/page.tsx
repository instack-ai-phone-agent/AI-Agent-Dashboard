"use client";

import { useState } from "react";
import AgentFilter from "@/components/agent-filter";
import DashboardShell from "@/components/dashboard-shell";
import DashboardStats from "@/components/dashboard-stats";
import DashboardChart from "@/components/dashboard-chart";
import RecentCallsTable from "@/components/recent-calls-table";
import RecentChats from "@/components/recent-chats";

export default function HomePage() {
  const [selectedAgentId, setSelectedAgentId] = useState("");

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <AgentFilter onChange={setSelectedAgentId} />
      </div>

      <DashboardStats agentId={selectedAgentId} />
      <DashboardChart agentId={selectedAgentId} />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <RecentCallsTable agentId={selectedAgentId} />
        <RecentChats agentId={selectedAgentId} />
      </div>
    </DashboardShell>
  );
}
