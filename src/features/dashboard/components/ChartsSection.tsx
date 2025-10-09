"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import type { IDashboardData } from "../types/dashboard.types";
import { TrendingUp, FileText, Users, Building2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChartsSectionProps {
  data: IDashboardData;
  isLoading?: boolean;
}

export const ChartsSection = ({ data, isLoading }: ChartsSectionProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('es-PE', { month: 'short', year: '2-digit' });
  };

  // Paleta de colores profesional
  const colors = {
    primary: "hsl(221, 83%, 53%)", // Azul profesional
    secondary: "hsl(262, 83%, 58%)", // Púrpura elegante
    success: "hsl(142, 76%, 36%)", // Verde esmeralda
    warning: "hsl(38, 92%, 50%)", // Ámbar
    danger: "hsl(0, 84%, 60%)", // Rojo coral
    info: "hsl(199, 89%, 48%)", // Azul cielo
    muted: "hsl(215, 20%, 65%)", // Gris azulado
    accent: "hsl(280, 100%, 70%)", // Magenta
  };

  // Configuración para el gráfico de ingresos
  const incomeChartConfig = {
    amount: {
      label: "Ingresos",
      color: colors.primary,
    },
  } satisfies ChartConfig;

  // Configuración para el gráfico de contratos
  const contractsChartConfig = {
    amount: {
      label: "Contratos",
      color: colors.secondary,
    },
  } satisfies ChartConfig;

  // Configuración para el gráfico de usuarios
  const usersChartConfig = {
    internalCollaborators: {
      label: "Colaboradores Internos",
      color: colors.primary,
    },
    externalCollaborators: {
      label: "Colaboradores Externos",
      color: colors.success,
    },
    clients: {
      label: "Clientes",
      color: colors.warning,
    },
  } satisfies ChartConfig;

  // Configuración para el gráfico de entregables
  const deliverablesChartConfig = {
    approved: {
      label: "Aprobados",
      color: colors.success,
    },
    completed: {
      label: "Completados",
      color: colors.info,
    },
    pending: {
      label: "Pendientes",
      color: colors.warning,
    },
  } satisfies ChartConfig;

  // Datos para el gráfico de pie de usuarios con gradientes
  const usersPieData = [
    { 
      category: "internalCollaborators", 
      value: data.users.internalCollaborators, 
      fill: colors.primary,
      name: "Colaboradores Internos"
    },
    { 
      category: "externalCollaborators", 
      value: data.users.externalCollaborators, 
      fill: colors.success,
      name: "Colaboradores Externos"
    },
    { 
      category: "clients", 
      value: data.users.clients, 
      fill: colors.warning,
      name: "Clientes"
    },
  ];

  // Datos para el gráfico de pie de entregables
  const deliverablesPieData = [
    { 
      category: "approved", 
      value: data.deliverables.approved, 
      fill: colors.success,
      name: "Aprobados"
    },
    { 
      category: "completed", 
      value: data.deliverables.completed - data.deliverables.approved, 
      fill: colors.info,
      name: "Completados"
    },
    { 
      category: "pending", 
      value: data.deliverables.pending, 
      fill: colors.warning,
      name: "Pendientes"
    },
  ];

  // Calcular tendencias (simulado)
  const calculateTrend = (data: { amount: number }[]) => {
    if (data.length < 2) return { trend: 0, isPositive: true };
    const current = data[data.length - 1]?.amount || 0;
    const previous = data[data.length - 2]?.amount || 0;
    const trend = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    return { trend: Math.abs(trend), isPositive: trend >= 0 };
  };

  const incomeTrend = calculateTrend(data.charts.incomeByMonth);
  const contractsTrend = calculateTrend(data.charts.contractsByMonth);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse border border-border/50 shadow-lg bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/50 dark:border-gray-800">
            <CardHeader className="pb-3">
              <div className="h-6 bg-muted rounded-lg w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted rounded-xl"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Gráfico de Ingresos por Mes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Ingresos por Mes</CardTitle>
                <CardDescription className="text-sm">
                  Evolución de ingresos mensuales
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant={incomeTrend.isPositive ? "default" : "destructive"} 
              className="flex items-center gap-1 px-3 py-1"
            >
              {incomeTrend.isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {incomeTrend.trend.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer config={incomeChartConfig}>
            <AreaChart
              accessibilityLayer
              data={data.charts.incomeByMonth}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.primary} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground))" 
                strokeOpacity={0.2}
                vertical={false} 
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tickFormatter={formatMonth}
                className="text-xs font-medium"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tickFormatter={formatCurrency}
                className="text-xs font-medium"
              />
              <ChartTooltip
                cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: "5 5" }}
                content={<ChartTooltipContent 
                  indicator="dot" 
                  className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-xl"
                />}
                formatter={(value: number) => [formatCurrency(value), 'Ingresos']}
                labelFormatter={formatMonth}
              />
              <Area
                dataKey="amount"
                type="monotone"
                fill="url(#incomeGradient)"
                stroke={colors.primary}
                strokeWidth={3}
                dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Contratos por Mes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Contratos por Mes</CardTitle>
                <CardDescription className="text-sm">
                  Nuevos contratos creados mensualmente
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant={contractsTrend.isPositive ? "default" : "destructive"} 
              className="flex items-center gap-1 px-3 py-1"
            >
              {contractsTrend.isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {contractsTrend.trend.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer config={contractsChartConfig}>
            <LineChart
              accessibilityLayer
              data={data.charts.contractsByMonth}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground))" 
                strokeOpacity={0.2}
                vertical={false} 
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tickFormatter={formatMonth}
                className="text-xs font-medium"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                className="text-xs font-medium"
              />
              <ChartTooltip
                cursor={{ stroke: colors.secondary, strokeWidth: 1, strokeDasharray: "5 5" }}
                content={<ChartTooltipContent 
                  className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-xl"
                />}
                formatter={(value: number) => [value, 'Contratos']}
                labelFormatter={formatMonth}
              />
              <Line
                dataKey="amount"
                type="monotone"
                stroke={colors.secondary}
                strokeWidth={3}
                dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors.secondary, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Distribución de Usuarios */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Distribución de Usuarios</CardTitle>
              <CardDescription className="text-sm">
                Composición actual del equipo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer
            config={usersChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  hideLabel 
                  className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-xl"
                />}
              />
              <Pie
                data={usersPieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              />
            </PieChart>
          </ChartContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {usersPieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">({item.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Estado de Entregables */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Estado de Entregables</CardTitle>
              <CardDescription className="text-sm">
                Progreso de todos los entregables
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer
            config={deliverablesChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  hideLabel 
                  className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-xl"
                />}
              />
              <Pie
                data={deliverablesPieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              />
            </PieChart>
          </ChartContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {deliverablesPieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">({item.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};