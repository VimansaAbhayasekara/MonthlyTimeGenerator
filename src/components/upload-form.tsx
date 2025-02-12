"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";
import { generateReport } from "@/lib/report-generator";
import { ReportTable } from "@/components/report-table";
import { ReportRow } from "@/types";
import { CheckCircle, XCircle } from "lucide-react"; // Import icons
import { toast } from "react-hot-toast"; // Import react-hot-toast

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
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
      setShowPreview(true);

      // Success toast message
      toast.success("Report generated successfully!");
    } catch{
      // Error toast message
      toast.error("Failed to generate report. Please try again.");
    }
  };

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
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            disabled={reportData.length === 0}
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>
      </div>

      {showPreview && reportData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-amber-400">
            Report Preview
          </h3>
          <ReportTable data={reportData} />
        </div>
      )}
    </div>
  );
}
