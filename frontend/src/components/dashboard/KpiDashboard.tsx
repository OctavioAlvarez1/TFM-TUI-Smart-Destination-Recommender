// KPI summary dashboard displayed after a recommendation search.
// Shows top-destination sustainability score, average confidence, average congestion
// and a demand-redistribution banner listing how many destinations were penalised.
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import type { Recommendation } from "../../types/recommendation";

// ── Count-up ────────────────────────────────────────────
const CountUp = ({ to, decimals = 1 }: { to: number; decimals?: number }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const dur = 1300;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setVal(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{val.toFixed(decimals)}</>;
};

// ── Fill bar ────────────────────────────────────────────
const FillBar = ({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) => (
  <Box sx={{ height: 6, borderRadius: "999px", bgcolor: "rgba(0,0,0,.06)", overflow: "hidden" }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      style={{ height: "100%", borderRadius: "999px", background: color }}
    />
  </Box>
);

// ── Status pill ─────────────────────────────────────────
type MetricType = "sustainability" | "confidence" | "congestion";

import type { Locale } from "../../locales/en";

const getStatus = (value: number, type: MetricType, sl: Locale["kpi"]["statusLabels"]) => {
  if (type === "congestion") {
    if (value < 35) return { label: sl.lowPressure, color: "#10B981" };
    if (value < 65) return { label: sl.moderate,    color: "#F59E0B" };
    return { label: sl.highPressure, color: "#EF4444" };
  }
  if (value >= 80) return { label: sl.excellent, color: "#10B981" };
  if (value >= 60) return { label: sl.good,      color: "#6366F1" };
  if (value >= 40) return { label: sl.moderate,  color: "#F59E0B" };
  return { label: sl.low, color: "#EF4444" };
};

// ── Metric card ─────────────────────────────────────────
interface MetricCardProps {
  title: string;
  subtitle: string;
  value: number;
  type: MetricType;
  color: string;
  icon: React.JSX.Element;
  animDelay: number;
  barDelay: number;
}

const MetricCard = ({
  title,
  subtitle,
  value,
  type,
  color,
  icon,
  animDelay,
  barDelay,
}: MetricCardProps) => {
  const { locale } = useLanguage();
  const status = getStatus(value, type, locale.kpi.statusLabels);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: animDelay, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Card
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: "24px",
          border: "1px solid rgba(226,232,240,.8)",
          background: `linear-gradient(145deg, ${color}06 0%, ${color}12 100%)`,
          overflow: "hidden",
          position: "relative",
          transition: "all .3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: `0 20px 48px rgba(15,23,42,.09)`,
          },
        }}
      >
        {/* Color accent stripe */}
        <Box sx={{ height: 4, background: color }} />

        <CardContent sx={{ p: 3.5 }}>
          {/* Icon */}
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "13px",
              bgcolor: `${color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
              mb: 3,
            }}
          >
            {icon}
          </Box>

          {/* Hero number */}
          <Typography
            sx={{
              fontSize: "3rem",
              fontWeight: 900,
              lineHeight: 1,
              color: "text.primary",
              letterSpacing: "-0.02em",
              mb: 0.75,
            }}
          >
            <CountUp to={value} />
          </Typography>

          {/* Title */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              color: "text.primary",
              mb: 0.4,
            }}
          >
            {title}
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: ".82rem",
              color: "#94A3B8",
              mb: 2.5,
            }}
          >
            {subtitle}
          </Typography>

          {/* Bar + status */}
          <FillBar value={value} color={color} delay={barDelay} />

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.6,
              mt: 1.5,
              px: 1.4,
              py: 0.35,
              borderRadius: "999px",
              bgcolor: `${status.color}12`,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: status.color,
              }}
            />
            <Typography
              sx={{
                fontSize: ".75rem",
                fontWeight: 700,
                color: status.color,
              }}
            >
              {status.label}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ── Top Destination card ────────────────────────────────
const TopDestCard = ({
  name,
  score,
  animDelay,
}: {
  name: string;
  score: number;
  animDelay: number;
}) => {
  const { locale } = useLanguage();
  return (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: animDelay, ease: "easeOut" }}
    style={{ height: "100%" }}
  >
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: "24px",
        background: "linear-gradient(145deg, #0F172A 0%, #1E3A5F 100%)",
        overflow: "hidden",
        position: "relative",
        transition: "all .3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 24px 60px rgba(15,23,42,.35)",
        },
      }}
    >
      {/* Decorative glow */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <CardContent sx={{ p: 3.5, position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          {/* Trophy icon */}
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "13px",
              background: "linear-gradient(135deg, #F59E0B, #FCD34D)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <EmojiEventsRoundedIcon sx={{ color: "#FFF", fontSize: 24 }} />
          </Box>

          {/* Eyebrow */}
          <Typography
            sx={{
              fontSize: ".75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".12em",
              color: "rgba(255,255,255,.4)",
              mb: 1,
            }}
          >
            {locale.kpi.topPick}
          </Typography>

          {/* Destination name */}
          <Typography
            sx={{
              color: "#FFF",
              fontWeight: 900,
              fontSize: "2rem",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              mb: 0.75,
            }}
          >
            {name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "rgba(255,255,255,.45)", mb: 3 }}>
            <LocationOnRoundedIcon sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: ".82rem" }}>{locale.kpi.country}</Typography>
          </Box>
        </Box>

        {/* Score badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderRadius: "14px",
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <Typography sx={{ color: "rgba(255,255,255,.55)", fontSize: ".82rem", fontWeight: 600 }}>
            {locale.kpi.matchScore}
          </Typography>
          <Typography
            sx={{
              color: "#38BDF8",
              fontWeight: 900,
              fontSize: "1.3rem",
              lineHeight: 1,
            }}
          >
            {score.toFixed(0)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
  );
};

// ── Main ────────────────────────────────────────────────
interface KpiDashboardProps {
  recommendations: Recommendation[];
}

const KpiDashboard = ({ recommendations }: KpiDashboardProps) => {
  const { locale } = useLanguage();
  if (recommendations.length === 0) return null;

  const avg = (key: keyof Recommendation) =>
    recommendations.reduce((s, r) => s + (r[key] as number), 0) / recommendations.length;

  const sustainability = avg("sustainability_score");
  const confidence = avg("confidence_score");
  const congestion = avg("congestion_score");
  const top = recommendations[0];

  const congestionColor =
    congestion < 35 ? "#10B981" : congestion < 65 ? "#F59E0B" : "#EF4444";

  return (
    <Box sx={{ mb: 10 }}>
      {/* SECTION HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: ".82rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".2em",
              color: "#2563EB",
              mb: 1,
            }}
          >
            {locale.kpi.badge}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.6rem", md: "2rem" },
              fontWeight: 800,
              color: "text.primary",
              lineHeight: 1.1,
            }}
          >
            {locale.kpi.heading}
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title={locale.kpi.sustainability.title}
          subtitle={locale.kpi.sustainability.subtitle}
          value={sustainability}
          type="sustainability"
          color="#10B981"
          icon={<SpaRoundedIcon sx={{ fontSize: 22 }} />}
          animDelay={0}
          barDelay={0.2}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title={locale.kpi.confidence.title}
          subtitle={locale.kpi.confidence.subtitle}
          value={confidence}
          type="confidence"
          color="#6366F1"
          icon={<GpsFixedRoundedIcon sx={{ fontSize: 22 }} />}
          animDelay={0.1}
          barDelay={0.3}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title={locale.kpi.congestion.title}
          subtitle={locale.kpi.congestion.subtitle}
          value={congestion}
          type="congestion"
          color={congestionColor}
          icon={<PeopleRoundedIcon sx={{ fontSize: 22 }} />}
          animDelay={0.2}
          barDelay={0.4}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <TopDestCard
          name={top.destination_name}
          score={top.final_score}
          animDelay={0.3}
        />
      </Grid>
    </Grid>
    </Box>
  );
};

export default KpiDashboard;
