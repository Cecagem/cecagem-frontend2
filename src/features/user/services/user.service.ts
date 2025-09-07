import { cecagemApi } from "@/lib/api-client";
import {
  UserFilters,
  UsersResponse,
  CreateCompleteUserRequest,
  UpdateCompleteUserRequest,
  UserCompleteResponse,
  DeleteUserResponse,
} from "../types/user.type";

class UserService {
  private readonly baseEndpoint = "/users";

  async getUsers(filters?: Partial<UserFilters>): Promise<UsersResponse> {
    const params = new URLSearchParams();

    if (filters?.type) {
      params.append("type", filters.type);
    }
    if (filters?.page) {
      params.append("page", filters.page.toString());
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.role) {
      params.append("role", filters.role);
    }
    if (filters?.isActive !== undefined) {
      params.append("isActive", filters.isActive.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `${this.baseEndpoint}?${queryString}`
      : this.baseEndpoint;

    return await cecagemApi.get<UsersResponse>(url);
  }

  async createCompleteUser(
    userData: CreateCompleteUserRequest
  ): Promise<UserCompleteResponse> {
    return await cecagemApi.post<UserCompleteResponse>(
      `${this.baseEndpoint}/complete`,
      userData as unknown as Record<string, unknown>
    );
  }

  // async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
  //   return await cecagemApi.patch<User>(
  //     `${this.baseEndpoint}/${userId}`,
  //     userData as unknown as Record<string, unknown>
  //   );
  // }

  async updateCompleteUser(
    userId: string,
    userData: UpdateCompleteUserRequest
  ): Promise<UserCompleteResponse> {
    return await cecagemApi.patch<UserCompleteResponse>(
      `${this.baseEndpoint}/${userId}/complete`,
      userData as unknown as Record<string, unknown>
    );
  }

  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    return await cecagemApi.delete<DeleteUserResponse>(
      `${this.baseEndpoint}/${userId}`
    );
  }
}

const userApiService = new UserService();

export const userService = {
  getUsers: (filters?: Partial<UserFilters>) =>
    userApiService.getUsers(filters),

  createCompleteUser: (userData: CreateCompleteUserRequest) =>
    userApiService.createCompleteUser(userData),

  // updateUser: (userId: string, userData: UpdateUserRequest) =>
  //   userApiService.updateUser(userId, userData),

  updateCompleteUser: (userId: string, userData: UpdateCompleteUserRequest) =>
    userApiService.updateCompleteUser(userId, userData),

  deleteUser: (userId: string) => userApiService.deleteUser(userId),
} as const;
