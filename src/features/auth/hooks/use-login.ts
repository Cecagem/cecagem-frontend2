"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { authService, useAuthStore, type LoginRequest } from "@/features/auth";

export function useLogin() {
  const { setSession, markHydrated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: async () => {
      try {
        const user = await authService.me();

        setSession(user);

        markHydrated();

        await new Promise((resolve) => setTimeout(resolve, 100));

        toast.success("¡Bienvenido! Has iniciado sesión correctamente.");

        const redirectUrl = searchParams.get("redirect") || "/dashboard";

        setTimeout(() => {
          router.push(redirectUrl);
        }, 300);
      } catch (error) {
        console.error("Error processing login response:", error);
        toast.error("Error al procesar la respuesta del servidor");
      }
    },
    onError: (error: Error & { status?: number; code?: string }) => {
      console.error("Login error:", error);

      if (error.status === 401) {
        toast.error(
          "Credenciales incorrectas. Verifica tu email y contraseña."
        );
      } else if (error.status === 403) {
        toast.error("Tu cuenta está bloqueada. Contacta al administrador.");
      } else if (error.status && error.status >= 500) {
        toast.error("Error del servidor. Intenta nuevamente más tarde.");
      } else if (error.code === "NETWORK_ERROR") {
        toast.error("Error de conexión. Verifica tu internet.");
      } else {
        toast.error("Error al iniciar sesión. Intenta nuevamente.");
      }
    },
  });
}
