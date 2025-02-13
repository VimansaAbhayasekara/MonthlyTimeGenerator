// src/lib/report-generator.ts
import { ReportRow } from "@/types";

export function generateReport(data: unknown[][], holidays: Date[]): ReportRow[] {
  // Skip first two rows (titles) and get header from third row
  const [, , headerRow, ...dataRows] = data as (string | number)[][];

  // Extract date columns from header row (indexes 2 to -2 to exclude Total)
  const dateColumns = headerRow.slice(2, -1) as string[];

  // Filter out invalid rows before processing
  const validRows = dataRows.filter((row) => {
    const user = String(row[0]); // Column A (index 0) is now user names
    const project = String(row[1]); // Column B (index 1) is now project codes
    const dailyHours = row.slice(2, -1) as (string | number)[]; // Columns C onwards are times

    // Ensure user, project, and dailyHours are valid
    return (
      user && // User is not empty
      project && // Project is not empty
      dailyHours.length > 0 && // Daily hours exist
      dailyHours.some((hours) => hours !== undefined && hours !== null) // At least one valid hour entry
    );
  });

  return validRows.map((row) => {
    const user = String(row[0]); // Column A (index 0) is now user names
    const project = String(row[1]); // Column B (index 1) is now project codes
    const dailyHours = row.slice(2, -1) as (string | number)[]; // Columns C onwards are times

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
      "Total Hours": Number(total.toFixed(2)), // Round to 2 decimal places
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