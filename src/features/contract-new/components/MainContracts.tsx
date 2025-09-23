"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useContracts, useDeleteContract } from '../hooks/useContracts';
import { ContractFilters } from './ContractFilters';
import { ContractTable } from './ContractTable';
import { ContractStatsCards } from './ContractStatsCards';
import { DeleteContractDialog } from './DeleteContractDialog';
import type { 
  IContractFilters, 
  IContract 
} from '../types';

export function MainContracts() {
  // Estado para filtros y paginación
  const [filters, setFilters] = useState<Partial<IContractFilters>>({
    page: 1,
    limit: 10,
  });

  // Estado para el diálogo de confirmación de eliminación
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    contractId: string | null;
    contractName: string | null;
  }>({
    open: false,
    contractId: null,
    contractName: null,
  });

  // Obtener datos
  const { 
    data: contractsData, 
    isLoading, 
    error, 
    refetch 
  } = useContracts(filters);

  // Hook de eliminación
  const deleteContractMutation = useDeleteContract();

  const contracts = useMemo(() => contractsData?.data || [], [contractsData?.data]);

  // Handlers para filtros
  const handleFiltersChange = useCallback((newFilters: Partial<IContractFilters>) => {
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

  // Handler para crear nuevo contrato
  const handleCreateContract = () => {
    // TODO: Implementar modal de creación
    console.log('Crear nuevo contrato');
  };

  // Handler para editar contrato
  const handleEditContract = useCallback((contract: IContract) => {
    // TODO: Implementar modal de edición
    console.log('Editar contrato:', contract.id);
  }, []);

  // Handler para eliminar contrato
  const handleDeleteContract = useCallback((contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    setDeleteDialog({
      open: true,
      contractId,
      contractName: contract?.name || null,
    });
  }, [contracts]);

  // Confirmar eliminación
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialog.contractId) return;

    try {
      await deleteContractMutation.mutateAsync(deleteDialog.contractId);
      setDeleteDialog({ open: false, contractId: null, contractName: null });
    } catch (error) {
      // Error ya manejado por el hook
      console.error('Error eliminando contrato:', error);
    }
  }, [deleteDialog.contractId, deleteContractMutation]);

  // Calcular estadísticas básicas de los datos actuales
  const stats = {
    totalContracts: contracts.length,
    activeContracts: contracts.filter(c => c.overallProgress < 100).length,
    completedContracts: contracts.filter(c => c.overallProgress === 100).length,
    thisMonthContracts: 0, // TODO: Calcular basado en fecha
    totalRevenue: contracts.reduce((sum, c) => sum + c.costTotal, 0),
    avgProgress: contracts.length > 0 ? Math.round(contracts.reduce((sum, c) => sum + c.overallProgress, 0) / contracts.length) : 0,
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg text-red-600 mb-4">
          Error al cargar los contratos
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
            Gestión de Contratos
          </h1>
          <p className="text-muted-foreground">
            Administra y supervisa todos los contratos de proyectos
          </p>
        </div>
        <Button onClick={handleCreateContract} className="text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Contrato
        </Button>
      </div>
      
      {/* Estadísticas */}
      <ContractStatsCards 
        data={stats}
      />

      {/* Filtros */}
      <ContractFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Tabla */}
      <div className="space-y-4">
        <ContractTable
          data={contracts}
          isLoading={isLoading}
          onEdit={handleEditContract}
          onDelete={handleDeleteContract}
        />
      </div>

      {/* Diálogo de confirmación de eliminación */}
      <DeleteContractDialog
        open={deleteDialog.open}
        onOpenChange={(open) => 
          setDeleteDialog(prev => ({ ...prev, open }))
        }
        onConfirm={handleConfirmDelete}
        contractName={deleteDialog.contractName || undefined}
        isLoading={deleteContractMutation.isPending}
      />
    </div>
  );
}