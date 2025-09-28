import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../services";
import type { IContractFilters, IUpdateDeliverableDto, ICreateContractDto, IUpdateContractDto } from "../types";
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
    refetchOnWindowFocus: true, // Actualizar cuando regrese a la ventana
    staleTime: 0, // Siempre considerar los datos como obsoletos
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
      // Invalidar todas las queries de contratos para refrescar la lista principal
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.lists() });
      
      // Refrescar los datos inmediatamente para actualización en tiempo real
      await queryClient.refetchQueries({ 
        queryKey: CONTRACT_QUERY_KEYS.lists(),
        exact: false 
      });
      
      // Determinar el tipo de acción basado en el estado del entregable
      let title = "Entregable actualizado";
      let description = "El entregable ha sido actualizado exitosamente";
      
      if (response.isAproved === true && response.isCompleted === true) {
        title = "Entregable aprobado";
        description = "El entregable ha sido aprobado exitosamente";
      } else if (response.isAproved === false && response.isCompleted === false) {
        title = "Entregable rechazado";
        description = "El entregable ha sido rechazado y vuelve a estar en progreso";
      }
      
      // Mostrar notificación de éxito
      showSuccess("updated", { 
        title,
        description
      });
    },
    onError: (error: Error) => {
      // Mostrar notificación de error
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
      // Invalidar todas las queries de contratos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      
      // Mostrar notificación de éxito
      showSuccess("created", { 
        title: "Contrato creado",
        description: `El contrato "${response.name}" ha sido creado exitosamente`
      });
      
      return response;
    },
    onError: (error: Error) => {
      // Mostrar notificación de error
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
      // Invalidar todas las queries de contratos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      
      // Invalidar el contrato específico
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.detail(id) });
      
      // Mostrar notificación de éxito
      showSuccess("updated", { 
        title: "Contrato actualizado",
        description: `El contrato "${response.name}" ha sido actualizado exitosamente`
      });
      
      return response;
    },
    onError: (error: Error) => {
      // Mostrar notificación de error
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
      // Invalidar todas las queries de contratos para refrescar la lista principal
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      await queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.lists() });
      
      // Refrescar los datos inmediatamente para actualización en tiempo real
      await queryClient.refetchQueries({ 
        queryKey: CONTRACT_QUERY_KEYS.lists(),
        exact: false 
      });
      
      // Mostrar notificación de éxito
      const statusText = response.status === "COMPLETED" ? "aprobado" : 
                        response.status === "FAILED" ? "rechazado" : "actualizado";
      showSuccess("updated", { 
        title: "Pago actualizado",
        description: `El pago ha sido ${statusText} exitosamente`
      });
    },
    onError: (error: Error) => {
      // Mostrar notificación de error
      showError("error", {
        title: "Error al actualizar pago",
        description: error?.message || "No se pudo actualizar el pago"
      });
    },
  });
};