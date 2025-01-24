import { Box, Tab, Tabs } from "@mui/material";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import "./app.scss";
import { EnvValueStreamProvider } from "./contexts/EnvValueStreamContext";
import { Chart } from "./pages/chart";
import { Home } from "./pages/home";

const App = () => {
  const location = useLocation();

  return (
    <>
      <Box className="header">
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }} />
          <Tabs value={location.pathname}>
            <Tab
              label="Home"
              value="/"
              to="/"
              component={Link}
              className="tab-item"
            />
            <Tab
              label="Chart"
              value="/chart"
              to="/chart"
              component={Link}
              className="tab-item"
            />
          </Tabs>
        </Box>
      </Box>

      <Box className="main">
        <EnvValueStreamProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chart" element={<Chart />} />
          </Routes>
        </EnvValueStreamProvider>
      </Box>
    </>
  );
};

export default App;
