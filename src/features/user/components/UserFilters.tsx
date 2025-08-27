"use client";

import { SearchFilters } from "@/components/shared/filters";
import { 
  SearchFilters as ISearchFilters, 
  UserEstado, 
  UserRol, 
  getRolLabel, 
  getEstadoLabel 
} from "../types";

interface UserFiltersProps {
  filters: ISearchFilters;
  onApplyFilters: (filters: ISearchFilters) => void;
  onClearFilters: () => void;
}

export default function UserFilters({ 
  filters, 
  onApplyFilters, 
  onClearFilters 
}: UserFiltersProps) {
  
  const selectFilters = [
    {
      key: "estado",
      label: "Estado",
      placeholder: "Todos los estados",
      options: [
        { value: UserEstado.ACTIVO, label: getEstadoLabel(UserEstado.ACTIVO) },
        { value: UserEstado.INACTIVO, label: getEstadoLabel(UserEstado.INACTIVO) },
      ]
    },
    {
      key: "rol",
      label: "Rol",
      placeholder: "Todos los roles",
      options: [
        { value: UserRol.ADMINISTRADOR, label: getRolLabel(UserRol.ADMINISTRADOR) },
        { value: UserRol.RRHH, label: getRolLabel(UserRol.RRHH) },
        { value: UserRol.COLABORADOR_INTERNO, label: getRolLabel(UserRol.COLABORADOR_INTERNO) },
        { value: UserRol.COLABORADOR_EXTERNO, label: getRolLabel(UserRol.COLABORADOR_EXTERNO) },
      ]
    }
  ];

  return (
    <SearchFilters<ISearchFilters>
      filters={filters}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearFilters}
      searchPlaceholder="Buscar por nombre, apellido o email..."
      selectFilters={selectFilters}
    />
  );
}
