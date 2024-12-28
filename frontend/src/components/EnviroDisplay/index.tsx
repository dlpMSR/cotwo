import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
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

  useEffect(() => {
    const fetchEnvValue = async () => {
      try {
        const response = await fetch(
          "http://localhost/api/v1/environment/measurement"
        );
        if (!response.ok) throw new Error();

        const res = await response.json();
        const { timestamp, ...data } = res;
        setEnvValue(data);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    };

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
            <Box>
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
            <Box>
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
