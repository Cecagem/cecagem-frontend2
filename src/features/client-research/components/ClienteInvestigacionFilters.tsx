"use client";

import { SearchFilters as SearchFiltersComponent, FilterOption, SelectFilter } from "@/components/shared";
import { SearchFilters, ClienteInvestigacionEstado, Universidad, GradoAcademico } from "../types/index";

interface ClienteInvestigacionFiltersProps {
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export default function ClienteInvestigacionFilters({
  filters,
  onApplyFilters,
  onClearFilters,
}: ClienteInvestigacionFiltersProps) {
  
  // Configurar opciones de estado
  const estadoOptions: FilterOption[] = [
    { value: ClienteInvestigacionEstado.ACTIVO, label: "Activo" },
    { value: ClienteInvestigacionEstado.INACTIVO, label: "Inactivo" },
  ];

  // Configurar opciones de universidad
  const universidadOptions: FilterOption[] = Object.values(Universidad).map((universidad) => ({
    value: universidad,
    label: universidad,
  }));

  // Configurar opciones de grado
  const gradoOptions: FilterOption[] = [
    { value: GradoAcademico.BACHILLER, label: "Bachiller" },
    { value: GradoAcademico.EGRESADO, label: "Egresado" },
    { value: GradoAcademico.MAESTRIA, label: "Maestría" },
  ];

  // Configurar filtros de select
  const selectFilters: SelectFilter[] = [
    {
      key: "estado",
      label: "Estado",
      placeholder: "Estado",
      options: estadoOptions,
      width: "lg:min-w-[140px]",
    },
    {
      key: "universidad",
      label: "Universidad", 
      placeholder: "Universidad",
      options: universidadOptions,
      width: "lg:min-w-[180px]",
    },
    {
      key: "grado",
      label: "Grado",
      placeholder: "Grado",
      options: gradoOptions,
      width: "lg:min-w-[140px]",
    },
  ];

  return (
    <SearchFiltersComponent
      filters={filters}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearFilters}
      searchPlaceholder="Buscar por nombre, apellido, correo, carrera o universidad..."
      searchKey="search"
      selectFilters={selectFilters}
      title="Filtros de Búsqueda"
      debounceMs={300}
    />
  );
}
