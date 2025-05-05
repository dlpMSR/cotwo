import dayjs from "dayjs";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";

export const RefreshContext = createContext<dayjs.Dayjs | null>(null);

type RefreshContextProviderProps = {
  children: ReactNode;
};

export const RefreshContextProvider = ({
  children,
}: RefreshContextProviderProps) => {
  const [initDate, setInitDate] = useState<dayjs.Dayjs>(dayjs());

  let estimateTime = useRef<dayjs.Dayjs>(dayjs());
  useEffect(() => {
    const interval = setInterval(() => {
      estimateTime.current = estimateTime.current.add(1, "second");
      const diff: number = dayjs().diff(estimateTime.current); // unit: ms
      if (diff > 3000) {
        const now = dayjs();
        setInitDate(now);
        estimateTime.current = now;

        console.log("reloaded.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <RefreshContext.Provider value={initDate}>
      {children}
    </RefreshContext.Provider>
  );
};
