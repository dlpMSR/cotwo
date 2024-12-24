import { DigitalClockDisplay } from "@/components/DigitalClockDisplay";
import { Grid } from "@mui/material";
import "./home.scss";

function Home() {
  return (
    <>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{ boxSizing: "border-box" }}
      >
        <Grid item xs={10} sm={8} md={6}>
          <DigitalClockDisplay />
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
