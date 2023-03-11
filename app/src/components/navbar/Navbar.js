import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Box, Container } from "@mui/system";
import React, { useState } from "react";
import { pages } from "../../data/Pages";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

/**
 * 
 * @returns responsive nabar 
 * @author Noorullah Niamatullah
 */

const Navbar = () => {
  const [anchorNav, setAnchorNav] = useState(null);
  const [anchorAccount, setAnchorAccount] = useState(null);
  const boxMDScreen = {
    flexGrow: 1,
    display: { xs: "none", md: "flex" },
  };

  const btnMDScreen = {
    my: 2,
    color: "white",
    display: "block",
  };
  const logoStyle = {
    mr: 2,
    display: { xs: "none", md: "flex" },
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",
  };
  const xsLogoStyle = {
    mr: 2,
    display: { xs: "flex", md: "none" },
    flexGrow: 1,
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",
  };
  const handleOpenNavMenu = (event) => {
    setAnchorNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorNav(null);
  };
  const handleOpenAccount = (event) => {
    setAnchorAccount(event.currentTarget);
  };
  const handleCloseAccount = () => {
    setAnchorAccount(null);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography as={Link} noWrap to="/" variant="h6" sx={logoStyle}>
          IC3
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {pages.map((page) => (
              <Link to={page.path} key={page.label}>
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              </Link>
            ))}
          </Menu>
        </Box>
        <Typography
          variant="h5"
          noWrap
          t="/"
          sx={xsLogoStyle}
        >
          IC3
        </Typography>
        <Box sx={boxMDScreen}>
          {pages.map((page) => (
            <Link to={page.path} key={page.label}>
              <Button key={pages.label} sx={btnMDScreen}>
                {page.label}
              </Button>
            </Link>
          ))}
        </Box>
        <Box>
          <Tooltip title="Account ">
            <AccountCircleIcon onClick={handleOpenAccount} fontSize="large" />
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorAccount}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorAccount)}
            onClose={handleCloseAccount}
          >
            <MenuItem>Sign in</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
