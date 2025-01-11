import { Co2Chart } from "@/components/charts/Co2Chart";
import { TempHumidChart } from "@/components/charts/TempHumidChart";
import { CurrentCo2Display } from "@/components/CurrentCo2Display";
import { CurrentTempHumidDisplay } from "@/components/CurrentTempHumidDisplay";
import { EnvValue, trendDatum, trendDatumUnixtime } from "@/types";
import { timestampToUnixtime } from "@/utils/helpers";
import { useApiClient } from "@/utils/useApiClient";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function Chart() {
  const locationName = import.meta.env.VITE_LOCATION;
  const { get } = useApiClient();
  const [envValue, setEnvValue] = useState<EnvValue>({
    co2: 0,
    temperature: 0,
    humidity: 0,
  });
  const [co2Trend, setCo2Trend] = useState<trendDatumUnixtime[]>([]);
  const [co2MaTrend, setCo2MaTrend] = useState<trendDatumUnixtime[]>([]);
  const [temperatureTrend, setTemperatureTrend] = useState<
    trendDatumUnixtime[]
  >([]);
  const [humidityTrend, setHumidityTrend] = useState<trendDatumUnixtime[]>([]);

  useEffect(() => {
    const fetchEnvValue = async () => {
      const data = await get<EnvValue>("/environment/measurement");
      setEnvValue(data);
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

    fetchEnvValue();
    fetchTrendData();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={10} sm={10} md={12}>
            <Typography variant="h4">{locationName}</Typography>
          </Grid>

          <Grid item xs={10} sm={10} md={6}>
            <CurrentCo2Display co2={envValue.co2} />
            <Co2Chart co2Trend={co2Trend} co2MaTrend={co2MaTrend} />
          </Grid>

          <Grid item xs={10} sm={10} md={6}>
            <CurrentTempHumidDisplay
              temperature={envValue.temperature}
              humidity={envValue.humidity}
            />
            <TempHumidChart
              temperatureTrend={temperatureTrend}
              humidityTrend={humidityTrend}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
