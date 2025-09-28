"use client";

import { Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Building2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import type { IDashboardData } from "../types/dashboard.types";

interface StatsCardsProps {
  data: IDashboardData;
  isLoading?: boolean;
}

export const StatsCards = ({ data, isLoading }: StatsCardsProps) => {
  // Función para calcular porcentajes y tendencias
  const calculatePercentage = (current: number, total: number) => {
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  // Función para determinar el color de tendencia
  const getTrendColor = (percentage: number, isGood: boolean = true) => {
    if (percentage >= 80) return isGood ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
    if (percentage >= 60) return "text-amber-600 dark:text-amber-400";
    return isGood ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400";
  };

  const getTrendIcon = (percentage: number, isGood: boolean = true) => {
    if (percentage >= 80) return isGood ? TrendingUp : TrendingDown;
    if (percentage >= 60) return Minus;
    return isGood ? TrendingDown : TrendingUp;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Primera fila - 2 columnas */}
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse border border-border/50 shadow-lg bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/50 dark:border-gray-800">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded-lg w-3/4"></div>
                      <div className="h-8 bg-muted rounded-lg w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                    <div className="h-16 w-16 bg-muted rounded-2xl"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Segunda fila - 4 columnas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i + 2} className="animate-pulse border border-border/50 shadow-lg bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/50 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                      <div className="h-2 bg-muted rounded w-2/3"></div>
                    </div>
                    <div className="h-12 w-12 bg-muted rounded-xl"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Primera fila - 2 tarjetas principales con diseño mejorado
  const mainStats = [
    {
      title: "Contratos Activos",
      value: data.contracts.active.toString(),
      total: data.contracts.total,
      subtitle: `de ${data.contracts.total} totales`,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30",
      cardBg: "bg-gradient-to-br from-white via-blue-50/30 to-blue-100/50 dark:from-gray-900 dark:via-blue-950/20 dark:to-blue-900/30",
      borderColor: "border-blue-200/60 dark:border-blue-800/50",
      percentage: calculatePercentage(data.contracts.active, data.contracts.total),
    },
    {
      title: "Usuarios Activos",
      value: data.users.active.toString(),
      total: data.users.total,
      subtitle: `de ${data.users.total} totales`,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30",
      cardBg: "bg-gradient-to-br from-white via-purple-50/30 to-purple-100/50 dark:from-gray-900 dark:via-purple-950/20 dark:to-purple-900/30",
      borderColor: "border-purple-200/60 dark:border-purple-800/50",
      percentage: calculatePercentage(data.users.active, data.users.total),
    },
  ];

  // Segunda fila - 4 tarjetas secundarias con diseño mejorado
  const secondaryStats = [
    {
      title: "Empresas Activas",
      value: data.companies.active.toString(),
      total: data.companies.total,
      subtitle: `de ${data.companies.total} totales`,
      icon: Building2,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30",
      cardBg: "bg-gradient-to-br from-white via-indigo-50/30 to-indigo-100/50 dark:from-gray-900 dark:via-indigo-950/20 dark:to-indigo-900/30",
      borderColor: "border-indigo-200/60 dark:border-indigo-800/50",
      percentage: calculatePercentage(data.companies.active, data.companies.total),
    },
    {
      title: "Entregables Completados",
      value: data.deliverables.completed.toString(),
      total: data.deliverables.total,
      subtitle: `de ${data.deliverables.total} totales`,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30",
      cardBg: "bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/50 dark:from-gray-900 dark:via-emerald-950/20 dark:to-emerald-900/30",
      borderColor: "border-emerald-200/60 dark:border-emerald-800/50",
      percentage: calculatePercentage(data.deliverables.completed, data.deliverables.total),
    },
    {
      title: "Contratos por Vencer",
      value: data.contracts.expiringSoon.toString(),
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30",
      cardBg: "bg-gradient-to-br from-white via-amber-50/30 to-amber-100/50 dark:from-gray-900 dark:via-amber-950/20 dark:to-amber-900/30",
      borderColor: "border-amber-200/60 dark:border-amber-800/50",
      isAlert: true,
    },
    {
      title: "Pagos Vencidos",
      value: data.contracts.withOverduePayments.toString(),
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30",
      cardBg: "bg-gradient-to-br from-white via-red-50/30 to-red-100/50 dark:from-gray-900 dark:via-red-950/20 dark:to-red-900/30",
      borderColor: "border-red-200/60 dark:border-red-800/50",
      isAlert: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primera fila - 2 columnas principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = getTrendIcon(stat.percentage);
          const trendColor = getTrendColor(stat.percentage);
          
          return (
            <Card key={index} className={`border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 ${stat.cardBg} overflow-hidden group`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {stat.title}
                      </p>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {stat.percentage}%
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                      <div className="flex items-center gap-2">
                        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                        <p className="text-sm text-muted-foreground">
                          {stat.subtitle}
                        </p>
                      </div>
                    </div>
                    {/* Barra de progreso */}
                    <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${stat.bgColor.replace('bg-gradient-to-br', 'bg-gradient-to-r')}`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Segunda fila - 4 columnas secundarias */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          const showTrend = !stat.isAlert && stat.total;
          const TrendIcon = showTrend ? getTrendIcon(stat.percentage!) : null;
          const trendColor = showTrend ? getTrendColor(stat.percentage!, !stat.isAlert) : "";
          
          return (
            <Card key={index + 2} className={`border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 ${stat.cardBg} overflow-hidden group`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {stat.title}
                      </p>
                      {showTrend && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          {stat.percentage}%
                        </Badge>
                      )}
                      {stat.isAlert && parseInt(stat.value) > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                          ¡Atención!
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                      {stat.subtitle && (
                        <div className="flex items-center gap-1">
                          {TrendIcon && <TrendIcon className={`h-3 w-3 ${trendColor}`} />}
                          <p className="text-xs text-muted-foreground">
                            {stat.subtitle}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Barra de progreso para tarjetas con total */}
                    {showTrend && (
                      <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${stat.bgColor.replace('bg-gradient-to-br', 'bg-gradient-to-r')}`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};