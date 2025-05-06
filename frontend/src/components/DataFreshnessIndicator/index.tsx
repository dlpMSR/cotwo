import { SocketStateContext } from "@/contexts/EnvValueStreamContext";
import Brightness1 from "@mui/icons-material/Brightness1";
import { IconButton } from "@mui/material";
import { useContext } from "react";

type DataFreshnessIndicatorProps = {
  fontSize: number;
};

export function DataFreshnessIndicator({
  fontSize,
}: DataFreshnessIndicatorProps) {
  const readyState = useContext(SocketStateContext);

  let color = "#ffc0cb";
  switch (readyState) {
    case null:
    case WebSocket.CONNECTING:
      color = "#ffd700"; // gold
      break;
    case WebSocket.OPEN:
      color = "#90ee90"; // lightgreen
      break;
    default:
      color = "#ffc0cb"; // pink
      break;
  }

  return (
    <IconButton disabled>
      <Brightness1 sx={{ fontSize: `${fontSize}rem`, color: color }} />
    </IconButton>
  );
}
