import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const DigitalClockDisplay = () => {
  const [timeNow, setTimeNow] = useState<dayjs.Dayjs>(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <Box className="clock-container">
      <Box className="date-display-container">
        <Box>
          <Typography>
            {timeNow.year()}/{timeNow.month() + 1}/{timeNow.date()}
          </Typography>
        </Box>
        {/* <div class="weekday">
          <span>({{ weekday }})</span>
        </div> */}
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
  );
};
