"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";
import { Holiday } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function HolidayForm({ 
  holiday, 
  onSuccess 
}: { 
  holiday?: Holiday; 
  onSuccess: () => void 
}) {
  const [date, setDate] = useState<Date | undefined>(
    holiday?.date ? new Date(holiday.date) : undefined
  );
  const [name, setName] = useState(holiday?.name || "");
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!date || !name) return;
    
    if (holiday) {
      await supabase
        .from("holidays")
        .update({ date: date.toISOString(), name })
        .eq("id", holiday.id);
    } else {
      await supabase.from("holidays").insert({ date: date.toISOString(), name });
    }
    
    onSuccess();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{holiday ? "Edit" : "Add Holiday"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{holiday ? "Edit" : "Add"} Holiday</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <Input
            placeholder="Holiday Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}