"use client";

import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCompanies, useCompaniesStats } from '../hooks/use-accounting-clients';
import { AccountingClientFilters } from './AccountingClientFilters';
import { AccountingClientTable } from './AccountingClientTable';
import { CompanyForm } from './CompanyForm';
import { AccountingClientStatsCards } from './AccountingClientStatsCards';
import type { 
  ICompany, 
  ICompanyFilters 
} from '../types/accounting-clients.types';

export function MainAccountingClients() {
  // Estado para filtros y paginación
  const [filters, setFilters] = useState<Partial<ICompanyFilters>>({
    page: 1,
    limit: 10,
  });

  // Estado para modales
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);

  // Obtener datos
  const { 
    data: companiesData, 
    isLoading, 
    error, 
    refetch 
  } = useCompanies(filters);

  // Obtener estadísticas
  const { 
    data: stats, 
    isLoading: isLoadingStats 
  } = useCompaniesStats();

  const companies = companiesData?.data || [];
  const paginationMeta = companiesData?.pagination;

  // Handlers para paginación
  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters(prev => ({
      ...prev,
      limit: pageSize,
      page: 1, // Reset a la primera página cuando cambia el tamaño
    }));
  }, []);

  // Handlers para filtros
  const handleFiltersChange = useCallback((newFilters: Partial<ICompanyFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset a la primera página cuando cambian los filtros
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
    });
  }, []);

  // Handlers para modales
  const handleCreateCompany = useCallback(() => {
    setSelectedCompany(null);
    setShowCreateForm(true);
  }, []);

  const handleEditCompany = useCallback((company: ICompany) => {
    setSelectedCompany(company);
    setShowEditForm(true);
  }, []);

  const handleDeleteCompany = useCallback((company: ICompany) => {
    // TODO: Implementar confirmación de eliminación
    console.log('Eliminar empresa:', company);
  }, []);

  const handleCompanySaved = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCloseCreateForm = useCallback(() => {
    setShowCreateForm(false);
    setSelectedCompany(null);
  }, []);

  const handleCloseEditForm = useCallback(() => {
    setShowEditForm(false);
    setSelectedCompany(null);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium text-destructive mb-2">
          Error al cargar las empresas
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || 'Ha ocurrido un error inesperado'}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de crear */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Clientes Contables
          </h1>
          <p className="text-muted-foreground">
            Gestiona las empresas y sus relaciones con colaboradores internos
          </p>
        </div>
        <Button onClick={handleCreateCompany} className="text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>
      
      {/* Estadísticas */}
      <AccountingClientStatsCards 
        data={stats}
        isLoading={isLoadingStats}
      />

      {/* Filtros */}
      <AccountingClientFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Tabla */}
      <div className="space-y-4">
        <AccountingClientTable
          data={companies}
          isLoading={isLoading}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
          // Props para paginación del servidor
          serverPagination={true}
          paginationMeta={paginationMeta}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Modal de crear empresa */}
      <CompanyForm
        open={showCreateForm}
        onOpenChange={handleCloseCreateForm}
        onCompanySaved={handleCompanySaved}
        mode="create"
      />

      {/* Modal de editar empresa */}
      <CompanyForm
        open={showEditForm}
        onOpenChange={handleCloseEditForm}
        onCompanySaved={handleCompanySaved}
        company={selectedCompany}
        mode="edit"
      />
    </div>
  );
}