// Insights page — Spain's tourism concentration problem.
// Displays: stats header, Spain congestion map, Low Season Optimizer cards,
// monthly congestion heatmap (INE EOH data), and redistribution scenario comparisons.
// Accepts optional recommendations prop to highlight the user's specific results.
import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Grid,
  useTheme,
} from "@mui/material";

import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import EuroRoundedIcon from "@mui/icons-material/EuroRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import Footer from "../components/layout/Footer";
import DestinationMap from "../components/map/DestinationMap";
import type { Recommendation } from "../types/recommendation";

// ── Static data from congestion_scores.csv ──────────────

type HeatmapDest = { id: string; name: string; region: string; type: string; monthly: number[] };

const ALL_DESTINATIONS: HeatmapDest[] = [
  { id: "D001", name: "Mallorca",         region: "Balearic Islands",     type: "Beach",  monthly: [25,25,35,50,65,80,95,100,75,55,35,30] },
  { id: "D002", name: "Ibiza",            region: "Balearic Islands",     type: "Beach",  monthly: [25,25,35,50,65,80,95,100,75,55,35,30] },
  { id: "D003", name: "Menorca",          region: "Balearic Islands",     type: "Beach",  monthly: [25,25,35,50,65,80,95,100,75,55,35,30] },
  { id: "D004", name: "Tenerife",         region: "Canary Islands",       type: "Mixed",  monthly: [65,70,65,60,65,75,85,90,80,75,70,80] },
  { id: "D005", name: "Gran Canaria",     region: "Canary Islands",       type: "Mixed",  monthly: [65,70,65,60,65,75,85,90,80,75,70,80] },
  { id: "D006", name: "Lanzarote",        region: "Canary Islands",       type: "Nature", monthly: [65,70,65,60,65,75,85,90,80,75,70,80] },
  { id: "D007", name: "Costa del Sol",    region: "Andalusia",            type: "Beach",  monthly: [25,25,35,50,65,80,95,100,75,55,35,30] },
  { id: "D008", name: "Marbella",         region: "Andalusia",            type: "Beach",  monthly: [25,25,35,50,65,80,95,100,75,55,35,30] },
  { id: "D009", name: "Malaga",           region: "Andalusia",            type: "City",   monthly: [60,60,70,85,90,80,65,60,75,85,70,75] },
  { id: "D010", name: "Valencia",         region: "Valencian Community",  type: "City",   monthly: [60,60,70,85,90,80,65,60,75,85,70,75] },
  { id: "D011", name: "Alicante",         region: "Valencian Community",  type: "Beach",  monthly: [25,25,35,50,65,80,95,100,75,55,35,30] },
  { id: "D012", name: "Benidorm",         region: "Valencian Community",  type: "Beach",  monthly: [25,25,35,50,65,80,95,100,75,55,35,30] },
  { id: "D013", name: "Barcelona",        region: "Catalonia",            type: "City",   monthly: [60,60,70,85,90,80,65,60,75,85,70,75] },
  { id: "D014", name: "Madrid",           region: "Community of Madrid",  type: "City",   monthly: [60,60,70,85,90,80,65,60,75,85,70,75] },
  { id: "D015", name: "Seville",          region: "Andalusia",            type: "City",   monthly: [60,60,70,85,90,80,65,60,75,85,70,75] },
  { id: "D016", name: "Granada",          region: "Andalusia",            type: "City",   monthly: [60,60,70,85,90,80,65,60,75,85,70,75] },
  { id: "D017", name: "Bilbao",           region: "Basque Country",       type: "City",   monthly: [60,60,70,85,90,80,65,60,75,85,70,75] },
  { id: "D018", name: "San Sebastian",    region: "Basque Country",       type: "Mixed",  monthly: [60,60,70,85,90,80,65,60,75,85,70,75] },
  { id: "D019", name: "Picos de Europa",  region: "Asturias",             type: "Nature", monthly: [15,15,20,35,55,70,85,90,75,45,25,20] },
  { id: "D020", name: "Sierra Nevada",    region: "Andalusia",            type: "Nature", monthly: [15,15,20,35,55,70,85,90,75,45,25,20] },
];

const DEFAULT_HEATMAP_IDS = ["D001","D002","D004","D013","D014","D015","D019","D020"];

