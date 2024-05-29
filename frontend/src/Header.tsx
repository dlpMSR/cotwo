import { Box, Tab, Tabs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const headerStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  left: 0,
};

const tabStyle = {
  textTransform: "none",
};

const Header = () => {
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
    </>
  );
};

export default Header;
