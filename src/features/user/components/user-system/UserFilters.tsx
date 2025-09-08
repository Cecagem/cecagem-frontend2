"use client";

import { useMemo } from "react";
import { SearchFilters } from "@/components/shared/filters";

import {
  getRoleLabel,
  type UserFilters as IUserFilters,
  UserRole,
  type UserFiltersProps,
} from "@/features/user";

export default function UserFilters({
  filters,
  onApplyFilters,
  onClearFilters,
}: UserFiltersProps) {
  const selectFilters = useMemo(
    () => [
      // {
      //   key: "type",
      //   label: "Tipo de Usuario",
      //   placeholder: "Todos los tipos",
      //   options: [
      //     { value: "users_system", label: "Usuarios del Sistema" },
      //     { value: "clients", label: "Clientes" },
      //     { value: "company", label: "Empresas" },
      //   ],
      // },
      {
        key: "isActive",
        label: "Estado",
        placeholder: "Todos los estados",
        options: [
          { value: "true", label: "Activo" },
          { value: "false", label: "Inactivo" },
        ],
      },
      {
        key: "role",
        label: "Rol",
        placeholder: "Todos los roles",
        options: [
          // {
          //   value: UserRole.SUPER_ADMIN,
          //   label: getRoleLabel(UserRole.SUPER_ADMIN),
          // },
          { value: UserRole.ADMIN, label: getRoleLabel(UserRole.ADMIN) },
          // { value: UserRole.CLIENT, label: getRoleLabel(UserRole.CLIENT) },
          // { value: UserRole.COMPANY, label: getRoleLabel(UserRole.COMPANY) },
          {
            value: UserRole.COLLABORATOR_EXTERNAL,
            label: getRoleLabel(UserRole.COLLABORATOR_EXTERNAL),
          },
          {
            value: UserRole.COLLABORATOR_INTERNAL,
            label: getRoleLabel(UserRole.COLLABORATOR_INTERNAL),
          },
          { value: UserRole.RRHH, label: getRoleLabel(UserRole.RRHH) },
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
      searchPlaceholder="Buscar por nombre, apellido o email..."
      searchKey="search"
      selectFilters={selectFilters}
      title="Filtros de Usuarios"
      debounceMs={500}
    />
  );
}
