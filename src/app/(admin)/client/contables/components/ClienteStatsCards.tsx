"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, UserX, Calendar } from "lucide-react";
import { ClienteContableStats } from "../types";

interface ClienteStatsCardsProps {
  stats: ClienteContableStats;
  isLoading: boolean;
}

export function ClienteStatsCards({ stats, isLoading }: ClienteStatsCardsProps) {
  const statsData = [
    {
      title: "Total Clientes",
      value: stats.total,
      icon: Building2,
      subtitle: `${stats.activos} activos`,
    },
    {
      title: "Clientes Activos",
      value: stats.activos,
      icon: Users,
      subtitle: `${Math.round((stats.activos / stats.total) * 100)}% del total`,
    },
    {
      title: "Clientes Inactivos",
      value: stats.inactivos,
      icon: UserX,
      subtitle: "Cuentas suspendidas",
    },
    {
      title: "Nuevos Este Mes",
      value: stats.nuevosEsteMes,
      icon: Calendar,
      subtitle: "Registrados reciente",
    },
  ];

  if (isLoading) {
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
                  <p className="text-xl font-bold">{stat.value}</p>
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
  );
}
