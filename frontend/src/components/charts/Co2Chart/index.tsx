import { trendDatumUnixtime } from "@/types";
import { TrendDataInsufficientError } from "@/utils/errors";
import { calculateTrendMovingAverage } from "@/utils/helpers";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
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

type Co2ChartProps = {
  co2Trend: trendDatumUnixtime[];
};

export function Co2Chart({ co2Trend }: Co2ChartProps) {
  let co2MaTrend: trendDatumUnixtime[] = [];
  try {
    co2MaTrend = calculateTrendMovingAverage(co2Trend, 30);
  } catch (e) {
    if (e instanceof TrendDataInsufficientError) {
      console.log(e.message);
    } else {
      throw e;
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ marginBottom: "1.3rem" }}>
        <Typography sx={{ fontSize: "1.7rem" }}>過去12時間の推移</Typography>
      </Box>
      <ResponsiveContainer width={"100%"} height={270}>
        <LineChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
            isAnimationActive={false}
          />
          <Line
            data={co2MaTrend}
            name="30分間移動平均[ppm]"
            type="monotone"
            dataKey="value"
            stroke="#20b2aa"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
