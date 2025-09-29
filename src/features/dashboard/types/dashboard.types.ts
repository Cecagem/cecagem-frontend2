// Interfaces para el dashboard
export interface IFinancialSummary {
  totalIncome: number;
  pendingIncome: number;
  pendingCollaboratorPayments: number;
  pendingCompanyPayments: number;
}

export interface IContractsSummary {
  total: number;
  active: number;
  expiringSoon: number;
  withOverduePayments: number;
}

export interface IUsersSummary {
  total: number;
  active: number;
  internalCollaborators: number;
  externalCollaborators: number;
  clients: number;
}

export interface ICompaniesSummary {
  total: number;
  active: number;
}

export interface IDeliverablesSummary {
  total: number;
  completed: number;
  approved: number;
  pending: number;
}

export interface IChartData {
  month: string;
  amount: number;
}

export interface ICharts {
  incomeByMonth: IChartData[];
  contractsByMonth: IChartData[];
}

export interface IAlert {
  type: 'overdue_payment' | 'contract_expiring' | 'pending_approval' | 'system_notification';
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface IDashboardData {
  financialSummary: IFinancialSummary;
  contracts: IContractsSummary;
  users: IUsersSummary;
  companies: ICompaniesSummary;
  deliverables: IDeliverablesSummary;
  charts: ICharts;
  alerts: IAlert[];
}

// Filtros para el dashboard
export interface IDashboardFilters {
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
}