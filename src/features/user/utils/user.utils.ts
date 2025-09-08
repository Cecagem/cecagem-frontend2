import { UserRole } from "../types/user.type";
import type { UserRole as UserRoleType } from "../types/user.type";

export const requiresSalary = (role: UserRole): boolean => {
  return role === "COLLABORATOR_INTERNAL" || role === "RRHH";
};

export const availableRoles = [
  { value: "ADMIN", label: "Administrador" },
  { value: "COLLABORATOR_EXTERNAL", label: "Colaborador Externo" },
  { value: "COLLABORATOR_INTERNAL", label: "Colaborador Interno" },
  { value: "RRHH", label: "Recursos Humanos" },
];

export const documentTypes = [
  { value: "DNI", label: "DNI" },
  { value: "PASSPORT", label: "Pasaporte" },
  { value: "OTHER", label: "Otro" },
];

// export { requiresSalary };

export const getRoleLabel = (role: UserRoleType): string => {
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
