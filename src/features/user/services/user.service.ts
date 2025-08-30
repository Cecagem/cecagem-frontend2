import { cecagemApi } from "@/lib/api-client";
import {
  User,
  UserFilters,
  UsersResponse,
  CreateCompleteUserRequest,
  UpdateUserRequest,
} from "../types/user.type";

class UserService {
  private readonly baseEndpoint = "/users";

  async getUsers(filters?: Partial<UserFilters>): Promise<UsersResponse> {
    const params = new URLSearchParams();

    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
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

  async createCompleteUser(userData: CreateCompleteUserRequest): Promise<User> {
    return await cecagemApi.post<User>(
      `${this.baseEndpoint}/complete`,
      userData as unknown as Record<string, unknown>
    );
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    return await cecagemApi.patch<User>(
      `${this.baseEndpoint}/${userId}`,
      userData as unknown as Record<string, unknown>
    );
  }

  async deleteUser(userId: string): Promise<void> {
    await cecagemApi.delete<void>(`${this.baseEndpoint}/${userId}`);
  }
}

const userApiService = new UserService();

export const userService = {
  getUsers: (filters?: Partial<UserFilters>) =>
    userApiService.getUsers(filters),
  createCompleteUser: (userData: CreateCompleteUserRequest) =>
    userApiService.createCompleteUser(userData),
  updateUser: (userId: string, userData: UpdateUserRequest) =>
    userApiService.updateUser(userId, userData),
  deleteUser: (userId: string) => userApiService.deleteUser(userId),
};
