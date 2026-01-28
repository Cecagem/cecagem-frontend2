import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { transactionService } from "../services/account.service";
import {
  ITransactionFilters,
  ICreateTransactionDto,
  IUpdateTransactionDto,
  TransactionStatus,
} from "../types/account.types";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters?: ITransactionFilters) =>
    [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  summary: () => [...transactionKeys.all, "summary"] as const,
};

// 🔄 Hook actualizado - Reducido staleTime y agregado refetchOnWindowFocus
export const useTransactions = (filters?: ITransactionFilters) => {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionService.getAll(filters),
    staleTime: 0, // 🔄 CAMBIADO: De 5 * 60 * 1000 a 0 para siempre tener datos frescos
    refetchOnWindowFocus: true, // 🆕 AGREGADO: Refrescar cuando vuelvas a la ventana
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Sin cambios - Los detalles individuales pueden mantener cache
  });
};

// 🔄 Hook actualizado - Reducido staleTime y agregado refetchOnWindowFocus
export const useTransactionSummary = () => {
  return useQuery({
    queryKey: transactionKeys.summary(),
    queryFn: () => transactionService.getSummary(),
    staleTime: 0, // 🔄 CAMBIADO: De 5 * 60 * 1000 a 0 para siempre tener datos frescos
    refetchOnWindowFocus: true, // 🆕 AGREGADO: Refrescar cuando vuelvas a la ventana
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateTransactionDto) =>
      transactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() });

      // 🆕 Mostrar toast de éxito
      toast.success("Transacción creada exitosamente");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(
        error.response?.data?.message || "Error al crear la transacción"
      );
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateTransactionDto }) =>
      transactionService.update(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() });

      // 🆕 Mostrar toast de éxito
      toast.success("Transacción actualizada exitosamente");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(
        error.response?.data?.message || "Error al actualizar la transacción"
      );
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() });

      // 🆕 Mostrar toast de éxito
      toast.success("Transacción eliminada exitosamente");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(
        error.response?.data?.message || "Error al eliminar la transacción"
      );
    },
  });
};

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: TransactionStatus }) =>
      transactionService.update(id, { estado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.summary() });

      // 🆕 Mostrar toast de éxito
      toast.success("Estado de transacción actualizado exitosamente");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(
        error.response?.data?.message || "Error al cambiar el estado"
      );
    },
  });
};
