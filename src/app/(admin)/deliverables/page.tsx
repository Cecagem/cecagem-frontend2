"use client";

import { AdminHeader } from "@/components/shared";
import { DeliverablesPage } from "@/features/deliverables";

export default function Deliverables() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Gestión de Entregables" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <DeliverablesPage />
      </div>
    </div>
  );
}
