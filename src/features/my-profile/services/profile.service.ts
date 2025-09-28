import { cecagemApi } from "@/lib/api-client";
import { UserProfile, ChangePasswordRequest, ChangePasswordResponse } from "../types/profile.types";

export const profileService = {
  getCurrentUser: async (): Promise<UserProfile> => {
    return cecagemApi.get<UserProfile>("/auth/me");
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    return cecagemApi.patch<ChangePasswordResponse>("/auth/change-password", data as unknown as Record<string, unknown>);
  },
};