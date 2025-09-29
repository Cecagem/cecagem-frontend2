import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { ChangePasswordRequest, ChangePasswordErrorResponse } from "../types/profile.types";
import { toast } from "sonner";

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
    onSuccess: (response) => {
      // Optionally invalidate user queries if needed
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success(response.message || "Contraseña cambiada exitosamente");
    },
    onError: (error: { response?: { data?: ChangePasswordErrorResponse }; message?: string }) => {
      // Handle API error response
      const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error al cambiar la contraseña";
      toast.error(errorMessage);
    },
  });
};