"use client";

import { Building, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { StatsGrid, StatCard } from "@/components/shared/stats-cards";

interface CompanyStatsCardsProps {
  stats: CompanyStats;
  isLoading: boolean;
}

interface CompanyStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

export const CompanyStatsCards = ({
  stats,
  isLoading,
}: CompanyStatsCardsProps) => {
  const statsData = [
    {
      title: "Total Empresas",
      value: stats.total,
      icon: Building,
      subtitle: `${stats.active} activas`,
    },
    {
      title: "Empresas Activas",
      value: stats.active,
      icon: CheckCircle,
      subtitle: `${
        stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
      }% del total`,
    },
    {
      title: "Empresas Inactivas",
      value: stats.inactive,
      icon: XCircle,
      subtitle: "Cuentas suspendidas",
    },
    {
      title: "Nuevas Este Mes",
      value: stats.newThisMonth,
      icon: TrendingUp,
      subtitle: "Registradas reciente",
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
