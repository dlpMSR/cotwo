import { DigitalClockDisplay } from "@/components/DigitalClockDisplay";
import { EnviroDisplay } from "@/components/EnviroDisplay";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export function Home() {
  const [displayWidth, setDisplayWidth] = useState<number>(0);
  useEffect(() => {
    // 先に中身のcomponentのサイズが決まるためGridは採用しない
    const resizeHandler = () => {
      const iw: number = window.innerWidth;
      let dw: number;
      if (iw < 600) {
        dw = Math.floor(iw * 0.83);
      } else if (iw < 900) {
        dw = Math.floor(iw * 0.67);
      } else {
        dw = Math.floor(iw * 0.5);
      }
      setDisplayWidth(dw);
    };
    resizeHandler(); // 初回Render後にdisplayWidthを初期化
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <Box
      className="lato-bold"
      sx={{ display: "flex", justifyContent: "center", width: "100%" }}
    >
      <Box sx={{ paddingTop: `${displayWidth * 0.0025}rem` }}>
        <Box sx={{ marginBottom: `${displayWidth * 0.003}rem` }}>
          <DigitalClockDisplay width={displayWidth} />
        </Box>
        <Box>
          <EnviroDisplay width={displayWidth} />
        </Box>
      </Box>
    </Box>
  );
}
