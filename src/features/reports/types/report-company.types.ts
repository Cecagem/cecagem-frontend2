// Tipos base para el reporte de empresas
export type Currency = 'PEN' | 'USD';
export type PaymentMethod = 'CARD' | 'CASH' | 'YAPE' | 'BANK_TRANSFER';

// Contacto de la empresa
export interface CompanyContact {
  name: string;
  phone: string;
  email: string;
}

// Pago reciente de la empresa
export interface CompanyRecentPayment {
  id: string;
  amount: number;
  currency: Currency;
  paidAt: string;
  method: PaymentMethod;
  collaboratorName: string;
}

// Empresa individual en el reporte
export interface CompanyReportItem {
  id: string;
  ruc: string;
  businessName: string;
  tradeName: string;
  totalActiveEmployees: number;
  totalPaidPEN: number;
  totalPaidUSD: number;
  totalPendingPEN: number;
  totalPendingUSD: number;
  contact: CompanyContact;
  recentPayments: CompanyRecentPayment[];
}

// Resumen estadístico del reporte de empresas
export interface CompanyReportSummary {
  totalActiveCompanies: number;
  totalCollaborators: number;
  totalRevenuePEN: number;
  totalRevenueUSD: number;
  totalPendingPEN: number;
  totalPendingUSD: number;
  averageMonthlyPaymentPEN: number;
  averageMonthlyPaymentUSD: number;
}

// Rango de fechas del reporte
export interface CompanyReportDateRange {
  startDate: string;
  endDate: string;
}

// Respuesta completa del endpoint de reporte de empresas
export interface CompanyReportResponse {
  summary: CompanyReportSummary;
  companies: CompanyReportItem[];
  dateRange: CompanyReportDateRange;
  currency: Currency;
}

// Parámetros para el filtro del reporte de empresas
export interface CompanyReportFilters {
  startDate: string; // formato: YYYY-MM-DD
  endDate: string;   // formato: YYYY-MM-DD
  currency: Currency;
}

// Tipo para manejo de errores en reportes de empresas
export interface CompanyReportError {
  message: string;
  code?: string;
}