// Destinations penalized (congestion > 80) per month, computed from all 20 destinations
const PENALIZED_BY_MONTH: Record<number, number> = {
  1: 0, 2: 0, 3: 0, 4: 8, 5: 8, 6: 0, 7: 12, 8: 12, 9: 0, 10: 8, 11: 0, 12: 0,
};

// ── Colour helpers ───────────────────────────────────────
const cellStyle = (score: number) => {
  if (score <= 30) return { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0" };
  if (score <= 60) return { bg: "#FEF9C3", text: "#854D0E", border: "#FDE68A" };
  if (score <= 80) return { bg: "#FFEDD5", text: "#9A3412", border: "#FED7AA" };
  return { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" };
};


// ── Stat card ────────────────────────────────────────────
const StatCard = ({
  value, label, icon, color, delay,
}: {
  value: string; label: string; icon: React.ReactNode; color: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay, ease: "easeOut" }}
  >
    <Box
      sx={{
        borderRadius: "20px",
        border: `1px solid ${color}22`,
        background: `linear-gradient(145deg, ${color}08 0%, ${color}14 100%)`,
        p: 3,
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 44, height: 44, borderRadius: "12px",
          bgcolor: `${color}18`, display: "flex",
          alignItems: "center", justifyContent: "center", color, mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontSize: "2.2rem", fontWeight: 900, color: "text.primary", lineHeight: 1, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: ".85rem", color: "text.secondary", fontWeight: 500, lineHeight: 1.5 }}>
        {label}
      </Typography>
    </Box>
  </motion.div>
);

// ── Heatmap ──────────────────────────────────────────────
const CongestionHeatmap = ({
  activeMonth,
  onMonthClick,
  destinations,
}: {
  activeMonth: number | null;
  onMonthClick: (m: number) => void;
  destinations: HeatmapDest[];
}) => {
  const { locale } = useLanguage();
  const ll = locale.insights.heatmap.levelShort;
  const getLevelShort = (score: number) =>
    score <= 30 ? ll.low : score <= 60 ? ll.moderate : score <= 80 ? ll.high : ll.veryHigh;
  return (
  <Box sx={{ overflowX: "auto", pb: 1 }}>
    <Box sx={{ minWidth: 820 }}>
      {/* Header row — clickeable */}
      <Box sx={{ display: "grid", gridTemplateColumns: "180px repeat(12, 1fr)", gap: 0.5, mb: 0.5 }}>
        <Box />
        {locale.search.monthsShort.map((m, i) => {
          const isActive = activeMonth === i + 1;
          const penalized = PENALIZED_BY_MONTH[i + 1] > 0;
          return (
            <Box
              key={m}
              onClick={() => onMonthClick(i + 1)}
              sx={{
                textAlign: "center",
                py: 1,
                borderRadius: "8px",
                cursor: "pointer",
                bgcolor: isActive
                  ? penalized ? "rgba(239,68,68,.12)" : "rgba(37,99,235,.12)"
                  : "transparent",
                border: isActive
                  ? penalized ? "1px solid rgba(239,68,68,.25)" : "1px solid rgba(37,99,235,.2)"
                  : "1px solid transparent",
                transition: "all .2s ease",
                "&:hover": {
                  bgcolor: isActive
                    ? undefined
                    : "rgba(128,128,128,.08)",
                  border: isActive ? undefined : "1px solid rgba(128,128,128,.15)",
                },
              }}
            >
              <Typography sx={{
                fontSize: ".7rem", fontWeight: 700,
                color: isActive
                  ? penalized ? "#EF4444" : "#2563EB"
                  : "#94A3B8",
              }}>
                {m}
              </Typography>
              {penalized && (
                <Box sx={{
                  width: 4, height: 4, borderRadius: "50%",
                  bgcolor: isActive ? "#EF4444" : "#CBD5E1",
                  mx: "auto", mt: 0.4,
                  transition: "background .2s",
                }} />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Data rows */}
      {destinations.map((dest, dIdx) => (
        <motion.div
          key={dest.id}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: dIdx * 0.07, ease: "easeOut" }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: "180px repeat(12, 1fr)", gap: 0.5, mb: 0.5 }}>
            {/* Destination label */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, pr: 1 }}>
              <Box>
                <Typography sx={{ fontSize: ".8rem", fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
                  {dest.name}
                </Typography>
                <Typography sx={{ fontSize: ".68rem", color: "#94A3B8" }}>
                  {dest.type}
                </Typography>
              </Box>
            </Box>

            {/* Month cells */}
            {dest.monthly.map((score, mIdx) => {
              const s = cellStyle(score);
              const isActive = activeMonth === mIdx + 1;
              const isPenalized = score > 80;
              return (
                <motion.div
                  key={mIdx}
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: dIdx * 0.05 + mIdx * 0.015 }}
                >
                  <Box
                    sx={{
                      bgcolor: s.bg,
                      border: `1px solid ${isActive ? s.text : s.border}`,
                      borderRadius: "7px",
                      height: 58,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "2px",
                      cursor: "default",
                      boxShadow: isPenalized && isActive ? `0 0 0 2px ${s.text}44` : "none",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                      transition: "all .2s ease",
                      position: "relative",
                    }}
                  >
                    <Typography sx={{ fontSize: ".78rem", fontWeight: 900, color: s.text, lineHeight: 1 }}>
                      {score}
                    </Typography>
                    <Typography sx={{ fontSize: ".58rem", fontWeight: 600, color: s.text, opacity: 0.75, lineHeight: 1 }}>
                      {getLevelShort(score)}
                    </Typography>
                    {isPenalized && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 3, right: 3,
                          width: 5, height: 5,
                          borderRadius: "50%",
                          bgcolor: s.text,
                        }}
                      />
                    )}
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>
      ))}

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
        {[
          { label: locale.insights.heatmap.legend[0], bg: "#DCFCE7", text: "#166534" },
          { label: locale.insights.heatmap.legend[1], bg: "#FEF9C3", text: "#854D0E" },
          { label: locale.insights.heatmap.legend[2], bg: "#FFEDD5", text: "#9A3412" },
          { label: locale.insights.heatmap.legend[3], bg: "#FEE2E2", text: "#991B1B" },
        ].map((l) => (
          <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "4px", bgcolor: l.bg, border: `1px solid ${l.text}44` }} />
            <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>{l.label}</Typography>
          </Box>
        ))}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, ml: 1 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#991B1B" }} />
          <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>{locale.insights.heatmap.penaltyDot}</Typography>
        </Box>
      </Box>
    </Box>
  </Box>
  );
};

// ── Redistribution scenario card ─────────────────────────
const ScenarioCard = ({
  from, to, monthLabel, fromScore, toScore, delay,
}: {
  from: string; to: string; monthLabel: string; fromScore: number; toScore: number; delay: number;
}) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { locale } = useLanguage();
  const sc = locale.insights.scenarios;
  const ll = locale.insights.heatmap.levelLabels;
  const getLevelLabel = (score: number) =>
    score <= 30 ? ll.low : score <= 60 ? ll.moderate : score <= 80 ? ll.high : ll.veryHigh;
  const fromS = cellStyle(fromScore);
  const toS = cellStyle(toScore);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <Box
        sx={{
          borderRadius: "20px",
          border: "1px solid",
          borderColor: "divider",
          background: dark
            ? "linear-gradient(160deg, #1E293B 0%, #111827 100%)"
            : "linear-gradient(160deg, #FAFBFF 0%, #F5F8FF 100%)",
          p: 3,
          height: "100%",
        }}
      >
        <Typography sx={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "#94A3B8", mb: 2 }}>
          {monthLabel}
        </Typography>

        {/* FROM */}
        <Box sx={{ p: 2, borderRadius: "12px", bgcolor: `${fromS.bg}`, border: `1px solid ${fromS.border}`, mb: 1.5 }}>
          <Typography sx={{ fontSize: ".68rem", fontWeight: 600, color: fromS.text, mb: 0.25, textTransform: "uppercase", letterSpacing: ".1em" }}>
            {sc.overSaturated}
          </Typography>
          <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1rem" }}>{from}</Typography>
          <Typography sx={{ fontSize: ".75rem", color: fromS.text, fontWeight: 700 }}>
            {sc.congestionLabel} {fromScore} — {getLevelLabel(fromScore)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
          <SwapHorizRoundedIcon sx={{ color: "#2563EB", fontSize: 22 }} />
        </Box>

        {/* TO */}
        <Box sx={{ p: 2, borderRadius: "12px", bgcolor: `${toS.bg}`, border: `1px solid ${toS.border}` }}>
          <Typography sx={{ fontSize: ".68rem", fontWeight: 600, color: toS.text, mb: 0.25, textTransform: "uppercase", letterSpacing: ".1em" }}>
            {sc.horizonRecommends}
          </Typography>
          <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1rem" }}>{to}</Typography>
          <Typography sx={{ fontSize: ".75rem", color: toS.text, fontWeight: 700 }}>
            {sc.congestionLabel} {toScore} — {getLevelLabel(toScore)}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

// ── Low Season Optimizer helpers ─────────────────────────
const getPeakMonth = (monthly: number[], months: string[]): { name: string; score: number } => {
  const idx = monthly.reduce((best, v, i) => (v > monthly[best] ? i : best), 0);
  return { name: months[idx], score: Math.min(100, monthly[idx]) };
};

const getBestOffPeak = (monthly: number[], months: string[], count = 2): Array<{ name: string; score: number }> =>
  monthly
    .map((v, i) => ({ name: months[i], score: Math.min(100, v) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count);

// ── Low Season card ───────────────────────────────────────
const LowSeasonCard = ({ dest, delay }: { dest: HeatmapDest; delay: number }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { locale } = useLanguage();
  const peak = getPeakMonth(dest.monthly, locale.search.monthsShort);
  const offPeak = getBestOffPeak(dest.monthly, locale.search.monthsShort);
  const drop = Math.round(((peak.score - offPeak[0].score) / peak.score) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      <Box
        sx={{
          borderRadius: "18px",
          border: "1px solid",
          borderColor: "divider",
          background: dark
            ? "linear-gradient(160deg, #1E293B 0%, #111827 100%)"
            : "linear-gradient(160deg, #FAFBFF 0%, #F5F8FF 100%)",
          p: 2.5,
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: ".95rem", lineHeight: 1.2 }}>
              {dest.name}
            </Typography>
            <Typography sx={{ fontSize: ".72rem", color: "#94A3B8" }}>{dest.region}</Typography>
          </Box>
          <Chip
            label={locale.insights.optimizer.congestionDrop.replace("{n}", String(drop))}
            size="small"
            icon={<TrendingUpRoundedIcon style={{ fontSize: 12, transform: "rotate(180deg)" }} />}
            sx={{
              height: 22, fontSize: ".68rem", fontWeight: 700,
              bgcolor: "rgba(16,185,129,.1)", color: "#059669",
              border: "1px solid rgba(16,185,129,.2)",
            }}
          />
        </Box>

        {/* Peak */}
        <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: "#FEE2E2", border: "1px solid #FECACA", mb: 1 }}>
          <Typography sx={{ fontSize: ".66rem", fontWeight: 700, color: "#991B1B", textTransform: "uppercase", letterSpacing: ".08em", mb: 0.25 }}>
            {locale.insights.optimizer.peak}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 800, color: "#7F1D1D", fontSize: ".88rem" }}>{peak.name}</Typography>
            <Typography sx={{ fontWeight: 700, color: "#991B1B", fontSize: ".82rem" }}>
              {peak.score}/100
            </Typography>
          </Box>
        </Box>

        {/* Best months */}
        <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: "#DCFCE7", border: "1px solid #BBF7D0" }}>
          <Typography sx={{ fontSize: ".66rem", fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: ".08em", mb: 0.5 }}>
            {locale.insights.optimizer.lowSeason}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.75 }}>
            {offPeak.map((m) => (
              <Box key={m.name} sx={{ flex: 1, textAlign: "center", p: 0.75, borderRadius: "8px", bgcolor: "rgba(22,163,74,.1)" }}>
                <Typography sx={{ fontWeight: 800, color: "#15803D", fontSize: ".85rem" }}>{m.name}</Typography>
                <Typography sx={{ fontWeight: 600, color: "#166534", fontSize: ".72rem" }}>{m.score}/100</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

interface InsightsProps {
  initialMonth?: number;
  recommendations?: Recommendation[];
}

// ── Main page ────────────────────────────────────────────
const Insights = ({ initialMonth = 7, recommendations = [] }: InsightsProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { locale } = useLanguage();
  const loc = locale.insights;
  const [activeMonth, setActiveMonth] = useState<number | null>(initialMonth);

  const penalized = activeMonth ? PENALIZED_BY_MONTH[activeMonth] : 0;

  const hasRecs = recommendations.length > 0;
  const displayedDestinations = hasRecs
    ? ALL_DESTINATIONS.filter((d) =>
        recommendations.some((r) => r.destination_name === d.name)
      )
    : ALL_DESTINATIONS.filter((d) => DEFAULT_HEATMAP_IDS.includes(d.id));

  return (
    <>
      {/* PAGE HEADER */}
      <Box
        sx={{
          background: "linear-gradient(160deg, #070C16 0%, #0F1A2E 100%)",
          pt: { xs: 14, md: 16 },
          pb: { xs: 8, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid texture */}
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        {/* Animated orb 1 — strong blue, top-left */}
        <motion.div
          style={{ position: "absolute", top: "-5%", left: "-8%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,.55) 0%, rgba(37,99,235,.2) 40%, transparent 70%)", filter: "blur(45px)", pointerEvents: "none" }}
          animate={{ x: [0, 50, -25, 0], y: [0, -35, 25, 0], scale: [1, 1.15, 0.92, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Animated orb 2 — cyan, right */}
        <motion.div
          style={{ position: "absolute", top: "10%", right: "-10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,.45) 0%, rgba(56,189,248,.15) 45%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }}
          animate={{ x: [0, -40, 18, 0], y: [0, 30, -20, 0], scale: [1, 0.88, 1.1, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        {/* Animated orb 3 — teal/emerald accent, bottom-left */}
        <motion.div
          style={{ position: "absolute", bottom: "-15%", left: "15%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,.4) 0%, rgba(16,185,129,.12) 45%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.18, 0.9, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        {/* Animated orb 4 — violet warm accent, bottom-right */}
        <motion.div
          style={{ position: "absolute", bottom: "-10%", right: "10%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.38) 0%, transparent 65%)", filter: "blur(42px)", pointerEvents: "none" }}
          animate={{ x: [0, -20, 25, 0], y: [0, 15, -25, 0], scale: [1, 1.1, 0.85, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Typography
              sx={{
                display: "inline-block", px: 2.5, py: 0.9, borderRadius: "999px",
                color: "#38BDF8", fontWeight: 700, fontSize: ".78rem",
                textTransform: "uppercase", letterSpacing: ".2em", mb: 3,
                border: "1px solid rgba(56,189,248,.2)",
                background: "rgba(56,189,248,.06)",
              }}
            >
              {loc.badge}
            </Typography>

            <Typography
              sx={{
                color: "#FFFFFF", fontWeight: 900, lineHeight: 1.05,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                maxWidth: 800, mb: 2.5,
              }}
            >
              {loc.title}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.65)", fontSize: { xs: "1rem", md: "1.1rem" },
                maxWidth: 680, lineHeight: 1.8,
              }}
            >
              {loc.subtitle}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* STATS */}
      <Container maxWidth="xl" sx={{ mt: { xs: 6, md: 8 }, mb: 8 }}>
        <Grid container spacing={2.5}>
          {[
            { ...loc.stats[0], icon: <PeopleRoundedIcon sx={{ fontSize: 22 }} />,        color: "#6366F1", delay: 0 },
            { ...loc.stats[1], icon: <TrendingDownRoundedIcon sx={{ fontSize: 22 }} />,  color: "#EF4444", delay: 0.1 },
            { ...loc.stats[2], icon: <EuroRoundedIcon sx={{ fontSize: 22 }} />,          color: "#F59E0B", delay: 0.2 },
            { ...loc.stats[3], icon: <WbSunnyRoundedIcon sx={{ fontSize: 22 }} />,       color: "#10B981", delay: 0.3 },
          ].map((s) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={s.value}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* MAP */}
      <Container maxWidth="xl" sx={{ mb: { xs: 8, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Typography sx={{ fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", color: "#2563EB", mb: 1 }}>
            {loc.map.badge}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 800, color: "text.primary", lineHeight: 1.1, mb: 0.5 }}>
                {loc.map.title}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: ".95rem", lineHeight: 1.7, maxWidth: 600 }}>
                {loc.map.subtitle}
              </Typography>
            </Box>
            {hasRecs && (
              <Chip
                label={loc.map.highlightChip.replace("{n}", String(recommendations.length))}
                sx={{ fontWeight: 700, fontSize: ".78rem", bgcolor: "rgba(37,99,235,.08)", color: "#2563EB", border: "1px solid rgba(37,99,235,.15)" }}
              />
            )}
          </Box>
          <DestinationMap
            activeMonth={activeMonth}
            recommendedIds={hasRecs ? recommendations.map((r) => {
              // Map destination name back to ID using the ALL_DESTINATIONS list
              const found = ALL_DESTINATIONS.find((d) => d.name === r.destination_name);
              return found?.id ?? "";
            }).filter(Boolean) : []}
          />
        </motion.div>
      </Container>

      {/* LOW SEASON OPTIMIZER */}
      <Box sx={{ bgcolor: dark ? "rgba(15,25,47,.5)" : "#F8FAFC", py: { xs: 8, md: 10 } }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Typography sx={{ fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", color: "#10B981", mb: 1 }}>
              {loc.optimizer.badge}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 800, color: "text.primary", lineHeight: 1.1, mb: 0.5 }}>
                  {loc.optimizer.title}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: ".95rem", lineHeight: 1.7, maxWidth: 640 }}>
                  {loc.optimizer.subtitlePart1} <Box component="span" sx={{ fontWeight: 700, color: "#059669" }}>{loc.optimizer.subtitleBold}</Box> {loc.optimizer.subtitlePart2}
                </Typography>
              </Box>
              <Chip
                label={loc.optimizer.dataChip}
                size="small"
                sx={{ fontWeight: 600, fontSize: ".75rem", bgcolor: "rgba(16,185,129,.08)", color: "#059669", border: "1px solid rgba(16,185,129,.18)" }}
              />
            </Box>
          </motion.div>

          <Grid container spacing={2.5} sx={{ mt: 2 }}>
            {displayedDestinations.map((dest, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dest.id}>
                <LowSeasonCard dest={dest} delay={i * 0.06} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* HEATMAP */}
      <Box sx={{ bgcolor: "background.default", py: { xs: 8, md: 10 } }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Typography
              sx={{
                fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: ".2em", color: "#2563EB", mb: 1,
              }}
            >
              {loc.heatmap.badge}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 800,
                color: "text.primary", lineHeight: 1.1, mb: 1.5,
              }}
            >
              {loc.heatmap.title}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: ".95rem", lineHeight: 1.8, maxWidth: 680, mb: 4 }}>
              {loc.heatmap.subtitlePart1}{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#EF4444" }}>{loc.heatmap.subtitleRed}</Box>{" "}
              {loc.heatmap.subtitlePart2}
            </Typography>
          </motion.div>

          {/* Month selector */}
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 4 }}>
            {locale.search.monthsShort.map((m, i) => {
              const monthNum = i + 1;
              const p = PENALIZED_BY_MONTH[monthNum];
              const isActive = activeMonth === monthNum;
              return (
                <Chip
                  key={m}
                  label={p > 0 ? `${m} (${p} ${loc.heatmap.penalizedLabel})` : m}
                  onClick={() => setActiveMonth(isActive ? null : monthNum)}
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    bgcolor: isActive
                      ? p > 0 ? "rgba(239,68,68,.12)" : "rgba(37,99,235,.12)"
                      : dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
                    color: isActive
                      ? p > 0 ? "#EF4444" : "#2563EB"
                      : "text.secondary",
                    border: isActive
                      ? p > 0 ? "1px solid rgba(239,68,68,.25)" : "1px solid rgba(37,99,235,.25)"
                      : "1px solid transparent",
                    transition: "all .2s ease",
                    "&:hover": { opacity: 0.85 },
                  }}
                />
              );
            })}
          </Stack>

          {/* Active month banner */}
          {activeMonth && penalized > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  p: 2, mb: 3, borderRadius: "14px",
                  bgcolor: "rgba(239,68,68,.06)",
                  border: "1px solid rgba(239,68,68,.15)",
                  display: "flex", alignItems: "center", gap: 1.5,
                }}
              >
                <PeopleRoundedIcon sx={{ color: "#EF4444", fontSize: 20 }} />
                <Typography sx={{ fontSize: ".88rem", color: "text.primary" }}>
                  {loc.heatmap.bannerPenalized
                    .replace("{n}", String(penalized))
                    .replace("{month}", locale.search.months[activeMonth! - 1])}
                </Typography>
              </Box>
            </motion.div>
          )}

          {activeMonth && penalized === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  p: 2, mb: 3, borderRadius: "14px",
                  bgcolor: "rgba(16,185,129,.06)",
                  border: "1px solid rgba(16,185,129,.15)",
                  display: "flex", alignItems: "center", gap: 1.5,
                }}
              >
                <SpaRoundedIcon sx={{ color: "#10B981", fontSize: 20 }} />
                <Typography sx={{ fontSize: ".88rem", color: "text.primary" }}>
                  {loc.heatmap.bannerSafe
                    .replace("{month}", locale.search.months[activeMonth! - 1])}
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Source banner */}
          <Box
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              p: 1.5, mb: 2, borderRadius: "12px",
              bgcolor: hasRecs ? "rgba(37,99,235,.06)" : "rgba(100,116,139,.06)",
              border: hasRecs ? "1px solid rgba(37,99,235,.15)" : "1px solid rgba(100,116,139,.12)",
            }}
          >
            <Box
              sx={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                bgcolor: hasRecs ? "#2563EB" : "#94A3B8",
              }}
            />
            <Typography sx={{ fontSize: ".8rem", color: "text.secondary" }}>
              {hasRecs
                ? loc.heatmap.sourceBannerRecs.replace("{n}", String(displayedDestinations.length))
                : loc.heatmap.sourceBannerDefault}
            </Typography>
          </Box>

          <CongestionHeatmap
            activeMonth={activeMonth}
            onMonthClick={(m) => setActiveMonth((prev) => (prev === m ? null : m))}
            destinations={displayedDestinations}
          />
        </Container>
      </Box>

      {/* REDISTRIBUTION SCENARIOS */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Typography sx={{ fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", color: "#2563EB", mb: 1 }}>
            {loc.redistribution.badge}
          </Typography>
          <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 800, color: "text.primary", lineHeight: 1.1, mb: 1.5 }}>
            {loc.redistribution.title}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: ".95rem", lineHeight: 1.8, maxWidth: 680, mb: 6 }}>
            {loc.redistribution.subtitle}
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ScenarioCard
              from="Mallorca" to="Picos de Europa"
              monthLabel="July — Peak Season"
              fromScore={95} toScore={85}
              delay={0}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ScenarioCard
              from="Barcelona" to="Sierra Nevada"
              monthLabel="May — Spring Peak"
              fromScore={90} toScore={55}
              delay={0.1}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ScenarioCard
              from="Ibiza" to="Sierra Nevada"
              monthLabel="August — Summer Peak"
              fromScore={100} toScore={90}
              delay={0.2}
            />
          </Grid>
        </Grid>
      </Container>

      {/* IMPACT TARGETS */}
      <Box sx={{ bgcolor: "linear-gradient(160deg, #070C16 0%, #0F1A2E 100%)", background: "linear-gradient(160deg, #070C16 0%, #0F1A2E 100%)", py: { xs: 8, md: 10 } }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Typography sx={{ fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", color: "#38BDF8", mb: 1 }}>
              {loc.impactTargets.badge}
            </Typography>
            <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, mb: 6 }}>
              {loc.impactTargets.title}
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {loc.impactTargets.items.map((t, i) => {
              const colors = ["#38BDF8", "#10B981", "#6366F1", "#F59E0B"];
              const delays = [0, 0.1, 0.2, 0.3];
              return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={t.value}>
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: delays[i], ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      borderRadius: "20px",
                      border: `1px solid ${colors[i]}22`,
                      background: `linear-gradient(145deg, ${colors[i]}08 0%, ${colors[i]}14 100%)`,
                      p: 3, height: "100%",
                    }}
                  >
                    <Typography sx={{ fontSize: "2.4rem", fontWeight: 900, color: colors[i], lineHeight: 1, mb: 0.5 }}>
                      {t.value}
                    </Typography>
                    <Typography sx={{ fontSize: ".85rem", fontWeight: 700, color: "#FFFFFF", mb: 1 }}>
                      {t.label}
                    </Typography>
                    <Typography sx={{ fontSize: ".8rem", color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>
                      {t.desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default Insights;
