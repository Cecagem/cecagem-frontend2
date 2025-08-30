"use client";

import { useState, useCallback } from "react";
import ModeToggle from "@/components/themes/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Plus } from "lucide-react";
import {
  useUsers,
  User,
  UserFormData,
  UserStatsCards,
  UserFilters,
  UserTable,
  UserForm,
  // DeleteConfirmation, // Preparado para desarrollo futuro
} from "@/features/user";

function UserPage() {
  const {
    users,
    stats,
    isLoading,
    filters,
    createUser,
    // updateUser,
    // deleteUser,
    applyFilters,
    clearFilters,
    // isUpdating,
    // isDeleting,
  } = useUsers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  // const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);

  const handleCreateUser = useCallback(() => {
    // setSelectedUser(undefined);
    setIsFormOpen(true);
  }, []);

  // Métodos preparados para desarrollo futuro
  const handleEditUser = useCallback((user: User) => {
    console.log("Editar usuario:", user);
    // setSelectedUser(user);
    // setIsFormOpen(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    console.log("Eliminar usuario:", user);
    // setUserToDelete(user);
    // setIsDeleteModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (userData: UserFormData) => {
    try {
      // Solo crear usuarios por ahora
      await createUser(userData);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  }, [createUser]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="bg-background/60 backdrop-blur-md sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Gestión de Usuarios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto mr-4">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificaciones"
            className="mr-2"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header con título y botón crear */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
              Administra los usuarios del sistema, sus roles y datos de contrato
            </p>
          </div>
          <Button onClick={handleCreateUser} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Estadísticas */}
        <UserStatsCards stats={stats} isLoading={isLoading} />

        {/* Filtros */}
        <UserFilters
          filters={filters}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />

        {/* Tabla de usuarios */}
        <UserTable
          users={users}
          isLoading={isLoading}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </main>

      {/* Modal de formulario */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
        }}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      {/* Modal de confirmación de eliminación - Preparado para desarrollo futuro */}
      {/* 
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(undefined);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
        userName={userToDelete ? `${userToDelete.profile?.firstName || ''} ${userToDelete.profile?.lastName || ''}` : ""}
      />
      */}
    </div>
  );
}

export default UserPage;
