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

const timestampToUnixtime = (item) => {
  return { timestamp: dayjs(item.timestamp).unix(), value: item.value };
};

const renderCustomLegendText = (value: string) => {
  return <span style={{ color: "#666666", fontSize: "1.2rem" }}>{value}</span>;
};

export function TempHumidChart() {
  const { get } = useApiClient();
  const [tempertureTrend, setTempertureTrend] = useState([]);
  const [humidityTrend, setHumidityTrend] = useState([]);

  useEffect(() => {
    const fetchTempHumidTrend = async () => {
      const [tempResponse, humidResponse] = await Promise.all([
        get("/environment/trend/temperature"),
        get("/environment/trend/humidity"),
      ]);
      const tempertureData = tempResponse.map(timestampToUnixtime);
      const humidityData = humidResponse.map(timestampToUnixtime);
      setTempertureTrend(tempertureData);
      setHumidityTrend(humidityData);
    };

    fetchTempHumidTrend();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveContainer width={"100%"} height={270}>
        <LineChart margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickCount={12}
            tickLine={false}
            tick={{ fontSize: "1.2rem", fontWeight: "lighter" }}
            tickFormatter={(unixTime) => dayjs.unix(unixTime).format("hA")}
          />
          <YAxis
            yAxisId="left"
            type="number"
            tickCount={12}
            width={40}
            tick={{ fontSize: "1.2rem", fontWeight: "lighter" }}
            domain={[-10, 40]}
            allowDataOverflow
            unit="℃"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickCount={6}
            width={40}
            tick={{ fontSize: "1.2rem", fontWeight: "lighter" }}
            domain={[0, 100]}
            unit="%"
          />
          <CartesianGrid strokeDasharray="" vertical={false} />
          <Legend
            verticalAlign="top"
            height={27}
            iconType="plainline"
            formatter={renderCustomLegendText}
          />
          <Line
            data={tempertureTrend}
            name="気温[℃]"
            type="monotone"
            dataKey="value"
            stroke="#ff8c00"
            strokeWidth={3}
            dot={false}
            yAxisId="left"
          />
          <Line
            data={humidityTrend}
            name="湿度[%]"
            type="monotone"
            dataKey="value"
            stroke="#4169e1"
            strokeWidth={3}
            dot={false}
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
