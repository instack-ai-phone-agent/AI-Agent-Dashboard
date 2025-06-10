"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, PhoneIncoming, PhoneOutgoing, Volume2, DollarSign } from "lucide-react";

interface DashboardStatsProps {
  agentId: string;
  timeframe: "Daily" | "Weekly" | "Monthly";
}

export default function DashboardStats({ agentId, timeframe }: DashboardStatsProps) {
  const stats = [
    {
      icon: Clock,
      label: "Total Duration",
      value: timeframe === "Monthly" ? "28h 20m" : timeframe === "Weekly" ? "7h 45m" : "1h 10m",
    },
    {
      icon: PhoneIncoming,
      label: "Inbound Calls",
      value: timeframe === "Monthly" ? "320" : timeframe === "Weekly" ? "80" : "15",
    },
    {
      icon: PhoneOutgoing,
      label: "Outbound Calls",
      value: timeframe === "Monthly" ? "260" : timeframe === "Weekly" ? "65" : "12",
    },
    {
      icon: Volume2,
      label: "Total Volume",
      value: timeframe === "Monthly" ? "580" : timeframe === "Weekly" ? "145" : "27",
    },
    {
      icon: DollarSign,
      label: "Call Cost",
      value: timeframe === "Monthly" ? "$382.50" : timeframe === "Weekly" ? "$94.30" : "$18.50",
    },
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="shadow-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="text-sm text-gray-500">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
              </div>
              <Icon className="w-6 h-6 text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
