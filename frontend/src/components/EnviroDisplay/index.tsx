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
} from "@/types";
import { useApiClient } from "@/utils/useApiClient";
import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import "./EnviroDisplay.scss";

import dayjs from "dayjs";

interface EnviroDisplayProps {
  width: number;
}

export const EnviroDisplay = ({ width }: EnviroDisplayProps) => {
  const { get } = useApiClient();
  const initDate = useContext(RefreshContext);
  const socketRef = useContext(EnvValueStreamContext);
  const readyState = useContext(SocketStateContext);
  const [envValue, setEnvValue] = useState<CurrentEnvValue>({
    co2: 0,
    temperature: 0,
    humidity: 0,
    updatedAt: dayjs(),
  });

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
      setEnvValue({ ...data, updatedAt: dayjs() });
    };

    const updateLiveData = (e: MessageEvent<string>) => {
      const message: EnvValueStreamMessage = JSON.parse(e.data).message;
      const updatedAt = dayjs(message.timestamp + "Z");
      const data: EnvValue = {
        temperature: message.temperature,
        humidity: message.humidity,
        co2: message.co2_corrected, // co2ではなく補正値のco2_correctedを使う
      };
      setEnvValue({ ...data, updatedAt: updatedAt });
    };

    fetchEnvValue();
    if (socketRef?.current) {
      socketRef.current.addEventListener("message", updateLiveData);
    }

    return () => {
      socketRef?.current?.removeEventListener("message", updateLiveData);
    };
  }, [readyState, initDate]);

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
          <Box sx={{ alignSelf: "end" }}>
            <Typography
              className="enviro-letter"
              sx={{ fontSize: fontSize.unit }}
            >
              ppm
            </Typography>
          </Box>
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
            <Box
              sx={{
                width: `${width * 0.0035}rem`,
                alignSelf: "flex-end",
                textAlign: "right",
              }}
            >
              <Typography
                className="enviro-letter unit"
                sx={{ fontSize: fontSize.unit }}
              >
                °C
              </Typography>
            </Box>
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
            <Box
              sx={{
                width: `${width * 0.0035}rem`,
                alignSelf: "flex-end",
                textAlign: "right",
              }}
            >
              <Typography
                className="enviro-letter"
                sx={{ fontSize: fontSize.unit }}
              >
                %
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
