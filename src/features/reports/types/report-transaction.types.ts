// Tipos base para el reporte de transacciones
export type Currency = 'PEN' | 'USD';
export type TransactionType = 'EXPENSE' | 'INCOME';
export type TransactionStatus = 'COMPLETED' | 'PENDING';

// Usuario asociado a una transacción
export interface TransactionUser {
  id: string;
  email: string;
  fullName: string;
}

// Transacción individual en el reporte
export interface TransactionReportItem {
  id: string;
  tipo: TransactionType;
  categoria: string;
  monto: number;
  currency: Currency;
  fecha: string;
  estado: TransactionStatus;
  descripcion: string;
  user?: TransactionUser;
}

// Categoría de ingresos/gastos
export interface TransactionCategoryReport {
  category: string;
  totalPEN: number;
  totalUSD: number;
  transactionCount: number;
  percentage: number;
}

// Resumen estadístico del reporte de transacciones
export interface TransactionReportSummary {
  totalIncomesPEN: number;
  totalIncomesUSD: number;
  totalExpensesPEN: number;
  totalExpensesUSD: number;
  netBalancePEN: number;
  netBalanceUSD: number;
  totalIncomeTransactions: number;
  totalExpenseTransactions: number;
  pendingTransactions: number;
  completedTransactions: number;
  avgIncomePerTransactionPEN: number;
  avgIncomePerTransactionUSD: number;
  avgExpensePerTransactionPEN: number;
  avgExpensePerTransactionUSD: number;
}

// Rango de fechas del reporte
export interface TransactionReportDateRange {
  startDate: string;
  endDate: string;
}

// Respuesta completa del endpoint de reporte de transacciones
export interface TransactionReportResponse {
  summary: TransactionReportSummary;
  transactions: TransactionReportItem[];
  incomeByCategory: TransactionCategoryReport[];
  expenseByCategory: TransactionCategoryReport[];
  dateRange: TransactionReportDateRange;
  currency: Currency;
  transactionType: TransactionType;
}

// Parámetros para el filtro del reporte de transacciones
export interface TransactionReportFilters {
  startDate: string; // formato: YYYY-MM-DD
  endDate: string;   // formato: YYYY-MM-DD
  currency: Currency;
  transactionType: TransactionType;
}

// Tipo para manejo de errores en reportes de transacciones
export interface TransactionReportError {
  message: string;
  code?: string;
}