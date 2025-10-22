"use client";

import { AdminHeader } from "@/components/shared";
import { MainAccount } from "@/features/account";

export default function AccountPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Gestión de Ingresos y Gastos" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <MainAccount />
      </div>
    </div>
  );
}
