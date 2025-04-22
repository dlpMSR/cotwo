import { trendDatumUnixtime } from "@/types";
import {
  calculateTimeTicks,
  calculateTrendMovingAverage,
} from "@/utils/helpers";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

const Co2Tooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, number>) => {
  if (!(active && payload && payload.length)) return null;

  const date = dayjs.unix(label);
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.96)",
        border: "1px solid #cccccc",
        borderRadius: "1px",
        padding: "3px",
        width: 80,
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: "2px",
          color: "#404040",
        }}
      >
        {date.format("HH:mm:ss")}
      </span>
      <span
        style={{ display: "block", color: payload[0].color }}
      >{`${payload[0].value?.toFixed(1)} ppm`}</span>

      {payload[1] !== undefined && (
        <span
          style={{ display: "block", color: payload[1].color }}
        >{`${payload[1].value?.toFixed(1)} ppm`}</span>
      )}
    </div>
  );
};

const renderCustomLegendText = (value: string) => {
  return <span style={{ color: "#666666", fontSize: "1.2rem" }}>{value}</span>;
};

type MargedCo2Datum = {
  timestamp: number;
  co2: number;
  ma: number | undefined;
};

type Co2ChartProps = {
  co2Trend: trendDatumUnixtime[];
};

export function Co2Chart({ co2Trend }: Co2ChartProps) {
  const co2MaTrend: trendDatumUnixtime[] = calculateTrendMovingAverage(
    co2Trend,
    30
  );

  // Tooltipの表示を適切にするため、co2Trendとco2MaTrendの2系列を統合する
  const margedCo2Series: MargedCo2Datum[] = co2Trend.map((item) => {
    const match = co2MaTrend.find((i) => i.timestamp == item.timestamp);
    return {
      timestamp: item.timestamp,
      co2: item.value,
      ma: match ? match.value : undefined,
    };
  });

  let [tsMin, tsMax] = [0, 0];
  if (co2Trend.length > 0) {
    tsMin = co2Trend[co2Trend.length - 1].timestamp;
    tsMax = co2Trend[0].timestamp;
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
            ticks={calculateTimeTicks(tsMin, tsMax)}
            tickLine={false}
            tick={{ fontSize: "1.2rem", fontWeight: "lighter" }}
            tickFormatter={(unixTime) => dayjs.unix(unixTime).format("hA")}
          />
          <YAxis
            tickCount={10}
            width={40}
            tick={{ fontSize: "1.2rem", fontWeight: "lighter" }}
            domain={([, dataMax]) => {
              return [0, dataMax < 1800 ? 1800 : dataMax];
            }}
          />
          <CartesianGrid strokeDasharray="" vertical={false} />
          <Legend
            verticalAlign="top"
            height={27}
            iconType="plainline"
            formatter={renderCustomLegendText}
          />
          <Tooltip content={<Co2Tooltip />} />
          <Line
            data={margedCo2Series}
            name="二酸化炭素濃度[ppm]"
            type="monotone"
            dataKey="co2"
            stroke="#afeeee"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            data={margedCo2Series}
            name="30分間移動平均[ppm]"
            type="monotone"
            dataKey="ma"
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
