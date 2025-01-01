import { Box, Tab, Tabs } from "@mui/material";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import "./app.scss";
import { Chart } from "./pages/chart";
import { Home } from "./pages/home";

const App = () => {
  const location = useLocation();

  return (
    <>
      <Box className="header">
        <Tabs value={location.pathname}>
          <Box sx={{ flexGrow: 1 }} />
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

      <Box className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<Chart />} />
        </Routes>
      </Box>
    </>
  );
};

export default App;
