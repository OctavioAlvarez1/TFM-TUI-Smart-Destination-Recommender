import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";

import { useState } from "react";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useThemeContext } from "../../theme/ThemeProvider";

import horizonLogo from "../../assets/logo/horizon-logo.svg";

import MegaMenu from "./MegaMenu";

const Header = () => {
  const {
    darkMode,
    toggleTheme,
  } = useThemeContext();

  const [megaOpen, setMegaOpen] =
    useState(false);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background:
          "rgba(7,12,22,0.55)",

        backdropFilter:
          "blur(16px)",

        borderBottom:
          "1px solid rgba(255,255,255,0.12)",

        boxShadow: "none",

        overflow: "visible",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "62px",

          px: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexGrow: 1,
          }}
        >
          <img
            src={horizonLogo}
            alt="Horizon"
            style={{
              width: 28,
              height: 28,
            }}
          />

          <Typography
            sx={{
              color: "#FFFFFF",

              fontSize: "1.1rem",

              fontWeight: 800,

              letterSpacing: ".08em",
            }}
          >
            HORIZON
          </Typography>
        </Box>

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },

            gap: 3,
          }}
        >
          <Button
            onMouseEnter={() =>
              setMegaOpen(true)
            }
            sx={{
              color: "#FFFFFF",
              fontSize: ".78rem",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Destinations
          </Button>

          <Button
            sx={{
              color: "#FFFFFF",
              fontSize: ".78rem",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Insights
          </Button>

          <Button
            sx={{
              color: "#FFFFFF",
              fontSize: ".78rem",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Analytics
          </Button>

          <Button
            sx={{
              color: "#FFFFFF",
              fontSize: ".78rem",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            About
          </Button>
        </Box>

        <IconButton
          onClick={toggleTheme}
          sx={{
            ml: 3,

            color: "#FFFFFF",

            width: 42,

            height: 42,

            border:
              "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {darkMode ? (
            <LightModeIcon />
          ) : (
            <DarkModeIcon />
          )}
        </IconButton>
      </Toolbar>

      <Box
        onMouseLeave={() =>
          setMegaOpen(false)
        }
      >
        {megaOpen && <MegaMenu />}
      </Box>
    </AppBar>
  );
};

export default Header;