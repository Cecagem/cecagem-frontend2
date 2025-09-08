"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import UserFilters from "./UserFilters";
import { UserTable } from "./UserTable";
import { UserForm } from "./UserForm";
import {
  UserStatsCards,
  User,
  UserFilters as UserFiltersType,
  CreateCompleteUserRequest,
  UpdateCompleteUserRequest,
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/features/user";

export const MainUsers = () => {
  const [filters, setFilters] = useState<Partial<UserFiltersType>>({
    page: 1,
    limit: 5,
    type: "users_system",
  });

  const userStats = {
    total: 100,
    active: 12,
    inactive: 2,
    newThisMonth: 5,
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);

  const { showSuccess, showError } = useToast();

  const { data: usersResponse, isLoading } = useUsers(filters);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const applyFilters = useCallback((newFilters: Partial<UserFiltersType>) => {
    setFilters((prev: Partial<UserFiltersType>) => {
      const newState = {
        ...prev,
        ...newFilters,
        page: 1,
      };
      return newState;
    });
  }, []);

  const handlePaginationChange = useCallback(
    (newFilters: Partial<UserFiltersType>) => {
      setFilters((prev: Partial<UserFiltersType>) => {
        const newState = {
          ...prev,
          ...newFilters,
        };
        return newState;
      });
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({ page: 1, limit: 5, type: "users_system" });
  }, []);

  const handleCreateUser = useCallback(() => {
    setSelectedUser(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    setUserToDelete(user);
  }, []);

  const handleFormSubmit = useCallback(
    async (userData: CreateCompleteUserRequest) => {
      try {
        if (selectedUser) {
          const updateData: UpdateCompleteUserRequest = {
            user: userData.user,
            profile: userData.profile,
            company: userData.company,
          };
          await updateUserMutation.mutateAsync({
            userId: selectedUser.id,
            data: updateData,
          });
          showSuccess("updated", {
            title: "¡Usuario actualizado exitosamente!",
          });
        } else {
          await createUserMutation.mutateAsync(userData);
          showSuccess("created", {
            title: "¡Usuario creado exitosamente!",
          });
        }
        setIsFormOpen(false);
        setSelectedUser(undefined);
      } catch (error) {
        console.error("Error al procesar usuario:", error);
        showError(selectedUser ? "updated" : "created", {
          title: selectedUser
            ? "Error al actualizar usuario"
            : "Error al crear usuario",
          description: selectedUser
            ? "No se pudieron guardar los cambios del usuario. Intenta nuevamente."
            : "No se pudo crear el usuario. Verifica los datos e intenta nuevamente.",
        });
      }
    },
    [
      selectedUser,
      createUserMutation,
      updateUserMutation,
      showSuccess,
      showError,
    ]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!userToDelete) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      setUserToDelete(undefined);
      showSuccess("deleted", {
        title: "¡Usuario eliminado exitosamente!",
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      showError("deleted", {
        title: "Error al eliminar usuario",
      });
    }
  }, [userToDelete, deleteUserMutation, showSuccess, showError]);

  const isOperationLoading =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    deleteUserMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema, sus roles y datos de contrato
          </p>
        </div>
        <Button onClick={handleCreateUser} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <UserStatsCards isLoading={isLoading} stats={userStats} />

      <UserFilters
        filters={filters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      <UserTable
        usersResponse={usersResponse}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        filters={filters}
        onFiltersChange={handlePaginationChange}
      />

      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(undefined);
        }}
        onSubmit={handleFormSubmit}
        isLoading={isOperationLoading}
        user={selectedUser}
      />

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold">
              Confirmar Eliminación
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <strong>
                {userToDelete.profile
                  ? `${userToDelete.profile.firstName} ${userToDelete.profile.lastName}`
                  : userToDelete.email}
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setUserToDelete(undefined)}
                variant="outline"
                className="flex-1"
                disabled={deleteUserMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="destructive"
                className="flex-1"
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainUsers;
