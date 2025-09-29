"use client";

import React from 'react';
import { Building2, TrendingUp, Users } from 'lucide-react';
import { StatsGrid, StatCard } from '@/components/shared/stats-cards';

interface ICompanyStatsData {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  thisMonthCompanies: number;
  totalRevenue: number;
}

interface AccountingClientStatsCardsProps {
  data?: ICompanyStatsData;
  isLoading?: boolean;
}

export const AccountingClientStatsCards = ({
  data,
  isLoading = false,
}: AccountingClientStatsCardsProps) => {

  return (
    <StatsGrid columns={3}>
      <StatCard
        title="Total de Empresas"
        value={data?.totalCompanies || 0}
        subtitle={`${data?.thisMonthCompanies || 0} nuevas este mes`}
        icon={Building2}
        loading={isLoading}
      />
      <StatCard
        title="Empresas Activas"
        value={data?.activeCompanies || 0}
        subtitle={`${data ? Math.round((data.activeCompanies / (data.totalCompanies || 1)) * 100) : 0}% del total`}
        icon={TrendingUp}
        variant="success"
        loading={isLoading}
      />
      <StatCard
        title="Empresas Inactivas"
        value={data?.inactiveCompanies || 0}
        subtitle={`${data ? Math.round((data.inactiveCompanies / (data.totalCompanies || 1)) * 100) : 0}% del total`}
        icon={Users}
        variant="error"
        loading={isLoading}
      />
    </StatsGrid>
  );
};