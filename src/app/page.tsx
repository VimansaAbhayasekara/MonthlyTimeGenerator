// src/app/page.tsx (Report Page)
"use client";
import { UploadForm } from "@/components/upload-form";

export default function ReportPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Generate Monthly Plan-Time Report</h1>
      </div>
      <UploadForm />
    </div>
  );
}