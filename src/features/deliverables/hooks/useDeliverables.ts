import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deliverableService } from "../services/deliverable.service";
import { engagementService } from "@/features/engagements/services/engagements.service";
import {
  IDeliverableFilters,
  ICreateDeliverableDto,
  IUpdateDeliverableDto,
} from "../types/deliverable.types";

export const deliverableKeys = {
  all: ["deliverables"] as const,
  lists: () => [...deliverableKeys.all, "list"] as const,
  list: (filters?: IDeliverableFilters) =>
    [...deliverableKeys.lists(), filters] as const,
  details: () => [...deliverableKeys.all, "detail"] as const,
  detail: (id: string) => [...deliverableKeys.details(), id] as const,
};

export const useDeliverables = (filters?: IDeliverableFilters) => {
  return useQuery({
    queryKey: deliverableKeys.list(filters),
    queryFn: () => deliverableService.getAll(filters),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useDeliverable = (id: string) => {
  return useQuery({
    queryKey: deliverableKeys.detail(id),
    queryFn: () => deliverableService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDeliverable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateDeliverableDto) =>
      deliverableService.create(data),
    onSuccess: (response) => {
      toast.success(
        response.message || "El entregable se ha creado correctamente"
      );
      queryClient.invalidateQueries({ queryKey: deliverableKeys.lists() });
      // Invalidar también las queries de entregables por servicio que usa ContractFormStep2
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "engagements" && 
                 query.queryKey[1] === "deliverables";
        }
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(
        error.response?.data?.message || "Ha ocurrido un error inesperado"
      );
    },
  });
};

export const useUpdateDeliverable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateDeliverableDto }) =>
      deliverableService.update(id, data),
    onSuccess: (response, { id }) => {
      toast.success(
        response.message || "El entregable se ha actualizado correctamente"
      );
      queryClient.invalidateQueries({ queryKey: deliverableKeys.lists() });
      queryClient.invalidateQueries({ queryKey: deliverableKeys.detail(id) });
      // Invalidar también las queries de entregables por servicio que usa ContractFormStep2
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "engagements" && 
                 query.queryKey[1] === "deliverables";
        }
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(
        error.response?.data?.message || "Ha ocurrido un error inesperado"
      );
    },
  });
};

export const useDeleteDeliverable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deliverableService.delete(id),
    onSuccess: (response) => {
      toast.success(
        response.message || "El entregable se ha eliminado correctamente"
      );
      queryClient.invalidateQueries({ queryKey: deliverableKeys.lists() });
      // Invalidar también las queries de entregables por servicio que usa ContractFormStep2
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "engagements" && 
                 query.queryKey[1] === "deliverables";
        }
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(
        error.response?.data?.message || "Ha ocurrido un error inesperado"
      );
    },
  });
};

// Actualizado para traer TODOS los servicios con un límite alto
export const useAllServicesForSelect = () => {
  return useQuery({
    queryKey: ["all-services-for-select"],
    queryFn: () => engagementService.getServices({ limit: 100 }), // Límite alto para traer todos
    staleTime: 10 * 60 * 1000,
    select: (data) => {
      // Transformar los datos para el SearchableSelect
      return data.data.map(service => ({
        value: service.id,
        label: `${service.name} - $${service.basePrice}`,
        disabled: !service.isActive // Los inactivos aparecen pero deshabilitados
      }));
    }
  });
};

// Mantener el hook original para compatibilidad
export const useServicesForSelect = () => {
  return useQuery({
    queryKey: ["services-for-select"],
    queryFn: () => engagementService.getServices({ isActive: true }),
    staleTime: 10 * 60 * 1000,
  });
};
