// Hero search bar component with three input fields:
// Traveler Profile (user ID), Travel Month (dropdown) and number of Destinations.
// Auto-fetches the user profile to display travel-style/budget/sustainability chips.
// Fully dark-mode aware — backgrounds, borders and text adapt to the active theme.
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Paper,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  useTheme,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import { getUserProfile, type UserProfile } from "../../api/recommendationApi";

// ── Profile chip colours ─────────────────────────────────
const STYLE_COLOR: Record<string, string> = {
  Nature: "#10B981", Relax: "#38BDF8", Culture: "#8B5CF6",
  Family: "#F59E0B", Nightlife: "#EC4899", Adventure: "#06B6D4",
};
const BUDGET_COLOR: Record<string, string> = {
  Low: "#10B981", Medium: "#F59E0B", High: "#EF4444",
};
const SUST_COLOR: Record<string, string> = {
  Low: "#EF4444", Medium: "#F59E0B", High: "#10B981",
};

interface SearchBarHeroProps {
  userId: string;
  month: number;
  topN: number;

  setUserId: (
    value: string
  ) => void;

  setMonth: (
    value: number
  ) => void;

  setTopN: (
    value: number
  ) => void;

  onSearch: () => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SearchBarHero = ({
  userId,
  month,
  topN,
  setUserId,
  setMonth,
  setTopN,
  onSearch,
}: SearchBarHeroProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (/^U\d{3}$/.test(userId)) {
        getUserProfile(userId)
          .then(setProfile)
          .catch(() => setProfile(null));
      } else {
        setProfile(null);
      }
    }, 400);
    return () => clearTimeout(id);
  }, [userId]);

  const handleTopNChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(
      event.target.value
    );

    if (!Number.isNaN(value)) {
      setTopN(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.75,
        delay: 0.55,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
    >
    <Paper
      elevation={0}
      sx={{
        position: "relative",

        maxWidth: 1550,

        mx: "auto",

        zIndex: 40,

        borderRadius: "36px",

        p: {
          xs: 2.5,
          md: 3.5,
        },

        background: dark
          ? "rgba(17,24,39,0.97)"
          : "rgba(255,255,255,0.98)",

        border: "1px solid",
        borderColor: "divider",

        backdropFilter:
          "blur(28px)",

        transition:
          "all .3s ease",

        boxShadow: `
          0 30px 80px rgba(15,23,42,.10),
          0 12px 32px rgba(59,130,246,.10),
          0 0 60px rgba(59,130,246,.06)
        `,

        "&:hover": {
          boxShadow: `
            0 35px 90px rgba(15,23,42,.12),
            0 18px 40px rgba(59,130,246,.12),
            0 0 70px rgba(59,130,246,.08)
          `,
        },
      }}
    >
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.25fr 1.25fr 1fr auto",
          },

          gap: {
            xs: 2,
            lg: 0,
          },

          alignItems: "center",
        }}
      >
        {/* PROFILE */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 3,

            px: 3,

            py: 1.5,

            borderRight: {
              lg: "1px solid",
            },
            borderRightColor: {
              lg: "divider",
            },
          }}
        >
          <Box
            sx={{
              width: 76,

              height: 76,

              borderRadius: "50%",

              background: dark
                ? "rgba(37,99,235,.12)"
                : "rgba(37,99,235,.06)",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",
            }}
          >
            <PersonOutlineRoundedIcon
              sx={{
                color: "#2563EB",
                fontSize: 34,
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: ".9rem",
                mb: 0.75,
              }}
            >
              Traveler Profile
            </Typography>

            <TextField
              fullWidth
              variant="standard"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              slotProps={{
                input: { disableUnderline: true },
                htmlInput: {
                  style: { fontSize: "1.3rem", fontWeight: 700, color: dark ? "#F1F5F9" : "#0F172A" },
                },
              }}
            />

            {/* Profile chips — appear once profile is loaded */}
            {profile && (
              <Box sx={{ display: "flex", gap: 0.75, mt: 1, flexWrap: "wrap" }}>
                <Chip
                  label={profile.travel_style}
                  size="small"
                  sx={{
                    fontSize: ".68rem", fontWeight: 700, height: 20,
                    bgcolor: `${STYLE_COLOR[profile.travel_style] ?? "#6366F1"}18`,
                    color: STYLE_COLOR[profile.travel_style] ?? "#6366F1",
                    border: `1px solid ${STYLE_COLOR[profile.travel_style] ?? "#6366F1"}30`,
                  }}
                />
                <Chip
                  label={`${profile.budget_level} budget`}
                  size="small"
                  sx={{
                    fontSize: ".68rem", fontWeight: 700, height: 20,
                    bgcolor: `${BUDGET_COLOR[profile.budget_level] ?? "#64748B"}18`,
                    color: BUDGET_COLOR[profile.budget_level] ?? "#64748B",
                    border: `1px solid ${BUDGET_COLOR[profile.budget_level] ?? "#64748B"}30`,
                  }}
                />
                <Chip
                  label={`Eco: ${profile.sustainability_preference}`}
                  size="small"
                  sx={{
                    fontSize: ".68rem", fontWeight: 700, height: 20,
                    bgcolor: `${SUST_COLOR[profile.sustainability_preference] ?? "#10B981"}18`,
                    color: SUST_COLOR[profile.sustainability_preference] ?? "#10B981",
                    border: `1px solid ${SUST_COLOR[profile.sustainability_preference] ?? "#10B981"}30`,
                  }}
                />
                <Chip
                  label={`${profile.country} · ${profile.age_group}`}
                  size="small"
                  sx={{
                    fontSize: ".68rem", fontWeight: 600, height: 20,
                    bgcolor: "rgba(100,116,139,.08)",
                    color: "text.secondary",
                    border: "1px solid rgba(100,116,139,.15)",
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* MONTH */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 3,

            px: 3,

            py: 1.5,

            borderRight: {
              lg: "1px solid",
            },
            borderRightColor: {
              lg: "divider",
            },
          }}
        >
          <Box
            sx={{
              width: 76,

              height: 76,

              borderRadius: "50%",

              background: dark
                ? "rgba(37,99,235,.12)"
                : "rgba(37,99,235,.06)",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",
            }}
          >
            <CalendarMonthRoundedIcon
              sx={{
                color: "#2563EB",
                fontSize: 34,
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "text.secondary",

                fontWeight: 600,

                fontSize: ".9rem",

                mb: 0.75,
              }}
            >
              Travel Month
            </Typography>

            <TextField
              select
              fullWidth
              variant="standard"
              value={month}
              onChange={(e) =>
                setMonth(
                  Number(
                    e.target.value
                  )
                )
              }
              slotProps={{
                input: { disableUnderline: true },
                htmlInput: {
                  style: { fontSize: "1.3rem", fontWeight: 700, color: dark ? "#F1F5F9" : "#0F172A" },
                },
              }}
            >
              {months.map(
                (
                  monthName,
                  index
                ) => (
                  <MenuItem
                    key={index + 1}
                    value={index + 1}
                  >
                    {monthName}
                  </MenuItem>
                )
              )}
            </TextField>
          </Box>
        </Box>

        {/* DESTINATIONS */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 3,

            px: 3,

            py: 1.5,
          }}
        >
          <Box
            sx={{
              width: 76,

              height: 76,

              borderRadius: "50%",

              background: dark
                ? "rgba(37,99,235,.12)"
                : "rgba(37,99,235,.06)",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",
            }}
          >
            <TravelExploreRoundedIcon
              sx={{
                color: "#2563EB",
                fontSize: 34,
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "text.secondary",

                fontWeight: 600,

                fontSize: ".9rem",

                mb: 0.75,
              }}
            >
              Destinations
            </Typography>

            <TextField
              fullWidth
              type="number"
              variant="standard"
              value={topN}
              onChange={
                handleTopNChange
              }
              slotProps={{
                input: { disableUnderline: true },
                htmlInput: {
                  min: 1,
                  style: { fontSize: "1.3rem", fontWeight: 700, color: dark ? "#F1F5F9" : "#0F172A" },
                },
              }}
            />
          </Box>
        </Box>

        {/* BUTTON */}

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "center",

            px: {
              lg: 2,
            },
          }}
        >
          <Button
            onClick={onSearch}
            startIcon={
              <SearchRoundedIcon />
            }
            sx={{
              width: 280,

              height: 78,

              borderRadius: "22px",

              color: "#FFF",

              fontWeight: 700,

              fontSize: "1.15rem",

              textTransform:
                "none",

              background:
                "linear-gradient(135deg,#1DA1F2 0%,#2563EB 100%)",

              boxShadow:
                "0 20px 40px rgba(37,99,235,.22)",

              transition:
                "all .25s ease",

              "&:hover": {
                background:
                  "linear-gradient(135deg,#38BDF8 0%,#2563EB 100%)",

                transform:
                  "translateY(-2px)",

                boxShadow:
                  "0 25px 50px rgba(37,99,235,.28)",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Paper>
    </motion.div>
  );
};

export default SearchBarHero;