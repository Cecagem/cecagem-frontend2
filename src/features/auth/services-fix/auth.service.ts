import { cecagemApi } from "@/lib/api-client";

import { LoginRequest, User2 } from "@/features/auth";
console.log("API URL:", process.env.NEXT_PUBLIC_API_CECAGEM_URL);

export const authService = {
  login: async (credentials: LoginRequest): Promise<{ message: string }> => {
    // const result = await cecagemApi.post<{ message: string }>(
    //   "/auth/login",
    //   credentials
    // );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_CECAGEM_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    const result = await response.json();
    console.log("Login result:", result);

    return result;
  },

  me: async (): Promise<User2> => {
    const result = await cecagemApi.get<User2>("/auth/me");
    console.log("Me result:", result);

    return result;
  },

  logout: async (): Promise<void> => {
    try {
      await cecagemApi.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
};
