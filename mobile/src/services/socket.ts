import { io, Socket } from "socket.io-client";
import { ENV } from "@/config/env";
import type { SocketEvent } from "@/types/events";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(ENV.SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
    });
  }
  return socket;
}

export type SocketHandlers = {
  onEvent: (event: SocketEvent) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onConnectError?: (err: unknown) => void;
};

export function startSocket(handlers: SocketHandlers) {
  const s = getSocket();

  s.on("connect", () => {
    console.log("Socket connected:", s.id);
    handlers.onConnect?.();
  });

  s.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    handlers.onDisconnect?.(reason);
  });

  s.on("connect_error", (err) => {
    console.log("Socket connect_error:", err);
    handlers.onConnectError?.(err);
  });

  s.on("event", (evt: SocketEvent) => {
    handlers.onEvent(evt);
  });

  if (!s.connected) s.connect();

  return () => {
    s.off("connect");
    s.off("disconnect");
    s.off("connect_error");
    s.off("event");
  };
}