"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DashboardChartProps {
  agentId: string;
  timeframe: string;
}

const chartDataMap: Record<string, { name: string; calls: number }[]> = {
  daily: [
    { name: "12am", calls: 4 },
    { name: "4am", calls: 2 },
    { name: "8am", calls: 6 },
    { name: "12pm", calls: 10 },
    { name: "4pm", calls: 12 },
    { name: "8pm", calls: 7 },
  ],
  weekly: [
    { name: "Mon", calls: 24 },
    { name: "Tue", calls: 52 },
    { name: "Wed", calls: 48 },
    { name: "Thu", calls: 63 },
    { name: "Fri", calls: 39 },
    { name: "Sat", calls: 18 },
    { name: "Sun", calls: 26 },
  ],
  monthly: [
    { name: "Week 1", calls: 124 },
    { name: "Week 2", calls: 142 },
    { name: "Week 3", calls: 132 },
    { name: "Week 4", calls: 156 },
  ],
};

export default function DashboardChart({ agentId, timeframe }: DashboardChartProps) {
  const data = chartDataMap[timeframe] || chartDataMap.weekly;

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Calls This {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: "0.875rem" }} />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
