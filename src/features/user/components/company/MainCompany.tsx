"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import CompanyFilters from "./CompanyFilters";
import CompanyTable from "./CompanyTable";
import CompanyForm from "./CompanyForm";
import CompanyStatsCards from "./CompanyStatsCards";
import {
  User,
  UserFilters,
  CreateCompleteUserRequest,
  UpdateCompleteUserRequest,
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/features/user";

export const MainCompany = () => {
  const [filters, setFilters] = useState<Partial<UserFilters>>({
    page: 1,
    limit: 5,
    type: "company",
  });

  const companyStats = {
    total: 50,
    active: 45,
    inactive: 5,
    newThisMonth: 3,
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<User | undefined>(
    undefined
  );
  const [companyToDelete, setCompanyToDelete] = useState<User | undefined>(
    undefined
  );

  const { showSuccess, showError } = useToast();

  const { data: companiesResponse, isLoading } = useUsers(filters);
  const createCompanyMutation = useCreateUser();
  const updateCompanyMutation = useUpdateUser();
  const deleteCompanyMutation = useDeleteUser();

  const applyFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters((prev: Partial<UserFilters>) => {
      const newState = {
        ...prev,
        ...newFilters,
        page: 1,
        type: "company" as const,
      };
      return newState;
    });
  }, []);

  const handlePaginationChange = useCallback(
    (newFilters: Partial<UserFilters>) => {
      setFilters((prev: Partial<UserFilters>) => {
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
    setFilters({ page: 1, limit: 5, type: "company" as const });
  }, []);

  const handleCreateCompany = useCallback(() => {
    setSelectedCompany(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditCompany = useCallback((company: User) => {
    setSelectedCompany(company);
    setIsFormOpen(true);
  }, []);

  const handleDeleteCompany = useCallback((company: User) => {
    setCompanyToDelete(company);
  }, []);

  const handleFormSubmit = useCallback(
    async (companyData: CreateCompleteUserRequest) => {
      try {
        if (selectedCompany) {
          const updateData: UpdateCompleteUserRequest = {
            user: companyData.user,
            company: companyData.company,
          };
          await updateCompanyMutation.mutateAsync({
            userId: selectedCompany.id,
            data: updateData,
          });
          showSuccess("updated", {
            title: "¡Empresa actualizada exitosamente!",
          });
        } else {
          await createCompanyMutation.mutateAsync(companyData);
          showSuccess("created", {
            title: "¡Empresa creada exitosamente!",
          });
        }
        setIsFormOpen(false);
        setSelectedCompany(undefined);
      } catch (error) {
        console.error("Error al procesar empresa:", error);
        showError(selectedCompany ? "updated" : "created", {
          title: selectedCompany
            ? "Error al actualizar empresa"
            : "Error al crear empresa",
          description: selectedCompany
            ? "No se pudieron guardar los cambios de la empresa. Intenta nuevamente."
            : "No se pudo crear la empresa. Verifica los datos e intenta nuevamente.",
        });
      }
    },
    [
      selectedCompany,
      createCompanyMutation,
      updateCompanyMutation,
      showSuccess,
      showError,
    ]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompanyMutation.mutateAsync(companyToDelete.id);
      setCompanyToDelete(undefined);
      showSuccess("deleted", {
        title: "¡Empresa eliminada exitosamente!",
      });
    } catch (error) {
      console.error("Error al eliminar empresa:", error);
      showError("deleted", {
        title: "Error al eliminar empresa",
      });
    }
  }, [companyToDelete, deleteCompanyMutation, showSuccess, showError]);

  const isOperationLoading =
    createCompanyMutation.isPending ||
    updateCompanyMutation.isPending ||
    deleteCompanyMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Empresas
          </h1>
          <p className="text-muted-foreground">
            Administra las empresas registradas en el sistema
          </p>
        </div>
        <Button onClick={handleCreateCompany} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>

      <CompanyStatsCards isLoading={isLoading} stats={companyStats} />

      <CompanyFilters
        filters={filters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      <CompanyTable
        companiesResponse={companiesResponse}
        isLoading={isLoading}
        onEdit={handleEditCompany}
        onDelete={handleDeleteCompany}
        filters={filters}
        onFiltersChange={handlePaginationChange}
      />

      <CompanyForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCompany(undefined);
        }}
        onSubmit={handleFormSubmit}
        isLoading={isOperationLoading}
        company={selectedCompany}
      />

      {companyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold">
              Confirmar Eliminación
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              ¿Estás seguro de que deseas eliminar la empresa{" "}
              <strong>{companyToDelete.company?.businessName}</strong>? Esta
              acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setCompanyToDelete(undefined)}
                variant="outline"
                className="flex-1"
                disabled={deleteCompanyMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="destructive"
                className="flex-1"
                disabled={deleteCompanyMutation.isPending}
              >
                {deleteCompanyMutation.isPending ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainCompany;
