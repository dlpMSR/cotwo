import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

type CurrentTempHumidDisplayProps = {
  temperature: number;
  humidity: number;
  updatedAt: dayjs.Dayjs | null;
};

export function CurrentTempHumidDisplay({
  temperature,
  humidity,
  updatedAt,
}: CurrentTempHumidDisplayProps) {
  return (
    <Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box>
          <Typography variant="h5">気温と湿度</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ marginRight: "0.8rem" }}>
          <Box sx={{ display: "flex" }}>
            <Typography sx={{ fontSize: "1.3rem", marginRight: "1.2rem" }}>
              現在
            </Typography>
            <Typography sx={{ fontSize: "3rem" }}>{temperature}</Typography>
            <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
              ℃
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: "flex" }}>
            <Typography sx={{ fontSize: "3rem" }}>{humidity}</Typography>
            <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
              %
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", height: "1.5rem" }}
      >
        {updatedAt && (
          <Typography>更新: {updatedAt.format("MM/DD HH:mm:ss")}</Typography>
        )}
      </Box>
    </Box>
  );
}
