// ENUMS
export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export const TransactionCategory = {
  // Ingresos
  SALARY: "SALARY",
  FREELANCE: "FREELANCE",
  INVESTMENT: "INVESTMENT",
  BUSINESS: "BUSINESS",
  OTHER_INCOME: "OTHER_INCOME",
  
  // Egresos
  FOOD: "FOOD",
  TRANSPORT: "TRANSPORT",
  UTILITIES: "UTILITIES",
  ENTERTAINMENT: "ENTERTAINMENT",
  HEALTHCARE: "HEALTHCARE",
  EDUCATION: "EDUCATION",
  SHOPPING: "SHOPPING",
  RENT: "RENT",
  OTHER_EXPENSE: "OTHER_EXPENSE",
} as const;

export const TransactionStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
export type TransactionCategory = (typeof TransactionCategory)[keyof typeof TransactionCategory];
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

// ENTITIES
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  transactionCount: number;
}

// FILTERS
export interface TransactionFilters {
  type?: TransactionType | "all";
  category?: TransactionCategory | "all";
  status?: TransactionStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// API RESPONSES
export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: TransactionStats;
}

export interface TransactionResponse {
  transaction: Transaction;
}

// API REQUESTS
export interface CreateTransactionRequest {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
  status?: TransactionStatus;
}

export interface UpdateTransactionRequest {
  type?: TransactionType;
  category?: TransactionCategory;
  amount?: number;
  description?: string;
  date?: string;
  status?: TransactionStatus;
}

export interface DeleteTransactionResponse {
  message: string;
  deletedId: string;
}

// FORM TYPES
export interface TransactionFormData {
  type: TransactionType;
  category: TransactionCategory;
  amount: string;
  description: string;
  date: string;
  status: TransactionStatus;
}

// UTILITY TYPES
export interface CategoryOption {
  value: TransactionCategory;
  label: string;
  type: TransactionType;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}