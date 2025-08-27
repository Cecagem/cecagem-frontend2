"use client";

import { Users, UserCheck, GraduationCap, BookOpen } from "lucide-react";
import { StatCard, StatsGrid } from "@/components/shared";
import { ClienteInvestigacionStats } from "../types/index";

interface ClienteInvestigacionStatsCardsProps {
  stats: ClienteInvestigacionStats;
  isLoading: boolean;
}

export default function ClienteInvestigacionStatsCards({ stats, isLoading }: ClienteInvestigacionStatsCardsProps) {
  const statsData = [
    {
      title: "Total Clientes",
      value: stats.total,
      icon: Users,
      subtitle: `${stats.activos} activos`,
    },
    {
      title: "Clientes Activos",
      value: stats.activos,
      icon: UserCheck,
      subtitle: `${Math.round((stats.activos / stats.total) * 100) || 0}% del total`,
    },
    {
      title: "Bachilleres",
      value: stats.bachilleres,
      icon: BookOpen,
      subtitle: "Estudiantes de pregrado",
    },
    {
      title: "Egresados/Maestrías",
      value: stats.egresados + stats.maestrias,
      icon: GraduationCap,
      subtitle: "Graduados y posgrado",
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
