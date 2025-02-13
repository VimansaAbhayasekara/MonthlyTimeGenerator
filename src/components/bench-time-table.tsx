// src/components/bench-time-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReportRow } from "@/types";

export function BenchTimeTable({ data }: { data: ReportRow[] }) {
  // Aggregate bench time by user
  const userBenchTime = data.reduce((acc, row) => {
    const user = row.User;
    const benchTime = row["Bench Time"] || 0; // Use 0 as fallback if bench time is undefined
    if (user && benchTime !== 0) { // Only include users with non-zero bench time
      acc[user] = benchTime;
    }
    return acc;
  }, {} as Record<string, number>);

  const benchTimeData = Object.entries(userBenchTime).map(([user, benchTime]) => ({
    user,
    benchTime: Number(benchTime.toFixed(2)),
    
  }));


  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-amber-400">Bench Time</h3>
      <div className="rounded-lg border border-gray-700 overflow-hidden">
        <Table className="bg-gray-800">
          <TableHeader className="bg-amber-500">
            <TableRow>
              <TableHead className="text-gray-900 font-bold">User</TableHead>
              <TableHead className="text-gray-900 font-bold">Bench Time (Hours)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benchTimeData.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-700">
                <TableCell className="text-gray-200">{row.user}</TableCell>
                <TableCell className="text-gray-200 font-medium">
                  {row.benchTime.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}