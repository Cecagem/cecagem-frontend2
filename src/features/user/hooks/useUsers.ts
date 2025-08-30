import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserService } from "../services";
import { 
  User, 
  UserStats, 
  SearchFilters, 
  UserFormData,
  UserRole,
} from "../types";

// Query keys
const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (filters: SearchFilters) => [...userQueryKeys.lists(), filters] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

export function useUsers() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<SearchFilters>({});

  // Query principal para obtener usuarios
  const { 
    data: users = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: userQueryKeys.list(filters),
    queryFn: () => {
      if (Object.keys(filters).length > 0) {
        return UserService.searchUsers({
          search: filters.search,
          role: filters.role,
          status: filters.status,
        });
      }
      return UserService.getUsers();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutation principal para crear usuario
  const createUserMutation = useMutation({
    mutationFn: (userData: UserFormData) => UserService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });

  // Mutations preparadas para desarrollo futuro
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<UserFormData> }) => 
      UserService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });

  // Calcular estadísticas basadas en los nuevos roles
  const calculateStats = (users: User[]): UserStats => {
    const stats: UserStats = {
      total: users.length,
      active: 0,
      inactive: 0,
      newThisMonth: 0,
      byRole: {
        superAdmin: 0,
        admin: 0,
        collaboratorExternal: 0,
        collaboratorInternal: 0,
        rrhh: 0,
      },
    };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    users.forEach((user) => {
      // Contar por estado
      if (user.isActive) {
        stats.active++;
      } else {
        stats.inactive++;
      }

      // Contar nuevos este mes
      const createdDate = new Date(user.createdAt);
      if (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      ) {
        stats.newThisMonth++;
      }

      // Contar por rol
      switch (user.role) {
        case UserRole.SUPER_ADMIN:
          stats.byRole.superAdmin++;
          break;
        case UserRole.ADMIN:
          stats.byRole.admin++;
          break;
        case UserRole.COLLABORATOR_EXTERNAL:
          stats.byRole.collaboratorExternal++;
          break;
        case UserRole.COLLABORATOR_INTERNAL:
          stats.byRole.collaboratorInternal++;
          break;
        case UserRole.RRHH:
          stats.byRole.rrhh++;
          break;
      }
    });

    return stats;
  };

  const stats = calculateStats(users);

  // Función principal para crear usuario
  const createUser = async (userData: UserFormData) => {
    return createUserMutation.mutateAsync(userData);
  };

  // Funciones preparadas para desarrollo futuro
  const updateUser = async (id: string, userData: Partial<UserFormData>) => {
    return updateUserMutation.mutateAsync({ id, userData });
  };

  const deleteUser = async (id: string) => {
    return deleteUserMutation.mutateAsync(id);
  };

  const applyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    // Datos principales
    users,
    stats,
    isLoading: isLoading || createUserMutation.isPending || updateUserMutation.isPending || deleteUserMutation.isPending,
    error,
    filters,
    
    // Funciones principales
    createUser,
    
    // Funciones preparadas para futuro desarrollo
    updateUser,
    deleteUser,
    applyFilters,
    clearFilters,
    refetch,
    
    // Estados de las mutaciones
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
}