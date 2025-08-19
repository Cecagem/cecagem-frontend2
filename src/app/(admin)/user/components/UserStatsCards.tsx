"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Crown } from "lucide-react";
import { UserStats } from "../types";

interface UserStatsCardsProps {
  stats: UserStats;
  isLoading: boolean;
}

export function UserStatsCards({ stats, isLoading }: UserStatsCardsProps) {
  const statsData = [
    {
      title: "Total Usuarios",
      value: stats.total,
      icon: Users,
      subtitle: `${stats.total - stats.inactivos} activos`,
    },
    {
      title: "Usuarios Activos",
      value: stats.activos,
      icon: UserCheck,
      subtitle: `${Math.round((stats.activos / stats.total) * 100)}% del total`,
    },
    {
      title: "Administradores",
      value: stats.admins,
      icon: Crown,
      subtitle: "Con permisos completos",
    },
    {
      title: "Colaboradores",
      value: stats.total - stats.admins,
      icon: Users,
      subtitle: "Internos y externos",
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
