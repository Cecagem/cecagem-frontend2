"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/shared";

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
      <AdminHeader title={isDetailView ? 'Detalle de la Empresa' : 'Mis Empresas'} />

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