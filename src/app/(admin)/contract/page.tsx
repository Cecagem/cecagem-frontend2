"use client";

import { Suspense } from "react";
import { MainContracts } from "@/features/contract";
import { AdminHeader } from "@/components/shared";

export default function ContractsPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Gestión de Proyectos" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Suspense fallback={<div>Cargando...</div>}>
          <MainContracts />
        </Suspense>
      </div>
    </div>
  );
}
