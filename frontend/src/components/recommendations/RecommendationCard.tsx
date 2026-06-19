import {
  Card,
  Typography,
  Stack,
  Divider,
  Box,
  Grid,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import type { Recommendation } from "../../types/recommendation";

import SustainabilityBadge from "./SustainabilityBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import CongestionBadge from "./CongestionBadge";

// ── Rank colour palette ─────────────────────────────────
const rankMeta = (rank: number) => {
  if (rank === 1)
    return {
      color: "#F59E0B",
      bg: "linear-gradient(160deg, #FFFBEB 0%, #FEF3C7 100%)",
      border: "rgba(245,158,11,.18)",
    };
  if (rank === 2)
    return {
      color: "#94A3B8",
      bg: "linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 100%)",
      border: "rgba(148,163,184,.18)",
    };
  if (rank === 3)
    return {
      color: "#B87333",
      bg: "linear-gradient(160deg, #FDF8F5 0%, #FDEEE4 100%)",
      border: "rgba(184,115,51,.18)",
    };
  return {
    color: "#2563EB",
    bg: "linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 100%)",
    border: "rgba(37,99,235,.12)",
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
            color: "#64748B",
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
  const rank = rankMeta(recommendation.recommendation_rank);

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
        border: "1px solid rgba(226,232,240,.85)",
        background: `linear-gradient(160deg, ${rank.color}06 0%, ${rank.color}0E 100%)`,
        overflow: "hidden",
        transition: "all .35s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 24px 56px rgba(15,23,42,.09)",
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
                color: "#0F172A",
                lineHeight: 1,
              }}
            >
              {recommendation.final_score.toFixed(0)}
            </Typography>
            <Typography
              sx={{
                fontSize: ".65rem",
                color: "#94A3B8",
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
              color: "#0F172A",
              lineHeight: 1.1,
              mb: 0.5,
            }}
          >
            {recommendation.destination_name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94A3B8", mb: 2.5 }}>
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
          <Typography sx={{ fontSize: ".8rem", fontWeight: 700, color: "#0F172A", mb: 1.25 }}>
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
                    color: "#475569",
                    lineHeight: 1.5,
                  },
                  bgcolor: "rgba(37,99,235,.05)",
                  border: "1px solid rgba(37,99,235,.10)",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default RecommendationCard;
