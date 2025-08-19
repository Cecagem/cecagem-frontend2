"use client";

import { useState, useEffect, useCallback } from "react";
import { User, UserStats, SearchFilters, UserRole, UserStatus } from "../types";

// Datos de ejemplo (simulación de API)
const mockUsers: User[] = [
  {
    id: "1",
    nombres: "Juan Carlos",
    apellidos: "Pérez López",
    telefono: "3001234567",
    correo: "juan.perez@example.com",
    rol: UserRole.ADMIN,
    estado: UserStatus.ACTIVE,
    fechaCreacion: new Date("2024-01-15"),
    fechaModificacion: new Date("2024-08-01"),
  },
  {
    id: "2",
    nombres: "María Elena",
    apellidos: "González Silva",
    telefono: "3109876543",
    correo: "maria.gonzalez@example.com",
    rol: UserRole.USER,
    estado: UserStatus.ACTIVE,
    fechaCreacion: new Date("2024-02-20"),
    fechaModificacion: new Date("2024-07-15"),
  },
  {
    id: "3",
    nombres: "Carlos Alberto",
    apellidos: "Ramírez Torres",
    telefono: "3205551234",
    correo: "carlos.ramirez@example.com",
    rol: UserRole.MODERATOR,
    estado: UserStatus.INACTIVE,
    fechaCreacion: new Date("2024-03-10"),
    fechaModificacion: new Date("2024-06-20"),
  },
  {
    id: "4",
    nombres: "Ana Sofía",
    apellidos: "Martínez Ruiz",
    telefono: "3156667890",
    correo: "ana.martinez@example.com",
    rol: UserRole.USER,
    estado: UserStatus.ACTIVE,
    fechaCreacion: new Date("2024-04-05"),
    fechaModificacion: new Date("2024-08-10"),
  },
];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  // Simular carga inicial de datos
  useEffect(() => {
    setIsLoading(true);
    // Simular delay de API
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let filtered = [...users];

    // Filtrar por búsqueda de texto
    if (searchFilters.search) {
      const searchTerm = searchFilters.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.nombres.toLowerCase().includes(searchTerm) ||
          user.apellidos.toLowerCase().includes(searchTerm) ||
          user.correo.toLowerCase().includes(searchTerm) ||
          user.telefono.includes(searchTerm)
      );
    }

    // Filtrar por rol
    if (searchFilters.rol) {
      filtered = filtered.filter((user) => user.rol === searchFilters.rol);
    }

    // Filtrar por estado
    if (searchFilters.estado) {
      filtered = filtered.filter((user) => user.estado === searchFilters.estado);
    }

    setFilteredUsers(filtered);
  }, [users, searchFilters]);

  // Calcular estadísticas
  const stats: UserStats = {
    total: users.length,
    activos: users.filter((user) => user.estado === UserStatus.ACTIVE).length,
    inactivos: users.filter((user) => user.estado === UserStatus.INACTIVE).length,
    admins: users.filter((user) => user.rol === UserRole.ADMIN).length,
    usuarios: users.filter((user) => user.rol === UserRole.USER).length,
    moderadores: users.filter((user) => user.rol === UserRole.MODERATOR).length,
  };

  // Crear usuario
  const createUser = useCallback(async (userData: Omit<User, "id" | "fechaCreacion" | "fechaModificacion">) => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        fechaCreacion: new Date(),
        fechaModificacion: new Date(),
      };

      setUsers((prev) => [...prev, newUser]);
      return { success: true, user: newUser };
    } catch {
      return { success: false, error: "Error al crear usuario" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar usuario
  const updateUser = useCallback(async (userId: string, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, ...userData, fechaModificacion: new Date() }
            : user
        )
      );
      return { success: true };
    } catch {
      return { success: false, error: "Error al actualizar usuario" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Eliminar usuario
  const deleteUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) => prev.filter((user) => user.id !== userId));
      return { success: true };
    } catch {
      return { success: false, error: "Error al eliminar usuario" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cambiar estado del usuario
  const toggleUserStatus = useCallback(async (userId: string, newStatus: UserStatus) => {
    return updateUser(userId, { estado: newStatus });
  }, [updateUser]);

  // Aplicar filtros
  const applyFilters = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchFilters({});
  }, []);

  return {
    users: filteredUsers,
    allUsers: users,
    stats,
    isLoading,
    searchFilters,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    applyFilters,
    clearFilters,
  };
};
