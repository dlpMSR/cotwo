import { Co2Chart } from "@/components/charts/Co2Chart";
import { TempHumidChart } from "@/components/charts/TempHumidChart";
import { CurrentCo2Display } from "@/components/currentDisplay/CurrentCo2Display";
import { CurrentTempHumidDisplay } from "@/components/currentDisplay/CurrentTempHumidDisplay";
import {
  EnvValueStreamContext,
  SocketStateContext,
} from "@/contexts/EnvValueStreamContext";
import { RefreshContext } from "@/contexts/RefreshContext";
import {
  CurrentEnvValue,
  EnvValue,
  EnvValueStreamMessage,
  latestMeasurementApiResponse,
  trendDatum,
  trendDatumUnixtime,
} from "@/types";
import { rollTimeSeries, timestampToUnixtime } from "@/utils/helpers";
import { useApiClient } from "@/utils/useApiClient";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useContext, useEffect, useState } from "react";
import "./chart.scss";

dayjs.extend(utc);

export function Chart() {
  const locationName = import.meta.env.VITE_LOCATION;
  const { get } = useApiClient();
  const initDate = useContext(RefreshContext);
  const socketRef = useContext(EnvValueStreamContext);
  const readyState = useContext(SocketStateContext);
  const [envValue, setEnvValue] = useState<CurrentEnvValue>({
    co2: 0,
    temperature: 0,
    humidity: 0,
    updatedAt: null,
  });
  const [co2Trend, setCo2Trend] = useState<trendDatumUnixtime[]>([]);
  const [temperatureTrend, setTemperatureTrend] = useState<
    trendDatumUnixtime[]
  >([]);
  const [humidityTrend, setHumidityTrend] = useState<trendDatumUnixtime[]>([]);

  useEffect(() => {
    const fetchEnvValue = async () => {
      const response = await get<latestMeasurementApiResponse>(
        "/environment/measurement"
      );
      const data: EnvValue = {
        temperature: response.temperature,
        humidity: response.humidity,
        co2: response.co2,
      };
      setEnvValue({ ...data, updatedAt: null });
    };

    const fetchTrendData = async () => {
      const [co2Response, tempResponse, humidResponse] = await Promise.all([
        get<trendDatum[]>("/environment/trend/co2"),
        get<trendDatum[]>("/environment/trend/temperature"),
        get<trendDatum[]>("/environment/trend/humidity"),
      ]);
      const co2Data = co2Response.map(timestampToUnixtime);
      const temperatureData = tempResponse.map(timestampToUnixtime);
      const humidityData = humidResponse.map(timestampToUnixtime);
      setCo2Trend(co2Data);
      setTemperatureTrend(temperatureData);
      setHumidityTrend(humidityData);
    };

    const updateLiveData = (e: MessageEvent<string>) => {
      const message: EnvValueStreamMessage = JSON.parse(e.data).message;
      const updatedAt = dayjs.utc(message.timestamp);
      setCo2Trend((prev: trendDatumUnixtime[]) => {
        return rollTimeSeries(prev, {
          timestamp: updatedAt.unix(),
          value: message.co2, // 補正前の値
        });
      });
      setTemperatureTrend((prev: trendDatumUnixtime[]) => {
        return rollTimeSeries(prev, {
          timestamp: updatedAt.unix(),
          value: message.temperature,
        });
      });
      setHumidityTrend((prev: trendDatumUnixtime[]) => {
        return rollTimeSeries(prev, {
          timestamp: updatedAt.unix(),
          value: message.humidity,
        });
      });
      setEnvValue({
        temperature: message.temperature,
        humidity: message.humidity,
        co2: message.co2_corrected, // 数値での掲示には補正値を使う
        updatedAt: updatedAt.local(),
      });
    };

    fetchEnvValue();
    fetchTrendData();
    if (socketRef?.current) {
      socketRef.current.addEventListener("message", updateLiveData);
    }

    return () => {
      socketRef?.current?.removeEventListener("message", updateLiveData);
    };
  }, [readyState, initDate]);

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
            <Grid size={{ xs: 12, sm: 10, md: 12 }}>
              <Typography sx={{ fontSize: "2.2rem", paddingBottom: "1.8rem" }}>
                {locationName}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 10, md: 6 }}>
              <Box sx={{ marginBottom: "2rem" }}>
                <Box sx={{ marginBottom: "0.7rem" }}>
                  <CurrentCo2Display
                    co2={envValue.co2}
                    updatedAt={envValue.updatedAt}
                  />
                </Box>
                <Co2Chart co2Trend={co2Trend} />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 10, md: 6 }}>
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
