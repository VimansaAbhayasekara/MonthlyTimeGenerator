import { ReportRow } from "@/types";

export function generateReport(data: unknown[][], holidays: Date[]): ReportRow[] {
  // Skip first two rows (titles) and get header from third row
  const [, , headerRow, ...dataRows] = data as (string | number)[][];

  // Extract date columns from header row (indexes 2 to -2 to exclude Total)
  const dateColumns = headerRow.slice(2, -1) as string[];

  // Calculate total working days in the month (excluding holidays and weekends)
  // const workingDays = dateColumns.filter((dateStr) => {
  //   const date = parseExcelDate(dateStr);
  //   return date && !isHoliday(date, holidays) && !isWeekend(date);
  // }).length;

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

  // Group daily allocated hours by user and date
  const userDailyAllocatedHours: Record<string, Record<string, number>> = {};

  validRows.forEach((row) => {
    const user = String(row[0]);
    const dailyHours = row.slice(2, -1) as (string | number)[];

    dailyHours.forEach((hours, index) => {
      const dateStr = dateColumns[index];
      const date = parseExcelDate(dateStr);

      if (date && !isHoliday(date, holidays) && !isWeekend(date)) {
        const numericHours = typeof hours === 'string' ? parseFloat(hours) : hours;
        if (!Number.isNaN(numericHours)) {
          if (!userDailyAllocatedHours[user]) {
            userDailyAllocatedHours[user] = {};
          }
          userDailyAllocatedHours[user][dateStr] = (userDailyAllocatedHours[user][dateStr] || 0) + numericHours;
        }
      }
    });
  });

  // Calculate bench time for each user
  const userBenchTime: Record<string, number> = {};

  Object.entries(userDailyAllocatedHours).forEach(([user, dailyHours]) => {
    let totalBenchTime = 0;

    Object.entries(dailyHours).forEach(([dateStr, allocatedHours]) => {
      const date = parseExcelDate(dateStr);
      if (date && !isHoliday(date, holidays) && !isWeekend(date)) {
        totalBenchTime += (8 - allocatedHours); // Bench time per day
      }
    });


    userBenchTime[user] = totalBenchTime;
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
      "Bench Time": Number((userBenchTime[user] || 0).toFixed(2)), // Add bench time to the report
    };
  });
}


function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
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