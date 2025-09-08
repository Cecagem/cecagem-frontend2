"use client";

import { useMemo } from "react";
import { SearchFilters } from "@/components/shared/filters";

import {
  type UserFilters as IUserFilters,
  type UserFiltersProps,
} from "@/features/user";

export const ClientFilters = ({
  filters,
  onApplyFilters,
  onClearFilters,
}: UserFiltersProps) => {
  const selectFilters = useMemo(
    () => [
      {
        key: "isActive",
        label: "Estado",
        placeholder: "Todos los estados",
        options: [
          { value: "true", label: "Activo" },
          { value: "false", label: "Inactivo" },
        ],
      },
    ],
    []
  );

  return (
    <SearchFilters<IUserFilters>
      filters={filters}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearFilters}
      searchPlaceholder="Buscar por nombre, apellido, correo o universidad..."
      searchKey="search"
      selectFilters={selectFilters}
      title="Filtros de Clientes"
      debounceMs={500}
    />
  );
};
