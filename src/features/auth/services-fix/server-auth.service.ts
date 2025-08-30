"use client";

import { authService } from "./auth.service";

export class ClientAuthService {
  static async isAuthenticated(): Promise<boolean> {
    try {
      await authService.me();
      return true;
    } catch (error) {
      console.error("Auth check failed:", error);
      return false;
    }
  }

  static async getUser() {
    try {
      const user = await authService.me();
      return user;
    } catch (error) {
      console.error("Get user failed:", error);
      return null;
    }
  }

  static async logout() {
    try {
      await authService.logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/login";
    }
  }
}
