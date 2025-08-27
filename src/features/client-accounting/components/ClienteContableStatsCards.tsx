"use client";

import { Building2, Users, UserX, Calendar } from "lucide-react";
import { StatsGrid, StatCard } from "@/components/shared/stats-cards";
import { ClienteContableStats } from "../types";

interface ClienteContableStatsCardsProps {
  stats: ClienteContableStats;
  isLoading: boolean;
}

export default function ClienteContableStatsCards({ stats, isLoading }: ClienteContableStatsCardsProps) {
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

  return (
    <StatsGrid columns={4}>
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          loading={isLoading}
        />
      ))}
    </StatsGrid>
  );
}
