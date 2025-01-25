import { useWebSocket } from "@/utils/useWebSocket";
import { createContext, ReactNode, useEffect, useState } from "react";

export const EnvValueStreamContext = createContext<WebSocket | undefined>(
  undefined
);

type EnvValueStreamProviderProps = {
  children: ReactNode;
};

export const EnvValueStreamProvider = ({
  children,
}: EnvValueStreamProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | undefined>();
  const { connectWebSocket } = useWebSocket();

  useEffect(() => {
    setSocket(connectWebSocket("/env_values"));
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <EnvValueStreamContext.Provider value={socket}>
      {children}
    </EnvValueStreamContext.Provider>
  );
};
