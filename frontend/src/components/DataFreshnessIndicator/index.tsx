import { EnvValueStreamContext } from "@/contexts/EnvValueStreamContext";
import Brightness1 from "@mui/icons-material/Brightness1";
import { IconButton } from "@mui/material";
import { useContext } from "react";

type DataFreshnessIndicatorProps = {
  fontSize: number;
};

export function DataFreshnessIndicator({
  fontSize,
}: DataFreshnessIndicatorProps) {
  const socket = useContext(EnvValueStreamContext);

  // lightgreen or pink
  const color = socket?.readyState == WebSocket.OPEN ? "#90ee90" : "#ffc0cb";

  return (
    <IconButton disabled>
      <Brightness1 sx={{ fontSize: `${fontSize}rem`, color: color }} />
    </IconButton>
  );
}
