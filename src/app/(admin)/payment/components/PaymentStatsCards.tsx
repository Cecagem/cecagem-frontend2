"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EstadisticasPago } from "../types";
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  CreditCard,
  PiggyBank
} from "lucide-react";

interface PaymentStatsCardsProps {
  estadisticas: EstadisticasPago | null;
  loading?: boolean;
}

export function PaymentStatsCards({ estadisticas, loading = false }: PaymentStatsCardsProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statsData = [
    {
      title: "Total Proyectos",
      value: estadisticas?.totalProyectos || 0,
      icon: PiggyBank,
      subtitle: `${estadisticas?.proyectosAlContado || 0} al contado, ${estadisticas?.proyectosEnCuotas || 0} en cuotas`,
      color: "text-blue-600"
    },
    {
      title: "Total Pagado", 
      value: estadisticas?.totalPagado || 0,
      icon: CheckCircle,
      subtitle: `${estadisticas?.cuotasPagadas || 0} cuotas completadas`,
      color: "text-green-600",
      isMoneda: true
    },
    {
      title: "Total Pendiente",
      value: estadisticas?.totalPendiente || 0,
      icon: Clock,
      subtitle: `${estadisticas?.cuotasPendientes || 0} cuotas pendientes`,
      color: "text-orange-600",
      isMoneda: true
    },
    {
      title: "Requieren Atención",
      value: (estadisticas?.cuotasVencidas || 0) + (estadisticas?.cuotasPendientesValidacion || 0),
      icon: AlertTriangle,
      subtitle: `${estadisticas?.cuotasVencidas || 0} vencidas, ${estadisticas?.cuotasPendientesValidacion || 0} por validar`,
      color: "text-red-600"
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-8 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="transition-all hover:shadow-sm">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className={`text-xl font-bold ${stat.color}`}>
                      {stat.isMoneda ? formatMoney(stat.value) : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <div className="p-2 rounded-md bg-muted/50">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumen de monto total */}
      {estadisticas && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resumen Financiero
            </CardTitle>
            <CardDescription>
              Vista general del estado de cobros de todos los proyectos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Monto Total General
                  </p>
                  <p className="text-3xl font-bold">
                    {formatMoney(estadisticas.totalMontoGeneral)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    {estadisticas.proyectosAlContado} Contado
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {estadisticas.proyectosEnCuotas} Cuotas
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Progreso de Cobranza
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pagado</span>
                      <span className="text-sm font-medium text-green-600">
                        {((estadisticas.totalPagado / estadisticas.totalMontoGeneral) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(estadisticas.totalPagado / estadisticas.totalMontoGeneral) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">
                        {formatMoney(estadisticas.totalPagado)}
                      </span>
                      <span className="text-muted-foreground">
                        Pendiente: {formatMoney(estadisticas.totalPendiente)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
