"use client";

import { Suspense } from "react";
import { AdminHeader } from "@/components/shared";
import { MainAccountingClients } from "@/features/accounting-clients";

export default function AccountingClientsPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Gestión de Clientes Contables" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Suspense fallback={<div>Cargando...</div>}>
          <MainAccountingClients />
        </Suspense>
      </div>
    </div>
  );
}
