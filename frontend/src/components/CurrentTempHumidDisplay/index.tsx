import { Box, Typography } from "@mui/material";

export function CurrentTempHumidDisplay() {
  return (
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
          <Typography sx={{ fontSize: "3rem" }}>803.8</Typography>
          <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
            ℃
          </Typography>
        </Box>
      </Box>
      <Box>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ fontSize: "3rem" }}>803.8</Typography>
          <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
            %
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography>更新: 01/10 16:32:27</Typography>
        </Box>
      </Box>
    </Box>
  );
}
