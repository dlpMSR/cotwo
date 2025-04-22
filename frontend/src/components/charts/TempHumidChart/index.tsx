import { trendDatumUnixtime } from "@/types";
import { calculateTimeTicks } from "@/utils/helpers";
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

const renderCustomLegendText = (value: string) => {
  return <span style={{ color: "#666666", fontSize: "1.2rem" }}>{value}</span>;
};

const TempHumidTooltip = ({
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
        borderRadius: "3px",
        padding: "3px",
        width: 60,
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
      >{`${payload[0].value} ℃`}</span>
      <span
        style={{ display: "block", color: payload[1].color }}
      >{`${payload[1].value} %`}</span>
    </div>
  );
};

type TempHumidChartProps = {
  temperatureTrend: trendDatumUnixtime[];
  humidityTrend: trendDatumUnixtime[];
};

export function TempHumidChart({
  temperatureTrend,
  humidityTrend,
}: TempHumidChartProps) {
  let [tsMin, tsMax] = [0, 0];
  if (temperatureTrend.length > 0) {
    tsMin = temperatureTrend[temperatureTrend.length - 1].timestamp;
    tsMax = temperatureTrend[0].timestamp;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ marginBottom: "1.3rem" }}>
        <Typography sx={{ fontSize: "1.7rem" }}>過去12時間の推移</Typography>
      </Box>
      <ResponsiveContainer width={"100%"} height={270}>
        <LineChart margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
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
            width={30}
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
          <Tooltip content={<TempHumidTooltip />} />
          <Line
            data={temperatureTrend}
            name="気温[℃]"
            type="monotone"
            dataKey="value"
            stroke="#ff8c00"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
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
            isAnimationActive={false}
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
