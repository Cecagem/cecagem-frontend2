import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { accountingClientsService } from '../services/accounting-clients.service';
import type { 
  ICompanyFilters, 
  ICreateCompanyDto, 
  IUpdateCompanyDto,
  ICollaboratorOption
} from '../types/accounting-clients.types';

// Interfaces para estadísticas
interface ICompanyStats {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  thisMonthCompanies: number;
  totalRevenue: number;
}

// Query keys
export const ACCOUNTING_CLIENTS_QUERY_KEYS = {
  companies: ['accounting-clients'] as const,
  companiesWithFilters: (filters: Partial<ICompanyFilters>) => 
    ['accounting-clients', filters] as const,
  company: (id: string) => ['accounting-clients', id] as const,
  companiesStats: ['accounting-clients', 'stats'] as const,
  collaborators: ['collaborators'] as const,
  collaboratorsWithSearch: (search?: string) => 
    ['collaborators', search] as const,
};

// Hook para obtener estadísticas de empresas
export const useCompaniesStats = () => {
  return useQuery({
    queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companiesStats,
    queryFn: async (): Promise<ICompanyStats> => {
      // Obtener todas las empresas para calcular estadísticas
      const response = await accountingClientsService.getCompanies({
        limit: 1000, // Límite alto para obtener todas
      });
      
      const companies = response.data;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Calcular ingresos totales sumando monthlyPayment de todas las relaciones activas
      const totalRevenue = companies.reduce((acc, company) => {
        const activeRelations = company.contract.filter(relation => relation.isActive);
        const companyRevenue = activeRelations.reduce((sum, relation) => sum + relation.monthlyPayment, 0);
        return acc + companyRevenue;
      }, 0);
      
      return {
        totalCompanies: companies.length,
        activeCompanies: companies.filter(c => c.isActive).length,
        inactiveCompanies: companies.filter(c => !c.isActive).length,
        thisMonthCompanies: companies.filter(c => 
          new Date(c.createdAt) >= startOfMonth
        ).length,
        totalRevenue,
      };
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener empresas con filtros
export const useCompanies = (filters: Partial<ICompanyFilters> = {}) => {
  return useQuery({
    queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companiesWithFilters(filters),
    queryFn: () => accountingClientsService.getCompanies(filters),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener una empresa por ID
export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.company(id),
    queryFn: () => accountingClientsService.getCompanyById(id),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener colaboradores internos (para el select)
export const useCollaborators = (search?: string) => {
  return useQuery({
    queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.collaboratorsWithSearch(search),
    queryFn: () => accountingClientsService.getCollaborators({ 
      search,
      limit: 100 // Límite alto para el select
    }),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para crear empresa
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateCompanyDto) => 
      accountingClientsService.createCompany(data),
    onSuccess: () => {
      toast.success('✅ Empresa creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companies });
      queryClient.invalidateQueries({ queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companiesStats });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error('Error creating company:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '';
      
      // Detectar diferentes tipos de errores
      if (errorMessage.toLowerCase().includes('ruc') && 
          errorMessage.toLowerCase().includes('exist')) {
        toast.error('❌ Este RUC ya está registrado en el sistema');
      } else if (errorMessage.toLowerCase().includes('email') && 
                 errorMessage.toLowerCase().includes('exist')) {
        toast.error('❌ Este email de contacto ya está registrado');
      } else if (errorMessage.toLowerCase().includes('validation') ||
                 errorMessage.toLowerCase().includes('required') ||
                 errorMessage.toLowerCase().includes('invalid')) {
        toast.error('❌ Datos inválidos: Verifica que todos los campos estén correctos');
      } else if (errorMessage.toLowerCase().includes('user') &&
                 errorMessage.toLowerCase().includes('not found')) {
        toast.error('❌ El colaborador seleccionado no existe');
      } else {
        toast.error('❌ Error al crear la empresa: ' + errorMessage);
      }
    },
  });
};

// Hook para actualizar empresa
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCompanyDto }) => 
      accountingClientsService.updateCompany(id, data),
    onSuccess: () => {
      toast.success('✅ Empresa actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companies });
      queryClient.invalidateQueries({ queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companiesStats });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error('Error updating company:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '';
      
      if (errorMessage.toLowerCase().includes('not found')) {
        toast.error('❌ Empresa no encontrada');
      } else if (errorMessage.toLowerCase().includes('ruc') && 
                 errorMessage.toLowerCase().includes('exist')) {
        toast.error('❌ Este RUC ya está registrado por otra empresa');
      } else {
        toast.error('❌ Error al actualizar la empresa: ' + errorMessage);
      }
    },
  });
};

// Hook para eliminar empresa
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountingClientsService.deleteCompany(id),
    onSuccess: () => {
      toast.success('✅ Empresa eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companies });
      queryClient.invalidateQueries({ queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companiesStats });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error('Error deleting company:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '';
      
      if (errorMessage.toLowerCase().includes('not found')) {
        toast.error('❌ Empresa no encontrada');
      } else if (errorMessage.toLowerCase().includes('relation') ||
                 errorMessage.toLowerCase().includes('dependency')) {
        toast.error('❌ No se puede eliminar: La empresa tiene relaciones activas');
      } else {
        toast.error('❌ Error al eliminar la empresa: ' + errorMessage);
      }
    },
  });
};

// Utility hook para convertir colaboradores a opciones del select
export const useCollaboratorOptions = (search?: string): {
  options: ICollaboratorOption[];
  isLoading: boolean;
  error: Error | null;
} => {
  const { data, isLoading, error } = useCollaborators(search);
  
  const options: ICollaboratorOption[] = data?.data?.map((collaborator) => ({
    value: collaborator.id,
    label: `${collaborator.profile.documentNumber} - ${collaborator.profile.firstName} ${collaborator.profile.lastName}`,
    email: collaborator.email,
  })) || [];

  return {
    options,
    isLoading,
    error: error as Error | null,
  };
};

// Hook para actualizar pagos
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: string; data: { status: string } }) => 
      accountingClientsService.updatePayment(paymentId, data),
    onSuccess: async (response: { status: string; id: string }) => {
      // Invalidar todas las queries de empresas para refrescar la lista principal
      await queryClient.invalidateQueries({ queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companies });
      
      // Refrescar los datos inmediatamente para actualización en tiempo real
      await queryClient.refetchQueries({ 
        queryKey: ACCOUNTING_CLIENTS_QUERY_KEYS.companies,
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