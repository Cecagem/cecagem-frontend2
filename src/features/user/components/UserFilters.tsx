"use client";

import { SearchFilters } from "@/components/shared/filters";
import { 
  SearchFilters as ISearchFilters, 
  UserStatus, 
  UserRole, 
  getRoleLabel, 
  getStatusLabel 
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
      key: "status",
      label: "Estado",
      placeholder: "Todos los estados",
      options: [
        { value: UserStatus.ACTIVE, label: getStatusLabel(UserStatus.ACTIVE) },
        { value: UserStatus.INACTIVE, label: getStatusLabel(UserStatus.INACTIVE) },
      ]
    },
    {
      key: "role",
      label: "Rol",
      placeholder: "Todos los roles",
      options: [
        { value: UserRole.SUPER_ADMIN, label: getRoleLabel(UserRole.SUPER_ADMIN) },
        { value: UserRole.ADMIN, label: getRoleLabel(UserRole.ADMIN) },
        { value: UserRole.COLLABORATOR_EXTERNAL, label: getRoleLabel(UserRole.COLLABORATOR_EXTERNAL) },
        { value: UserRole.COLLABORATOR_INTERNAL, label: getRoleLabel(UserRole.COLLABORATOR_INTERNAL) },
        { value: UserRole.RRHH, label: getRoleLabel(UserRole.RRHH) },
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
