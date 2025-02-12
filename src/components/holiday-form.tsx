"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { Holiday } from "@/types";
import { parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { toast } from "react-hot-toast"; // Import react-hot-toast

export function HolidayForm({
  holiday,
  onSuccess,
  open,
  onOpenChange,
  holidays, // Pass the list of existing holidays for validation
}: {
  holiday?: Holiday;
  onSuccess: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  holidays: Holiday[]; // List of existing holidays
}) {
  const [date, setDate] = useState<Date | undefined>(
    holiday?.date ? toZonedTime(parseISO(holiday.date), "UTC") : undefined
  );
  const [name, setName] = useState(holiday?.name || "");
  const [error, setError] = useState<string | null>(null); // For displaying validation errors

  const handleSubmit = async () => {
    setError(null); // Reset error message

    // Validation 1: Check if date is provided
    if (!date) {
      setError("Please provide a date.");
      return;
    }

    // Convert to UTC date without time
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    // Validation 2: Check if the date or name already exists in the holidays list
    const formatDate = (date: string | Date) => new Date(date).toISOString().split("T")[0];

    const isDuplicateDate = holidays.some(
      (h) => formatDate(h.date) === formatDate(utcDate) && h.id !== holiday?.id
    );

    const isDuplicateName = name && holidays.some(
      (h) => h.name === name && h.id !== holiday?.id
    );

    if (isDuplicateDate && isDuplicateName) {
      setError("A holiday with this date & name already exists.");
      return;
    }

    if (isDuplicateDate) {
      setError("A holiday with this date already exists.");
      return;
    }

    if (isDuplicateName) {
      setError("A holiday with this name already exists.");
      return;
    }

    try {
      if (holiday) {
        // Update existing holiday
        await supabase
          .from("holidays")
          .update({ date: utcDate.toISOString(), name })
          .eq("id", holiday.id);
        
        // Success Toast for Edit
        toast.success("Holiday updated successfully!");
      } else {
        // Insert new holiday
        await supabase.from("holidays").insert({ date: utcDate.toISOString(), name });

        // Success Toast for Add
        toast.success("Holiday added successfully!");
      }

      onSuccess(); // Trigger success callback
      onOpenChange?.(false); // Close the dialog
      setDate(undefined); // Reset date
      setName(""); // Reset name

    } catch {
      setError("An error occurred while saving the holiday. Please try again.");

      // Error Toast
      toast.error("Failed to save the holiday. Please try again.", { style: { backgroundColor: "#FF4B4B" } });
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Only show trigger button when not editing */}
      {!holiday && (
        <DialogTrigger asChild>
          <Button>Add Holiday</Button>
        </DialogTrigger>
      )}
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
            required // Make date mandatory
          />
          <Input
            placeholder="Holiday Name (Optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>} {/* Display error message */}
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
