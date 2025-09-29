import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { researchClientsService } from '../services/research-clients.service';
import type { 
  IResearchClientFilters, 
  ICreateResearchClientDto, 
  IUpdateResearchClientDto 
} from '../types/research-clients.types';

// Interfaces para estadísticas
interface IResearchClientStats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  thisMonthClients: number;
}

// Query keys
export const RESEARCH_CLIENTS_QUERY_KEYS = {
  researchClients: ['research-clients'] as const,
  researchClientsWithFilters: (filters: Partial<IResearchClientFilters>) => 
    ['research-clients', filters] as const,
  researchClient: (id: string) => ['research-clients', id] as const,
  researchClientsStats: ['research-clients', 'stats'] as const,
};

// Hook para obtener estadísticas de clientes
export const useResearchClientsStats = () => {
  return useQuery({
    queryKey: RESEARCH_CLIENTS_QUERY_KEYS.researchClientsStats,
    queryFn: async (): Promise<IResearchClientStats> => {
      // Obtener todos los clientes para calcular estadísticas
      const response = await researchClientsService.getResearchClients({
        limit: 1000, // Límite alto para obtener todos
      });
      
      const clients = response.data;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      return {
        totalClients: clients.length,
        activeClients: clients.filter(c => c.isActive).length,
        inactiveClients: clients.filter(c => !c.isActive).length,
        thisMonthClients: clients.filter(c => 
          new Date(c.createdAt) >= startOfMonth
        ).length,
      };
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener clientes de investigación con filtros
export const useResearchClients = (filters: Partial<IResearchClientFilters> = {}) => {
  return useQuery({
    queryKey: RESEARCH_CLIENTS_QUERY_KEYS.researchClientsWithFilters(filters),
    queryFn: () => researchClientsService.getResearchClients(filters),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener un cliente por ID
export const useResearchClient = (id: string) => {
  return useQuery({
    queryKey: RESEARCH_CLIENTS_QUERY_KEYS.researchClient(id),
    queryFn: () => researchClientsService.getResearchClientById(id),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para crear cliente de investigación
export const useCreateResearchClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateResearchClientDto) => 
      researchClientsService.createResearchClient(data),
    onSuccess: () => {
      toast.success('Cliente de investigación creado exitosamente');
      // Invalidar todas las queries de research-clients (incluye las filtradas)
      queryClient.invalidateQueries({ queryKey: ['research-clients'] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error('Error creating research client:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '';
      
      // Detectar diferentes tipos de errores
      if (errorMessage.toLowerCase().includes('email') && 
          errorMessage.toLowerCase().includes('exist')) {
        toast.error('❌ Este email ya está registrado en el sistema');
      } else if (errorMessage.toLowerCase().includes('validation') ||
                 errorMessage.toLowerCase().includes('required') ||
                 errorMessage.toLowerCase().includes('invalid')) {
        toast.error('❌ Datos inválidos: Verifica que todos los campos estén correctos');
      } else if (errorMessage.toLowerCase().includes('document') &&
                 errorMessage.toLowerCase().includes('exist')) {
        toast.error('❌ Este número de documento ya está registrado');
      } else {
        toast.error(errorMessage || 'Error al crear el cliente. Intenta nuevamente.');
      }
    },
  });
};

// Hook para actualizar cliente de investigación
export const useUpdateResearchClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateResearchClientDto }) => {
      return researchClientsService.updateResearchClient(id, data);
    },
    onSuccess: () => {
      toast.success('Cliente de investigación actualizado exitosamente');
      // Invalidar todas las queries de research-clients (incluye las filtradas)
      queryClient.invalidateQueries({ queryKey: ['research-clients'] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error('Error updating research client:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '';
      
      // Detectar diferentes tipos de errores
      if (errorMessage.toLowerCase().includes('email') && 
          errorMessage.toLowerCase().includes('exist')) {
        toast.error('❌ Este email ya está registrado por otro usuario');
      } else if (errorMessage.toLowerCase().includes('validation') ||
                 errorMessage.toLowerCase().includes('required') ||
                 errorMessage.toLowerCase().includes('invalid')) {
        toast.error('❌ Datos inválidos: Verifica que todos los campos estén correctos');
      } else if (errorMessage.toLowerCase().includes('not found') ||
                 errorMessage.toLowerCase().includes('no encontrado')) {
        toast.error('❌ Cliente no encontrado');
      } else if (errorMessage.toLowerCase().includes('document') &&
                 errorMessage.toLowerCase().includes('exist')) {
        toast.error('❌ Este número de documento ya está registrado');
      } else {
        toast.error(errorMessage || 'Error al actualizar el cliente. Intenta nuevamente.');
      }
    },
  });
};

// Hook para eliminar cliente de investigación
export const useDeleteResearchClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => researchClientsService.deleteResearchClient(id),
    onSuccess: () => {
      toast.success('Cliente de investigación eliminado correctamente');
      // Invalidar todas las queries de research-clients (incluye las filtradas)
      queryClient.invalidateQueries({ queryKey: ['research-clients'] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error('Error deleting research client:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '';
      
      if (errorMessage.toLowerCase().includes('not found')) {
        toast.error('❌ Cliente no encontrado');
      } else if (errorMessage.toLowerCase().includes('constraint') ||
                 errorMessage.toLowerCase().includes('referenced')) {
        toast.error('❌ No se puede eliminar: El cliente tiene registros asociados');
      } else {
        toast.error(errorMessage || 'Error al eliminar el cliente');
      }
    },
  });
};