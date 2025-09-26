import { cecagemApi } from "@/lib/api-client";
import type { 
  IResearchClient,
  IResearchClientResponse,
  IResearchClientFilters,
  ICreateResearchClientDto,
  IUpdateResearchClientDto
} from "../types/research-clients.types";

const ENDPOINTS = {
  users: "/users",
  userComplete: "/users/complete",
  user: (id: string) => `/users/${id}`,
  userProfile: (id: string) => `/users/${id}/profile`,
};

export const researchClientsService = {
  // Obtener clientes de investigación con filtros
  async getResearchClients(filters: Partial<IResearchClientFilters> = {}): Promise<IResearchClientResponse> {
    const params = new URLSearchParams();
    
    // Siempre filtrar por tipo 'clients'
    params.append("type", "clients");
    
    // Parámetros de paginación
    params.append("page", (filters.page || 1).toString());
    params.append("limit", (filters.limit || 10).toString());
    
    // Filtros opcionales
    if (filters.search) params.append("search", filters.search);
    if (filters.role) params.append("role", filters.role);
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());
    
    return await cecagemApi.get<IResearchClientResponse>(
      `${ENDPOINTS.users}?${params.toString()}`
    );
  },

  // Obtener cliente por ID
  async getResearchClientById(id: string): Promise<IResearchClient> {
    return await cecagemApi.get<IResearchClient>(ENDPOINTS.user(id));
  },

  // Crear nuevo cliente de investigación
  async createResearchClient(data: ICreateResearchClientDto): Promise<IResearchClient> {
    try {
      const result = await cecagemApi.post<IResearchClient>(
        ENDPOINTS.userComplete, 
        data as unknown as Record<string, unknown>
      );
      return result;
    } catch (error) {
      console.error('❌ Error al crear cliente:', error);
      throw error;
    }
  },

  // Actualizar datos de usuario (email, password, role, isActive)
  async updateResearchClientUser(id: string, data: {
    email?: string;
    password?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<IResearchClient> {
    try {
      const result = await cecagemApi.patch<IResearchClient>(
        ENDPOINTS.user(id), 
        data as unknown as Record<string, unknown>
      );
      return result;
    } catch (error) {
      console.error('❌ Error al actualizar datos de usuario:', error);
      throw error;
    }
  },

  // Actualizar perfil de usuario (datos personales y académicos)
  async updateResearchClientProfile(id: string, data: {
    firstName?: string;
    lastName?: string;
    documentType?: string;
    documentNumber?: string;
    phone?: string;
    university?: string;
    faculty?: string;
    career?: string;
    academicDegree?: string;
    salaryMonth?: number;
    paymentDate?: string;
  }): Promise<IResearchClient> {
    try {
      const result = await cecagemApi.patch<IResearchClient>(
        ENDPOINTS.userProfile(id), 
        data as unknown as Record<string, unknown>
      );
      return result;
    } catch (error) {
      console.error('❌ Error al actualizar perfil de usuario:', error);
      throw error;
    }
  },

  // Actualizar cliente completo (usa ambas APIs secuencialmente)
  async updateResearchClient(id: string, data: IUpdateResearchClientDto): Promise<IResearchClient> {
    try {
      let result: IResearchClient | null = null;

      // Actualizar datos de usuario si existen
      if (data.user) {
        result = await this.updateResearchClientUser(id, data.user);
      }
      
      // Actualizar perfil si existen datos
      if (data.profile) {
        result = await this.updateResearchClientProfile(id, data.profile);
      }

      // Si no hay resultado, obtener el cliente actualizado
      if (!result) {
        result = await this.getResearchClientById(id);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error al actualizar cliente completo:', error);
      throw error;
    }
  },

  // Eliminar cliente de investigación
  async deleteResearchClient(id: string): Promise<void> {
    try {
      await cecagemApi.delete(ENDPOINTS.user(id));
    } catch (error) {
      console.error('❌ Error al eliminar cliente:', error);
      throw error;
    }
  },
};