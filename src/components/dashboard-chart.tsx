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
}

const defaultData = [
  { name: "Mon", calls: 24 },
  { name: "Tue", calls: 52 },
  { name: "Wed", calls: 48 },
  { name: "Thu", calls: 63 },
  { name: "Fri", calls: 39 },
  { name: "Sat", calls: 18 },
  { name: "Sun", calls: 26 },
];

export default function DashboardChart({ agentId }: DashboardChartProps) {
  // Optional: filter data based on agentId here
  const data = defaultData;

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Calls This Week</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="#4f46e5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
