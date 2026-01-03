// ENUMS
export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

// ENTITIES
export interface ITransaction {
  id: string;
  tipo: TransactionType;
  categoria: string;
  currency: string;
  monto: string;
  fecha: string;
  estado: TransactionStatus;
  descripcion: string;
  paymentId: string;
  isRecurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTOs
export interface ICreateTransactionDto {
  tipo: TransactionType;
  categoria: string;
  currency: string;
  monto: string;
  fecha: string;
  estado: TransactionStatus;
  descripcion: string;
  paymentId?: string;
  isRecurrent?: boolean;
}

export interface IUpdateTransactionDto {
  tipo?: TransactionType;
  categoria?: string;
  currency?: string;
  monto?: string;
  fecha?: string;
  estado?: TransactionStatus;
  descripcion?: string;
  paymentId?: string;
  isRecurrent?: boolean;
}

// FILTERS
export interface ITransactionFilters {
  search?: string;
  tipo?: TransactionType;
  estado?: TransactionStatus;
  categoria?: string;
  fechaInicio?: string;
  fechaFin?: string;
  isRecurrent?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "fecha" | "monto" | "concepto"; // Opcional
  sortOrder?: "asc" | "desc";
}

// RESPONSES
export interface ITransactionMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ITransactionsResponse {
  data: ITransaction[];
  meta: ITransactionMeta;
}

export interface ITransactionResponse {
  data: ITransaction;
  message?: string;
}

// FORM TYPES
export interface ITransactionFormData {
  tipo: TransactionType;
  categoria: string;
  monto: string;
  fecha: string;
  estado: TransactionStatus;
  descripcion: string;
  paymentId?: string;
  isRecurrent: boolean;
}

// TABLE TYPES
export interface ITransactionTableFilters {
  search: string;
  tipo: string;
  estado: string;
  categoria: string;
  fechaInicio: string;
  fechaFin: string;
  isRecurrent: string;
  page: number;
  limit: number;
}

// SUMMARY API TYPES
export interface ICurrencySummary {
  income: number;
  expense: number;
  transactions: number;
  total: number;
}

export interface ITransactionSummaryResponse {
  pen: ICurrencySummary;
  usd: ICurrencySummary;
}

// STATS PARA UI (adaptado de la API)
export interface ITransactionStatsByCurrency {
  pen: {
    currency: string;
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    transactionCount: number;
  };
  usd: {
    currency: string;
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    transactionCount: number;
  };
}