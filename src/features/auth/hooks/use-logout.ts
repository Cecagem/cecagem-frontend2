"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService, useAuthStore } from "@/features/auth";
import { useRouter } from "next/navigation";

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast.success("Has cerrado sesión correctamente.");
    },

    onError: (error) => {
      console.error("Logout error:", error);
      toast.error(
        "Error al cerrar sesión, pero tu sesión local ha sido limpiada."
      );
    },
    onSettled: () => {
      clearSession();
      router.replace("/login");
    },
  });
}
