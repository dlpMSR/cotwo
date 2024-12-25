import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import "./DigitalClockDisplay.scss";

interface DigitalClockDisplayProps {
  width: number;
}

export const DigitalClockDisplay = ({ width }: DigitalClockDisplayProps) => {
  const [timeNow, setTimeNow] = useState<dayjs.Dayjs>(dayjs());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <>
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
              {timeNow.year()}/{timeNow.month() + 1}/{timeNow.date()}
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
          sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
        >
          <Box>
            <Typography
              className="clock-number"
              sx={{ fontSize: `${width * 0.03}rem` }}
            >
              {timeNow.hour()}
            </Typography>
          </Box>

          <Box>
            <Typography
              className="colon"
              sx={{ fontSize: `${width * 0.03}rem` }}
            >
              :
            </Typography>
          </Box>

          <Box>
            <Typography
              className="clock-number"
              sx={{ fontSize: `${width * 0.03}rem` }}
            >
              {timeNow.minute()}
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
              {timeNow.second()}
            </Typography>
          </Box>
        </Box>

        {/* <div class="d-flex flex-row align-end">
        <div>
          <span class="time number">{{ hour }}</span>
        </div>

        <div>
          <span class="time colon">:</span>
        </div>

        <div>
          <span class="time number">{{ minute }}</span>
        </div>

        <div>
          <span class="number second">{{ second }}</span>
        </div>
      </div> */}
      </Box>
    </>
  );
};
