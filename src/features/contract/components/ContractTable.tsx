"use client";

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { getContractColumns } from './contract-columns';
import { ContractExpandedView } from './ContractExpandedView';
import type { IContract } from "../types";

interface ContractTableProps {
  data: IContract[];
  isLoading?: boolean;
  onDelete?: (contractId: string) => void;
}

export const ContractTable = ({
  data,
  isLoading = false,
  onDelete,
}: ContractTableProps) => {
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Encontrar el contrato seleccionado por ID para mantener la selección tras updates
  const selectedContract = selectedContractId 
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
          // Cerrar el detalle
          setSelectedContractId(null);
        } else {
          // Toggle del detalle usando ID
          setSelectedContractId(selectedContractId === contract.id ? null : contract.id);
        }
      }}
    />
  );
};