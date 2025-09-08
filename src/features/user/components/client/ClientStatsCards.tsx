"use client";

import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { StatsGrid, StatCard } from "@/components/shared/stats-cards";

interface ClientStatsCardsProps {
  stats: ClientStats;
  isLoading: boolean;
}

interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

export const ClientStatsCards = ({
  stats,
  isLoading,
}: ClientStatsCardsProps) => {
  const statsData = [
    {
      title: "Total Clientes",
      value: stats.total,
      icon: Users,
      subtitle: `${stats.active} activos`,
    },
    {
      title: "Clientes Activos",
      value: stats.active,
      icon: UserCheck,
      subtitle: `${
        stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
      }% del total`,
    },
    {
      title: "Clientes Inactivos",
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
        <StatCard key={index} {...stat} loading={isLoading} />
      ))}
    </StatsGrid>
  );
};
