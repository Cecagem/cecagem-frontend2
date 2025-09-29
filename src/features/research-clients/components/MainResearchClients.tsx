"use client";

import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useResearchClients, useResearchClientsStats } from '../hooks/use-research-clients';
import { ResearchClientFilters } from './ResearchClientFilters';
import { ResearchClientTable } from './ResearchClientTable';
import { ResearchClientForm } from './ResearchClientForm';
import { ResearchClientStatsCards } from './ResearchClientStatsCards';
import type { 
  IResearchClient, 
  IResearchClientFilters 
} from '../types/research-clients.types';

export function MainResearchClients() {
  // Estado para filtros y paginación
  const [filters, setFilters] = useState<Partial<IResearchClientFilters>>({
    page: 1,
    limit: 10,
    type: 'clients', // Siempre filtrar por clientes
  });

  // Estado para modales
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IResearchClient | null>(null);

  // Obtener datos
  const { 
    data: clientsData, 
    isLoading, 
    error, 
    refetch 
  } = useResearchClients(filters);

  // Obtener estadísticas
  const { 
    data: stats, 
    isLoading: isLoadingStats 
  } = useResearchClientsStats();

  const clients = clientsData?.data || [];
  const paginationMeta = clientsData?.meta;

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
  const handleFiltersChange = useCallback((newFilters: Partial<IResearchClientFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      type: 'clients', // Mantener siempre el tipo
      page: 1, // Reset a la primera página cuando cambian los filtros
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      type: 'clients',
    });
  }, []);

  // Handlers para modales
  const handleCreateClient = () => {
    setSelectedClient(null);
    setShowCreateForm(true);
  };

  const handleEditClient = (client: IResearchClient) => {
    setSelectedClient(client);
    setShowEditForm(true);
  };

  const handleClientSaved = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setSelectedClient(null);
    refetch();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes de Investigación</h1>
            <p className="text-muted-foreground">
              Gestiona los clientes que requieren servicios de investigación y tesis
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error al cargar los clientes de investigación
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
          <h1 className="text-3xl font-bold tracking-tight">Clientes de Investigación</h1>
          <p className="text-muted-foreground">
            Gestiona los clientes que requieren servicios de investigación y tesis
          </p>
        </div>
        
        <Button 
          className="text-white w-full sm:w-auto"
          onClick={handleCreateClient}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Statistics Cards */}
      <ResearchClientStatsCards 
        stats={stats || { 
          totalClients: 0, 
          activeClients: 0, 
          inactiveClients: 0, 
          thisMonthClients: 0 
        }} 
        isLoading={isLoadingStats} 
      />

      {/* Filtros */}
      <ResearchClientFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Tabla */}
      <ResearchClientTable
        clients={clients}
        isLoading={isLoading}
        onEditClient={handleEditClient}
        // Props para paginación del servidor
        serverPagination={true}
        paginationMeta={paginationMeta}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Formulario de creación */}
      <ResearchClientForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onClientSaved={handleClientSaved}
        mode="create"
      />

      {/* Formulario de edición */}
      <ResearchClientForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onClientSaved={handleClientSaved}
        client={selectedClient}
        mode="edit"
      />
    </div>
  );
}