// Individual destination recommendation card.
// Shows rank panel (colour-coded #1/#2/#3), final score, metric tiles
// (Preference/Sustainability/Popularity/Congestion), explanation chips,
// and Best Months to Visit based on INE monthly congestion scores.
import {
  Card,
  Typography,
  Stack,
  Divider,
  Box,
  Grid,
  Chip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

import type { Recommendation } from "../../types/recommendation";

import SustainabilityBadge from "./SustainabilityBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import CongestionBadge from "./CongestionBadge";

// ── Monthly congestion scores (INE EOH data) ─────────────
const MONTHLY_SCORES: Record<string, number[]> = {
  D001: [12, 16, 25, 47, 89, 98, 100, 100, 95, 70, 15, 13],
  D002: [10, 14, 22, 42, 80, 88, 100, 100, 85, 63, 13, 11],
  D003: [7,  10, 16, 30, 57, 63, 83, 88, 67, 45, 9,  8],
  D004: [59, 65, 61, 57, 62, 71, 87, 92, 77, 72, 66, 77],
  D005: [57, 62, 58, 54, 59, 68, 83, 88, 73, 69, 63, 73],
  D006: [43, 47, 44, 41, 44, 51, 62, 66, 55, 52, 47, 55],
  D007: [14, 18, 29, 54, 102, 113, 115, 115, 109, 80, 17, 15],
  D008: [11, 14, 23, 43, 82, 90, 92, 92, 87, 64, 14, 12],
  D009: [59, 58, 68, 82, 89, 77, 64, 58, 73, 82, 68, 57],
  D010: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D011: [19, 25, 36, 63, 103, 113, 118, 118, 111, 82, 22, 17],
  D012: [25, 32, 46, 80, 131, 144, 150, 150, 141, 105, 28, 22],
  D013: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D014: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D015: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D016: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D017: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D018: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D019: [28, 30, 36, 44, 49, 55, 66, 72, 58, 48, 37, 33],
  D020: [14, 15, 18, 22, 25, 28, 33, 36, 29, 24, 18, 17],
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const getBestMonths = (destId: string, count = 3): string[] => {
  const scores = MONTHLY_SCORES[destId];
  if (!scores) return [];
  return scores
    .map((score, i) => ({ score: Math.min(100, score), i }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .sort((a, b) => a.i - b.i)
    .map(({ i }) => MONTH_NAMES[i]);
};

// ── Rank colour palette ─────────────────────────────────
const rankMeta = (rank: number, dark: boolean) => {
  if (rank === 1)
    return {
      color: "#F59E0B",
      bg: dark
        ? "linear-gradient(160deg, rgba(245,158,11,.14) 0%, rgba(245,158,11,.08) 100%)"
        : "linear-gradient(160deg, #FFFBEB 0%, #FEF3C7 100%)",
      border: "rgba(245,158,11,.22)",
    };
  if (rank === 2)
    return {
      color: "#94A3B8",
      bg: dark
        ? "linear-gradient(160deg, rgba(148,163,184,.10) 0%, rgba(100,116,139,.07) 100%)"
        : "linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 100%)",
      border: "rgba(148,163,184,.20)",
    };
  if (rank === 3)
    return {
      color: "#B87333",
      bg: dark
        ? "linear-gradient(160deg, rgba(184,115,51,.14) 0%, rgba(184,115,51,.08) 100%)"
        : "linear-gradient(160deg, #FDF8F5 0%, #FDEEE4 100%)",
      border: "rgba(184,115,51,.22)",
    };
  return {
    color: "#2563EB",
    bg: dark
      ? "linear-gradient(160deg, rgba(37,99,235,.14) 0%, rgba(37,99,235,.08) 100%)"
      : "linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 100%)",
    border: "rgba(37,99,235,.18)",
  };
};

// ── Metric tile ─────────────────────────────────────────
const MetricTile = ({
  label,
  value,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
  >
    <Box
      sx={{
        borderRadius: "14px",
        p: { xs: 1.75, md: 2 },
        bgcolor: `${color}0D`,
        border: `1px solid ${color}22`,
        height: "100%",
      }}
    >
      {/* Dot + label */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: color,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: ".7rem",
            fontWeight: 700,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: ".08em",
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Big number */}
      <Typography
        sx={{
          fontSize: "1.9rem",
          fontWeight: 900,
          color,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {value.toFixed(0)}
      </Typography>
    </Box>
  </motion.div>
);

// ── Card ────────────────────────────────────────────────
interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const rank = rankMeta(recommendation.recommendation_rank, dark);

  const metrics = [
    { label: "Preference",    value: recommendation.preference_score,    color: "#6366F1" },
    { label: "Sustainability", value: recommendation.sustainability_score, color: "#10B981" },
    { label: "Popularity",    value: recommendation.popularity_score,    color: "#F59E0B" },
    { label: "Congestion",    value: recommendation.congestion_score,    color: "#EF4444" },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "24px",
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(160deg, ${rank.color}06 0%, ${rank.color}0E 100%)`,
        overflow: "hidden",
        transition: "all .35s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: dark
            ? "0 24px 56px rgba(0,0,0,.35)"
            : "0 24px 56px rgba(15,23,42,.09)",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>

        {/* ── LEFT RANK PANEL ── */}
        <Box
          sx={{
            width: { xs: "100%", md: 152 },
            background: rank.bg,
            borderRight: { md: `1px solid ${rank.border}` },
            borderBottom: { xs: `1px solid ${rank.border}`, md: "none" },
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 4, md: 2 },
            p: { xs: 2.5, md: 3.5 },
            flexShrink: 0,
          }}
        >
          {/* Rank */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: ".65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".14em",
                color: rank.color,
                mb: 0.25,
              }}
            >
              Rank
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "2.8rem", md: "3.6rem" },
                fontWeight: 900,
                color: rank.color,
                lineHeight: 1,
              }}
            >
              #{recommendation.recommendation_rank}
            </Typography>
          </Box>

          {/* Divider */}
          <Box sx={{ display: { xs: "block", md: "none" }, width: 1, height: 44, bgcolor: rank.border }} />
          <Box sx={{ display: { xs: "none", md: "block" }, width: "42%", height: 1, bgcolor: rank.border }} />

          {/* Score */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: "2.2rem", md: "2.6rem" },
                fontWeight: 900,
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              {recommendation.final_score.toFixed(0)}
            </Typography>
            <Typography
              sx={{
                fontSize: ".65rem",
                color: "text.secondary",
                fontWeight: 600,
                mt: 0.25,
                textTransform: "uppercase",
                letterSpacing: ".1em",
              }}
            >
              Match Score
            </Typography>
          </Box>
        </Box>

        {/* ── RIGHT CONTENT ── */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 4 }, minWidth: 0 }}>

          {/* Name + location */}
          <Typography
            sx={{
              fontSize: { xs: "1.65rem", md: "2rem" },
              fontWeight: 800,
              color: "text.primary",
              lineHeight: 1.1,
              mb: 0.5,
            }}
          >
            {recommendation.destination_name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", mb: 2.5 }}>
            <LocationOnRoundedIcon sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: ".82rem" }}>Spain</Typography>
          </Box>

          {/* Badges */}
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 3 }}>
            <SustainabilityBadge score={recommendation.sustainability_score} />
            <ConfidenceBadge confidence={recommendation.confidence_score} />
            <CongestionBadge congestion={recommendation.congestion_score} />
          </Stack>

          {/* Metric tiles 2×2 */}
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {metrics.map((m, i) => (
              <Grid size={{ xs: 6, sm: 3 }} key={m.label}>
                <MetricTile
                  label={m.label}
                  value={m.value}
                  color={m.color}
                  delay={0.12 + i * 0.08}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Why */}
          <Typography sx={{ fontSize: ".8rem", fontWeight: 700, color: "text.primary", mb: 1.25 }}>
            Why Horizon Recommended This
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {recommendation.explanations.slice(0, 4).map((exp, i) => (
              <Chip
                key={i}
                label={`✓ ${exp}`}
                size="small"
                sx={{
                  height: "auto",
                  py: 0.6,
                  borderRadius: "10px",
                  "& .MuiChip-label": {
                    whiteSpace: "normal",
                    fontSize: ".74rem",
                    fontWeight: 500,
                    color: "text.secondary",
                    lineHeight: 1.5,
                  },
                  bgcolor: "rgba(37,99,235,.07)",
                  border: "1px solid rgba(37,99,235,.14)",
                }}
              />
            ))}
          </Box>

          {/* Best months — low season boost */}
          {getBestMonths(recommendation.destination_id).length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CalendarTodayRoundedIcon sx={{ fontSize: 14, color: "#10B981" }} />
                <Typography sx={{ fontSize: ".78rem", fontWeight: 700, color: "text.primary" }}>
                  Best Months to Visit
                </Typography>
                <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>
                  — lowest congestion, best value
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                {getBestMonths(recommendation.destination_id).map((m) => (
                  <Chip
                    key={m}
                    label={m}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: ".73rem",
                      fontWeight: 700,
                      bgcolor: "rgba(16,185,129,.08)",
                      color: "#059669",
                      border: "1px solid rgba(16,185,129,.22)",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default RecommendationCard;
