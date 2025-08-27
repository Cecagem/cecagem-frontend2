"use client";

import { useState } from "react";
import ModeToggle from "@/components/themes/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { FiltrosPago } from "./types";
import { usePagos } from "./hooks/usePagos";
import { PaymentStatsCards, PaymentTable } from "./components";

export default function PaymentPage() {
  const [filtros, setFiltros] = useState<FiltrosPago>({});
  const {
    estadisticas, 
    loading, 
    error, 
    validarPago,
    rechazarPago,
    filtrarProyectos
  } = usePagos();

  // Aplicar filtros a los proyectos
  const proyectosFiltrados = filtrarProyectos(filtros);

  if (error) {
    return (
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/60 backdrop-blur-md sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Gestión de Pagos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto mr-4">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notificaciones"
              className="mr-2"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error al cargar los datos
            </div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
              Reintentar
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="bg-background/60 backdrop-blur-md sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Gestión de Pagos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto mr-4">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificaciones"
            className="mr-2"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header con título */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Pagos</h1>
            <p className="text-muted-foreground">
              Dashboard administrativo para validar pagos de proyectos
            </p>
          </div>
        </div>

        {/* Cards de estadísticas */}
        <PaymentStatsCards 
          estadisticas={estadisticas}
          loading={loading}
        />

        {/* Tabla de proyectos y pagos con filtros integrados */}
        <PaymentTable
          proyectos={proyectosFiltrados}
          loading={loading}
          onValidarPago={validarPago}
          onRechazarPago={rechazarPago}
          filtros={filtros}
          onFiltrosChange={setFiltros}
        />
      </main>
    </div>
  );
}
