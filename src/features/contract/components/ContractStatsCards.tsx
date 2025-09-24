"use client";

import React from 'react';
import { FileText, TrendingUp, CheckCircle, DollarSign } from 'lucide-react';
import { StatsGrid, StatCard } from '@/components/shared/stats-cards';

interface IContractStatsData {
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;
  thisMonthContracts: number;
  totalRevenue: number;
  avgProgress: number;
}

interface ContractStatsCardsProps {
  data?: IContractStatsData;
  isLoading?: boolean;
}

export const ContractStatsCards = ({
  data,
  isLoading = false,
}: ContractStatsCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <StatsGrid columns={4}>
      <StatCard
        title="Total de Contratos"
        value={data?.totalContracts || 0}
        subtitle={`${data?.thisMonthContracts || 0} nuevos este mes`}
        icon={FileText}
        loading={isLoading}
      />
      <StatCard
        title="Contratos Activos"
        value={data?.activeContracts || 0}
        subtitle={`${data ? Math.round((data.activeContracts / (data.totalContracts || 1)) * 100) : 0}% del total`}
        icon={TrendingUp}
        variant="success"
        loading={isLoading}
      />
      <StatCard
        title="Contratos Completados"
        value={data?.completedContracts || 0}
        subtitle={`${data ? Math.round((data.completedContracts / (data.totalContracts || 1)) * 100) : 0}% completados`}
        icon={CheckCircle}
        variant="default"
        loading={isLoading}
      />
      <StatCard
        title="Ingresos Totales"
        value={formatCurrency(data?.totalRevenue || 0)}
        subtitle={`Progreso promedio: ${data?.avgProgress || 0}%`}
        icon={DollarSign}
        variant="warning"
        loading={isLoading}
      />
    </StatsGrid>
  );
};