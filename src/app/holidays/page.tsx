"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Holiday } from "@/types";
import { HolidayCard } from "@/components/holiday-card";
import { HolidayForm } from "@/components/holiday-form";

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const fetchHolidays = async () => {
    const { data } = await supabase
      .from("holidays")
      .select("*")
      .order("date", { ascending: true });
    setHolidays(data || []);
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Holidays</h1>
        <HolidayForm onSuccess={fetchHolidays} holidays={holidays} /> {/* Pass holidays prop */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {holidays.map((holiday) => (
          <HolidayCard
            key={holiday.id}
            holiday={holiday}
            onDelete={fetchHolidays}
            onEdit={fetchHolidays}
            holidays={holidays} // Pass holidays prop
          />
        ))}
      </div>
    </div>
  );
}