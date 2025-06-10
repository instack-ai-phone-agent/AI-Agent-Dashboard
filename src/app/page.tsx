"use client";

import { useEffect, useState } from "react";
import AgentFilter from "@/components/agent-filter";
import DashboardShell from "@/components/dashboard-shell";
import DashboardStats from "@/components/dashboard-stats";
import DashboardChart from "@/components/dashboard-chart";
import RecentCallsTable from "@/components/recent-calls-table";
import RecentChats from "@/components/recent-chats";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { getVoiceAgents } from "@/lib/api";

export default function HomePage() {
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const result = await getVoiceAgents();
      const options = result.map((a) => ({ id: a.id, name: a.name }));
      setAgents([{ id: "all", name: "All Agents" }, ...options]);
    };
    fetchAgents();
  }, []);

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 6);

  const formattedRange = `${startDate.toLocaleDateString("en-AU", {
    month: "short",
    day: "2-digit",
  })} - ${endDate.toLocaleDateString("en-AU", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })}`;

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <AgentFilter agents={agents} value={selectedAgentId} onChange={setSelectedAgentId} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 rounded-md px-3 min-h-[40px] w-full sm:max-w-[200px] inline-flex items-center justify-center text-sm font-medium"
              >
                <span>{formattedRange}</span>
                <CalendarDays className="ml-2 opacity-50 w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="daily" value={timeframe} onValueChange={(val) => setTimeframe(val as "daily" | "weekly" | "monthly")} className="mb-6">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>

      <DashboardStats agentId={selectedAgentId} timeframe={timeframe.charAt(0).toUpperCase() + timeframe.slice(1) as "Daily" | "Weekly" | "Monthly"} />
      <DashboardChart agentId={selectedAgentId} timeframe={timeframe} />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <RecentCallsTable agentId={selectedAgentId} />
        <RecentChats agentId={selectedAgentId} />
      </div>
    </DashboardShell>
  );
}
