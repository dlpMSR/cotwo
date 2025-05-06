import { RefreshContext } from "@/contexts/RefreshContext";
import {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const EnvValueStreamContext =
  createContext<MutableRefObject<WebSocket | null> | null>(null);
export const SocketStateContext = createContext<WebSocket["readyState"] | null>(
  null
);

type EnvValueStreamProviderProps = {
  children: ReactNode;
};

/**
 * 環境値受信用WebSocketインスタンスを管理するContextProvider。
 * socketRef: socketをuseStateで保持すると諸々不都合だったのでuseRefにしてます。
 * readyState: socketの状態を示すState。なるべく正確になるよう制御しContextとして共有する。
 * socketの接続状態によって再レンダーをしたいときはreadyStateを使うようにしてください。
 */
export const EnvValueStreamProvider = ({
  children,
}: EnvValueStreamProviderProps) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<number | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const initDate = useContext(RefreshContext);

  const baseUrl = import.meta.env.VITE_WEBSOCKET_BASEURL;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 1000; // unit: ms

  const handleOpen = useCallback(() => {
    console.log("Connected.");
    setReadyState(socketRef.current ? socketRef.current.readyState : null);
    if (socketRef.current) {
      reconnectAttempts.current = 0;
    }
  }, []);

  const handleClose = useCallback(() => {
    console.log("Disconnected.");
    setReadyState(socketRef.current ? socketRef.current.readyState : null);
    if (socketRef.current) {
      if (reconnectAttempts.current <= MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current += 1;
        console.log(`Reconnecting... (attempt ${reconnectAttempts.current})`);
        setTimeout(() => {
          connect();
        }, RECONNECT_DELAY);
      } else {
        console.log("Maximum reconnection attempts reached.");
      }
    }
  }, []);

  const handleError = useCallback(() => {
    console.log("Error occurred.");
    setReadyState(socketRef.current ? socketRef.current.readyState : null);
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, []);

  const connect = useCallback(() => {
    const newSocket = new WebSocket(baseUrl + "/env_values");
    newSocket.addEventListener("open", handleOpen);
    newSocket.addEventListener("close", handleClose);
    newSocket.addEventListener("error", handleError);
    socketRef.current = newSocket;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.removeEventListener("open", handleOpen);
        socketRef.current.removeEventListener("close", handleClose);
        socketRef.current.removeEventListener("error", handleError);
        socketRef.current.close();
        setReadyState(null);
      }
    };
  }, [initDate]);

  return (
    <EnvValueStreamContext.Provider value={socketRef}>
      <SocketStateContext.Provider value={readyState}>
        {children}
      </SocketStateContext.Provider>
    </EnvValueStreamContext.Provider>
  );
};
