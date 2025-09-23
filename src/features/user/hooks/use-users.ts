import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '../services/user.service';
import type { 
  IUserFilters, 
  ICreateUserDto, 
  IUpdateUserDto,
  IUserStats
} from '../types/user.types';

// Query keys
export const USER_QUERY_KEYS = {
  users: ['users'] as const,
  usersWithFilters: (filters: Partial<IUserFilters>) => 
    ['users', filters] as const,
  user: (id: string) => ['users', id] as const,
  usersStats: ['users', 'stats'] as const,
};

// Hook para obtener estadísticas de usuarios
export const useUsersStats = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.usersStats,
    queryFn: async (): Promise<IUserStats> => {
      // Obtener todos los usuarios para calcular estadísticas
      const response = await userService.getUsers({
        limit: 1000, // Límite alto para obtener todos
      });
      
      const users = response.data;
      
      // Calcular salarios solo de usuarios que requieren contrato
      const usersWithSalary = users.filter(user => 
        user.profile.salaryMonth && user.profile.salaryMonth > 0
      );
      
      const totalSalaries = usersWithSalary.reduce((sum, user) => 
        sum + (user.profile.salaryMonth || 0), 0
      );
      
      const averageSalary = usersWithSalary.length > 0 
        ? totalSalaries / usersWithSalary.length 
        : 0;
      
      return {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
        totalSalaries,
        averageSalary,
      };
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener usuarios con filtros
export const useUsers = (filters: Partial<IUserFilters> = {}) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.usersWithFilters(filters),
    queryFn: () => userService.getUsers(filters),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 segundos
  });
};

// Hook para obtener un usuario por ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.user(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para crear usuario
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateUserDto) => userService.createUser(data),
    onSuccess: (newUser) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.usersStats });

      // Verificar que el usuario tenga la estructura correcta antes de acceder al profile
      const userName = newUser?.profile?.firstName && newUser?.profile?.lastName 
        ? `${newUser.profile.firstName} ${newUser.profile.lastName}`
        : 'Usuario';

      toast.success('Usuario creado correctamente', {
        description: `${userName} ha sido registrado.`
      });
    },
    onError: (error: Error) => {
      console.error('Error al crear usuario:', error);
      const message = error?.message || 'Error al crear el usuario';
      toast.error('Error al crear usuario', {
        description: message
      });
    },
  });
};

// Hook para actualizar usuario
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateUserDto }) => 
      userService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.user(updatedUser.id) });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.usersStats });

      // Verificar que el usuario tenga la estructura correcta antes de acceder al profile
      const userName = updatedUser?.profile?.firstName && updatedUser?.profile?.lastName 
        ? `${updatedUser.profile.firstName} ${updatedUser.profile.lastName}`
        : 'Usuario';

      toast.success('Usuario actualizado correctamente', {
        description: `Los datos de ${userName} han sido actualizados.`
      });
    },
    onError: (error: Error) => {
      console.error('Error al actualizar usuario:', error);
      const message = error?.message || 'Error al actualizar el usuario';
      toast.error('Error al actualizar usuario', {
        description: message
      });
    },
  });
};

// Hook para eliminar usuario
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.usersStats });

      toast.success('Usuario eliminado correctamente', {
        description: 'El usuario ha sido eliminado del sistema.'
      });
    },
    onError: (error: Error) => {
      console.error('Error al eliminar usuario:', error);
      const message = error?.message || 'Error al eliminar el usuario';
      toast.error('Error al eliminar usuario', {
        description: message
      });
    },
  });
};

// Hook para validar email
export const useValidateEmail = (email: string, excludeId?: string) => {
  return useQuery({
    queryKey: ['validate-email', email, excludeId],
    queryFn: () => userService.validateEmail(email, excludeId),
    enabled: !!email && email.includes('@'),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 10000, // 10 segundos
  });
};

// Hook helper para invalidar todas las queries de usuarios
export const useInvalidateUsers = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.usersStats });
  };
};