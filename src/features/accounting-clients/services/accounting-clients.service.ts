import { cecagemApi } from "@/lib/api-client";
import type { 
  ICompany,
  ICompaniesResponse,
  ICompanyFilters,
  ICreateCompanyDto,
  IUpdateCompanyDto,
  ICollaboratorsResponse
} from "../types/accounting-clients.types";

const ENDPOINTS = {
  companies: "/companies",
  company: (id: string) => `/companies/${id}`,
  collaborators: "/users",
};

export const accountingClientsService = {
  // Obtener empresas con filtros
  async getCompanies(filters: Partial<ICompanyFilters> = {}): Promise<ICompaniesResponse> {
    const params = new URLSearchParams();
    
    // Parámetros de paginación
    params.append("page", (filters.page || 1).toString());
    params.append("limit", (filters.limit || 10).toString());
    
    // Filtros opcionales
    if (filters.search) params.append("search", filters.search);
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());
    if (filters.ruc) params.append("ruc", filters.ruc);
    if (filters.businessName) params.append("businessName", filters.businessName);
    if (filters.tradeName) params.append("tradeName", filters.tradeName);

    console.log('🏢 Obteniendo empresas:', `${ENDPOINTS.companies}?${params.toString()}`);
    
    return await cecagemApi.get<ICompaniesResponse>(
      `${ENDPOINTS.companies}?${params.toString()}`
    );
  },

  // Obtener empresa por ID
  async getCompanyById(id: string): Promise<ICompany> {
    console.log('🏢 Obteniendo empresa por ID:', id);
    return await cecagemApi.get<ICompany>(ENDPOINTS.company(id));
  },

  // Crear nueva empresa
  async createCompany(data: ICreateCompanyDto): Promise<ICompany> {
    console.log('➕ Creando empresa:', data);
    try {
      const result = await cecagemApi.post<ICompany>(
        ENDPOINTS.companies, 
        data as unknown as Record<string, unknown>
      );
      console.log('Empresa creada correctamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al crear empresa:', error);
      throw error;
    }
  },

  // Actualizar empresa
  async updateCompany(id: string, data: IUpdateCompanyDto): Promise<ICompany> {
    console.log('📝 Actualizando empresa:', { id, data });
    try {
      const result = await cecagemApi.patch<ICompany>(
        ENDPOINTS.company(id), 
        data as unknown as Record<string, unknown>
      );
      console.log('Empresa actualizada correctamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al actualizar empresa:', error);
      throw error;
    }
  },

  // Eliminar empresa
  async deleteCompany(id: string): Promise<void> {
    console.log('🗑️ Eliminando empresa:', id);
    try {
      await cecagemApi.delete(ENDPOINTS.company(id));
      console.log('Empresa eliminada correctamente');
    } catch (error) {
      console.error('❌ Error al eliminar empresa:', error);
      throw error;
    }
  },

  // Obtener colaboradores internos para el select
  async getCollaborators(filters: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<ICollaboratorsResponse> {
    const params = new URLSearchParams();
    
    // Filtros fijos para colaboradores internos
    params.append("role", "COLLABORATOR_INTERNAL");
    params.append("type", "users_system");
    
    // Parámetros de paginación
    params.append("page", (filters.page || 1).toString());
    params.append("limit", (filters.limit || 50).toString()); // Límite más alto para el select
    
    // Búsqueda opcional
    if (filters.search) params.append("search", filters.search);

    console.log('👥 Obteniendo colaboradores internos:', `${ENDPOINTS.collaborators}?${params.toString()}`);
    
    return await cecagemApi.get<ICollaboratorsResponse>(
      `${ENDPOINTS.collaborators}?${params.toString()}`
    );
  },
};