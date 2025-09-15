import { cecagemApi } from "@/lib/api-client";
import {
  TransactionFilters,
  TransactionsResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionResponse,
  DeleteTransactionResponse,
  TransactionStats,
  MonthlyData,
} from "../types/account.types";

class AccountService {
  private readonly baseEndpoint = "/transactions";

  async getTransactions(filters?: Partial<TransactionFilters>): Promise<TransactionsResponse> {
    const params = new URLSearchParams();

    if (filters?.type) {
      params.append("type", filters.type);
    }
    if (filters?.category) {
      params.append("category", filters.category);
    }
    if (filters?.status) {
      params.append("status", filters.status);
    }
    if (filters?.dateFrom) {
      params.append("dateFrom", filters.dateFrom);
    }
    if (filters?.dateTo) {
      params.append("dateTo", filters.dateTo);
    }
    if (filters?.amountMin) {
      params.append("amountMin", filters.amountMin.toString());
    }
    if (filters?.amountMax) {
      params.append("amountMax", filters.amountMax.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.page) {
      params.append("page", filters.page.toString());
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `${this.baseEndpoint}?${queryString}`
      : this.baseEndpoint;

    return await cecagemApi.get<TransactionsResponse>(url);
  }

  async getTransactionById(id: string): Promise<TransactionResponse> {
    return await cecagemApi.get<TransactionResponse>(`${this.baseEndpoint}/${id}`);
  }

  async createTransaction(transactionData: CreateTransactionRequest): Promise<TransactionResponse> {
    return await cecagemApi.post<TransactionResponse>(
      this.baseEndpoint,
      transactionData as unknown as Record<string, unknown>
    );
  }

  async updateTransaction(
    id: string,
    transactionData: UpdateTransactionRequest
  ): Promise<TransactionResponse> {
    return await cecagemApi.put<TransactionResponse>(
      `${this.baseEndpoint}/${id}`,
      transactionData as unknown as Record<string, unknown>
    );
  }

  async deleteTransaction(id: string): Promise<DeleteTransactionResponse> {
    return await cecagemApi.delete<DeleteTransactionResponse>(`${this.baseEndpoint}/${id}`);
  }

  async getStats(filters?: { dateFrom?: string; dateTo?: string }): Promise<TransactionStats> {
    const params = new URLSearchParams();
    
    if (filters?.dateFrom) {
      params.append("dateFrom", filters.dateFrom);
    }
    if (filters?.dateTo) {
      params.append("dateTo", filters.dateTo);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${this.baseEndpoint}/stats?${queryString}`
      : `${this.baseEndpoint}/stats`;

    return await cecagemApi.get<TransactionStats>(url);
  }

  async getMonthlyReport(year: number): Promise<MonthlyData[]> {
    return await cecagemApi.get(`${this.baseEndpoint}/monthly-report/${year}`);
  }
}

export const accountService = new AccountService();