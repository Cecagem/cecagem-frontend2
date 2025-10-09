// Exportar types de reportes de contratos
export type {
  ContractStatus,
  Currency,
  ContractUser,
  ContractService,
  ContractReportItem,
  ContractReportSummary,
  ContractReportDateRange,
  ContractReportResponse,
  ContractReportFilters,
  ContractReportError,
} from './report-contract.types';

// Exportar types de reportes de empresas
export type {
  PaymentMethod,
  CompanyContact,
  CompanyRecentPayment,
  CompanyReportItem,
  CompanyReportSummary,
  CompanyReportDateRange,
  CompanyReportResponse,
  CompanyReportFilters,
  CompanyReportError,
} from './report-company.types';

// Exportar types de reportes de transacciones
export type {
  TransactionType,
  TransactionStatus,
  TransactionUser,
  TransactionReportItem,
  TransactionCategoryReport,
  TransactionReportSummary,
  TransactionReportDateRange,
  TransactionReportResponse,
  TransactionReportFilters,
  TransactionReportError,
} from './report-transaction.types';

// Re-exportar Currency desde contracts para mantener compatibilidad
export type { Currency as CompanyCurrency } from './report-company.types';
export type { Currency as TransactionCurrency } from './report-transaction.types';