"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";
import { generateReport } from "@/lib/report-generator";
import { ReportTable } from "@/components/report-table";
import { ReportRow } from "@/types";
import { CheckCircle, XCircle } from "lucide-react"; // Import icons
import { toast } from "react-hot-toast"; // Import react-hot-toast
import { ProjectHoursChart } from "@/components/project-hours-chart";
import { BenchTimeTable } from "@/components/bench-time-table";
import { BenchTimeChart } from "@/components/bench-time-chart";
import { ProjectAllocationChart } from "@/components/project-allocation-chart";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [showTables, setShowTables] = useState(false); // State for tables visibility
  const [showGraphs, setShowGraphs] = useState(false); // State for graphs visibility
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [generateClicked, setGenerateClicked] = useState(false);

  const handleGenerate = async () => {
    setGenerateClicked(true);
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const { data: holidays } = await supabase.from("holidays").select("date");

      const report = generateReport(
        jsonData as unknown[][], // Fix array type
        holidays?.map((h) => new Date(h.date)) ?? []
      );

      setReportData(report);
      setShowGraphs(true);

      // Success toast message
      toast.success("Report generated successfully!");
    } catch{
      // Error toast message
      toast.error("Failed to generate report. Please try again.");
    }
  };

  const chartData = useMemo(() => {
    const projectMap = new Map<string, number>();
    
    reportData.forEach((row) => {
      const project = row["Project Code"];
      const hours = row["Total Hours"];
      if (project && typeof hours === 'number') {
        projectMap.set(project, (projectMap.get(project) || 0) + hours);
      }
    });

    return Array.from(projectMap.entries()).map(([project, totalHours]) => ({
      project,
      totalHours: Number(totalHours.toFixed(2))
    })).sort((a, b) => b.totalHours - a.totalHours);
  }, [reportData]);

  const projectAllocationData = useMemo(() => {
    const projectMap = new Map<string, Set<string>>();
  
    reportData.forEach((row) => {
      const project = row["Project Code"];
      const user = row.User;
      if (project && user) {
        if (!projectMap.has(project)) {
          projectMap.set(project, new Set());
        }
        projectMap.get(project)?.add(user);
      }
    });
  
    return Array.from(projectMap.entries()).map(([project, users]) => ({
      project,
      employees: users.size,
    }));
  }, [reportData]);

  const handleDownload = () => {
    if (reportData.length === 0) return;

    try {
      const validData = reportData.filter(row => row.User && row["Project Code"]); // Filter valid rows
      const ws = XLSX.utils.json_to_sheet(validData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, "report.xlsx");

      setTimeout(() => {
        toast.success("Report downloaded successfully!");
      }, 800);
    } catch {
      toast.error("Failed to download the report. Please try again.");
    }
  };

  const benchTimeData = useMemo(() => {
    const userBenchTime: Record<string, number> = {};
  
    reportData.forEach((row) => {
      const user = row.User;
      const benchTime = row["Bench Time"];
      if (user && benchTime !== undefined) {
        userBenchTime[user] =  benchTime;
      }
    });
  
    // Filter users with non-zero bench time
    return Object.entries(userBenchTime)
      .filter(([, benchTime]) => benchTime !== 0) // Exclude users with 0 bench time
      .map(([user, benchTime]) => ({
        user,
        benchTime: Number(benchTime.toFixed(2)),
      }));
  }, [reportData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex items-center w-full sm:w-80 md:w-96 max-w-md">
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full pr-14 truncate" // Increased padding for icons
          />
          {/* Validation Icon */}
          {generateClicked && !file ? (
            <XCircle className="absolute right-3 h-5 w-5 text-red-500" />
          ) : file ? (
            <CheckCircle className="absolute right-3 h-5 w-5 text-green-500" />
          ) : null}
        </div>

        <div className="flex flex-wrap ml-3 gap-3">
          <Button onClick={handleGenerate}>Generate</Button>
          <Button
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
            onClick={handleDownload}
            disabled={reportData.length === 0}
          >
            Download
          </Button>

          {/* Button to toggle graphs */}
          <Button
            variant="outline"
            onClick={() => setShowGraphs(!showGraphs)}
            disabled={reportData.length === 0}
          >
            {showGraphs ? "Hide Charts" : "Show Charts"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowTables(!showTables)}
            disabled={reportData.length === 0}
          >
            {showTables ? "Hide Tables" : "Show Tables"}
          </Button>

          
        </div>
      </div>

      {/* Conditionally render tables and graphs based on state */}
      {(showTables || showGraphs) && reportData.length > 0 && (
        <div className="space-y-8">
          {/* Show tables if showTables is true */}
          {showTables && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-amber-400">
                Report Preview
              </h3>
              <ReportTable data={reportData} />
              <BenchTimeTable data={reportData} />
            </div>
          )}

          {/* Show graphs if showGraphs is true */}
          {showGraphs && (
            <div className="space-y-8">
              <ProjectHoursChart data={chartData} />
              <ProjectAllocationChart data={projectAllocationData} />
              <BenchTimeChart data={benchTimeData} />
              
            </div>
          )}
        </div>
      )}
    </div>
  );
}
