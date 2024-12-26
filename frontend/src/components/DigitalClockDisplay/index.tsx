import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import "./DigitalClockDisplay.scss";

interface DigitalClockDisplayProps {
  width: number;
}

const padZero = (num: number): string => {
  return num < 10 ? "0" + String(num) : String(num);
};

export const DigitalClockDisplay = ({ width }: DigitalClockDisplayProps) => {
  const [timeNow, setTimeNow] = useState<dayjs.Dayjs>(dayjs());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  });

  const year: string = String(timeNow.year());
  const month: string = padZero(timeNow.month() + 1);
  const date: string = padZero(timeNow.date());
  const hour: string = padZero(timeNow.hour());
  const minute: string = padZero(timeNow.minute());
  const second: string = padZero(timeNow.second());

  return (
    <Box className="clock-display">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: `${width * 0.0025}rem`,
        }}
      >
        <Box>
          <Typography
            className="clock-number"
            sx={{ fontSize: `${width * 0.009}rem` }}
          >
            {year}/{month}/{date}
          </Typography>
        </Box>
        <Box>
          <Typography
            className="clock-number"
            sx={{
              fontSize: `${width * 0.0083}rem`,
              marginLeft: `${width * 0.001}rem`,
            }}
          >
            ({timeNow.format("ddd")})
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Box>
          <Typography
            className="clock-number"
            sx={{ fontSize: `${width * 0.03}rem` }}
          >
            {hour}
          </Typography>
        </Box>

        <Box>
          <Typography className="colon" sx={{ fontSize: `${width * 0.03}rem` }}>
            :
          </Typography>
        </Box>

        <Box>
          <Typography
            className="clock-number"
            sx={{ fontSize: `${width * 0.03}rem` }}
          >
            {minute}
          </Typography>
        </Box>

        <Box>
          <Typography
            className="clock-number"
            sx={{
              fontSize: `${width * 0.018}rem`,
              marginLeft: `${width * 0.002}rem`,
              marginBottom: `${width * 0.001}rem`,
            }}
          >
            {second}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
