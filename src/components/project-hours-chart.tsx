// src/components/project-hours-chart.tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';

export function ProjectHoursChart({ data }: { data: { project: string; totalHours: number }[] }) {
  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <h3 className="text-lg font-semibold text-amber-400 mb-4">Monthly Planned Time by Project</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
          <defs>
            <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
              <stop offset="100%" stopColor="#D97706" stopOpacity={1} />
            </linearGradient>
          </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="project"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={{ stroke: '#6B7280' }}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={{ stroke: '#6B7280' }}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: 6 }}
              itemStyle={{ color: '#E5E7EB' }}
              formatter={(value) => [`${value} hours`, '']}
            />
            <Legend />
            <Bar
              dataKey="totalHours"
              name="Total Planned Time"
              fill="url(#amberGradient)"
              radius={[4, 4, 0, 0]}
              label={{ position: 'top', fill: '#E5E7EB', fontSize: 8 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}