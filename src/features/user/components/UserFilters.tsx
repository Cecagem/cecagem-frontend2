"use client";

import { SearchFilters } from "@/components/shared/filters";
import type {
  UserFilters as IUserFilters,
  UserRole as UserRoleType,
} from "../types/user.type";
import { UserRole, UserStatus } from "../types/user.type";

const getRoleLabel = (role: UserRoleType): string => {
  const labels: Record<UserRoleType, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Administrador",
    CLIENT: "Cliente",
    COMPANY: "Empresa",
    COLLABORATOR_INTERNAL: "Colaborador Interno",
    COLLABORATOR_EXTERNAL: "Colaborador Externo",
    RRHH: "Recursos Humanos",
  };
  return labels[role] || role;
};

const getStatusLabel = (status: boolean): string => {
  return status ? "Activo" : "Inactivo";
};

interface UserFiltersProps {
  filters: Partial<IUserFilters>;
  onApplyFilters: (filters: Partial<IUserFilters>) => void;
  onClearFilters: () => void;
}

export default function UserFilters({
  filters,
  onApplyFilters,
  onClearFilters,
}: UserFiltersProps) {
  const selectFilters = [
    {
      key: "type",
      label: "Tipo de Usuario",
      placeholder: "Todos los tipos",
      options: [
        { value: "all", label: "Todos" },
        { value: "users_system", label: "Usuarios del Sistema" },
        { value: "clients", label: "Clientes" },
        { value: "company", label: "Empresas" },
      ],
    },
    {
      key: "isActive",
      label: "Estado",
      placeholder: "Todos los estados",
      options: [
        { value: "true", label: getStatusLabel(UserStatus.ACTIVE) },
        { value: "false", label: getStatusLabel(UserStatus.INACTIVE) },
      ],
    },
    {
      key: "role",
      label: "Rol",
      placeholder: "Todos los roles",
      options: [
        {
          value: UserRole.SUPER_ADMIN,
          label: getRoleLabel(UserRole.SUPER_ADMIN),
        },
        { value: UserRole.ADMIN, label: getRoleLabel(UserRole.ADMIN) },
        { value: UserRole.CLIENT, label: getRoleLabel(UserRole.CLIENT) },
        { value: UserRole.COMPANY, label: getRoleLabel(UserRole.COMPANY) },
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
  ];

  return (
    <SearchFilters<IUserFilters>
      filters={filters}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearFilters}
      searchPlaceholder="Buscar por nombre, apellido o email..."
      selectFilters={selectFilters}
    />
  );
}
