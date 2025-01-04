import { useEffect, useRef, useState } from "react";
import {
  type ManagerOptions,
  type Socket,
  type SocketOptions,
  io,
} from "socket.io-client";

export interface SocketStatus {
  connected: boolean;
  reconnecting: boolean;
  error: string | null;
  connectionAttempts: number;
  latency: number | null;
  statusMessage: string;
  transport: string;
}

export type UseSocketStatusReturn = [SocketStatus, Socket | null];

/**
 * Custom Hook to track socket status and events.
 * @param serverUrl The server URL for the socket.io connection.
 * @param options Options for the socket.io connection.
 */
export const useSocketStatus = (
  serverUrl: string,
  options?: Partial<ManagerOptions & SocketOptions>
): UseSocketStatusReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>({
    connected: socketRef.current?.connected || false,
    reconnecting: false,
    error: null,
    connectionAttempts: 0,
    latency: null,
    statusMessage: "Disconnected",
    transport: "",
  });

  useEffect(() => {
    // Initialize socket connection
    // if (!socketRef.current) {
    const socket = io(serverUrl, options);
    socketRef.current = socket;
    // }

    // Event handlers
    const handleConnect = () => {
      setSocketStatus((prev) => ({
        ...prev,
        connected: true,
        reconnecting: false,
        error: null,
        statusMessage: "Connected",
        transport: socket.io.engine.transport.name,
      }));
    };

    const handleDisconnect = (reason: string) => {
      setSocketStatus((prev) => ({
        ...prev,
        connected: false,
        statusMessage: `Disconnected: ${reason}`,
      }));
    };

    const handleConnectError = (error: Error) => {
      setSocketStatus((prev) => ({
        ...prev,
        error: error.message || "Unknown connection error",
        statusMessage: "Connection error",
      }));
    };

    const handleReconnectAttempt = () => {
      setSocketStatus((prev) => ({
        ...prev,
        reconnecting: true,
        statusMessage: "Reconnecting...",
      }));
    };

    const handleReconnect = (attemptNumber: number) => {
      setSocketStatus((prev) => ({
        ...prev,
        connected: true,
        reconnecting: false,
        connectionAttempts: attemptNumber,
        error: null,
        statusMessage: `Reconnected after ${attemptNumber} attempt(s)`,
      }));
    };

    const handleReconnectError = (error: Error) => {
      setSocketStatus((prev) => ({
        ...prev,
        reconnecting: false,
        error: error.message || "Reconnection error",
        statusMessage: "Reconnection error",
      }));
    };

    const handleReconnectFailed = () => {
      setSocketStatus((prev) => ({
        ...prev,
        reconnecting: false,
        statusMessage: "Reconnection failed",
      }));
    };

    const handlePong = (latency: number) => {
      setSocketStatus((prev) => ({
        ...prev,
        latency,
        statusMessage: `Latency: ${latency}ms`,
      }));
    };

    // Attach event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("reconnect", handleReconnect);
    socket.on("reconnect_error", handleReconnectError);
    socket.on("reconnect_failed", handleReconnectFailed);
    socket.on("pong", handlePong);

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl, options]);

  return [socketStatus, socketRef.current];
};

type SocketStatusVariant = "info" | "success" | "warning" | "destructive";

export const getSocketStatus = (socketStatus: SocketStatus) => {
  const status = {
    variant: "info",
    text: socketStatus.statusMessage,
  } as { variant: SocketStatusVariant; text: string };
  if (socketStatus.connected) {
    status.variant = "success";
  } else if (socketStatus.reconnecting) {
    status.variant = "warning";
  } else if (socketStatus.error) {
    status.variant = "destructive";
  } else {
    status.variant = "info";
  }
  if (socketStatus.latency) {
    status.text += ` (${socketStatus.latency}ms)`;
  }
  return status;
};
