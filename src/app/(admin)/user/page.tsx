"use client";

import { AdminHeader } from "@/components/shared";
import { MainUsers } from "@/features/user";

export default function UserPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Gestión de Usuarios" />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <MainUsers />
      </div>
    </div>
  );
}
