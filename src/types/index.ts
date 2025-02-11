// src/types/index.ts
export interface Holiday {
    id: string;
    date: string;
    name: string;
    created_at: string;
  }
  
  export interface ReportRow {
    User: string;
    "Project Code": string;
    "Total Hours": number;
  }