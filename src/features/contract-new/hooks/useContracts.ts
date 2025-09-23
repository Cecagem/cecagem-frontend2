import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../services";
import type { IContractFilters } from "../types";
import { useToast } from "@/hooks/use-toast";

// Query keys para cache
export const CONTRACT_QUERY_KEYS = {
  all: ["contracts"] as const,
  lists: () => [...CONTRACT_QUERY_KEYS.all, "list"] as const,
  list: (filters: Partial<IContractFilters>) => 
    [...CONTRACT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...CONTRACT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CONTRACT_QUERY_KEYS.details(), id] as const,
};

// Hook para obtener contratos con filtros
export const useContracts = (filters: Partial<IContractFilters> = {}) => {
  return useQuery({
    queryKey: CONTRACT_QUERY_KEYS.list(filters),
    queryFn: () => contractService.getContracts(filters),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 segundos
  });
};

// Hook para obtener un contrato por ID
export const useContract = (id: string) => {
  return useQuery({
    queryKey: CONTRACT_QUERY_KEYS.detail(id),
    queryFn: () => contractService.getContractById(id),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para eliminar un contrato
export const useDeleteContract = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => contractService.deleteContract(id),
    onSuccess: (data, contractId) => {
      // Invalidar todas las queries de contratos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      
      // Remover el contrato específico del cache
      queryClient.removeQueries({ queryKey: CONTRACT_QUERY_KEYS.detail(contractId) });
      
      // Mostrar notificación de éxito
      showSuccess("deleted", { 
        title: "Contrato eliminado",
        description: data.message || "El contrato ha sido eliminado exitosamente"
      });
    },
    onError: (error: Error) => {
      // Mostrar notificación de error
      showError("error", {
        title: "Error al eliminar",
        description: error?.message || "No se pudo eliminar el contrato"
      });
    },
  });
};