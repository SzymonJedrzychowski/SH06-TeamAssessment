import { Box } from "@mui/material";
import React from "react";

const Homepage = () => {
  const boxStyling = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding:3  };
  return <Box sx={boxStyling}>Homepage</Box>;
};

export default Homepage;
