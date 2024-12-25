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
      <Box>
        <Box className="date-display-container">
          <Box>
            <Typography>
              {timeNow.year()}/{timeNow.month() + 1}/{timeNow.date()}
            </Typography>
          </Box>
          <Box>
            <Typography>({timeNow.format("ddd")})</Typography>
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
