"use client";

import React from 'react';
import { FileText, TrendingUp, CheckCircle } from 'lucide-react';
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

  return (
    <StatsGrid columns={3}>
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
    </StatsGrid>
  );
};