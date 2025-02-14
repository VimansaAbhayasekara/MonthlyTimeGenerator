"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "./ui/card";
import { motion } from "framer-motion";

interface ProjectAllocationChartProps {
  data: { project: string; employees: number }[];
}

export function ProjectAllocationChart({ data }: ProjectAllocationChartProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating loading delay
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-[#10b981] mb-4">Project Resource Allocation</h3>
        <div className="h-[400px]">
          {loading ? (
            // Skeleton loader while data is loading
            <div className="animate-pulse h-full bg-gray-700 rounded-lg" />
          ) : (
            // Animated Chart with fade-in effect
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#047857" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="project" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: 6 }} />
                  <Legend />
                  <Bar dataKey="employees" fill="url(#greenGradient)" name="Number of Employees" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}
