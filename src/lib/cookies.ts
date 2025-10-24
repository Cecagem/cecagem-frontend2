export const getAuthToken = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/auth/token", {
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("No se pudo obtener el token del servidor");
      return null;
    }

    const data = await response.json();
    return data.token || null;
  } catch (error) {
    console.error("Error obteniendo token:", error);
    return null;
  }
};
