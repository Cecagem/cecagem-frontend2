import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../services";
import type { IContractFilters, IUpdateDeliverableDto, ICreateContractDto, IUpdateContractDto, IUpdateInstallmentDto } from "../types";
import { useToast } from "@/hooks/use-toast";
import { transactionKeys } from "../../account/hooks/use-account";

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
    refetchOnWindowFocus: true,
    staleTime: 0,
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

// 🔄 Hook para eliminar un contrato - MODIFICADO
export const useDeleteContract = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => contractService.deleteContract(id),
    onSuccess: async (data, contractId) => {
      // Invalidar contratos
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      queryClient.removeQueries({ queryKey: CONTRACT_QUERY_KEYS.detail(contractId) });

      // 🆕 INVALIDAR TRANSACCIONES
      await queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: transactionKeys.summary() });

      // 🆕 FORZAR REFETCH INMEDIATO - ESTO ES LO MÁS IMPORTANTE
      await queryClient.refetchQueries({
        queryKey: transactionKeys.summary(),
        exact: true
      });
      await queryClient.refetchQueries({
        queryKey: transactionKeys.lists(),
        exact: false
      });

      showSuccess("deleted", {
        title: "Contrato eliminado",
        description: "El contrato y todas sus transacciones asociadas han sido eliminadas exitosamente"
      });
    },
    onError: (error: Error) => {
      showError("error", {
        title: "Error al eliminar",
        description: error?.message || "No se pudo eliminar el contrato"
      });
    },
  });
};

// ... resto de los hooks sin cambios ...

// Hook para actualizar entregables
export const useUpdateDeliverable = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({
      contractId,
      deliverableId,
      data
    }: {
      contractId: string;
      deliverableId: string;
      data: IUpdateDeliverableDto;
    }) => contractService.updateDeliverable(contractId, deliverableId, data),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.lists() });

      await queryClient.refetchQueries({
        queryKey: CONTRACT_QUERY_KEYS.lists(),
        exact: false
      });

      let title = "Entregable actualizado";
      let description = "El entregable ha sido actualizado exitosamente";

      if (response.isAproved === true && response.isCompleted === true) {
        title = "Entregable aprobado";
        description = "El entregable ha sido aprobado exitosamente";
      } else if (response.isAproved === false && response.isCompleted === false) {
        title = "Entregable rechazado";
        description = "El entregable ha sido rechazado y vuelve a estar en progreso";
      }

      showSuccess("updated", {
        title,
        description
      });
    },
    onError: (error: Error) => {
      showError("error", {
        title: "Error al actualizar",
        description: error?.message || "No se pudo actualizar el entregable"
      });
    },
  });
};

// Hook para crear un contrato
export const useCreateContract = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: ICreateContractDto) => contractService.createContract(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });

      showSuccess("created", {
        title: "Contrato creado",
        description: `El contrato "${response.name}" ha sido creado exitosamente`
      });

      return response;
    },
    onError: (error: Error) => {
      showError("error", {
        title: "Error al crear",
        description: error?.message || "No se pudo crear el contrato"
      });
    },
  });
};

// Hook para actualizar un contrato
export const useUpdateContract = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateContractDto }) =>
      contractService.updateContract(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.detail(id) });

      showSuccess("updated", {
        title: "Contrato actualizado",
        description: `El contrato "${response.name}" ha sido actualizado exitosamente`
      });

      return response;
    },
    onError: (error: Error) => {
      showError("error", {
        title: "Error al actualizar",
        description: error?.message || "No se pudo actualizar el contrato"
      });
    },
  });
};

// Hook para actualizar pagos
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: string; data: { status: string } }) =>
      contractService.updatePayment(paymentId, data),
    onSuccess: async (response: { status: string; id: string }) => {
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.lists() });

      await queryClient.refetchQueries({
        queryKey: CONTRACT_QUERY_KEYS.lists(),
        exact: false
      });

      const statusText = response.status === "COMPLETED" ? "aprobado" :
                        response.status === "FAILED" ? "rechazado" : "actualizado";
      showSuccess("updated", {
        title: "Pago actualizado",
        description: `El pago ha sido ${statusText} exitosamente`
      });
    },
    onError: (error: Error) => {
      showError("error", {
        title: "Error al actualizar pago",
        description: error?.message || "No se pudo actualizar el pago"
      });
    },
  });
};

// Hook para actualizar una cuota
export const useUpdateInstallment = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({
      contractId,
      installmentId,
      data
    }: {
      contractId: string;
      installmentId: string;
      data: IUpdateInstallmentDto
    }) => contractService.updateInstallment(contractId, installmentId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.lists() });

      await queryClient.refetchQueries({
        queryKey: CONTRACT_QUERY_KEYS.lists(),
        exact: false
      });

      showSuccess("updated", {
        title: "Cuota actualizada",
        description: "La cuota ha sido actualizada exitosamente"
      });
    },
    onError: (error: Error) => {
      showError("error", {
        title: "Error al actualizar cuota",
        description: error?.message || "No se pudo actualizar la cuota"
      });
    },
  });
};
