"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText } from 'lucide-react';
import { DataTable, ServerPaginationMeta } from '@/components/shared/data-table';
import { getContractColumns } from './contract-columns';
import { ContractExpandedView } from './ContractExpandedView';
import type { IContract } from "../types";

interface ContractTableProps {
  data: IContract[];
  isLoading?: boolean;
  onDelete?: (contractId: string) => void;
  // Props para paginación del servidor
  serverPagination?: boolean;
  paginationMeta?: ServerPaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const ContractTable = ({
  data,
  isLoading = false,
  onDelete,
  serverPagination = false,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
}: ContractTableProps) => {
  const searchParams = useSearchParams();
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Leer el ID del contrato desde los query parameters
  const contractIdFromUrl = searchParams.get('id');
  
  // Encontrar el contrato seleccionado por ID para mantener la selección tras updates
  const selectedContract = contractIdFromUrl 
    ? data.find(contract => contract.id === contractIdFromUrl) || null 
    : selectedContractId 
    ? data.find(contract => contract.id === selectedContractId) || null 
    : null;

  // Generar columnas con los handlers
  const columns = getContractColumns({
    onDelete,
  });

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      title="Contratos"
      icon={FileText}
      noDataMessage="No se encontraron contratos registrados"
      enablePagination={true}
      enableSorting={true}
      pageSize={10}
      selectedItem={selectedContract}
      detailComponent={(contract: IContract) => <ContractExpandedView contract={contract} />}
      detailTitle={(contract: IContract) => contract.name}
      getItemId={(contract: IContract) => contract.id}
      onRowClick={(contract: IContract | null) => {
        if (!contract) {
          // Cerrar el detalle - remover query parameters sin recargar
          const url = new URL(window.location.href);
          url.searchParams.delete('id');
          url.searchParams.delete('tab');
          window.history.replaceState({}, '', url.pathname + url.search);
          setSelectedContractId(null);
        } else {
          // Verificar si es el mismo contrato ya seleccionado para deseleccionar (toggle)
          const isCurrentlySelected = contractIdFromUrl === contract.id || selectedContractId === contract.id;
          
          if (isCurrentlySelected) {
            // Cerrar el detalle - remover query parameters sin recargar
            const url = new URL(window.location.href);
            url.searchParams.delete('id');
            url.searchParams.delete('tab');
            window.history.replaceState({}, '', url.pathname + url.search);
            setSelectedContractId(null);
          } else {
            // Abrir detalle con query parameters sin recargar
            const url = new URL(window.location.href);
            url.searchParams.set('id', contract.id);
            url.searchParams.set('tab', 'general'); // Tab por defecto
            window.history.replaceState({}, '', url.pathname + url.search);
            setSelectedContractId(contract.id);
          }
        }
      }}
      // Props para paginación del servidor
      serverPagination={serverPagination}
      paginationMeta={paginationMeta}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
};