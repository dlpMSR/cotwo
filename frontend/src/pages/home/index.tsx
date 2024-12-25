import { DigitalClockDisplay } from "@/components/DigitalClockDisplay";
import { Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export function Home() {
  const elem = useRef<HTMLDivElement>(null);
  const [displayWidth, setDisplayWidth] = useState<number>(0);

  useEffect(() => {
    const resizeHandler = () => {
      if (elem.current) setDisplayWidth(elem.current.clientWidth);
    };
    resizeHandler(); // 初回Render後にdisplayWidthを初期化

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      <Grid container spacing={0} justifyContent="center">
        <Grid item xs={10} sm={8} md={6} ref={elem}>
          <DigitalClockDisplay width={displayWidth} />
        </Grid>
      </Grid>
    </>
  );
}
