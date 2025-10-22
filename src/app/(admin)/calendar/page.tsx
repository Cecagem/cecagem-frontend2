"use client";

import { AdminHeader } from "@/components/shared";
import { Calendar } from "@/features/calendar";

export default function CalendarPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Calendario" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Calendar />
      </div>
    </div>
  );
}
