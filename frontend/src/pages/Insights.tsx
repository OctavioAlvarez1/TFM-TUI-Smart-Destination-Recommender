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
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import BeachAccessRoundedIcon from "@mui/icons-material/BeachAccessRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";


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

// ── Colour helpers ───────────────────────────────────────
const cellStyle = (score: number) => {
  if (score <= 30) return {
    bg: "linear-gradient(145deg, #ECFDF5 0%, #DCFCE7 100%)",
    bgDark: "linear-gradient(145deg, rgba(16,185,129,.18) 0%, rgba(16,185,129,.10) 100%)",
    text: "#166534", textDark: "#6EE7B7",
    border: "#BBF7D0", borderDark: "rgba(16,185,129,.28)",
    bar: "#10B981", glow: "rgba(16,185,129,.35)",
  };
  if (score <= 60) return {
    bg: "linear-gradient(145deg, #FEFCE8 0%, #FEF9C3 100%)",
    bgDark: "linear-gradient(145deg, rgba(245,158,11,.18) 0%, rgba(245,158,11,.10) 100%)",
    text: "#854D0E", textDark: "#FCD34D",
    border: "#FDE68A", borderDark: "rgba(245,158,11,.28)",
    bar: "#F59E0B", glow: "rgba(245,158,11,.35)",
  };
  if (score <= 80) return {
    bg: "linear-gradient(145deg, #FFF7ED 0%, #FFEDD5 100%)",
    bgDark: "linear-gradient(145deg, rgba(249,115,22,.18) 0%, rgba(249,115,22,.10) 100%)",
    text: "#9A3412", textDark: "#FDBA74",
    border: "#FED7AA", borderDark: "rgba(249,115,22,.28)",
    bar: "#F97316", glow: "rgba(249,115,22,.35)",
  };
  return {
    bg: "linear-gradient(145deg, #FFF1F2 0%, #FEE2E2 100%)",
    bgDark: "linear-gradient(145deg, rgba(239,68,68,.18) 0%, rgba(239,68,68,.10) 100%)",
    text: "#991B1B", textDark: "#FCA5A5",
    border: "#FECACA", borderDark: "rgba(239,68,68,.28)",
    bar: "#EF4444", glow: "rgba(239,68,68,.40)",
  };
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
    style={{ height: "100%" }}
  >
    <Box
      sx={{
        borderRadius: "20px",
        border: `1px solid rgba(255,255,255,.28)`,
        borderTop: `3px solid ${color}`,
        background: `linear-gradient(160deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,.10) 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 12px 40px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.30)`,
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: 44, height: 44, borderRadius: "12px",
          bgcolor: `${color}22`, display: "flex",
          alignItems: "center", justifyContent: "center", color, mb: 2, flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: ".85rem", color: "rgba(255,255,255,.75)", fontWeight: 600, lineHeight: 1.5 }}>
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
  penalizedByMonth,
}: {
  activeMonth: number | null;
  onMonthClick: (m: number) => void;
  destinations: HeatmapDest[];
  penalizedByMonth: Record<number, number>;
}) => {
  const { locale } = useLanguage();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const ll = locale.insights.heatmap.levelShort;
  const getLevelShort = (score: number) =>
    score <= 30 ? ll.low : score <= 60 ? ll.moderate : score <= 80 ? ll.high : ll.veryHigh;

  return (
  <Box sx={{ overflowX: "auto", pb: 1 }}>
    <Box sx={{ minWidth: 860 }}>
      {/* Header row */}
      <Box sx={{ display: "grid", gridTemplateColumns: "190px repeat(12, 1fr)", gap: 0.75, mb: 0.75 }}>
        <Box />
        {locale.search.monthsShort.map((m, i) => {
          const isActive = activeMonth === i + 1;
          const penalizedCount = (penalizedByMonth[i + 1] ?? 0) > 0;
          return (
            <Box
              key={m}
              onClick={() => onMonthClick(i + 1)}
              sx={{
                textAlign: "center",
                py: 1.1,
                borderRadius: "10px",
                cursor: "pointer",
                background: isActive
                  ? penalizedCount
                    ? "linear-gradient(135deg, rgba(239,68,68,.18), rgba(239,68,68,.08))"
                    : "linear-gradient(135deg, rgba(37,99,235,.18), rgba(37,99,235,.08))"
                  : "transparent",
                border: isActive
                  ? penalizedCount ? "1.5px solid rgba(239,68,68,.4)" : "1.5px solid rgba(37,99,235,.35)"
                  : "1.5px solid transparent",
                boxShadow: isActive
                  ? penalizedCount ? "0 4px 12px rgba(239,68,68,.15)" : "0 4px 12px rgba(37,99,235,.15)"
                  : "none",
                transition: "all .2s ease",
                "&:hover": {
                  background: isActive ? undefined : dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
                  border: isActive ? undefined : "1.5px solid",
                  borderColor: isActive ? undefined : "divider",
                },
              }}
            >
              <Typography sx={{
                fontSize: ".72rem", fontWeight: isActive ? 800 : 600,
                color: isActive
                  ? penalizedCount ? "#EF4444" : "#2563EB"
                  : "text.secondary",
                letterSpacing: ".03em",
              }}>
                {m}
              </Typography>
              {penalizedCount && (
                <Box sx={{
                  width: 5, height: 5, borderRadius: "50%",
                  bgcolor: isActive ? "#EF4444" : dark ? "rgba(239,68,68,.4)" : "#FCA5A5",
                  mx: "auto", mt: 0.5,
                  transition: "background .2s",
                }} />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Data rows */}
      {destinations.map((dest, dIdx) => {
        const typeMeta = DEST_TYPE_META[dest.type] ?? { emoji: "📍", color: "#2563EB" };
        return (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: dIdx * 0.07, ease: "easeOut" }}
          >
            <Box sx={{ display: "grid", gridTemplateColumns: "190px repeat(12, 1fr)", gap: 0.75, mb: 0.75 }}>
              {/* Destination label */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, pr: 1 }}>
                <Box sx={{
                  width: 8, height: 8, borderRadius: "50%",
                  bgcolor: typeMeta.color, flexShrink: 0,
                  boxShadow: `0 0 0 3px ${typeMeta.color}22`,
                }} />
                <Box>
                  <Typography sx={{ fontSize: ".8rem", fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
                    {dest.name}
                  </Typography>
                  <Typography sx={{ fontSize: ".65rem", color: "text.secondary", fontWeight: 500 }}>
                    {dest.type}
                  </Typography>
                </Box>
              </Box>

              {/* Month cells */}
              {dest.monthly.map((score, mIdx) => {
                const s = cellStyle(score);
                const isActive = activeMonth === mIdx + 1;
                const isPenalized = score > 80;
                const textColor = dark ? s.textDark : s.text;
                return (
                  <motion.div
                    key={mIdx}
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.28, delay: dIdx * 0.04 + mIdx * 0.012 }}
                    style={{ position: "relative" }}
                  >
                    <Box
                      sx={{
                        background: dark ? s.bgDark : s.bg,
                        border: `1.5px solid ${isActive ? s.bar : (dark ? s.borderDark : s.border)}`,
                        borderRadius: "10px",
                        height: 64,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1px",
                        cursor: "default",
                        overflow: "hidden",
                        boxShadow: isActive
                          ? `0 0 0 2.5px ${s.glow}, 0 6px 16px ${s.glow}`
                          : dark ? "none" : "0 1px 4px rgba(0,0,0,.06)",
                        transform: isActive ? "scale(1.06)" : "scale(1)",
                        zIndex: isActive ? 1 : 0,
                        transition: "all .22s ease",
                        position: "relative",
                        "&:hover": { transform: isActive ? "scale(1.07)" : "scale(1.04)", zIndex: 2 },
                      }}
                    >
                      {/* Bottom progress bar */}
                      <Box sx={{
                        position: "absolute", bottom: 0, left: 0,
                        height: 3, borderRadius: "0 2px 0 0",
                        bgcolor: s.bar,
                        width: `${score}%`,
                        opacity: 0.6,
                      }} />

                      <Typography sx={{ fontSize: ".82rem", fontWeight: 900, color: textColor, lineHeight: 1 }}>
                        {score}
                      </Typography>
                      <Typography sx={{ fontSize: ".58rem", fontWeight: 600, color: textColor, opacity: 0.8, lineHeight: 1 }}>
                        {getLevelShort(score)}
                      </Typography>

                      {isPenalized && (
                        <Box sx={{
                          position: "absolute",
                          top: 4, right: 4,
                          width: 6, height: 6,
                          borderRadius: "50%",
                          bgcolor: s.bar,
                          boxShadow: `0 0 0 2px ${s.glow}`,
                        }} />
                      )}
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </motion.div>
        );
      })}

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 2.5, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: locale.insights.heatmap.legend[0], bar: "#10B981", bg: "#DCFCE7", bgDark: "rgba(16,185,129,.15)", text: "#166534", textDark: "#6EE7B7" },
          { label: locale.insights.heatmap.legend[1], bar: "#F59E0B", bg: "#FEF9C3", bgDark: "rgba(245,158,11,.15)", text: "#854D0E", textDark: "#FCD34D" },
          { label: locale.insights.heatmap.legend[2], bar: "#F97316", bg: "#FFEDD5", bgDark: "rgba(249,115,22,.15)", text: "#9A3412", textDark: "#FDBA74" },
          { label: locale.insights.heatmap.legend[3], bar: "#EF4444", bg: "#FEE2E2", bgDark: "rgba(239,68,68,.15)", text: "#991B1B", textDark: "#FCA5A5" },
        ].map((l) => (
          <Box
            key={l.label}
            sx={{
              display: "flex", alignItems: "center", gap: 0.75,
              px: 1.2, py: 0.5, borderRadius: "8px",
              background: dark ? l.bgDark : l.bg,
              border: `1px solid ${dark ? l.bar + "33" : l.bar + "44"}`,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: "3px", bgcolor: l.bar }} />
            <Typography sx={{ fontSize: ".7rem", fontWeight: 600, color: dark ? l.textDark : l.text }}>{l.label}</Typography>
          </Box>
        ))}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1.2, py: 0.5, borderRadius: "8px", background: dark ? "rgba(239,68,68,.1)" : "#FFF1F2", border: "1px solid rgba(239,68,68,.2)" }}>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#EF4444", boxShadow: "0 0 0 2px rgba(239,68,68,.25)" }} />
          <Typography sx={{ fontSize: ".7rem", fontWeight: 600, color: dark ? "#FCA5A5" : "#991B1B" }}>{locale.insights.heatmap.penaltyDot}</Typography>
        </Box>
      </Box>
    </Box>
  </Box>
  );
};

// ── Redistribution scenario card ─────────────────────────
const ScenarioCard = ({
  from, to, labelIdx, fromScore, toScore, delay,
}: {
  from: string; to: string; labelIdx: number; fromScore: number; toScore: number; delay: number;
}) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { locale } = useLanguage();
  const sc = locale.insights.scenarios;
  const ll = locale.insights.heatmap.levelLabels;
  const getLevelLabel = (score: number) =>
    score <= 30 ? ll.low : score <= 60 ? ll.moderate : score <= 80 ? ll.high : ll.veryHigh;
  const toS = cellStyle(toScore);
  const reduction = fromScore - toScore;

  const CongestionBar = ({ score, bar }: { score: number; bar: string }) => (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ position: "relative", height: 6, borderRadius: "3px", bgcolor: dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${score}%`, bgcolor: bar, borderRadius: "3px", transition: "width .6s ease" }} />
      </Box>
    </Box>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Box
        sx={{
          borderRadius: "22px",
          border: "1px solid",
          borderColor: dark ? "rgba(255,255,255,.09)" : "rgba(0,0,0,.07)",
          background: dark ? "linear-gradient(160deg, #1A2540 0%, #111827 100%)" : "#FFFFFF",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: dark ? "0 4px 24px rgba(0,0,0,.28)" : "0 4px 24px rgba(0,0,0,.07)",
          transition: "transform .22s ease, box-shadow .22s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: dark ? "0 16px 40px rgba(0,0,0,.38)" : "0 16px 40px rgba(0,0,0,.12)",
          },
        }}
      >
        {/* Header with month label */}
        <Box sx={{
          px: 2.5, py: 1.5,
          background: dark
            ? "linear-gradient(135deg, rgba(37,99,235,.18) 0%, rgba(14,163,181,.10) 100%)"
            : "linear-gradient(135deg, rgba(37,99,235,.07) 0%, rgba(14,163,181,.04) 100%)",
          borderBottom: "1px solid",
          borderColor: dark ? "rgba(37,99,235,.18)" : "rgba(37,99,235,.10)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Typography sx={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "#2563EB" }}>
            {sc.labels[labelIdx]}
          </Typography>
          {reduction > 0 && (
            <Box sx={{
              display: "flex", alignItems: "center", gap: 0.4,
              px: 1, py: 0.3, borderRadius: "8px",
              bgcolor: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.25)",
            }}>
              <Typography sx={{ fontSize: ".65rem", fontWeight: 800, color: "#059669" }}>
                −{reduction} pts
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
          {/* FROM — over-saturated */}
          <Box sx={{
            p: 2, borderRadius: "14px",
            background: dark
              ? `linear-gradient(135deg, rgba(239,68,68,.14) 0%, rgba(239,68,68,.07) 100%)`
              : "linear-gradient(135deg, #FFF1F2 0%, #FEE2E2 100%)",
            border: `1.5px solid ${dark ? "rgba(239,68,68,.22)" : "#FECACA"}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
              <Box sx={{ width: 18, height: 18, borderRadius: "5px", bgcolor: "rgba(239,68,68,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontSize: ".6rem", fontWeight: 900, color: "#EF4444" }}>✕</Typography>
              </Box>
              <Typography sx={{ fontSize: ".62rem", fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: ".1em" }}>
                {sc.overSaturated}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, color: dark ? "#FCA5A5" : "#B91C1C", fontSize: "1.05rem", lineHeight: 1.2 }}>
              {from}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5 }}>
              <Typography sx={{ fontSize: ".72rem", color: dark ? "#FCA5A5" : "#991B1B", fontWeight: 600 }}>
                {getLevelLabel(fromScore)}
              </Typography>
              <Typography sx={{ fontSize: ".8rem", fontWeight: 900, color: "#EF4444" }}>
                {fromScore}/100
              </Typography>
            </Box>
            <CongestionBar score={fromScore} bar="#EF4444" />
          </Box>

          {/* Connector */}
          <Box sx={{ py: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ flex: 1, height: "1px", bgcolor: dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)" }} />
            <Box sx={{
              display: "flex", alignItems: "center", gap: 0.5,
              px: 1.5, py: 0.5, borderRadius: "20px",
              bgcolor: dark ? "rgba(37,99,235,.12)" : "rgba(37,99,235,.08)",
              border: "1px solid rgba(37,99,235,.18)",
            }}>
              <SwapHorizRoundedIcon sx={{ fontSize: 13, color: "#2563EB" }} />
              <Typography sx={{ fontSize: ".6rem", fontWeight: 700, color: "#2563EB", textTransform: "uppercase", letterSpacing: ".08em" }}>
                {sc.redirects}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, height: "1px", bgcolor: dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)" }} />
          </Box>

          {/* TO — recommended */}
          <Box sx={{
            p: 2, borderRadius: "14px",
            background: dark
              ? `linear-gradient(135deg, ${toS.bgDark} 0%, rgba(0,0,0,.1) 100%)`
              : `linear-gradient(135deg, ${toScore <= 30 ? "#F0FDF4" : toScore <= 60 ? "#FEFCE8" : toScore <= 80 ? "#FFF7ED" : "#FFF1F2"} 0%, ${toScore <= 30 ? "#DCFCE7" : toScore <= 60 ? "#FEF9C3" : toScore <= 80 ? "#FFEDD5" : "#FEE2E2"} 100%)`,
            border: `1.5px solid ${dark ? toS.borderDark : toS.border}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
              <Box sx={{ width: 18, height: 18, borderRadius: "5px", bgcolor: `${toS.bar}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontSize: ".6rem", fontWeight: 900, color: toS.bar }}>✓</Typography>
              </Box>
              <Typography sx={{ fontSize: ".62rem", fontWeight: 700, color: toS.bar, textTransform: "uppercase", letterSpacing: ".1em" }}>
                {sc.horizonRecommends}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, color: dark ? toS.textDark : toS.text, fontSize: "1.05rem", lineHeight: 1.2 }}>
              {to}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5 }}>
              <Typography sx={{ fontSize: ".72rem", color: dark ? toS.textDark : toS.text, fontWeight: 600 }}>
                {getLevelLabel(toScore)}
              </Typography>
              <Typography sx={{ fontSize: ".8rem", fontWeight: 900, color: toS.bar }}>
                {toScore}/100
              </Typography>
            </Box>
            <CongestionBar score={toScore} bar={toS.bar} />
          </Box>

          {/* Bottom insight */}
          {reduction > 0 && (
            <Box sx={{ mt: 1.5, px: 0.5, display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#10B981", flexShrink: 0 }} />
              <Typography sx={{ fontSize: ".68rem", color: "text.secondary", lineHeight: 1.4 }}>
                <Box component="span" sx={{ fontWeight: 700, color: "#059669" }}>−{reduction} pts</Box>
                {" "}{sc.ptsLess}
              </Typography>
            </Box>
          )}
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

// ── Low Season card helpers ───────────────────────────────
const DEST_TYPE_META: Record<string, { emoji: string; color: string }> = {
  Beach:  { emoji: "🏖️", color: "#0EA5E9" },
  City:   { emoji: "🏛️", color: "#8B5CF6" },
  Nature: { emoji: "🌿", color: "#10B981" },
  Mixed:  { emoji: "✨", color: "#F59E0B" },
};

// ── Low Season card ───────────────────────────────────────
const LowSeasonCard = ({ dest, delay }: { dest: HeatmapDest; delay: number }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { locale } = useLanguage();
  const peak = getPeakMonth(dest.monthly, locale.search.monthsShort);
  const offPeak = getBestOffPeak(dest.monthly, locale.search.monthsShort);
  const drop = Math.round(((peak.score - offPeak[0].score) / peak.score) * 100);
  const meta = DEST_TYPE_META[dest.type] ?? { emoji: "📍", color: "#2563EB" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Box
        sx={{
          borderRadius: "20px",
          border: "1px solid",
          borderColor: dark ? "rgba(255,255,255,.09)" : "rgba(0,0,0,.07)",
          background: dark ? "linear-gradient(160deg, #1A2540 0%, #111827 100%)" : "#FFFFFF",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: dark ? "0 4px 20px rgba(0,0,0,.28)" : "0 4px 20px rgba(0,0,0,.06)",
          transition: "transform .22s ease, box-shadow .22s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: dark ? "0 16px 40px rgba(0,0,0,.38)" : "0 16px 40px rgba(0,0,0,.12)",
          },
        }}
      >
        {/* Colored top stripe */}
        <Box sx={{ height: 4, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}66)` }} />

        {/* Header */}
        <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box sx={{
              width: 38, height: 38, borderRadius: "11px",
              bgcolor: `${meta.color}18`,
              border: `1px solid ${meta.color}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}>
              {meta.emoji}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1rem", lineHeight: 1.2 }}>
                {dest.name}
              </Typography>
              <Typography sx={{ fontSize: ".7rem", color: "text.secondary", mt: 0.15 }}>
                {dest.region}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`−${drop}%`}
            size="small"
            icon={<TrendingDownRoundedIcon style={{ fontSize: 13 }} />}
            sx={{
              height: 24, fontSize: ".72rem", fontWeight: 800,
              bgcolor: "rgba(16,185,129,.12)", color: "#059669",
              border: "1px solid rgba(16,185,129,.28)",
              borderRadius: "8px",
              "& .MuiChip-icon": { color: "#059669" },
            }}
          />
        </Box>

        {/* Comparison bar */}
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
            <Typography sx={{ fontSize: ".62rem", color: "#EF4444", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>
              ☀️ {peak.score}/100
            </Typography>
            <Typography sx={{ fontSize: ".62rem", color: "#10B981", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>
              ❄️ {offPeak[0].score}/100
            </Typography>
          </Box>
          <Box sx={{ position: "relative", height: 7, borderRadius: "4px", bgcolor: dark ? "rgba(255,255,255,.06)" : "#F1F5F9" }}>
            <Box sx={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${peak.score}%`,
              background: "linear-gradient(90deg, #10B981 0%, #F59E0B 55%, #EF4444 100%)",
              borderRadius: "4px",
              opacity: 0.28,
            }} />
            <Box sx={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${offPeak[0].score}%`,
              background: "linear-gradient(90deg, #059669, #10B981)",
              borderRadius: "4px",
            }} />
          </Box>
        </Box>

        <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
          {/* Peak month */}
          <Box sx={{
            p: 1.5, borderRadius: "12px",
            bgcolor: dark ? "rgba(239,68,68,.09)" : "#FFF5F5",
            border: `1px solid ${dark ? "rgba(239,68,68,.16)" : "#FECACA"}`,
          }}>
            <Typography sx={{ fontSize: ".63rem", fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: ".09em", mb: 0.5 }}>
              {locale.insights.optimizer.peak}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ fontWeight: 800, color: dark ? "#FCA5A5" : "#B91C1C", fontSize: ".92rem" }}>
                {peak.name}
              </Typography>
              <Box sx={{ px: 1, py: 0.2, borderRadius: "6px", bgcolor: dark ? "rgba(239,68,68,.14)" : "#FEE2E2" }}>
                <Typography sx={{ fontWeight: 700, color: "#EF4444", fontSize: ".78rem" }}>
                  {peak.score}/100
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Best months */}
          <Box sx={{
            p: 1.5, borderRadius: "12px",
            bgcolor: dark ? "rgba(16,185,129,.09)" : "#F0FDF4",
            border: `1px solid ${dark ? "rgba(16,185,129,.16)" : "#BBF7D0"}`,
          }}>
            <Typography sx={{ fontSize: ".63rem", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: ".09em", mb: 0.75 }}>
              {locale.insights.optimizer.lowSeason}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.75 }}>
              {offPeak.map((m) => (
                <Box key={m.name} sx={{
                  flex: 1, textAlign: "center", py: 0.75,
                  borderRadius: "9px",
                  bgcolor: dark ? "rgba(16,185,129,.12)" : "rgba(22,163,74,.08)",
                  border: "1px solid rgba(16,185,129,.22)",
                }}>
                  <Typography sx={{ fontWeight: 800, color: "#059669", fontSize: ".9rem", lineHeight: 1 }}>
                    {m.name}
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: dark ? "#6EE7B7" : "#166534", fontSize: ".7rem", mt: 0.25 }}>
                    {m.score}/100
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Insight tip */}
          <Box sx={{
            mt: "auto", pt: 0.75, px: 0.5,
            display: "flex", alignItems: "flex-start", gap: 0.75,
          }}>
            <Typography sx={{ fontSize: ".69rem", color: "text.secondary", lineHeight: 1.5 }}>
              💡{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#059669" }}>
                {offPeak[0].name}
              </Box>
              {" · "}{locale.insights.optimizer.congestionDrop.replace("{n}", String(drop))}
              {" · "}{locale.insights.optimizer.cheaperTip}
            </Typography>
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
  const [mapFilter, setMapFilter] = useState<"low" | "moderate" | "high" | "veryHigh" | null>(null);

  const hasRecs = recommendations.length > 0;
  const displayedDestinations = hasRecs
    ? ALL_DESTINATIONS.filter((d) =>
        recommendations.some((r) => r.destination_name === d.name)
      )
    : ALL_DESTINATIONS.filter((d) => DEFAULT_HEATMAP_IDS.includes(d.id));

  const penalizedByMonth: Record<number, number> = {};
  for (let m = 1; m <= 12; m++) {
    penalizedByMonth[m] = displayedDestinations.filter((d) => d.monthly[m - 1] > 80).length;
  }
  const penalized = activeMonth ? penalizedByMonth[activeMonth] : 0;

  return (
    <>
      {/* PAGE HEADER */}
      <Box
        sx={{
          background: "linear-gradient(160deg, #0A2E5E 0%, #0E63B5 35%, #0097B2 68%, #00C4CC 100%)",
          pt: { xs: 14, md: 16 },
          pb: { xs: 12, md: 14 },
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

        {/* Wave layer 1 — slow, deep */}
        <Box sx={{ position: "absolute", bottom: 60, left: 0, width: "100%", height: 120, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          <motion.div
            style={{ display: "flex", width: "200%", height: "100%" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: "50%", height: "100%", flexShrink: 0 }}>
              <path d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,20 1440,60 L1440,120 L0,120 Z" fill="rgba(255,255,255,.06)" />
            </svg>
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: "50%", height: "100%", flexShrink: 0 }}>
              <path d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,20 1440,60 L1440,120 L0,120 Z" fill="rgba(255,255,255,.06)" />
            </svg>
          </motion.div>
        </Box>

        {/* Wave layer 2 — medium speed */}
        <Box sx={{ position: "absolute", bottom: 30, left: 0, width: "100%", height: 100, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          <motion.div
            style={{ display: "flex", width: "200%", height: "100%" }}
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ width: "50%", height: "100%", flexShrink: 0 }}>
              <path d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,.09)" />
            </svg>
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ width: "50%", height: "100%", flexShrink: 0 }}>
              <path d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,.09)" />
            </svg>
          </motion.div>
        </Box>

        {/* Wave layer 3 — fast, surface */}
        <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 90, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          <motion.div
            style={{ display: "flex", width: "200%", height: "100%" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ width: "50%", height: "100%", flexShrink: 0 }}>
              <path d="M0,45 C200,80 400,10 600,45 C800,80 1000,10 1200,45 C1320,65 1380,30 1440,45 L1440,90 L0,90 Z" fill="rgba(255,255,255,.13)" />
            </svg>
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ width: "50%", height: "100%", flexShrink: 0 }}>
              <path d="M0,45 C200,80 400,10 600,45 C800,80 1000,10 1200,45 C1320,65 1380,30 1440,45 L1440,90 L0,90 Z" fill="rgba(255,255,255,.13)" />
            </svg>
          </motion.div>
        </Box>

        {/* Wave divider — bottom */}
        <Box sx={{ position: "absolute", bottom: -2, left: 0, width: "100%", lineHeight: 0, pointerEvents: "none", zIndex: 2 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill={dark ? "#0B1220" : "#F8FAFC"} />
          </svg>
        </Box>

        {/* Orb 1 — bright blue, top-left */}
        <motion.div
          style={{ position: "absolute", top: "-5%", left: "-8%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,163,181,.40) 0%, rgba(6,182,212,.12) 40%, transparent 70%)", filter: "blur(55px)", pointerEvents: "none" }}
          animate={{ x: [0, 50, -25, 0], y: [0, -35, 25, 0], scale: [1, 1.15, 0.92, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orb 2 — bright cyan, right */}
        <motion.div
          style={{ position: "absolute", top: "10%", right: "-10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,196,204,.5) 0%, rgba(0,180,216,.18) 45%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }}
          animate={{ x: [0, -40, 18, 0], y: [0, 30, -20, 0], scale: [1, 0.88, 1.1, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        {/* Orb 3 — coral/sunset, bottom-left */}
        <motion.div
          style={{ position: "absolute", bottom: "-15%", left: "15%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,113,94,.32) 0%, rgba(239,68,68,.10) 45%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.18, 0.9, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        {/* Orb 4 — turquoise, bottom-right */}
        <motion.div
          style={{ position: "absolute", bottom: "-10%", right: "10%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,.42) 0%, transparent 65%)", filter: "blur(42px)", pointerEvents: "none" }}
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

          </motion.div>

          {/* STATS — inside hero for shared dark bg */}
          <Grid container spacing={2.5} sx={{ mt: { xs: 5, md: 7 } }}>
            {[
              { ...loc.stats[0], icon: <FlightTakeoffRoundedIcon sx={{ fontSize: 22 }} />,   color: "#38BDF8", delay: 0 },
              { ...loc.stats[1], icon: <TrendingDownRoundedIcon sx={{ fontSize: 22 }} />,   color: "#FB7185", delay: 0.1 },
              { ...loc.stats[2], icon: <AccountBalanceRoundedIcon sx={{ fontSize: 22 }} />, color: "#FBBF24", delay: 0.2 },
              { ...loc.stats[3], icon: <BeachAccessRoundedIcon sx={{ fontSize: 22 }} />,    color: "#34D399", delay: 0.3 },
            ].map((s) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={s.value}>
                <StatCard {...s} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* MAP */}
      <Container maxWidth="xl" sx={{ mt: { xs: 8, md: 10 }, mb: { xs: 8, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
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

          {/* Map + Legend */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "220px 1fr" },
              gap: 0,
              borderRadius: "24px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              background: dark ? "rgba(17,24,39,0.6)" : "rgba(248,250,252,0.8)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Legend column — left */}
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 1.5,
                borderRight: { lg: "1px solid" },
                borderBottom: { xs: "1px solid", lg: "none" },
                borderColor: "divider",
              }}
            >
              <Typography sx={{ fontSize: ".8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".18em", color: "text.primary", mb: 1, textAlign: "center" }}>
                {locale.card.metrics.congestion}
              </Typography>

              {([
                { label: loc.heatmap.levelLabels.low,      range: "≤ 30", color: "#10B981", bg: "rgba(16,185,129,.10)",  penalized: false, key: "low"      as const },
                { label: loc.heatmap.levelLabels.moderate, range: "≤ 60", color: "#F59E0B", bg: "rgba(245,158,11,.10)", penalized: false, key: "moderate" as const },
                { label: loc.heatmap.levelLabels.high,     range: "≤ 80", color: "#F97316", bg: "rgba(249,115,22,.10)", penalized: false, key: "high"     as const },
                { label: loc.heatmap.levelLabels.veryHigh, range: "> 80", color: "#EF4444", bg: "rgba(239,68,68,.10)",  penalized: true,  key: "veryHigh" as const },
              ] as const).map((item) => {
                const active = mapFilter === item.key;
                return (
                  <Box
                    key={item.key}
                    onClick={() => setMapFilter(active ? null : item.key)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: "12px",
                      background: active ? `${item.color}22` : item.bg,
                      border: `1px solid ${active ? item.color : `${item.color}22`}`,
                      cursor: "pointer",
                      transition: "all .18s",
                      "&:hover": { border: `1px solid ${item.color}66`, background: `${item.color}18` },
                    }}
                  >
                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: item.color, flexShrink: 0, boxShadow: active ? `0 0 0 3px ${item.color}33` : "none" }} />
                    <Box>
                      <Typography sx={{ fontSize: ".82rem", fontWeight: active ? 800 : 700, color: item.color, lineHeight: 1.1 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontSize: ".72rem", color: "text.secondary", lineHeight: 1 }}>
                        {item.range}
                      </Typography>
                      {item.penalized && (
                        <Typography sx={{ fontSize: ".68rem", fontWeight: 700, color: "#EF4444", mt: 0.3 }}>
                          {loc.heatmap.penalizedLabel}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Map — right */}
            <Box sx={{ overflow: "hidden", minHeight: 420 }}>
              <DestinationMap
                activeMonth={activeMonth}
                filterLevel={mapFilter}
                recommendedIds={hasRecs ? recommendations.map((r) => {
                  const found = ALL_DESTINATIONS.find((d) => d.name === r.destination_name);
                  return found?.id ?? "";
                }).filter(Boolean) : []}
              />
            </Box>
          </Box>
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
              const p = penalizedByMonth[monthNum] ?? 0;
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
            penalizedByMonth={penalizedByMonth}
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
              labelIdx={0}
              fromScore={95} toScore={85}
              delay={0}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ScenarioCard
              from="Barcelona" to="Sierra Nevada"
              labelIdx={1}
              fromScore={90} toScore={55}
              delay={0.1}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ScenarioCard
              from="Ibiza" to="Sierra Nevada"
              labelIdx={2}
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
