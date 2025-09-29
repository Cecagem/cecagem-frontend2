"use client";

import { useState } from "react";
import ModeToggle from "@/components/themes/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";

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
      <header className="bg-background/60 backdrop-blur-md sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {isDetailView ? 'Detalle del Proyecto' : 'Mis Proyectos'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto mr-4">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificaciones"
            className="mr-2"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

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
