"use client";

import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { StatsGrid, StatCard } from "@/components/shared/stats-cards";
import type { TransactionStats } from "../types/account.types";

interface AccountStatsCardsProps {
  stats: TransactionStats;
  isLoading: boolean;
}

export const AccountStatsCards = ({ stats, isLoading }: AccountStatsCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const statsData: Array<{
    title: string;
    value: string | number;
    icon: typeof DollarSign;
    subtitle: string;
    variant: "default" | "success" | "warning" | "error";
  }> = [
    {
      title: "Balance Total",
      value: formatCurrency(stats.balance),
      icon: DollarSign,
      subtitle: `${stats.balance >= 0 ? "Positivo" : "Negativo"}`,
      variant: stats.balance >= 0 ? "success" : "error" as const,
    },
    {
      title: "Ingresos Totales",
      value: formatCurrency(stats.totalIncome),
      icon: TrendingUp,
      subtitle: `${formatCurrency(stats.monthlyIncome)} este mes`,
      variant: "success" as const,
    },
    {
      title: "Gastos Totales",
      value: formatCurrency(stats.totalExpenses),
      icon: TrendingDown,
      subtitle: `${formatCurrency(stats.monthlyExpenses)} este mes`,
      variant: "error" as const,
    },
    {
      title: "Transacciones",
      value: stats.transactionCount,
      icon: Activity,
      subtitle: "Total registradas",
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