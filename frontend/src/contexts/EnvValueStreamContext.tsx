import { RefreshContext } from "@/contexts/RefreshContext";
import { useWebSocket } from "@/utils/useWebSocket";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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
  const initDate = useContext(RefreshContext);

  useEffect(() => {
    if (socket === undefined || socket?.readyState !== WebSocket.OPEN) {
      console.log(socket?.readyState);
      setSocket(connectWebSocket("/env_values"));
    }

    return () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [initDate]);

  return (
    <EnvValueStreamContext.Provider value={socket}>
      {children}
    </EnvValueStreamContext.Provider>
  );
};
