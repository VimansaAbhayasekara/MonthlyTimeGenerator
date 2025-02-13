// src/components/bench-time-chart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "./ui/card";

export function BenchTimeChart({ data }: { data: { user: string; benchTime: number }[] }) {
  // Separate bench time and overtime
  const chartData = data.map((row) => ({
    ...row,
    benchTime: row.benchTime > 0 ? row.benchTime : 0, // Only positive bench time
    overtime: row.benchTime < 0 ? Math.abs(row.benchTime) : 0, // Overtime as positive value
  }));

  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-amber-400 mb-4">Bench Time Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis dataKey="user" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip />
          <Legend />
          <Bar dataKey="benchTime" fill="#f59e0b" name="Bench Time (Hours)" />
          <Bar dataKey="overtime" fill="#ef4444" name="Overtime (Hours)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </Card>
  );
}