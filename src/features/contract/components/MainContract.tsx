import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { ContractStats } from "./ContractStats";
import { ContractFilters } from "./ContractFilters";
import { contractColumns } from "./contract-columns";
import { ContractFormSteps } from "./ContractFormSteps";
import { ContractDeleteDialog } from "./ContractDeleteDialog";
import { ContractDetails } from "./ContractDetails";
import { useContracts, useDeleteContract } from "../hooks/useContract";
import type { IContract, IContractFilters } from "../types/contract.type";

export const MainContract = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<IContract | null>(
    null
  );
  const [contractToDelete, setContractToDelete] = useState<IContract | null>(
    null
  );
  const [contractToView, setContractToView] = useState<IContract | null>(null);
  const [filters, setFilters] = useState<Partial<IContractFilters>>({
    page: 1,
    limit: 5,
  });

  const contractDetailsRef = useRef<HTMLDivElement>(null);

  const { data: contractsData, isLoading } = useContracts(filters);
  const deleteContractMutation = useDeleteContract();

  const handleApplyFilters = (newFilters: Partial<IContractFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 5 });
  };

  const handleCreateContract = () => {
    setSelectedContract(null);
    setIsModalOpen(true);
  };

  const handleEditContract = (contract: IContract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleDeleteContract = (contractId: string) => {
    const contract = contractsData?.data.find((c) => c.id === contractId);
    if (contract) {
      setContractToDelete(contract);
    }
  };

  const handleConfirmDelete = (contractId: string) => {
    deleteContractMutation.mutate(contractId, {
      onSuccess: () => {
        setContractToDelete(null);
      },
    });
  };

  const handleViewContract = (contract: IContract) => {
    const isCurrentlyViewing = contractToView?.id === contract.id;
    setContractToView(isCurrentlyViewing ? null : contract);
  };

  // Scroll suave hacia ContractDetails cuando se abre
  useEffect(() => {
    if (contractToView && contractDetailsRef.current) {
      setTimeout(() => {
        contractDetailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100); // Pequeño delay para asegurar que el componente se haya renderizado
    }
  }, [contractToView]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Contratos
          </h1>
          <p className="text-muted-foreground">
            Administra los contratos del sistema, sus servicios y entregables
          </p>
        </div>
        <Button onClick={handleCreateContract} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Contrato
        </Button>
      </div>

      <ContractStats />

      <ContractFilters
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <DataTable
        data={contractsData?.data || []}
        columns={contractColumns({
          onView: handleViewContract,
          onEdit: handleEditContract,
          onDelete: handleDeleteContract,
        })}
        isLoading={isLoading}
        noDataMessage="No se encontraron contratos"
        enablePagination={true}
        enableSorting={true}
        pageSize={filters.limit}
      />

      {contractToView && (
        <div ref={contractDetailsRef} className="mt-6">
          <ContractDetails contract={contractToView} />
        </div>
      )}

      <ContractFormSteps
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contract={selectedContract}
      />

      <ContractDeleteDialog
        isOpen={!!contractToDelete}
        contract={contractToDelete}
        onClose={() => setContractToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteContractMutation.isPending}
      />
    </div>
  );
};
