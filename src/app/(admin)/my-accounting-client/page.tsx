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

// Importar hooks de accounting-clients
import { useCompanies, useCompany } from "@/features/accounting-clients/hooks/use-accounting-clients";
import { ICompanyFilters } from "@/features/accounting-clients/types/accounting-clients.types";

// Importar componentes de my-accounting-client
import { 
  CompanySearchCard, 
  CompanyCards, 
  CompanyDetailView 
} from "@/features/my-accounting-client/components";

export default function MyAccountingClientPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  
  // Estado para filtros con paginación
  const [filters, setFilters] = useState<Partial<ICompanyFilters>>({
    page: 1,
    limit: 6,
    search: undefined,
  });

  // Hook para obtener empresas con filtros
  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies(filters);

  // Hook para obtener la empresa seleccionada (se actualiza automáticamente)
  const { data: selectedCompanyData, isLoading: isLoadingSelectedCompany } = useCompany(selectedCompanyId || "");

  const userCompanies = companiesData?.data || [];
  const paginationMeta = companiesData?.pagination;
  
  // Convertir undefined a null para compatibilidad con CompanyDetailView
  const selectedCompany = selectedCompanyData || null;

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

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setIsDetailView(true);
  };

  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedCompanyId(null);
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
                  {isDetailView ? 'Detalle de la Empresa' : 'Mis Empresas'}
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
            <CompanySearchCard 
              searchTerm={filters.search || ""}
              onSearch={handleSearch}
            />

            {/* Lista de empresas con paginación */}
            <CompanyCards
              companies={userCompanies}
              onCompanyClick={handleCompanyClick}
              isLoading={isLoadingCompanies}
              paginationMeta={paginationMeta}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              filters={filters}
            />
          </>
        ) : (
          /* Vista detalle de la empresa */
          <CompanyDetailView
            company={selectedCompany}
            onBack={handleBackToList}
            isLoading={isLoadingSelectedCompany}
          />
        )}
      </div>
    </div>
  );
}