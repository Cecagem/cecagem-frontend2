import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_CECAGEM_URL?.replace("/api/v1", "") ||
  "https://back-system.cecagem.com";

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  return socket;
};

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) {
    console.log("🔄 Socket ya conectado, reutilizando:", socket.id);
    return socket;
  }

  console.log("🔌 Iniciando conexión socket a:", `${SOCKET_URL}/notifications`);
  console.log("🔑 Token presente:", token ? "✅ Sí" : "❌ No");

  socket = io(`${SOCKET_URL}/notifications`, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("✅ Socket conectado exitosamente");
    console.log("   - Socket ID:", socket?.id);
    console.log("   - Connected:", socket?.connected);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket desconectado");
    console.log("   - Razón:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Error de conexión socket");
    console.error("   - Mensaje:", error.message);
    console.error("   - Detalles:", error);
  });

  socket.on("error", (error) => {
    console.error("❌ Error general del socket:", error);
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket desconectado manualmente");
  }
};
