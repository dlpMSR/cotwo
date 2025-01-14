import { Co2Chart } from "@/components/charts/Co2Chart";
import { TempHumidChart } from "@/components/charts/TempHumidChart";
import { CurrentCo2Display } from "@/components/currentDisplay/CurrentCo2Display";
import { CurrentTempHumidDisplay } from "@/components/currentDisplay/CurrentTempHumidDisplay";
import { EnvValue, trendDatum, trendDatumUnixtime } from "@/types";
import { rollTimeSeries, timestampToUnixtime } from "@/utils/helpers";
import { useApiClient } from "@/utils/useApiClient";
import { useWebSocket } from "@/utils/useWebSocket";
import { Box, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import "./chart.scss";

type CurrentEnvValue = EnvValue & {
  updatedAt: dayjs.Dayjs | null;
};

export function Chart() {
  const locationName = import.meta.env.VITE_LOCATION;
  const { get } = useApiClient();
  const { connectWebSocket } = useWebSocket();
  const [envValue, setEnvValue] = useState<CurrentEnvValue>({
    co2: 0,
    temperature: 0,
    humidity: 0,
    updatedAt: null,
  });
  const [co2Trend, setCo2Trend] = useState<trendDatumUnixtime[]>([]);
  const [co2MaTrend, setCo2MaTrend] = useState<trendDatumUnixtime[]>([]);
  const [temperatureTrend, setTemperatureTrend] = useState<
    trendDatumUnixtime[]
  >([]);
  const [humidityTrend, setHumidityTrend] = useState<trendDatumUnixtime[]>([]);

  const fetchEnvValue = async () => {
    const data = await get<EnvValue>("/environment/measurement");
    setEnvValue({ ...data, updatedAt: null });
  };

  const fetchTrendData = async () => {
    const [co2Response, co2MaResponse, tempResponse, humidResponse] =
      await Promise.all([
        get<trendDatum[]>("/environment/trend/co2"),
        get<trendDatum[]>("/environment/trend/co2_ma"),
        get<trendDatum[]>("/environment/trend/temperature"),
        get<trendDatum[]>("/environment/trend/humidity"),
      ]);
    const co2Data = co2Response.map(timestampToUnixtime);
    const co2MaData = co2MaResponse.map(timestampToUnixtime);
    const temperatureData = tempResponse.map(timestampToUnixtime);
    const humidityData = humidResponse.map(timestampToUnixtime);
    setCo2Trend(co2Data);
    setCo2MaTrend(co2MaData);
    setTemperatureTrend(temperatureData);
    setHumidityTrend(humidityData);
  };

  const updateLiveData = (e: MessageEvent<string>) => {
    const value: EnvValue = JSON.parse(e.data).message;

    // 暫定でこの処理時点の日時を使用しているが、
    // いずれは配信値に含まれるtimestamp(計測日時)を使う
    const now = dayjs();

    setCo2Trend((prev: trendDatumUnixtime[]) => {
      return rollTimeSeries(prev, {
        timestamp: now.unix(),
        value: value.co2,
      });
    });

    setTemperatureTrend((prev: trendDatumUnixtime[]) => {
      return rollTimeSeries(prev, {
        timestamp: now.unix(),
        value: value.temperature,
      });
    });

    setHumidityTrend((prev: trendDatumUnixtime[]) => {
      return rollTimeSeries(prev, {
        timestamp: now.unix(),
        value: value.humidity,
      });
    });

    setEnvValue({ ...value, updatedAt: now });
  };

  useEffect(() => {
    fetchEnvValue();
    fetchTrendData();
    const socket = connectWebSocket("/env_values");
    socket.addEventListener("message", updateLiveData);
    return () => {
      socket.removeEventListener("message", updateLiveData);
      socket.close();
    };
  }, []);

  return (
    <Box className="chart-page" sx={{ width: "100%" }}>
      <Box
        sx={{
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Box sx={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={10} sm={10} md={12}>
              <Typography sx={{ fontSize: "2.2rem" }}>
                {locationName}
              </Typography>
            </Grid>

            <Grid item xs={10} sm={10} md={6}>
              <Box sx={{ marginBottom: "2rem" }}>
                <Box sx={{ marginBottom: "0.7rem" }}>
                  <CurrentCo2Display
                    co2={envValue.co2}
                    updatedAt={envValue.updatedAt}
                  />
                </Box>
                <Co2Chart co2Trend={co2Trend} co2MaTrend={co2MaTrend} />
              </Box>
            </Grid>

            <Grid item xs={10} sm={10} md={6}>
              <Box sx={{ marginBottom: "2rem" }}>
                <Box sx={{ marginBottom: "0.7rem" }}>
                  <CurrentTempHumidDisplay
                    temperature={envValue.temperature}
                    humidity={envValue.humidity}
                    updatedAt={envValue.updatedAt}
                  />
                </Box>
                <TempHumidChart
                  temperatureTrend={temperatureTrend}
                  humidityTrend={humidityTrend}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
