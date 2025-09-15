import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountService } from "../services/account.service";
import { mockStats, mockTransactions, delay } from "../data/mock-data";
import type {
  TransactionFilters,
  TransactionsResponse,
  TransactionResponse,
  DeleteTransactionResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionStats,
  MonthlyData,
  Transaction,
} from "../types/account.types";

// Flag para usar datos mock o API real
const USE_MOCK_DATA = true;

export const accountKeys = {
  all: ["transactions"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  list: (filters?: Partial<TransactionFilters>) =>
    [...accountKeys.lists(), filters] as const,
  details: () => [...accountKeys.all, "detail"] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  stats: () => [...accountKeys.all, "stats"] as const,
  monthly: () => [...accountKeys.all, "monthly"] as const,
  monthlyReport: (year: number) => [...accountKeys.monthly(), year] as const,
} as const;

export const useTransactions = (filters?: Partial<TransactionFilters>) => {
  return useQuery<TransactionsResponse, Error>({
    queryKey: accountKeys.list(filters),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await delay(800); // Simular delay de red
        // Aplicar filtros básicos a los datos mock
        let filteredTransactions = [...mockTransactions];
        
        if (filters?.type && filters.type !== "all") {
          filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
        }
        
        if (filters?.category && filters.category !== "all") {
          filteredTransactions = filteredTransactions.filter(t => t.category === filters.category);
        }
        
        if (filters?.status && filters.status !== "all") {
          filteredTransactions = filteredTransactions.filter(t => t.status === filters.status);
        }
        
        if (filters?.search) {
          filteredTransactions = filteredTransactions.filter(t => 
            t.description.toLowerCase().includes(filters.search!.toLowerCase())
          );
        }
        
        if (filters?.dateFrom) {
          filteredTransactions = filteredTransactions.filter(t => t.date >= filters.dateFrom!);
        }
        
        if (filters?.dateTo) {
          filteredTransactions = filteredTransactions.filter(t => t.date <= filters.dateTo!);
        }
        
        if (filters?.amountMin) {
          filteredTransactions = filteredTransactions.filter(t => t.amount >= filters.amountMin!);
        }
        
        if (filters?.amountMax) {
          filteredTransactions = filteredTransactions.filter(t => t.amount <= filters.amountMax!);
        }
        
        // Ordenar por fecha (más recientes primero)
        filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return {
          transactions: filteredTransactions,
          pagination: {
            page: 1,
            limit: 10,
            total: filteredTransactions.length,
            pages: Math.ceil(filteredTransactions.length / 10),
          },
          stats: mockStats,
        };
      }
      return accountService.getTransactions(filters);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTransaction = (id: string) => {
  return useQuery<TransactionResponse, Error>({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountService.getTransactionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTransactionStats = (filters?: { dateFrom?: string; dateTo?: string }) => {
  return useQuery<TransactionStats, Error>({
    queryKey: accountKeys.stats(),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await delay(500);
        return mockStats;
      }
      return accountService.getStats(filters);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useMonthlyReport = (year: number) => {
  return useQuery<MonthlyData[], Error>({
    queryKey: accountKeys.monthlyReport(year),
    queryFn: () => accountService.getMonthlyReport(year),
    enabled: !!year,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<TransactionResponse, Error, CreateTransactionRequest>({
    mutationFn: async (data) => {
      if (USE_MOCK_DATA) {
        await delay(1000);
        // Simular creación exitosa
        const newTransaction: Transaction = {
          id: `mock-${Date.now()}`,
          userId: "user1",
          type: data.type,
          category: data.category,
          amount: data.amount,
          description: data.description,
          date: data.date,
          status: data.status || "COMPLETED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Agregar a la lista mock (simular persistencia)
        mockTransactions.unshift(newTransaction);
        
        return { transaction: newTransaction };
      }
      return accountService.createTransaction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.stats() });
      queryClient.invalidateQueries({ queryKey: accountKeys.monthly() });
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TransactionResponse,
    Error,
    { id: string; data: UpdateTransactionRequest }
  >({
    mutationFn: async ({ id, data }) => {
      if (USE_MOCK_DATA) {
        await delay(1000);
        // Encontrar y actualizar la transacción
        const index = mockTransactions.findIndex(t => t.id === id);
        if (index === -1) {
          throw new Error("Transaction not found");
        }
        
        const updatedTransaction = {
          ...mockTransactions[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        mockTransactions[index] = updatedTransaction;
        return { transaction: updatedTransaction };
      }
      return accountService.updateTransaction(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.stats() });
      queryClient.setQueryData(accountKeys.detail(variables.id), data);
    },
    onError: (error) => {
      console.error("Error updating transaction:", error);
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteTransactionResponse, Error, string>({
    mutationFn: async (id) => {
      if (USE_MOCK_DATA) {
        await delay(800);
        // Encontrar y eliminar la transacción
        const index = mockTransactions.findIndex(t => t.id === id);
        if (index === -1) {
          throw new Error("Transaction not found");
        }
        
        mockTransactions.splice(index, 1);
        return { message: "Transaction deleted successfully", deletedId: id };
      }
      return accountService.deleteTransaction(id);
    },
    onSuccess: (_, transactionId) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.stats() });
      queryClient.removeQueries({ queryKey: accountKeys.detail(transactionId) });
    },
    onError: (error) => {
      console.error("Error deleting transaction:", error);
    },
  });
};