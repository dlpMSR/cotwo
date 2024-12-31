import { useApiClient } from "@/utils/useApiClient";
import { useWebSocket } from "@/utils/useWebSocket";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import "./EnviroDisplay.scss";

type EnvValue = {
  co2: number;
  temperature: number;
  humidity: number;
};

interface EnviroDisplayProps {
  width: number;
}

export const EnviroDisplay = ({ width }: EnviroDisplayProps) => {
  const [envValue, setEnvValue] = useState<EnvValue>({
    co2: 0,
    temperature: 0,
    humidity: 0,
  });
  const { get } = useApiClient();
  const { connectWebSocket } = useWebSocket();

  useEffect(() => {
    const fetchEnvValue = async () => {
      const data = await get<EnvValue>("/environment/measurement");
      setEnvValue(data);
    };
    const socket = connectWebSocket("/env_values");
    socket.addEventListener("message", (e) => {
      const message = JSON.parse(e.data).message;
      const data: EnvValue = {
        co2: message.co2,
        temperature: message.temperature,
        humidity: message.humidity,
      };
      setEnvValue(data);
    });

    fetchEnvValue();
  }, []);

  const fontSize: Record<string, string> = {
    co2: `${width * 0.012}rem`,
    temperature: `${width * 0.007}rem`,
    humidity: `${width * 0.007}rem`,
    unit: `${width * 0.003}rem`,
  };

  return (
    <Box className="enviro-display">
      <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
        <Box sx={{ display: "flex" }}>
          <Typography
            className="enviro-letter"
            sx={{ fontSize: fontSize.unit }}
          >
            CO
            <Typography
              component="sub"
              sx={{ fontFamily: "inherit", fontSize: "inherit" }}
            >
              2
            </Typography>
          </Typography>
          <Typography className="enviro-letter" sx={{ fontSize: fontSize.co2 }}>
            {envValue.co2.toFixed(1)}
          </Typography>
          <Typography
            className="enviro-letter unit"
            sx={{ fontSize: fontSize.unit }}
          >
            ppm
          </Typography>
        </Box>

        <Box sx={{ marginLeft: `${width * 0.003}rem` }}>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ marginInlineStart: "auto" }}>
              <Typography
                className="enviro-letter"
                sx={{ fontSize: fontSize.temperature }}
              >
                {envValue.temperature.toFixed(1)}
              </Typography>
            </Box>
            <Typography
              className="enviro-letter unit"
              sx={{ fontSize: fontSize.unit }}
            >
              °C
            </Typography>
          </Box>
          <Box sx={{ display: "flex", marginTop: `${width * 0.002}rem` }}>
            <Box sx={{ marginInlineStart: "auto" }}>
              <Typography
                className="enviro-letter"
                sx={{ fontSize: fontSize.humidity }}
              >
                {envValue.humidity.toFixed(1)}
              </Typography>
            </Box>
            <Typography
              className="enviro-letter unit"
              sx={{ fontSize: fontSize.unit }}
            >
              %
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
