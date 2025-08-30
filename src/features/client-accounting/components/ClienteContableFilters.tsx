"use client";

import { SearchFilters } from "@/components/shared/filters";
import { SearchFilters as ISearchFilters, ClienteEstado } from "../types";

interface ClienteContableFiltersProps {
  filters: ISearchFilters;
  onApplyFilters: (filters: ISearchFilters) => void;
  onClearFilters: () => void;
}

export default function ClienteContableFilters({ 
  filters, 
  onApplyFilters, 
  onClearFilters 
}: ClienteContableFiltersProps) {
  
  const selectFilters = [
    {
      key: "estado",
      label: "Estado",
      placeholder: "Todos los estados",
      options: [
        { value: ClienteEstado.ACTIVO, label: "Activo" },
        { value: ClienteEstado.INACTIVO, label: "Inactivo" },
      ]
    }
  ];

  return (
    <SearchFilters<ISearchFilters>
      filters={filters}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearFilters}
      searchPlaceholder="Buscar por RUC, razón social, nombre comercial o contacto..."
      selectFilters={selectFilters}
    />
  );
}
