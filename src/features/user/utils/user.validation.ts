import { UserRole } from "../types/user.type";

const requiresSalary = (role: UserRole): boolean => {
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

export { requiresSalary };
