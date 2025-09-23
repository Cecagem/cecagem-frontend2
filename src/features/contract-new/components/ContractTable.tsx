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
  onEdit?: (contract: IContract) => void;
  onDelete?: (contractId: string) => void;
}

export const ContractTable = ({
  data,
  isLoading = false,
  onEdit,
  onDelete,
}: ContractTableProps) => {
  const [selectedContract, setSelectedContract] = useState<IContract | null>(null);

  // Generar columnas con los handlers
  const columns = getContractColumns({
    onEdit,
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
      onRowClick={(contract: IContract) => {
        setSelectedContract(selectedContract?.id === contract.id ? null : contract);
      }}
    />
  );
};