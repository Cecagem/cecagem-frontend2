"use client";

import { AdminHeader } from "@/components/shared";
import { MainResearchClients } from "@/features/research-clients";

export default function ResearchClientsPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Gestión de Clientes de Investigación" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <MainResearchClients />
      </div>
    </div>
  );
}
