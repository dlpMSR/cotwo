import { useApiClient } from "@/utils/useApiClient";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type Co2Trend = {
  timestamp: number | string;
  value: number;
};

export function Co2Chart() {
  const { get } = useApiClient();
  const [co2Trend, setCo2Trend] = useState<Co2Trend[]>([]);

  useEffect(() => {
    const fetchCo2Trend = async () => {
      let data = await get<Co2Trend[]>("/environment/trend/co2");
      data = data.map((item) => {
        return { timestamp: dayjs(item.timestamp).unix(), value: item.value };
      });
      setCo2Trend(data);
    };

    fetchCo2Trend();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveContainer width={"100%"} height={400}>
        <LineChart
          data={co2Trend}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="timestamp"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(unixTime) =>
              dayjs.unix(unixTime).format("MM-DD hh")
            }
            interval={1}
            type="number"
          />
          <YAxis />
          <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
