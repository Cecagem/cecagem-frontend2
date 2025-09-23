import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../services/contract.service";
import type {
  IContractFilters,
  IContractResponse,
  ICreateConctract,
  IUpdateContract,
} from "../types/contract.type";
import { useToast } from "@/hooks/use-toast";

export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (filters?: Partial<IContractFilters>) =>
    [...contractKeys.lists(), filters] as const,
  details: () => [...contractKeys.all, "detail"] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
} as const;

export const useContracts = (filters?: Partial<IContractFilters>) => {
  return useQuery<IContractResponse, Error>({
    queryKey: contractKeys.list(filters),
    queryFn: () => contractService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useContractById = (contractId: string) => {
  return useQuery<IContractResponse, Error>({
    queryKey: contractKeys.detail(contractId),
    queryFn: () => contractService.getById(contractId),
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation<IContractResponse, Error, ICreateConctract>({
    mutationFn: (data: ICreateConctract) => contractService.create(data),
    onSuccess: () => {
      showSuccess("created", {
        title: "Contrato creado",
        description: "El contrato ha sido creado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creating contract:", error);
      showError("error", {
        title: "Error creando contrato",
        description: `No se pudo crear el contrato: ${error.message}`,
      });
    },
  });
};

export const useUpdateContract = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation<
    IContractResponse,
    Error,
    { contractId: string; contractData: IUpdateContract }
  >({
    mutationFn: ({ contractId, contractData }) =>
      contractService.update(contractId, contractData),
    onSuccess: (data, variables) => {
      showSuccess("updated", {
        title: "Contrato actualizado",
        description: "El contrato ha sido actualizado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: contractKeys.detail(variables.contractId),
      });
    },
    onError: (error) => {
      console.error("Error updating contract:", error);
      showError("error", {
        title: "Error actualizando contrato",
        description: `No se pudo actualizar el contrato: ${error.message}`,
      });
    },
  });
};

export const useDeleteContract = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: contractService.delete,
    onSuccess: () => {
      showSuccess("deleted", {
        title: "Contrato eliminado",
        description: "El contrato ha sido eliminado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting contract:", error);
      showError("error", {
        title: "Error eliminando contrato",
        description: `No se pudo eliminar el contrato: ${error.message}`,
      });
    },
  });
};

export const useRefreshContracts = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
  };
};
