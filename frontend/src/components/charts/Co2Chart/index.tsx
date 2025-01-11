import { trendDatum, trendDatumUnixtime } from "@/types";
import { timestampToUnixtime } from "@/utils/helpers";
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

const renderCustomLegendText = (value: string) => {
  return <span style={{ color: "#666666", fontSize: "1.2rem" }}>{value}</span>;
};

export function Co2Chart() {
  const { get } = useApiClient();
  const [co2Trend, setCo2Trend] = useState<trendDatumUnixtime[]>([]);
  const [co2MaTrend, setCo2MaTrend] = useState<trendDatumUnixtime[]>([]);

  useEffect(() => {
    const fetchCo2Trend = async () => {
      const [co2Response, co2MaResponse] = await Promise.all([
        get<trendDatum[]>("/environment/trend/co2"),
        get<trendDatum[]>("/environment/trend/co2_ma"),
      ]);
      const co2Data = co2Response.map(timestampToUnixtime);
      const co2MaData = co2MaResponse.map(timestampToUnixtime);
      setCo2Trend(co2Data);
      setCo2MaTrend(co2MaData);
    };

    fetchCo2Trend();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveContainer width={"100%"} height={270}>
        <LineChart margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
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
            tickCount={10}
            width={40}
            tick={{ fontSize: "1.2rem", fontWeight: "lighter" }}
          />
          <CartesianGrid strokeDasharray="" vertical={false} />
          <Legend
            verticalAlign="top"
            height={27}
            iconType="plainline"
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
