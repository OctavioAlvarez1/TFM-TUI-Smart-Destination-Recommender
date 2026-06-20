// Individual destination recommendation card.
// Shows rank panel (colour-coded #1/#2/#3), final score, metric tiles
// (Preference/Sustainability/Popularity/Congestion), explanation chips,
// and Best Months to Visit based on INE monthly congestion scores.
import {
  Card,
  Typography,
  Stack,
  Box,
  Grid,
  Chip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

import type { Recommendation } from "../../types/recommendation";
import { useLanguage } from "../../context/LanguageContext";

import SustainabilityBadge from "./SustainabilityBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import CongestionBadge from "./CongestionBadge";

import imgMallorca       from "../../assets/destinations/mallorca.png";
import imgMenorca        from "../../assets/destinations/menorca.jpg";
import imgLanzarote      from "../../assets/destinations/lanzarote.jpg";
import imgSanSebastian   from "../../assets/destinations/san-sebastian.jpeg";
import imgIbiza          from "../../assets/destinations/ibiza.jpg";
import imgTenerife       from "../../assets/destinations/tenerife.jpg";
import imgGranCanaria    from "../../assets/destinations/gran-canaria.jpg";
import imgCostadelSol    from "../../assets/destinations/costa-del-sol.jpg";
import imgMarbella       from "../../assets/destinations/marbella.jpg";
import imgMalaga         from "../../assets/destinations/malaga.jpg";
import imgValencia       from "../../assets/destinations/valencia.jpg";
import imgAlicante       from "../../assets/destinations/alicante.jpg";
import imgBenidorm       from "../../assets/destinations/benidorm.jpg";
import imgBarcelona      from "../../assets/destinations/barcelona.jpg";
import imgMadrid         from "../../assets/destinations/madrid.jpg";
import imgSeville        from "../../assets/destinations/seville.jpg";
import imgGranada        from "../../assets/destinations/granada.jpg";
import imgBilbao         from "../../assets/destinations/bilbao.jpg";
import imgPicosEuropa    from "../../assets/destinations/picos-de-europa.jpg";
import imgSierraNevada   from "../../assets/destinations/sierra-nevada.jpg";

const DEST_IMAGES: Record<string, string> = {
  "Mallorca":         imgMallorca,
  "Ibiza":            imgIbiza,
  "Menorca":          imgMenorca,
  "Tenerife":         imgTenerife,
  "Gran Canaria":     imgGranCanaria,
  "Lanzarote":        imgLanzarote,
  "Costa del Sol":    imgCostadelSol,
  "Marbella":         imgMarbella,
  "Malaga":           imgMalaga,
  "Valencia":         imgValencia,
  "Alicante":         imgAlicante,
  "Benidorm":         imgBenidorm,
  "Barcelona":        imgBarcelona,
  "Madrid":           imgMadrid,
  "Seville":          imgSeville,
  "Granada":          imgGranada,
  "Bilbao":           imgBilbao,
  "San Sebastian":    imgSanSebastian,
  "San Sebastián":    imgSanSebastian,
  "Picos de Europa":  imgPicosEuropa,
  "Sierra Nevada":    imgSierraNevada,
};

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

type ExplLocale = {
  strongMatch: string; goodMatch: string;
  excellentSustainability: string; goodSustainability: string;
  lowCongestion: string; highCongestion: string;
  popularTravelers: string; wellRated: string;
  styles: Record<string, string>;
};

const translateExplanation = (exp: string, t: ExplLocale): string => {
  if (exp === "Excellent sustainability performance.")                    return t.excellentSustainability;
  if (exp === "Good sustainability performance.")                         return t.goodSustainability;
  if (exp === "Lower expected congestion than comparable destinations.")  return t.lowCongestion;
  if (exp === "Higher expected congestion during the selected period.")   return t.highCongestion;
  if (exp === "Popular among travelers with similar interests.")          return t.popularTravelers;
  if (exp === "Well-rated by previous travelers.")                        return t.wellRated;
  const strong = exp.match(/^Strong match for your (\w+) travel preferences\.$/);
  if (strong) return t.strongMatch.replace("{style}", t.styles[strong[1]] ?? strong[1]);
  const good = exp.match(/^Good match for your (\w+) travel preferences\.$/);
  if (good)   return t.goodMatch.replace("{style}", t.styles[good[1]] ?? good[1]);
  return exp;
};

const getBestMonths = (destId: string, monthNames: string[], count = 3): string[] => {
  const scores = MONTHLY_SCORES[destId];
  if (!scores) return [];
  return scores
    .map((score, i) => ({ score: Math.min(100, score), i }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .sort((a, b) => a.i - b.i)
    .map(({ i }) => monthNames[i]);
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
  dark = false,
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
  dark?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
    style={{ height: "100%" }}
  >
    <Box
      sx={{
        borderRadius: "14px",
        p: { xs: 1.75, md: 2 },
        background: dark
          ? `rgba(15,23,42,0.72)`
          : `rgba(255,255,255,0.82)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${color}35`,
        boxShadow: `0 2px 12px ${color}12`,
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
  const { locale } = useLanguage();
  const rank = rankMeta(recommendation.recommendation_rank, dark);

  const metrics = [
    { label: locale.card.metrics.preference,    value: recommendation.preference_score,    color: "#6366F1" },
    { label: locale.card.metrics.sustainability, value: recommendation.sustainability_score, color: "#10B981" },
    { label: locale.card.metrics.popularity,    value: recommendation.popularity_score,    color: "#F59E0B" },
    { label: locale.card.metrics.congestion,    value: recommendation.congestion_score,    color: "#EF4444" },
  ];

  const destImage = DEST_IMAGES[recommendation.destination_name];

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
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
      {/* Destination photo — faded right side */}
      {destImage && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: { xs: "55%", md: "42%" },
            height: "100%",
            backgroundImage: `url(${destImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(1px) saturate(0.85)",
            transform: "scale(1.04)",
            opacity: dark ? 0.52 : 0.75,
            maskImage: "linear-gradient(to right, transparent 10%, rgba(0,0,0,0.5) 38%, black 58%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 10%, rgba(0,0,0,0.5) 38%, black 58%)",
            zIndex: 0,
          }}
        />
      )}

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, position: "relative", zIndex: 1 }}>

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
              {locale.card.rank}
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
              {locale.card.matchScore}
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
            <Typography sx={{ fontSize: ".82rem" }}>{locale.card.country}</Typography>
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
                  dark={dark}
                />
              </Grid>
            ))}
          </Grid>

          {/* Why */}
          <Typography sx={{ fontSize: ".8rem", fontWeight: 700, color: "text.primary", mb: 1.25 }}>
            {locale.card.whyRecommended}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {recommendation.explanations.slice(0, 4).map((exp, i) => (
              <Chip
                key={i}
                label={`✓ ${translateExplanation(exp, locale.card.explanations)}`}
                size="small"
                sx={{
                  height: "auto",
                  py: 0.6,
                  borderRadius: "20px",
                  "& .MuiChip-label": {
                    whiteSpace: "normal",
                    fontSize: ".74rem",
                    fontWeight: 600,
                    color: "#059669",
                    lineHeight: 1.5,
                  },
                  bgcolor: "rgba(16,185,129,.10)",
                  border: "1px solid rgba(16,185,129,.28)",
                }}
              />
            ))}
          </Box>

          {/* Best months — low season boost */}
          {getBestMonths(recommendation.destination_id, locale.search.monthsShort).length > 0 && (
            <>
              <Box sx={{ mt: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CalendarTodayRoundedIcon sx={{ fontSize: 14, color: "#10B981" }} />
                <Typography sx={{ fontSize: ".78rem", fontWeight: 700, color: "text.primary" }}>
                  {locale.card.bestMonths}
                </Typography>
                <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>
                  {locale.card.bestMonthsSub}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                {getBestMonths(recommendation.destination_id, locale.search.monthsShort).map((m) => (
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
