"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
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

function MyAccountingClientContent() {
  const searchParams = useSearchParams();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Solo renderizar en el cliente para evitar problemas de SSR
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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

  const userCompanies = useMemo(() => companiesData?.data || [], [companiesData?.data]);
  const paginationMeta = companiesData?.pagination;
  
  // Convertir undefined a null para compatibilidad con CompanyDetailView
  const selectedCompany = selectedCompanyData || null;

  // Leer parámetros de URL y establecer la empresa seleccionada
  useEffect(() => {
    if (isClient) {
      const companyId = searchParams.get('id');
      if (companyId) {
        setSelectedCompanyId(companyId);
        setIsDetailView(true);
      } else {
        setIsDetailView(false);
        setSelectedCompanyId(null);
      }
    }
  }, [isClient, searchParams]);

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
    // Actualizar URL con el ID de la empresa
    const url = new URL(window.location.href);
    url.searchParams.set('id', companyId);
    window.history.pushState({}, '', url.pathname + url.search);
    
    setSelectedCompanyId(companyId);
    setIsDetailView(true);
  };

  const handleBackToList = () => {
    // Limpiar parámetros de URL al volver a la lista
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url.pathname + url.search);
    
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

export default function MyAccountingClientPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <MyAccountingClientContent />
    </Suspense>
  );
}