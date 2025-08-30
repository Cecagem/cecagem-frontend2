"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { authService, useAuthStore } from "@/features/auth";

export const useAuth = () => {
  const pathname = usePathname();
  const { setSession, clearSession, markHydrated, hydrated, isAuthenticated } =
    useAuthStore();

  useEffect(() => {
    if (hydrated || pathname === "/login") {
      if (!hydrated) {
        markHydrated();
      }
      return;
    }

    const validateSession = async () => {
      try {
        const user = await authService.me();
        setSession(user);
      } catch (error) {
        console.log(" Validación de sesión falló desde useAuth:", error);
        clearSession();
      } finally {
        markHydrated();
      }
    };

    validateSession();
  }, [hydrated, setSession, clearSession, markHydrated, pathname]);

  return { isAuthenticated, hydrated };
};
