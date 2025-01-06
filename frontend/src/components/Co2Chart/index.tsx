import { useApiClient } from "@/utils/useApiClient";
import { useEffect, useState } from "react";
import { Line, LineChart } from "recharts";

type Co2Trend = {
  timestamp: string;
  value: number;
};

export function Co2Chart() {
  const { get } = useApiClient();
  const [co2Trend, setCo2Trend] = useState<Co2Trend[]>([]);

  useEffect(() => {
    const fetchCo2Trend = async () => {
      const data = await get<Co2Trend[]>("/environment/trend/co2");
      setCo2Trend(data);
    };

    fetchCo2Trend();
  }, []);

  return (
    <>
      <LineChart width={400} height={400} data={co2Trend}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </>
  );
}
