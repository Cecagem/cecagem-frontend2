"use client";

import { Users, UserCheck, UserX, Calendar } from "lucide-react";
import { StatsGrid, StatCard } from "@/components/shared/stats-cards";

interface IResearchClientStats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  thisMonthClients: number;
}

interface ResearchClientStatsCardsProps {
  stats: IResearchClientStats;
  isLoading?: boolean;
}

export const ResearchClientStatsCards = ({ 
  stats, 
  isLoading = false 
}: ResearchClientStatsCardsProps) => {
  const statsData: Array<{
    title: string;
    value: string | number;
    icon: typeof Users;
    subtitle: string;
    variant: "default" | "success" | "warning" | "error";
  }> = [
    {
      title: "Total Clientes",
      value: stats.totalClients,
      icon: Users,
      subtitle: "Clientes registrados",
      variant: "default" as const,
    },
    {
      title: "Clientes Activos",
      value: stats.activeClients,
      icon: UserCheck,
      subtitle: "Actualmente activos",
      variant: "success" as const,
    },
    {
      title: "Clientes Inactivos",
      value: stats.inactiveClients,
      icon: UserX,
      subtitle: "Actualmente inactivos",
      variant: "error" as const,
    },
    {
      title: "Nuevos Este Mes",
      value: stats.thisMonthClients,
      icon: Calendar,
      subtitle: "Registrados este mes",
      variant: "default" as const,
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
          variant={stat.variant}
        />
      ))}
    </StatsGrid>
  );
};