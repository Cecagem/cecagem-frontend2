"use client";

import React from 'react';
import { Building2, TrendingUp, Users, DollarSign } from 'lucide-react';
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
      <StatCard
        title="Ingresos Mensuales"
        value={data ? formatCurrency(data.totalRevenue) : 'S/ 0'}
        subtitle={data ? `${formatCurrency(data.totalRevenue / (data.activeCompanies || 1))} promedio` : 'Sin ingresos'}
        icon={DollarSign}
        variant="success"
        loading={isLoading}
      />
    </StatsGrid>
  );
};