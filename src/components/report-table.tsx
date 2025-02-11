// src/components/report-table.tsx
import { ReportRow } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ReportTable({ data }: { data: ReportRow[] }) {
  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden">
      <Table className="bg-gray-800">
        <TableHeader className="bg-amber-500">
          <TableRow>
            <TableHead className="text-gray-900 font-bold">User</TableHead>
            <TableHead className="text-gray-900 font-bold">Project Code</TableHead>
            <TableHead className="text-gray-900 font-bold">Total Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} className="hover:bg-gray-700">
              <TableCell className="text-gray-200">{row.User}</TableCell>
              <TableCell className="text-gray-200">{row["Project Code"]}</TableCell>
              <TableCell className="text-gray-200 font-medium">
                {row["Total Hours"].toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}