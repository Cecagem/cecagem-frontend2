export interface User {
  sub: string;
  email: string;
  corporation_id: string;
  company_id: string;
  roles: string[];
  app_id: string;
  scopes: string[];
  iat: number;
  exp: number;
  jti: string;
}

export interface User2 {
  id: string;
  role:
    | "ADMIN"
    | "RRHH"
    | "SUPER_ADMIN"
    | "COLLABORATOR_INTERNAL"
    | "COLLABORATOR_EXTERNAL";
  email: string;
  isActive: boolean;
  profile: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  academicDegree: string | null;
  career: string | null;
  faculty: string | null;
  university: string | null;
  paymentDate: string | null;
  salaryMonth: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface LoginRequest extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}
