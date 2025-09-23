"use client";

import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUsers } from '../hooks/use-users';
import { UserFilters } from './UserFilters';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { UserStatsCards } from './UserStatsCards';
import type { 
  IUser, 
  IUserFilters
} from '../types/user.types';

export function MainUsers() {
  // Estado para filtros y paginación
  const [filters, setFilters] = useState<Partial<IUserFilters>>({
    page: 1,
    limit: 10,
    type: 'users_system', // Siempre filtrar por usuarios del sistema
  });

  // Estado para modales
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // Obtener datos
  const { 
    data: usersData, 
    isLoading, 
    error, 
    refetch 
  } = useUsers(filters);

  // Obtener estadísticas (no se usan directamente, UserStatsCards tiene su propio hook)
  // const { 
  //   data: stats, 
  //   isLoading: isLoadingStats 
  // } = useUsersStats();

  const users = usersData?.data || [];
  const meta = usersData ? {
    page: usersData.page,
    limit: usersData.limit,
    total: usersData.total,
    totalPages: usersData.totalPages
  } : undefined;

  // Handlers para filtros
  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      type: 'users_system',
    });
  }, []);

  // Handlers para modales
  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowCreateForm(true);
  };

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setShowEditForm(true);
  };

  const handleUserSaved = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setSelectedUser(null);
    refetch();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuarios del Sistema</h1>
            <p className="text-muted-foreground">
              Gestiona los usuarios del sistema y sus permisos
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error al cargar los usuarios del sistema
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios del Sistema</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios del sistema y sus permisos
          </p>
        </div>
        
        <Button 
          className="text-white w-full sm:w-auto"
          onClick={handleCreateUser}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Statistics Cards */}
      <UserStatsCards />

      {/* Filtros */}
      <UserFilters
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1, // Reset página al cambiar filtros
            type: 'users_system', // Mantener siempre el tipo
          }));
        }}
        onClearFilters={handleClearFilters}
      />

      {/* Tabla */}
      <UserTable
        users={users}
        isLoading={isLoading}
        onEditUser={handleEditUser}
      />

      {/* Paginación */}
      {meta && meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {((meta.page - 1) * meta.limit) + 1} a{' '}
            {Math.min(meta.page * meta.limit, meta.total)} de {meta.total} usuarios
          </div>
        </div>
      )}

      {/* Formulario de creación */}
      <UserForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onUserSaved={handleUserSaved}
        user={selectedUser}
        mode="create"
      />

      {/* Formulario de edición */}
      <UserForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onUserSaved={handleUserSaved}
        user={selectedUser}
        mode="edit"
      />
    </div>
  );
}