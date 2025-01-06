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
