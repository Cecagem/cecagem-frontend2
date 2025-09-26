"use client";

import { StatsGrid, StatCard } from "@/components/shared";
import { useUsersStats } from "../hooks/use-users";
import { Users, UserCheck, UserX } from "lucide-react";

export const UserStatsCards = () => {
  const { data: stats, isLoading } = useUsersStats();
  
  return (
    <StatsGrid columns={3}>
      <StatCard
        title="Total Usuarios"
        value={stats?.total || 0}
        subtitle="Usuarios registrados"
        icon={Users}
        variant="default"
        loading={isLoading}
      />
      <StatCard
        title="Usuarios Activos"
        value={stats?.active || 0}
        subtitle="Usuarios con acceso al sistema"
        icon={UserCheck}
        variant="success"
        loading={isLoading}
      />
      <StatCard
        title="Usuarios Inactivos"
        value={stats?.inactive || 0}
        subtitle="Usuarios sin acceso"
        icon={UserX}
        variant="error"
        loading={isLoading}
      />
    </StatsGrid>
  );
};