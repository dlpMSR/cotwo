import { Box, Typography } from "@mui/material";

type CurrentCo2DisplayProps = {
  co2: number;
  updateAt: string | null;
};

export function CurrentCo2Display({ co2, updateAt }: CurrentCo2DisplayProps) {
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
          <Typography sx={{ fontSize: "3rem" }}>{co2}</Typography>
          <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
            ppm
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography>更新: 01/10 16:32:27</Typography>
        </Box>
      </Box>
    </Box>
  );
}
