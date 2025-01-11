import { Co2Chart } from "@/components/charts/Co2Chart";
import { TempHumidChart } from "@/components/charts/TempHumidChart";
import { trendDatum, trendDatumUnixtime } from "@/types";
import { timestampToUnixtime } from "@/utils/helpers";
import { useApiClient } from "@/utils/useApiClient";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function Chart() {
  const locationName = import.meta.env.VITE_LOCATION;
  const { get } = useApiClient();
  const [co2Trend, setCo2Trend] = useState<trendDatumUnixtime[]>([]);
  const [co2MaTrend, setCo2MaTrend] = useState<trendDatumUnixtime[]>([]);
  const [temperatureTrend, setTemperatureTrend] = useState<
    trendDatumUnixtime[]
  >([]);
  const [humidityTrend, setHumidityTrend] = useState<trendDatumUnixtime[]>([]);

  useEffect(() => {
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
            <Box sx={{ display: "flex", width: "100%" }}>
              <Box>
                <Typography variant="h5">二酸化炭素濃度</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    sx={{ fontSize: "1.3rem", marginRight: "1.2rem" }}
                  >
                    現在
                  </Typography>
                  <Typography sx={{ fontSize: "3rem" }}>803.8</Typography>
                  <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
                    ppm
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography>更新: 01/10 16:32:27</Typography>
                </Box>
              </Box>
            </Box>
            <Co2Chart co2Trend={co2Trend} co2MaTrend={co2MaTrend} />
          </Grid>

          <Grid item xs={10} sm={10} md={6}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Box>
                <Typography variant="h5">気温と湿度</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ marginRight: "0.8rem" }}>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    sx={{ fontSize: "1.3rem", marginRight: "1.2rem" }}
                  >
                    現在
                  </Typography>
                  <Typography sx={{ fontSize: "3rem" }}>803.8</Typography>
                  <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
                    ℃
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: "flex" }}>
                  <Typography sx={{ fontSize: "3rem" }}>803.8</Typography>
                  <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
                    %
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography>更新: 01/10 16:32:27</Typography>
                </Box>
              </Box>
            </Box>
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
