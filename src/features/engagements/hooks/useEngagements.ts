import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { engagementService } from "../services/engagements.service";
import type {
  ServiceFilters,
  ServicesResponse,
  ServiceResponse,
  DeleteServiceResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
  DeliverablesResponse,
} from "../types/engagements.type";

import { useToast } from "@/hooks/use-toast";

export const engagementKeys = {
  all: ["engagements"] as const,
  lists: () => [...engagementKeys.all, "list"] as const,
  list: (filters?: Partial<ServiceFilters>) =>
    [...engagementKeys.lists(), filters] as const,
  details: () => [...engagementKeys.all, "detail"] as const,
  detail: (id: string) => [...engagementKeys.details(), id] as const,
  deliverables: () => [...engagementKeys.all, "deliverables"] as const,
  deliverablesList: (serviceId: string) =>
    [...engagementKeys.deliverables(), serviceId] as const,
} as const;

export const useServices = (filters?: Partial<ServiceFilters>) => {
  return useQuery<ServicesResponse, Error>({
    queryKey: engagementKeys.list(filters),
    queryFn: () => engagementService.getServices(filters),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useServiceById = (serviceId: string) => {
  return useQuery<ServiceResponse, Error>({
    queryKey: engagementKeys.detail(serviceId),
    queryFn: () => engagementService.getServiceById(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation<ServiceResponse, Error, CreateServiceRequest>({
    mutationFn: engagementService.createService,
    onSuccess: () => {
      showSuccess("created", {
        title: "Servicio creado",
        description: `El servicio  ha sido creado exitosamente.`,
      });
      queryClient.invalidateQueries({ queryKey: engagementKeys.lists() });
      // Invalidar también las queries que usa el SearchableSelect en entregables
      queryClient.invalidateQueries({ queryKey: ["all-services-for-select"] });
      queryClient.invalidateQueries({ queryKey: ["services-for-select"] });
    },
    onError: (error) => {
      console.error("Error creating service:", error);
      showError("error", {
        title: "Error creando servicio",
        description: `No se pudo crear el servicio: ${error.message}`,
      });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceResponse,
    Error,
    { serviceId: string; serviceData: UpdateServiceRequest }
  >({
    mutationFn: ({ serviceId, serviceData }) =>
      engagementService.updateService(serviceId, serviceData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: engagementKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: engagementKeys.detail(variables.serviceId),
      });
      // Invalidar también las queries que usa el SearchableSelect en entregables
      queryClient.invalidateQueries({ queryKey: ["all-services-for-select"] });
      queryClient.invalidateQueries({ queryKey: ["services-for-select"] });
    },
    onError: (error) => {
      console.error("Error updating service:", error);
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteServiceResponse, Error, string>({
    mutationFn: engagementService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: engagementKeys.lists() });
      // Invalidar también las queries que usa el SearchableSelect en entregables
      queryClient.invalidateQueries({ queryKey: ["all-services-for-select"] });
      queryClient.invalidateQueries({ queryKey: ["services-for-select"] });
    },
    onError: (error) => {
      console.error("Error deleting service:", error);
    },
  });
};

export const useRefreshServices = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: engagementKeys.lists() });
  };
};

export const useDeliverablesByService = (serviceId: string) => {
  return useQuery<DeliverablesResponse, Error>({
    queryKey: engagementKeys.deliverablesList(serviceId),
    queryFn: () => engagementService.getDeliverablesByServiceId(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
