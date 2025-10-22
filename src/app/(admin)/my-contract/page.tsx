"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/shared";

// Importar hooks de contratos (reutilizando desde features/contract)
import { useContracts } from "@/features/contract/hooks/useContracts";
import { IContract, IContractFilters } from "@/features/contract/types/contract.types";

// Importar componentes de my-contract
import { 
  ProjectSearchCard, 
  ProjectCards, 
  ProjectDetailView 
} from "@/features/my-contract/components";

export default function MyContractsPage() {
  const [selectedContract, setSelectedContract] = useState<IContract | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  
  // Estado para filtros con paginación
  const [filters, setFilters] = useState<Partial<IContractFilters>>({
    page: 1,
    limit: 6,
    search: undefined,
  });

  // Hook para obtener contratos con filtros
  const { data: contractsData, isLoading: isLoadingContracts } = useContracts(filters);

  const userContracts = contractsData?.data || [];
  const paginationMeta = contractsData?.meta;

  const handleSearch = (search: string) => {
    setFilters(prev => ({
      ...prev,
      search: search.length >= 2 ? search : undefined,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters(prev => ({ ...prev, limit: pageSize, page: 1 }));
  };

  const handleProjectClick = (contractId: string) => {
    const contract = userContracts.find(c => c.id === contractId);
    if (contract) {
      setSelectedContract(contract);
      setIsDetailView(true);
    }
  };

  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedContract(null);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminHeader title={isDetailView ? 'Detalle del Proyecto' : 'Mis Proyectos'} />

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {!isDetailView ? (
          <>
            {/* Buscador */}
            <ProjectSearchCard 
              searchTerm={filters.search || ""}
              onSearch={handleSearch}
            />

            {/* Lista de proyectos con paginación */}
            <ProjectCards
              contracts={userContracts}
              onProjectClick={handleProjectClick}
              isLoading={isLoadingContracts}
              paginationMeta={paginationMeta}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              filters={filters}
            />
          </>
        ) : (
          /* Vista detalle del proyecto */
          <ProjectDetailView
            contract={selectedContract}
            onBack={handleBackToList}
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
}
