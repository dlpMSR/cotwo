import { useApiClient } from "@/utils/useApiClient";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Co2Trend = {
  timestamp: number | string;
  value: number;
};

export function Co2Chart() {
  const { get } = useApiClient();
  const [co2Trend, setCo2Trend] = useState<Co2Trend[]>([]);
  const [co2MaTrend, setCo2MaTrend] = useState<Co2Trend[]>([]);

  useEffect(() => {
    const fetchCo2Trend = async () => {
      const [co2Response, co2MaResponse] = await Promise.all([
        get<Co2Trend[]>("/environment/trend/co2"),
        get<Co2Trend[]>("/environment/trend/co2_ma"),
      ]);
      const co2Data = co2Response.map((item) => {
        return { timestamp: dayjs(item.timestamp).unix(), value: item.value };
      });
      const co2MaData = co2MaResponse.map((item) => {
        return { timestamp: dayjs(item.timestamp).unix(), value: item.value };
      });

      setCo2Trend(co2Data);
      setCo2MaTrend(co2MaData);
    };

    fetchCo2Trend();
  }, []);

  const color = {
    tick: "#666666",
    legend: "#666666",
  };
  const renderCustomLegendText = (value: string) => {
    return <span style={{ color: color.legend }}>{value}</span>;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveContainer width={"100%"} height={255}>
        <LineChart margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickCount={12}
            tickFormatter={(unixTime) => dayjs.unix(unixTime).format("hA")}
          />
          <YAxis tickCount={10} width={40} />
          <CartesianGrid strokeDasharray="" vertical={false} />
          <Legend
            verticalAlign="top"
            height={24}
            formatter={renderCustomLegendText}
          />
          <Line
            data={co2Trend}
            name="二酸化炭素濃度[ppm]"
            type="monotone"
            dataKey="value"
            stroke="#afeeee"
            strokeWidth={3}
            dot={false}
          />
          <Line
            data={co2MaTrend}
            name="30分間移動平均[ppm]"
            type="monotone"
            dataKey="value"
            stroke="#20b2aa"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
