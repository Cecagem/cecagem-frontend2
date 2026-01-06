"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { AdminHeader } from "@/components/shared";

// Importar hooks de contratos (reutilizando desde features/contract)
import { useContracts, useContract } from "@/features/contract/hooks/useContracts";
import { IContract, IContractFilters } from "@/features/contract/types/contract.types";

// Importar componentes de my-contract
import { 
  ProjectSearchCard, 
  ProjectCards, 
  ProjectDetailView 
} from "@/features/my-contract/components";

function MyContractsContent() {
  const searchParams = useSearchParams();
  const [selectedContract, setSelectedContract] = useState<IContract | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Obtener contractId de URL para carga directa
  const contractIdFromUrl = searchParams.get('id');

  // Solo renderizar en el cliente para evitar problemas de SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Estado para filtros con paginación
  const [filters, setFilters] = useState<Partial<IContractFilters>>({
    page: 1,
    limit: 6,
    search: undefined,
  });

  // Hook para obtener contratos con filtros
  const { data: contractsData, isLoading: isLoadingContracts } = useContracts(filters);

  // Hook para cargar contrato específico por ID (para URLs directas desde notificaciones)
  const {
    data: contractFromUrl,
    isLoading: isLoadingContractFromUrl
  } = useContract(contractIdFromUrl || "");

  const userContracts = useMemo(() => contractsData?.data || [], [contractsData?.data]);
  const paginationMeta = contractsData?.meta;

  // Leer parámetros de URL y establecer el contrato seleccionado
  useEffect(() => {
    if (!isClient) return;

    if (contractIdFromUrl) {
      // Prioridad 1: Contrato cargado directamente por ID
      if (contractFromUrl) {
        setSelectedContract(contractFromUrl);
        setIsDetailView(true);
        return;
      }
      // Prioridad 2: Buscar en lista paginada
      const contractInList = userContracts.find(c => c.id === contractIdFromUrl);
      if (contractInList) {
        setSelectedContract(contractInList);
        setIsDetailView(true);
        return;
      }
      // Si está cargando, esperar
      if (isLoadingContractFromUrl) return;
    } else {
      setIsDetailView(false);
      setSelectedContract(null);
    }
  }, [isClient, contractIdFromUrl, contractFromUrl, userContracts, isLoadingContractFromUrl]);

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
      // Actualizar URL con el ID del contrato y tab por defecto
      const url = new URL(window.location.href);
      url.searchParams.set('id', contractId);
      url.searchParams.set('tab', 'deliverables'); // Tab por defecto
      window.history.pushState({}, '', url.pathname + url.search);
      
      setSelectedContract(contract);
      setIsDetailView(true);
    }
  };

  const handleBackToList = () => {
    // Limpiar parámetros de URL al volver a la lista
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    url.searchParams.delete('tab');
    window.history.pushState({}, '', url.pathname + url.search);
    
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
            isLoading={isLoadingContractFromUrl && !selectedContract}
          />
        )}
      </div>
    </div>
  );
}

export default function MyContractsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <MyContractsContent />
    </Suspense>
  );
}
