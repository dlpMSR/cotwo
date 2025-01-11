import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

type CurrentCo2DisplayProps = {
  co2: number;
  updatedAt: dayjs.Dayjs | null;
};

export function CurrentCo2Display({ co2, updatedAt }: CurrentCo2DisplayProps) {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box>
        <Typography variant="h5">二酸化炭素濃度</Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ fontSize: "1.3rem", marginRight: "1.2rem" }}>
            現在
          </Typography>
          <Typography sx={{ fontSize: "3rem" }}>{co2.toFixed(1)}</Typography>
          <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
            ppm
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", height: "1.5rem" }}
        >
          {updatedAt && (
            <Typography>更新: {updatedAt.format("MM/DD HH:mm:ss")}</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
