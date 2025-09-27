"use client";

import { TrendingUp, TrendingDown, DollarSign, Activity, Coins, Globe } from "lucide-react";
import { StatsGrid, StatCard } from "@/components/shared/stats-cards";
import type { ITransactionStatsByCurrency } from "../types/account.types";

interface AccountStatsCardsProps {
  stats: ITransactionStatsByCurrency;
  isLoading: boolean;
}

export const AccountStatsCards = ({ stats, isLoading }: AccountStatsCardsProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    const currencyCode = currency === "PEN" ? "PEN" : "USD";
    const locale = currency === "PEN" ? "es-PE" : "en-US";
    
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  };

  const getCurrencyIcon = (currency: string) => {
    return currency === "USD" ? DollarSign : Coins;
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Resumen General</h3>
        <StatsGrid columns={2}>
          <StatCard
            title="Total de Transacciones"
            value={stats.overall.totalTransactions}
            subtitle="Todas las monedas"
            icon={Activity}
            loading={isLoading}
            variant="default"
          />
          <StatCard
            title="Monedas Activas"
            value={stats.overall.activeCurrencies.length}
            subtitle={stats.overall.activeCurrencies.join(", ")}
            icon={Globe}
            loading={isLoading}
            variant="default"
          />
        </StatsGrid>
      </div>

      {/* Estadísticas por Moneda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soles (PEN) */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-orange-500" />
            Soles Peruanos (PEN)
          </h3>
          <StatsGrid columns={2}>
            <StatCard
              title="Balance"
              value={formatCurrency(stats.pen.totalBalance, "PEN")}
              subtitle={stats.pen.totalBalance >= 0 ? "Positivo" : "Negativo"}
              icon={getCurrencyIcon("PEN")}
              loading={isLoading}
              variant={stats.pen.totalBalance >= 0 ? "success" : "error"}
            />
            <StatCard
              title="Transacciones"
              value={stats.pen.transactionCount}
              subtitle="En soles"
              icon={Activity}
              loading={isLoading}
              variant="default"
            />
            <StatCard
              title="Ingresos"
              value={formatCurrency(stats.pen.totalIncome, "PEN")}
              subtitle="Total acumulado"
              icon={TrendingUp}
              loading={isLoading}
              variant="success"
            />
            <StatCard
              title="Gastos"
              value={formatCurrency(stats.pen.totalExpenses, "PEN")}
              subtitle="Total acumulado"
              icon={TrendingDown}
              loading={isLoading}
              variant="error"
            />
          </StatsGrid>
        </div>

        {/* Dólares (USD) */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Dólares Americanos (USD)
          </h3>
          <StatsGrid columns={2}>
            <StatCard
              title="Balance"
              value={formatCurrency(stats.usd.totalBalance, "USD")}
              subtitle={stats.usd.totalBalance >= 0 ? "Positivo" : "Negativo"}
              icon={getCurrencyIcon("USD")}
              loading={isLoading}
              variant={stats.usd.totalBalance >= 0 ? "success" : "error"}
            />
            <StatCard
              title="Transacciones"
              value={stats.usd.transactionCount}
              subtitle="En dólares"
              icon={Activity}
              loading={isLoading}
              variant="default"
            />
            <StatCard
              title="Ingresos"
              value={formatCurrency(stats.usd.totalIncome, "USD")}
              subtitle="Total acumulado"
              icon={TrendingUp}
              loading={isLoading}
              variant="success"
            />
            <StatCard
              title="Gastos"
              value={formatCurrency(stats.usd.totalExpenses, "USD")}
              subtitle="Total acumulado"
              icon={TrendingDown}
              loading={isLoading}
              variant="error"
            />
          </StatsGrid>
        </div>
      </div>
    </div>
  );
};