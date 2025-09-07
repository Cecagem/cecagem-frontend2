import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import type {
  UserFilters,
  UsersResponse,
  UserCompleteResponse,
  DeleteUserResponse,
  CreateCompleteUserRequest,
  UpdateCompleteUserRequest,
  DocumentType,
} from "../types/user.type";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: Partial<UserFilters>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
} as const;

export const useUsers = (filters?: Partial<UserFilters>) => {
  return useQuery<UsersResponse, Error>({
    queryKey: userKeys.list(filters),
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserCompleteResponse, Error, CreateCompleteUserRequest>({
    mutationFn: userService.createCompleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserCompleteResponse,
    Error,
    { userId: string; data: UpdateCompleteUserRequest }
  >({
    mutationFn: ({ userId, data }) =>
      userService.updateCompleteUser(userId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(variables.userId), data);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteUserResponse, Error, string>({
    mutationFn: userService.deleteUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(userId) });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
};

export const createUserData = {
  admin: (
    email: string,
    profile: {
      firstName: string;
      lastName: string;
      documentType: DocumentType;
      documentNumber: string;
      phone: string;
    }
  ): CreateCompleteUserRequest => ({
    user: { email, role: "ADMIN" },
    profile,
  }),

  rrhh: (
    email: string,
    profile: {
      firstName: string;
      lastName: string;
      documentType: DocumentType;
      documentNumber: string;
      phone: string;
      salaryMonth: number;
      paymentDate: string;
    }
  ): CreateCompleteUserRequest => ({
    user: { email, role: "RRHH" },
    profile,
  }),

  collaboratorInternal: (
    email: string,
    profile: {
      firstName: string;
      lastName: string;
      documentType: DocumentType;
      documentNumber: string;
      phone: string;
      salaryMonth: number;
      paymentDate: string;
    }
  ): CreateCompleteUserRequest => ({
    user: { email, role: "COLLABORATOR_INTERNAL" },
    profile,
  }),

  collaboratorExternal: (
    email: string,
    profile: {
      firstName: string;
      lastName: string;
      documentType: DocumentType;
      documentNumber: string;
      phone: string;
    }
  ): CreateCompleteUserRequest => ({
    user: { email, role: "COLLABORATOR_EXTERNAL" },
    profile,
  }),

  client: (
    email: string,
    profile: {
      firstName: string;
      lastName: string;
      documentType: DocumentType;
      documentNumber: string;
      phone: string;
      university?: string;
      faculty?: string;
      career?: string;
      academicDegree?: string;
    }
  ): CreateCompleteUserRequest => ({
    user: { email, role: "CLIENT" },
    profile,
  }),

  company: (
    email: string,
    company: {
      ruc: string;
      businessName: string;
      tradeName?: string;
      address?: string;
      contactName?: string;
      contactPhone?: string;
      contactEmail?: string;
    }
  ): CreateCompleteUserRequest => ({
    user: { email, role: "COMPANY" },
    company: {
      ...company,
      contactEmail: company.contactEmail || email,
    },
  }),
};
