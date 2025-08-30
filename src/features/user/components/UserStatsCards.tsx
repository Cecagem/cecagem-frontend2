"use client";

import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { StatsGrid, StatCard } from "@/components/shared/stats-cards";
import { UserStats } from "../types";

interface UserStatsCardsProps {
  stats: UserStats;
  isLoading: boolean;
}

export default function UserStatsCards({ stats, isLoading }: UserStatsCardsProps) {
  const statsData = [
    {
      title: "Total Usuarios",
      value: stats.total,
      icon: Users,
      subtitle: `${stats.active} activos`,
    },
    {
      title: "Usuarios Activos",
      value: stats.active,
      icon: UserCheck,
      subtitle: `${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% del total`,
    },
    {
      title: "Usuarios Inactivos",
      value: stats.inactive,
      icon: UserX,
      subtitle: "Cuentas suspendidas",
    },
    {
      title: "Nuevos Este Mes",
      value: stats.newThisMonth,
      icon: UserPlus,
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
