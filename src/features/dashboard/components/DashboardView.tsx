"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { StatsCards } from "./StatsCards";
import { ChartsSection } from "./ChartsSection";
import { AlertsSection } from "./AlertsSection";
import { WhatsAppNotificationButton } from "@/components/shared";
import type { IDashboardFilters } from "../types/dashboard.types";

export const DashboardView = () => {
  const [filters, setFilters] = useState<IDashboardFilters>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { data, isLoading, refetch, isFetching } = useDashboard(filters);

  const handleFilterChange = (key: keyof IDashboardFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRefresh = () => {
    refetch();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 0, label: 'Todos los meses' },
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros y controles */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Filtros del Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {/* Selector de Año */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium text-muted-foreground">Año</label>
              <Select
                value={filters.year?.toString()}
                onValueChange={(value) => handleFilterChange('year', parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selector de Mes */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium text-muted-foreground">Mes</label>
              <Select
                value={filters.month?.toString() || "0"}
                onValueChange={(value) => {
                  const monthValue = parseInt(value);
                  handleFilterChange('month', monthValue === 0 ? "" : monthValue);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botón de actualizar */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium text-muted-foreground">Acción</label>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isFetching}
                className="flex items-center justify-center gap-2 w-full"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas de estadísticas */}
      {data && <StatsCards data={data} isLoading={isLoading} />}

      {/* Gráficos */}
      {data && <ChartsSection data={data} isLoading={isLoading} />}

      {/* Alertas */}
      {data && <AlertsSection alerts={data.alerts} isLoading={isLoading} />}

      {/* Ejemplos de WhatsApp Button - Todas las variantes y tamaños */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">WhatsApp Notifications - Todas las Variantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Variantes */}
            <div>
              <h3 className="text-md font-semibold mb-3">Variantes Disponibles:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">default</p>
                  <WhatsAppNotificationButton
                    userId="550e8400-e29b-41d4-a716-446655440000"
                    contractId="550e8400-e29b-41d4-a716-446655440001"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    variant="default"
                  >
                    Default
                  </WhatsAppNotificationButton>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">outline</p>
                  <WhatsAppNotificationButton
                    userId="550e8400-e29b-41d4-a716-446655440000"
                    contractId="550e8400-e29b-41d4-a716-446655440001"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    variant="outline"
                  >
                    Outline
                  </WhatsAppNotificationButton>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">secondary</p>
                  <WhatsAppNotificationButton
                    userId="550e8400-e29b-41d4-a716-446655440000"
                    contractId="550e8400-e29b-41d4-a716-446655440001"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    variant="secondary"
                  >
                    Secondary
                  </WhatsAppNotificationButton>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">ghost</p>
                  <WhatsAppNotificationButton
                    userId="550e8400-e29b-41d4-a716-446655440000"
                    contractId="550e8400-e29b-41d4-a716-446655440001"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    variant="ghost"
                  >
                    Ghost
                  </WhatsAppNotificationButton>
                </div>
              </div>
            </div>

            {/* Tamaños */}
            <div>
              <h3 className="text-md font-semibold mb-3">Tamaños Disponibles:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">sm (pequeño)</p>
                  <WhatsAppNotificationButton
                    companyId="550e8400-e29b-41d4-a716-446655440003"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    size="sm"
                  >
                    Pequeño
                  </WhatsAppNotificationButton>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">default (normal)</p>
                  <WhatsAppNotificationButton
                    companyId="550e8400-e29b-41d4-a716-446655440003"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    size="default"
                  >
                    Normal
                  </WhatsAppNotificationButton>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">lg (grande)</p>
                  <WhatsAppNotificationButton
                    companyId="550e8400-e29b-41d4-a716-446655440003"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    size="lg"
                  >
                    Grande
                  </WhatsAppNotificationButton>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">icon (solo icono)</p>
                  <WhatsAppNotificationButton
                    companyId="550e8400-e29b-41d4-a716-446655440003"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    size="icon"
                  />
                </div>
              </div>
            </div>

            {/* Ejemplos de uso */}
            <div>
              <h3 className="text-md font-semibold mb-3">Ejemplos de Uso:</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium min-w-[180px]">Notificación a Estudiante:</span>
                  <WhatsAppNotificationButton
                    userId="550e8400-e29b-41d4-a716-446655440000"
                    contractId="550e8400-e29b-41d4-a716-446655440001"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    size="sm"
                  >
                    Enviar a Estudiante
                  </WhatsAppNotificationButton>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium min-w-[180px]">Notificación a Empresa:</span>
                  <WhatsAppNotificationButton
                    companyId="550e8400-e29b-41d4-a716-446655440003"
                    installmentId="550e8400-e29b-41d4-a716-446655440002"
                    variant="outline"
                    size="sm"
                  >
                    Enviar a Empresa
                  </WhatsAppNotificationButton>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};