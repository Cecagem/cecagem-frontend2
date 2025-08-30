import { create } from "zustand";
import type { User2 } from "@/features/auth";

type AuthState = {
  user: User2 | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setSession: (user: User2) => void;
  clearSession: () => void;
  markHydrated: () => void;
  resetHydration: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,

  setSession: (user) =>
    set(() => ({
      user,
      isAuthenticated: true,
    })),

  clearSession: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
    })),

  markHydrated: () => set({ hydrated: true }),

  resetHydration: () => set({ hydrated: false }),
}));
