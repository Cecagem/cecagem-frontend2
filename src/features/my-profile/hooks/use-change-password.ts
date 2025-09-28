import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { ChangePasswordRequest } from "../types/profile.types";

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
    onSuccess: () => {
      // Optionally invalidate user queries if needed
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};