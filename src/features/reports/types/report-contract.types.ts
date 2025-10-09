// Tipos base para el reporte de contratos
export type ContractStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
export type Currency = 'PEN' | 'USD';

// Usuario asignado a un contrato
export interface ContractUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Servicio asociado al contrato
export interface ContractService {
  id: string;
  name: string;
  description: string;
}

// Contrato individual en el reporte
export interface ContractReportItem {
  id: string;
  name: string;
  university: string;
  career: string;
  costTotal: number;
  currency: Currency;
  startDate: string;
  endDate: string;
  service: ContractService;
  users: ContractUser[];
  totalPaid: number;
  totalPending: number;
  status: ContractStatus;
}

// Resumen estadístico del reporte
export interface ContractReportSummary {
  totalContracts: number;
  totalValuePEN: number;
  totalValueUSD: number;
  totalPaidPEN: number;
  totalPaidUSD: number;
  totalPendingPEN: number;
  totalPendingUSD: number;
  activeContracts: number;
  completedContracts: number;
  expiredContracts: number;
}

// Rango de fechas del reporte
export interface ContractReportDateRange {
  startDate: string;
  endDate: string;
}

// Respuesta completa del endpoint de reporte de contratos
export interface ContractReportResponse {
  summary: ContractReportSummary;
  contracts: ContractReportItem[];
  dateRange: ContractReportDateRange;
  currency: Currency;
}

// Parámetros para el filtro del reporte
export interface ContractReportFilters {
  startDate: string; // formato: YYYY-MM-DD
  endDate: string;   // formato: YYYY-MM-DD
  currency: Currency;
}

// Tipo para manejo de errores
export interface ContractReportError {
  message: string;
  code?: string;
}