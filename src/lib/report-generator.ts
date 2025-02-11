// src/lib/report-generator.ts
import { ReportRow } from "@/types";

export function generateReport(data: unknown[][], holidays: Date[]): ReportRow[] {
  // Skip first two rows (titles) and get header from third row
  const [, , headerRow, ...dataRows] = data as (string | number)[][];
  
  // Extract date columns from header row (indexes 2 to -2 to exclude Total)
  const dateColumns = headerRow.slice(2, -1) as string[];

  return dataRows.map(row => {
    // First column: User, Second column: Project
    const user = String(row[1]);
    const project = String(row[2]);
    const dailyHours = row.slice(2, -1) as (string | number)[]; // Exclude Total column
    
    let total = 0;

    dailyHours.forEach((hours, index) => {
      const dateStr = dateColumns[index];
      const date = parseExcelDate(dateStr);
      
      if (date && !isHoliday(date, holidays)) {
        const numericHours = typeof hours === 'string' ? parseFloat(hours) : hours;
        total += Number.isNaN(numericHours) ? 0 : numericHours;
      }
    });

    return {
      User: user,
      "Project Code": project,
      "Total Hours": Number(total.toFixed(2)) // Round to 2 decimal places
    };
  });
}

// Improved date parsing
function parseExcelDate(dateStr: string): Date | null {
  try {
    // Handle both Excel serial numbers and date strings
    if (/^\d+$/.test(dateStr)) {
      return new Date((Number(dateStr) - 25569) * 86400 * 1000); // Excel to JS date conversion
    }
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
}

function isHoliday(date: Date, holidays: Date[]): boolean {
  return holidays.some(h => 
    h.getUTCFullYear() === date.getFullYear() &&
    h.getUTCMonth() === date.getMonth() &&
    h.getUTCDate() === date.getDate()
  );
}