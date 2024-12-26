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

  const fontSize: Record<string, string> = {
    date: `${width * 0.009}rem`,
    weekday: `${width * 0.0083}rem`,
    time: `${width * 0.03}rem`,
    second: `${width * 0.018}rem`,
  };

  return (
    <Box className="clock-display">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box>
          <Typography className="clock-number" sx={{ fontSize: fontSize.date }}>
            {year}/{month}/{date}
          </Typography>
        </Box>
        <Box>
          <Typography
            className="clock-number"
            sx={{
              fontSize: fontSize.weekday,
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
          <Typography className="clock-number" sx={{ fontSize: fontSize.time }}>
            {hour}
          </Typography>
        </Box>

        <Box>
          <Typography className="colon" sx={{ fontSize: fontSize.time }}>
            :
          </Typography>
        </Box>

        <Box>
          <Typography className="clock-number" sx={{ fontSize: fontSize.time }}>
            {minute}
          </Typography>
        </Box>

        <Box>
          <Typography
            className="clock-number"
            sx={{
              fontSize: fontSize.second,
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
