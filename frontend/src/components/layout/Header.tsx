import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useThemeContext } from "../../theme/ThemeProvider";

import horizonLogo from "../../assets/logo/horizon-logo.svg";

import type { Page } from "../../App";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Destinations", page: "home" },
  { label: "Insights",     page: "insights" },
  { label: "Analytics",   page: "analytics" },
  { label: "About",        page: "about" },
];

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const { darkMode, toggleTheme } = useThemeContext();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(7,12,22,0.55)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "62px",
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => onNavigate("home")}
          sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            flexGrow: 1, cursor: "pointer",
          }}
        >
          <img src={horizonLogo} alt="Horizon" style={{ width: 28, height: 28 }} />
          <Typography
            sx={{
              color: "#FFFFFF", fontSize: "1.1rem",
              fontWeight: 800, letterSpacing: ".08em",
            }}
          >
            HORIZON
          </Typography>
        </Box>

        {/* Nav items */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {NAV_ITEMS.map(({ label, page }) => {
            const isActive = currentPage === page;
            return (
              <Button
                key={label}
                onClick={() => onNavigate(page)}
                sx={{
                  color: isActive ? "#38BDF8" : "#FFFFFF",
                  fontSize: ".78rem",
                  fontWeight: isActive ? 700 : 500,
                  textTransform: "uppercase",
                  position: "relative",
                  pb: "6px",
                  borderRadius: 0,

                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isActive ? "100%" : 0,
                    height: "2px",
                    borderRadius: "999px",
                    background: "#38BDF8",
                    transition: "width .25s ease",
                  },

                  "&:hover::after": { width: "100%" },
                  "&:hover": { background: "transparent", color: "#38BDF8" },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>

        {/* Theme toggle */}
        <IconButton
          onClick={toggleTheme}
          sx={{
            ml: 3, color: "#FFFFFF", width: 42, height: 42,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
