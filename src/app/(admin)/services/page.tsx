"use client";

import { AdminHeader } from "@/components/shared";
import { ServicesPage } from "@/features/engagements";

export default function Services() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Gestión de Servicios" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <ServicesPage />
      </div>
    </div>
  );
}
