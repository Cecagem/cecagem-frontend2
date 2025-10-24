export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  university: string;
  faculty: string;
  career: string;
  academicDegree: string;
  salaryMonth: string;
  paymentDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role:
    | "ADMIN"
    | "RRHH"
    | "SUPER_ADMIN"
    | "COLLABORATOR_INTERNAL"
    | "COLLABORATOR_EXTERNAL";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
}

export interface GetCurrentUserResponse {
  data: UserProfile;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

export interface ChangePasswordErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}
