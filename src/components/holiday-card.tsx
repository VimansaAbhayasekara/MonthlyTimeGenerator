"use client";
import { Holiday } from "@/types";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { HolidayForm } from "@/components/holiday-form";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

export function HolidayCard({
  holiday,
  onDelete,
  onEdit,
  holidays, // Pass the list of existing holidays
}: {
  holiday: Holiday;
  onDelete: () => void;
  onEdit: () => void;
  holidays: Holiday[]; // List of existing holidays
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async () => {
    await supabase.from("holidays").delete().eq("id", holiday.id);
    onDelete();
  };

  return (
    <>
      <motion.div
        className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 overflow-hidden"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-amber-400">
              {holiday.name}
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-amber-500"
                onClick={() => setShowForm(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <span className="text-sm">
              {format(parseISO(holiday.date), "MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </motion.div>

      <HolidayForm
        holiday={holiday}
        onSuccess={() => {
          onEdit();
          setShowForm(false);
        }}
        open={showForm}
        onOpenChange={setShowForm}
        holidays={holidays} // Pass the list of existing holidays
      />
    </>
  );
}