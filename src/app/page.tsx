// src/app/page.tsx
"use client";
import { HolidayForm } from "@/components/holiday-form";
import { UploadForm } from "@/components/upload-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Holiday } from "@/types";

export default function Home() {
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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 space-y-8">
      <h1 className="text-3xl font-bold">Zoneway Monthly Plan Time Generator</h1>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Holidays
            <HolidayForm onSuccess={fetchHolidays} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.map((holiday) => (
                <TableRow key={holiday.id}>
                  <TableCell>
                    {new Date(holiday.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{holiday.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <HolidayForm 
                        holiday={holiday} 
                        onSuccess={fetchHolidays}
                      />
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await supabase
                            .from("holidays")
                            .delete()
                            .eq("id", holiday.id);
                          fetchHolidays();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  );
}