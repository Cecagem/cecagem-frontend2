"use client";

import { useMemo } from "react";
import { SearchFilters, FilterOption, SelectFilter } from "@/components/shared/filters";
import { SearchFilters as ProjectSearchFilters, tipoProyectoLabels, estadoProyectoLabels } from "../types";

interface ProyectoFiltersProps {
  filters: ProjectSearchFilters;
  onApplyFilters: (filters: ProjectSearchFilters) => void;
  onClearFilters: () => void;
}

export function ProyectoFilters({ filters, onApplyFilters, onClearFilters }: ProyectoFiltersProps) {
  const tipoProyectoOptions: FilterOption[] = useMemo(() => 
    Object.entries(tipoProyectoLabels).map(([value, label]) => ({
      value,
      label,
    }))
  , []);

  const estadoOptions: FilterOption[] = useMemo(() => 
    Object.entries(estadoProyectoLabels).map(([value, label]) => ({
      value,
      label,
    }))
  , []);

  const colaboradorOptions: FilterOption[] = useMemo(() => [
    { value: "colab-1", label: "Juan Pérez - Especialista en Metodología" },
    { value: "colab-2", label: "Ana García - Desarrolladora Senior" },
    { value: "colab-3", label: "Carlos López - Consultor Financiero" },
  ], []);

  const selectFilters: SelectFilter[] = useMemo(() => [
    {
      key: "tipoProyecto",
      label: "Tipo de Proyecto",
      placeholder: "Todos los tipos",
      options: tipoProyectoOptions,
      width: "lg:min-w-[200px]",
    },
    {
      key: "estado",
      label: "Estado",
      placeholder: "Todos los estados",
      options: estadoOptions,
      width: "lg:min-w-[200px]",
    },
    {
      key: "colaboradorId",
      label: "Colaborador",
      placeholder: "Todos los colaboradores",
      options: colaboradorOptions,
      width: "lg:min-w-[200px]",
    },
  ], [tipoProyectoOptions, estadoOptions, colaboradorOptions]);

  return (
    <SearchFilters<ProjectSearchFilters>
      filters={filters}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearFilters}
      searchPlaceholder="Buscar por título, descripción o código..."
      searchKey="search"
      selectFilters={selectFilters}
      title="Filtros de Búsqueda"
      debounceMs={300}
    />
  );
}
