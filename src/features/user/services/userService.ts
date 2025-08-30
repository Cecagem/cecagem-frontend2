import { UserFormData, User } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BASE_BACKEND || process.env.URL_BASE_BACKEND;

if (!API_BASE_URL) {
  throw new Error("URL_BASE_BACKEND environment variable is not defined");
}

export class UserService {
  private static baseUrl = `${API_BASE_URL}/api/v1/users`;

  // Crear usuario completo - Método principal
  static async createUser(userData: UserFormData): Promise<User> {
    const response = await fetch(`${this.baseUrl}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Obtener todos los usuarios - Método principal
  static async getUsers(): Promise<User[]> {
    const response = await fetch(this.baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Métodos preparados para futuro desarrollo

  // Obtener usuario por ID
  static async getUserById(id: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Actualizar usuario
  static async updateUser(id: string, userData: Partial<UserFormData>): Promise<User> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Eliminar usuario
  static async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `Error ${response.status}: ${response.statusText}`);
    }
  }

  // Buscar usuarios con filtros
  static async searchUsers(filters: {
    search?: string;
    role?: string;
    status?: string;
  }): Promise<User[]> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append("search", filters.search);
    if (filters.role) params.append("role", filters.role);
    if (filters.status) params.append("status", filters.status);

    const url = params.toString() ? `${this.baseUrl}/search?${params}` : `${this.baseUrl}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
