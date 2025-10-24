import { AdminHeader } from "@/components/shared";
import { DashboardView } from "@/features/dashboard";

export default function Page() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title="Panel de Control" />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Resumen general de la actividad y métricas del sistema
            </p>
          </div>
        </div>

        <DashboardView />
      </div>
    </div>
  );
}
