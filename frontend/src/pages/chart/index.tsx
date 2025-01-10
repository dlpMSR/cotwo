import { Co2Chart } from "@/components/Co2Chart";
import { Box, Grid, Typography } from "@mui/material";

export function Chart() {
  const locationName = import.meta.env.VITE_LOCATION;

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={10} sm={10} md={12}>
            <Typography variant="h4">{locationName}</Typography>
          </Grid>
          <Grid item xs={10} sm={10} md={6}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Box>
                <Typography variant="h5">二酸化炭素濃度</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    sx={{ fontSize: "1.3rem", marginRight: "1.2rem" }}
                  >
                    現在
                  </Typography>
                  <Typography sx={{ fontSize: "3rem" }}>803.8</Typography>
                  <Typography sx={{ fontSize: "1.3rem", alignSelf: "end" }}>
                    ppm
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography>更新: 01/10 16:32:27</Typography>
                </Box>
              </Box>
            </Box>
            <Co2Chart />
          </Grid>

          <Grid item xs={10} sm={10} md={6} sx={{ backgroundColor: "yellow" }}>
            hoge
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
