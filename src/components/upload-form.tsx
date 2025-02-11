// src/components/upload-form.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";
import { generateReport } from "@/lib/report-generator";
import { ReportTable } from "@/components/report-table";
import { ReportRow } from "@/types";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [reportData, setReportData] = useState<ReportRow[]>([]);

  const handleGenerate = async () => {
    if (!file) return;
    
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    const { data: holidays } = await supabase
      .from("holidays")
      .select("date");
    
    const report = generateReport(
      jsonData as unknown[][], // Fix array type
      holidays?.map(h => new Date(h.date)) ?? []
    );
    
    setReportData(report);
    setShowPreview(true);

    // Generate download
    const ws = XLSX.utils.json_to_sheet(report);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="max-w-md"
        />
        <Button onClick={handleGenerate}>Generate & Download</Button>
        <Button 
          variant="outline" 
          onClick={() => setShowPreview(!showPreview)}
          disabled={reportData.length === 0}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      {showPreview && reportData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-amber-400">Report Preview</h3>
          <ReportTable data={reportData} />
        </div>
      )}
    </div>
  );
}