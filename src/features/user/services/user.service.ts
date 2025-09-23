import { cecagemApi } from "@/lib/api-client";
import type { 
  IUser,
  IUserResponse,
  IUserFilters,
  ICreateUserDto,
  IUpdateUserDto
} from "../types/user.types";

const ENDPOINTS = {
  users: "/users",
  userComplete: "/users/complete",
  user: (id: string) => `/users/${id}`,
  userProfile: (id: string) => `/users/${id}/profile`,
  userCompleteUpdate: (id: string) => `/users/${id}/complete`,
};

export const userService = {
  // Obtener usuarios con filtros
  async getUsers(filters: Partial<IUserFilters> = {}): Promise<IUserResponse> {
    const params = new URLSearchParams();
    
    // Parámetros obligatorios para el endpoint específico
    params.append("type", "users_system");
    params.append("page", (filters.page || 1).toString());
    params.append("limit", (filters.limit || 10).toString());
    
    // Filtros opcionales
    if (filters.search) params.append("search", filters.search);
    if (filters.role) params.append("role", filters.role);
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());

    console.log('🔍 Obteniendo usuarios del sistema:', `${ENDPOINTS.users}?${params.toString()}`);
    
    return await cecagemApi.get<IUserResponse>(
      `${ENDPOINTS.users}?${params.toString()}`
    );
  },

  // Obtener usuario por ID
  async getUserById(id: string): Promise<IUser> {
    console.log('👤 Obteniendo usuario por ID:', id);
    return await cecagemApi.get<IUser>(ENDPOINTS.user(id));
  },

  // Crear nuevo usuario
  async createUser(data: ICreateUserDto): Promise<IUser> {
    console.log('➕ Creando usuario:', data);
    try {
      const result = await cecagemApi.post<IUser>(
        ENDPOINTS.userComplete, 
        data as unknown as Record<string, unknown>
      );
      console.log('✅ Usuario creado correctamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      throw error;
    }
  },

  // Actualizar datos de usuario (email, role, isActive)
  async updateUserData(id: string, data: {
    email?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<IUser> {
    console.log('📝 Actualizando datos de usuario:', { id, data });
    try {
      const result = await cecagemApi.patch<IUser>(
        ENDPOINTS.user(id), 
        data as unknown as Record<string, unknown>
      );
      console.log('✅ Datos de usuario actualizados correctamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al actualizar datos de usuario:', error);
      throw error;
    }
  },

  // Actualizar perfil de usuario
  async updateUserProfile(id: string, profileData: {
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
  }): Promise<IUser> {
    console.log('📝 Actualizando perfil de usuario:', { id, profileData });
    try {
      const result = await cecagemApi.patch<IUser>(
        ENDPOINTS.userProfile(id), 
        profileData as unknown as Record<string, unknown>
      );
      console.log('✅ Perfil actualizado correctamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      throw error;
    }
  },

  // Actualizar usuario completo
  async updateUser(id: string, data: IUpdateUserDto): Promise<IUser> {
    console.log('📝 Actualizando usuario completo:', { id, data });
    try {
      // Usar el endpoint completo para actualizar todo de una vez
      const result = await cecagemApi.patch<IUser>(
        ENDPOINTS.userCompleteUpdate(id), 
        data as unknown as Record<string, unknown>
      );
      
      console.log('✅ Usuario actualizado correctamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al actualizar usuario completo:', error);
      throw error;
    }
  },

  // Eliminar usuario
  async deleteUser(id: string): Promise<void> {
    console.log('🗑️ Eliminando usuario:', id);
    try {
      await cecagemApi.delete(ENDPOINTS.user(id));
      console.log('✅ Usuario eliminado correctamente');
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      throw error;
    }
  },

  // Validar disponibilidad de email
  async validateEmail(email: string, excludeId?: string): Promise<{ available: boolean }> {
    const params = new URLSearchParams();
    params.append("email", email);
    if (excludeId) params.append("excludeId", excludeId);

    console.log('✉️ Validando disponibilidad de email:', email);
    try {
      const result = await cecagemApi.get<{ available: boolean }>(
        `/users/validate-email?${params.toString()}`
      );
      console.log('✅ Validación de email:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al validar email:', error);
      return { available: false };
    }
  }
};