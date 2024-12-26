import { Box, Typography } from "@mui/material";
import "./EnviroDisplay.scss";

interface EnviroDisplayProps {
  width: number;
}

export const EnviroDisplay = ({ width }: EnviroDisplayProps) => {
  const fontSize: Record<string, string> = {
    co2: `${width * 0.012}rem`,
    temperature: `${width * 0.007}rem`,
    humidity: `${width * 0.007}rem`,
    unit: `${width * 0.003}rem`,
  };

  return (
    <Box className="enviro-display">
      <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
        <Box sx={{ display: "flex" }}>
          <Typography
            className="enviro-letter"
            sx={{ fontSize: fontSize.unit }}
          >
            CO
            <Typography
              component="sub"
              sx={{ fontFamily: "inherit", fontSize: "inherit" }}
            >
              2
            </Typography>
          </Typography>
          <Typography className="enviro-letter" sx={{ fontSize: fontSize.co2 }}>
            25.0
          </Typography>
          <Typography
            className="enviro-letter unit"
            sx={{ fontSize: fontSize.unit }}
          >
            ppm
          </Typography>
        </Box>

        <Box sx={{ marginLeft: `${width * 0.003}rem` }}>
          <Box sx={{ display: "flex" }}>
            <Box>
              <Typography
                className="enviro-letter"
                sx={{ fontSize: fontSize.temperature }}
              >
                52.5
              </Typography>
            </Box>
            <Typography
              className="enviro-letter unit"
              sx={{ fontSize: fontSize.unit }}
            >
              °C
            </Typography>
          </Box>
          <Box sx={{ display: "flex", marginTop: `${width * 0.002}rem` }}>
            <Box>
              <Typography
                className="enviro-letter"
                sx={{ fontSize: fontSize.humidity }}
              >
                52.5
              </Typography>
            </Box>
            <Typography
              className="enviro-letter unit"
              sx={{ fontSize: fontSize.unit }}
            >
              %
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
