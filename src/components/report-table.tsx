// src/components/report-table.tsx
import { ReportRow } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

export function ReportTable({ data }: { data: ReportRow[] }) {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");

  // Get distinct users and projects for dropdowns
  const distinctUsers = Array.from(new Set(data.map((row) => row.User))).sort((a, b) =>
    a.localeCompare(b)
  );
  const distinctProjects = Array.from(new Set(data.map((row) => row["Project Code"]))).sort((a, b) =>
    a.localeCompare(b)
  );

  // Filter data based on selected user and project
  const filteredData = data.filter((row) => {
    const matchesUser = selectedUser ? row.User === selectedUser : true;
    const matchesProject = selectedProject ? row["Project Code"] === selectedProject : true;
    return matchesUser && matchesProject;
  });

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex space-x-4">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
        >
          <option value="">All Users</option>
          {distinctUsers.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
        >
          <option value="">All Projects</option>
          {distinctProjects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
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
            {filteredData.map((row, index) => (
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
    </div>
  );
}