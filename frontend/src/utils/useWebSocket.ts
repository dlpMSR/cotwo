import { useCallback } from "react";

export const useWebSocket = () => {
  const baseUrl = import.meta.env.VITE_WEBSOCKET_BASEURL;

  const connectWebSocket = useCallback(
    (path: string): WebSocket => {
      return new WebSocket(baseUrl + path);
    }, []
  );

  return { connectWebSocket };
}
