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
import ES from "country-flag-icons/react/3x2/ES";
import US from "country-flag-icons/react/3x2/US";

import { useThemeContext } from "../../theme/ThemeProvider";
import { useLanguage } from "../../context/LanguageContext";

import horizonLogo from "../../assets/logo/horizon-logo.svg";

import type { Page } from "../../App";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_PAGES: Page[] = ["home", "insights", "analytics", "about"];

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const { darkMode, toggleTheme } = useThemeContext();
  const { lang, toggleLanguage, locale } = useLanguage();

  const navLabels: Record<Page, string> = {
    home:      locale.nav.destinations,
    insights:  locale.nav.insights,
    analytics: locale.nav.analytics,
    about:     locale.nav.about,
  };

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
          {NAV_PAGES.map((page) => {
            const label = navLabels[page];
            const isActive = currentPage === page;
            return (
              <Button
                key={page}
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

        {/* Language toggle */}
        <Box
          onClick={toggleLanguage}
          sx={{
            ml: 2.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            px: 1,
            py: 0.6,
            transition: "border-color .2s",
            "&:hover": { borderColor: "rgba(255,255,255,0.4)" },
          }}
        >
          <US style={{ width: 22, opacity: lang === "en" ? 1 : 0.3, transition: "opacity .2s", borderRadius: 2, display: "block" }} title="English" />
          <Typography sx={{ fontSize: ".65rem", color: "rgba(255,255,255,.28)", lineHeight: 1 }}>|</Typography>
          <ES style={{ width: 22, opacity: lang === "es" ? 1 : 0.3, transition: "opacity .2s", borderRadius: 2, display: "block" }} title="Español" />
        </Box>

        {/* Theme toggle */}
        <IconButton
          onClick={toggleTheme}
          sx={{
            ml: 1.5, color: "#FFFFFF", width: 42, height: 42,
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
