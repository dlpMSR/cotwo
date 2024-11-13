import { Box, Tab, Tabs } from "@mui/material";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Chart from "./routes/chart";
import Home from "./routes/home";

const headerStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  left: 0,
};

const tabStyle = {
  textTransform: "none",
};

const App = () => {
  const location = useLocation();

  return (
    <>
      <Box sx={headerStyle}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={location.pathname}>
            <Box sx={{ flexGrow: 1 }} />

            <Tab label="Home" value="/" to="/" component={Link} sx={tabStyle} />
            <Tab
              label="Chart"
              value="/chart"
              to="/chart"
              component={Link}
              sx={tabStyle}
            />
          </Tabs>
        </Box>
      </Box>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chart" element={<Chart />} />
      </Routes>
    </>
  );
};

export default App;
