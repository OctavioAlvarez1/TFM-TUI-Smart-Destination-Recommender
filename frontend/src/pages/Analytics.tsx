// Analytics dashboard page — system governance view.
// Shows: KPI cards (destinations, profiles, penalised months, risk count),
// monthly redistribution activity bar chart, July destination status breakdown,
// and a filterable table of all 20 monitored destinations.
import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";

import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import Footer from "../components/layout/Footer";

// ── Data ─────────────────────────────────────────────────

// Congestion penalized destinations per month (congestion > 80, from 20 total)
const PENALIZED: Record<number, number> = {
  1: 0, 2: 0, 3: 0, 4: 8, 5: 8, 6: 0, 7: 12, 8: 12, 9: 0, 10: 8, 11: 0, 12: 0,
};

const DESTINATIONS = [
  { id:"D001", name:"Mallorca",        region:"Balearic Islands",       type:"Beach",  sustainability: 72, monthly: [12,16,25,47,89,98,100,100,95,70,15,13] },
  { id:"D002", name:"Ibiza",           region:"Balearic Islands",       type:"Beach",  sustainability: 58, monthly: [10,14,22,42,80,88,100,100,85,63,13,11] },
  { id:"D003", name:"Menorca",         region:"Balearic Islands",       type:"Beach",  sustainability: 88, monthly: [7,10,16,30,57,63,83,88,67,45,9,8] },
  { id:"D007", name:"Costa del Sol",   region:"Andalusia",              type:"Beach",  sustainability: 65, monthly: [14,18,29,54,100,100,100,100,100,80,17,15] },
  { id:"D008", name:"Marbella",        region:"Andalusia",              type:"Beach",  sustainability: 60, monthly: [11,14,23,43,82,90,92,92,87,64,14,12] },
  { id:"D011", name:"Alicante",        region:"Valencian Community",    type:"Beach",  sustainability: 68, monthly: [19,25,36,63,100,100,100,100,100,82,22,17] },
  { id:"D012", name:"Benidorm",        region:"Valencian Community",    type:"Beach",  sustainability: 55, monthly: [25,32,46,80,100,100,100,100,100,100,28,22] },
  { id:"D004", name:"Tenerife",        region:"Canary Islands",         type:"Mixed",  sustainability: 75, monthly: [59,65,61,57,62,71,87,92,77,72,66,77] },
  { id:"D005", name:"Gran Canaria",    region:"Canary Islands",         type:"Mixed",  sustainability: 72, monthly: [57,62,58,54,59,68,83,88,73,69,63,73] },
  { id:"D006", name:"Lanzarote",       region:"Canary Islands",         type:"Nature", sustainability: 82, monthly: [43,47,44,41,44,51,62,66,55,52,47,55] },
  { id:"D009", name:"Malaga",          region:"Andalusia",              type:"City",   sustainability: 78, monthly: [59,58,68,82,89,77,64,58,73,82,68,57] },
  { id:"D010", name:"Valencia",        region:"Valencian Community",    type:"City",   sustainability: 80, monthly: [55,59,66,74,82,84,88,88,79,84,64,59] },
  { id:"D013", name:"Barcelona",       region:"Catalonia",              type:"City",   sustainability: 76, monthly: [55,59,66,74,82,84,88,88,79,84,64,59] },
  { id:"D014", name:"Madrid",          region:"Community of Madrid",    type:"City",   sustainability: 74, monthly: [55,59,66,74,82,84,88,88,79,84,64,59] },
  { id:"D015", name:"Seville",         region:"Andalusia",              type:"City",   sustainability: 77, monthly: [55,59,66,74,82,84,88,88,79,84,64,59] },
  { id:"D016", name:"Granada",         region:"Andalusia",              type:"City",   sustainability: 79, monthly: [55,59,66,74,82,84,88,88,79,84,64,59] },
  { id:"D017", name:"Bilbao",          region:"Basque Country",         type:"City",   sustainability: 82, monthly: [55,59,66,74,82,84,88,88,79,84,64,59] },
  { id:"D018", name:"San Sebastián",   region:"Basque Country",         type:"Mixed",  sustainability: 84, monthly: [55,59,66,74,82,84,88,88,79,84,64,59] },
  { id:"D019", name:"Picos de Europa", region:"Asturias",               type:"Nature", sustainability: 91, monthly: [28,30,36,44,49,55,66,72,58,48,37,33] },
  { id:"D020", name:"Sierra Nevada",   region:"Andalusia",              type:"Nature", sustainability: 88, monthly: [14,15,18,22,25,28,33,36,29,24,18,17] },
];

// ── Helpers ───────────────────────────────────────────────
type StatusKey = "overloaded" | "high" | "moderate" | "opportunity";

const getStatusForMonth = (d: typeof DESTINATIONS[0], month: number): StatusKey => {
  const cong = Math.min(100, d.monthly[month - 1]);
  if (cong >= 92) return "overloaded";
  if (cong >= 80) return "high";
  const peakCong = Math.max(...d.monthly.map(v => Math.min(100, v)));
  if (cong < 55 && peakCong >= 80) return "opportunity";
  return "moderate";
};

const STATUS_META: Record<StatusKey, { color: string; bg: string }> = {
  overloaded:  { color: "#EF4444", bg: "rgba(239,68,68,.1)" },
  high:        { color: "#F59E0B", bg: "rgba(245,158,11,.1)" },
  moderate:    { color: "#6366F1", bg: "rgba(99,102,241,.1)" },
  opportunity: { color: "#10B981", bg: "rgba(16,185,129,.1)" },
};

const TYPE_COLOR: Record<string, string> = {
  Beach: "#38BDF8", City: "#6366F1", Nature: "#10B981", Mixed: "#F59E0B",
};

const sustColor = (s: number) =>
  s >= 85 ? "#10B981" : s >= 70 ? "#6366F1" : s >= 55 ? "#F59E0B" : "#EF4444";

// ── Sub-components ────────────────────────────────────────

// Interactive monthly bar chart — clicking a bar changes selectedMonth
const MonthlyChart = ({ selectedMonth, onSelect }: { selectedMonth: number; onSelect: (m: number) => void }) => {
  const { locale } = useLanguage();
  const max = 12;
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: { xs: 0.4, sm: 0.75 }, height: 140, mb: 1 }}>
        {Object.entries(PENALIZED).map(([m, count]) => {
          const month = parseInt(m);
          const isSelected = month === selectedMonth;
          const color = count === 0 ? "#10B981" : count <= 8 ? "#F59E0B" : "#EF4444";
          const barH = Math.max((count / max) * 120, count === 0 ? 6 : 8);
          return (
            <Box
              key={m}
              onClick={() => onSelect(month)}
              sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, cursor: "pointer" }}
            >
              {count > 0 && (
                <Typography sx={{ fontSize: ".6rem", fontWeight: 800, color, opacity: isSelected ? 1 : 0.55 }}>{count}</Typography>
              )}
              <Box sx={{
                width: "100%", height: `${barH}px`, minHeight: 6,
                borderRadius: "5px 5px 0 0", bgcolor: color,
                opacity: isSelected ? 1 : 0.32,
                boxShadow: isSelected ? `0 0 14px ${color}99` : "none",
                outline: isSelected ? `2px solid ${color}` : "none",
                outlineOffset: "1px",
                transition: "all .2s",
              }} />
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", gap: { xs: 0.4, sm: 0.75 } }}>
        {locale.search.monthsShort.map((m, i) => {
          const isSelected = i + 1 === selectedMonth;
          return (
            <Box
              key={m}
              onClick={() => onSelect(i + 1)}
              sx={{ flex: 1, textAlign: "center", cursor: "pointer", py: 0.4, borderRadius: "4px", bgcolor: isSelected ? "rgba(99,102,241,.1)" : "transparent", transition: "background .15s" }}
            >
              <Typography sx={{ fontSize: ".58rem", fontWeight: isSelected ? 800 : 600, color: isSelected ? "#6366F1" : "text.secondary" }}>{m}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// Destination performance heat tiles — sidebar filter + sorted grid
const DestinationBars = ({ month }: { month: number }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { locale } = useLanguage();
  const loc = locale.analytics.perfChart;
  const [filterType, setFilterType] = useState<string | null>(null);

  const TYPE_EMOJI: Record<string, string> = { Beach: "🏖️", City: "🏛️", Nature: "🌿", Mixed: "✨" };

  const scored = [...DESTINATIONS].map(d => {
    const cong = Math.min(100, d.monthly[month - 1]);
    const score = Math.round(d.sustainability * (1 - cong / 100));
    return { ...d, cong, score };
  }).sort((a, b) => b.score - a.score);

  const visible = filterType ? scored.filter(d => d.type === filterType) : scored;

  const tileColor = (score: number) => {
    if (score >= 55) return { bg: "rgba(16,185,129,.15)", border: "rgba(16,185,129,.32)", text: "#10B981" };
    if (score >= 35) return { bg: "rgba(245,158,11,.13)", border: "rgba(245,158,11,.28)", text: "#F59E0B" };
    return { bg: "rgba(239,68,68,.12)", border: "rgba(239,68,68,.26)", text: "#EF4444" };
  };
  const congColor = (c: number) => c >= 80 ? "#EF4444" : c >= 60 ? "#F59E0B" : "#10B981";

  const TYPES = ["Beach", "City", "Nature", "Mixed"] as const;

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", border: "1px solid", borderColor: "divider", background: dark ? "linear-gradient(160deg,#1E293B 0%,#111827 100%)" : "#FAFBFF" }}>
      {/* Header */}
      <Typography sx={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "#10B981", mb: 0.75 }}>
        {loc.badge}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 0.5 }}>
        <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.15rem" }}>{loc.title}</Typography>
        <Box sx={{ px: 1.5, py: 0.4, borderRadius: "999px", bgcolor: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)" }}>
          <Typography sx={{ fontSize: ".72rem", fontWeight: 700, color: "#6366F1" }}>{locale.search.months[month - 1]}</Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: ".8rem", color: "text.secondary", mb: 3, lineHeight: 1.6 }}>{loc.subtitle}</Typography>

      {/* Score legend */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
        {[
          { c: "#10B981", l: "≥ 55 — Opportunity" },
          { c: "#F59E0B", l: "35–54 — Moderate" },
          { c: "#EF4444", l: "< 35 — Risk" },
        ].map(l => (
          <Box key={l.l} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: l.c, opacity: .75 }} />
            <Typography sx={{ fontSize: ".68rem", color: "text.secondary", fontWeight: 600 }}>{l.l}</Typography>
          </Box>
        ))}
      </Stack>

      {/* Body: sidebar + tile grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "175px 1fr" }, gap: 2.5 }}>

        {/* ── Sidebar filter ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography sx={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "text.secondary", mb: 0.5, px: 0.5 }}>
            {locale.analytics.table.allFilter} / Tipo
          </Typography>

          {/* All */}
          {([null, ...TYPES] as (string | null)[]).map(type => {
            const isActive = filterType === type;
            const color = type ? TYPE_COLOR[type] : "#6366F1";
            const count = type ? scored.filter(d => d.type === type).length : scored.length;
            return (
              <Box
                key={type ?? "all"}
                onClick={() => setFilterType(isActive ? null : type)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1, px: 1.25, py: 0.85,
                  borderRadius: "10px", cursor: "pointer",
                  bgcolor: isActive ? `${color}18` : "transparent",
                  border: isActive ? `1px solid ${color}35` : "1px solid transparent",
                  transition: "all .18s",
                  "&:hover": { bgcolor: isActive ? `${color}22` : dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)" },
                }}
              >
                <Typography sx={{ fontSize: ".85rem", lineHeight: 1 }}>
                  {type ? TYPE_EMOJI[type] : "🗺️"}
                </Typography>
                <Typography sx={{ fontSize: ".78rem", fontWeight: isActive ? 800 : 600, color: isActive ? color : "text.secondary", flex: 1 }}>
                  {type ?? locale.analytics.table.allFilter}
                </Typography>
                <Box sx={{ px: 0.75, py: 0.1, borderRadius: "6px", bgcolor: isActive ? `${color}20` : dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)" }}>
                  <Typography sx={{ fontSize: ".62rem", fontWeight: 700, color: isActive ? color : "text.secondary" }}>{count}</Typography>
                </Box>
              </Box>
            );
          })}

          {/* Score tier legend hint */}
          <Box sx={{ mt: 2, px: 0.5 }}>
            <Typography sx={{ fontSize: ".65rem", color: "text.secondary", lineHeight: 1.7 }}>
              🌱 {loc.sustLabel}<br />⚡ {loc.congLabel}
            </Typography>
          </Box>
        </Box>

        {/* ── Tile grid ── */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignContent: "flex-start" }}>
          {visible.map((d, i) => {
            const tc = tileColor(d.score);
            const cc = congColor(d.cong);
            const globalRank = scored.findIndex(s => s.id === d.id) + 1;
            const medal = globalRank === 1 ? "🥇" : globalRank === 2 ? "🥈" : globalRank === 3 ? "🥉" : null;
            return (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.015, ease: "easeOut" }}
                style={{ width: "calc(20% - 8px)", minWidth: 105 }}
              >
                <Box sx={{
                  p: 1.25, borderRadius: "14px",
                  background: tc.bg, border: `1px solid ${tc.border}`,
                  height: "100%", cursor: "default",
                  transition: "transform .18s, box-shadow .18s",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: `0 6px 18px ${tc.border}` },
                }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                    <Typography sx={{ fontSize: ".58rem", fontWeight: 800, color: tc.text }}>#{globalRank}</Typography>
                    {medal && <Typography sx={{ fontSize: ".7rem", lineHeight: 1 }}>{medal}</Typography>}
                  </Box>
                  <Typography sx={{ fontSize: ".95rem", lineHeight: 1, mb: 0.4 }}>{TYPE_EMOJI[d.type]}</Typography>
                  <Typography sx={{ fontSize: ".72rem", fontWeight: 800, color: "text.primary", lineHeight: 1.2, mb: 1 }}>
                    {d.name}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={{ fontSize: ".6rem", color: "#10B981", fontWeight: 800, lineHeight: 1 }}>🌱</Typography>
                      <Typography sx={{ fontSize: ".62rem", color: "#10B981", fontWeight: 800 }}>{d.sustainability}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={{ fontSize: ".6rem", color: cc, fontWeight: 800, lineHeight: 1 }}>⚡</Typography>
                      <Typography sx={{ fontSize: ".62rem", color: cc, fontWeight: 800 }}>{d.cong}</Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            );
          })}
          {visible.length === 0 && (
            <Box sx={{ py: 4, textAlign: "center", width: "100%" }}>
              <Typography sx={{ color: "text.secondary", fontSize: ".85rem" }}>{locale.analytics.table.noResults}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Destination row — month-aware
const DestRow = ({ dest, month, index }: { dest: typeof DESTINATIONS[0]; month: number; index: number }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { locale } = useLanguage();
  const cong = Math.min(100, dest.monthly[month - 1]);
  const status = getStatusForMonth(dest, month);
  const meta = STATUS_META[status];
  const congColor = cong >= 92 ? "#EF4444" : cong >= 80 ? "#F59E0B" : "#6366F1";
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: "easeOut" }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: 2, px: 2.5, py: 1.75,
        borderBottom: "1px solid", borderBottomColor: "divider", flexWrap: "wrap",
        "&:hover": { bgcolor: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.018)" },
        transition: "background .15s",
      }}>
        <Box sx={{ minWidth: 160, flex: "1 1 140px" }}>
          <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: ".88rem" }}>{dest.name}</Typography>
          <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>{dest.region}</Typography>
        </Box>
        <Chip label={dest.type} size="small" sx={{ fontWeight: 700, fontSize: ".7rem", color: TYPE_COLOR[dest.type], bgcolor: `${TYPE_COLOR[dest.type]}14`, border: `1px solid ${TYPE_COLOR[dest.type]}22` }} />
        <Box sx={{ flex: "1 1 100px", minWidth: 100 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
            <Typography sx={{ fontSize: ".68rem", color: "text.secondary", fontWeight: 600 }}>{locale.search.monthsShort[month - 1]}</Typography>
            <Typography sx={{ fontSize: ".68rem", fontWeight: 800, color: congColor }}>{cong}</Typography>
          </Box>
          <Box sx={{ height: 5, borderRadius: "999px", bgcolor: "rgba(128,128,128,.12)", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${cong}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.025, ease: "easeOut" }}
              style={{ height: "100%", borderRadius: "999px", background: congColor }}
            />
          </Box>
        </Box>
        <Box sx={{ textAlign: "center", minWidth: 56 }}>
          <Typography sx={{ fontSize: ".75rem", fontWeight: 900, color: sustColor(dest.sustainability) }}>{dest.sustainability}</Typography>
          <Typography sx={{ fontSize: ".62rem", color: "text.secondary" }}>{locale.analytics.table.sustainLabel}</Typography>
        </Box>
        <Chip label={locale.analytics.table.statusLabels[status]} size="small" sx={{ fontWeight: 700, fontSize: ".7rem", color: meta.color, bgcolor: meta.bg, border: `1px solid ${meta.color}25`, minWidth: 110 }} />
      </Box>
    </motion.div>
  );
};

// ── Summary counts for July — used in hero KPI cards ─────
const overloaded   = DESTINATIONS.filter(d => getStatusForMonth(d, 7) === "overloaded").length;
const highPressure = DESTINATIONS.filter(d => getStatusForMonth(d, 7) === "high").length;

const peakPenalizedMonths = Object.values(PENALIZED).filter(v => v > 0).length;

// ── Main page ─────────────────────────────────────────────
const Analytics = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { locale } = useLanguage();
  const loc = locale.analytics;
  const [filter, setFilter] = useState<StatusKey | "all">("all");
  const [selectedMonth, setSelectedMonth] = useState(7);

  const overloadedM  = DESTINATIONS.filter(d => getStatusForMonth(d, selectedMonth) === "overloaded").length;
  const highPressureM = DESTINATIONS.filter(d => getStatusForMonth(d, selectedMonth) === "high").length;
  const moderateM    = DESTINATIONS.filter(d => getStatusForMonth(d, selectedMonth) === "moderate").length;
  const opportunityM = DESTINATIONS.filter(d => getStatusForMonth(d, selectedMonth) === "opportunity").length;

  const filtered = filter === "all"
    ? DESTINATIONS
    : DESTINATIONS.filter(d => getStatusForMonth(d, selectedMonth) === filter);

  return (
    <>
      {/* PAGE HEADER */}
      <Box sx={{
        background: "linear-gradient(160deg, #0D1521 0%, #1A2E50 28%, #6B2550 58%, #C45230 82%, #E8904A 100%)",
        pt: { xs: 14, md: 16 }, pb: { xs: 14, md: 18 },
        position: "relative", overflow: "hidden",
      }}>
        {/* Dot grid texture */}
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        {/* Orb 1 — coral sunset, top-right */}
        <motion.div
          style={{ position: "absolute", top: "-10%", right: "-8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(210,75,45,.55) 0%, rgba(210,75,45,.2) 40%, transparent 70%)", filter: "blur(45px)", pointerEvents: "none" }}
          animate={{ x: [0, -45, 22, 0], y: [0, 35, -22, 0], scale: [1, 1.12, 0.91, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orb 2 — warm magenta, left */}
        <motion.div
          style={{ position: "absolute", top: "20%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(170,45,90,.48) 0%, rgba(170,45,90,.15) 45%, transparent 70%)", filter: "blur(42px)", pointerEvents: "none" }}
          animate={{ x: [0, 35, -18, 0], y: [0, -28, 14, 0], scale: [1, 0.87, 1.12, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Orb 3 — golden hour, bottom-center */}
        <motion.div
          style={{ position: "absolute", bottom: "-10%", left: "35%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,140,55,.42) 0%, rgba(230,140,55,.12) 45%, transparent 70%)", filter: "blur(48px)", pointerEvents: "none" }}
          animate={{ x: [0, 25, -30, 0], y: [0, -18, 22, 0], scale: [1, 1.2, 0.88, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        {/* Orb 4 — deep ocean blue, bottom-left */}
        <motion.div
          style={{ position: "absolute", bottom: "-5%", left: "5%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,55,110,.6) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }}
          animate={{ x: [0, 18, -22, 0], y: [0, 12, -18, 0], scale: [1, 1.08, 0.9, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />

        {/* ── Scan line ── */}
        <motion.div
          style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(232,144,74,.5) 40%, rgba(196,82,48,.4) 60%, transparent 100%)", pointerEvents: "none", zIndex: 0 }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />

        {/* ── SVG data chart divider — congestion by month ── */}
        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", zIndex: 0 }}>
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(232,144,74,.18)" />
                <stop offset="100%" stopColor="rgba(232,100,50,.04)" />
              </linearGradient>
            </defs>
            {/* Smooth data line — penalized destinations per month [0,0,0,8,8,0,12,12,0,8,0,0] */}
            <path
              d="M 0,110 C 55,110 100,110 175,110 C 220,110 250,110 305,110 C 360,110 375,48 435,48 C 495,48 510,48 565,110 C 620,110 655,110 720,110 C 775,110 790,12 860,12 C 910,12 945,12 1000,110 C 1040,110 1065,48 1120,48 C 1175,48 1200,110 1265,110 C 1340,110 1400,110 1440,110"
              fill="none"
              stroke="rgba(232,144,74,.55)"
              strokeWidth="2.5"
            />
            {/* Area fill */}
            <path
              d="M 0,110 C 55,110 100,110 175,110 C 220,110 250,110 305,110 C 360,110 375,48 435,48 C 495,48 510,48 565,110 C 620,110 655,110 720,110 C 775,110 790,12 860,12 C 910,12 945,12 1000,110 C 1040,110 1065,48 1120,48 C 1175,48 1200,110 1265,110 C 1340,110 1400,110 1440,110 L 1440,110 L 0,110 Z"
              fill="url(#areaGrad)"
            />
            {/* Peak data dots */}
            <circle cx="435" cy="48" r="4" fill="rgba(245,158,11,.9)" />
            <circle cx="530" cy="48" r="4" fill="rgba(245,158,11,.9)" />
            <circle cx="860" cy="12" r="5.5" fill="rgba(239,68,68,.9)" />
            <circle cx="940" cy="12" r="5.5" fill="rgba(239,68,68,.9)" />
            <circle cx="1120" cy="48" r="4" fill="rgba(245,158,11,.9)" />
            {/* Page background fill below line */}
            <rect x="0" y="105" width="1440" height="10" fill={dark ? "#0B1220" : "#F8FAFC"} />
          </svg>
        </Box>

        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 70% 30%, rgba(210,75,45,.06), transparent 55%)" }} />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <Typography sx={{
              display: "inline-block", px: 2.5, py: 0.9, borderRadius: "999px",
              color: "#FBBF24", fontWeight: 700, fontSize: ".78rem",
              textTransform: "uppercase", letterSpacing: ".2em", mb: 3,
              border: "1px solid rgba(251,191,36,.25)", background: "rgba(251,191,36,.08)",
            }}>
              {loc.badge}
            </Typography>
            <Typography sx={{ color: "#FFFFFF", fontWeight: 900, lineHeight: 1.05, fontSize: { xs: "2.5rem", md: "3.5rem" }, maxWidth: 800, mb: 2.5 }}>
              {loc.title}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,.65)", fontSize: { xs: "1rem", md: "1.1rem" }, maxWidth: 680, lineHeight: 1.8 }}>
              {loc.subtitle}
            </Typography>
          </motion.div>

          {/* ── KPI stat cards inside hero ── */}
          <Grid container spacing={2.5} sx={{ mt: { xs: 5, md: 7 } }}>
            {[
              { value: "20",                          label: loc.kpis[0].label, icon: <PlaceRoundedIcon sx={{ fontSize: 22 }} />,        color: "#6366F1" },
              { value: "100",                         label: loc.kpis[1].label, icon: <PeopleRoundedIcon sx={{ fontSize: 22 }} />,        color: "#38BDF8" },
              { value: `${peakPenalizedMonths}/12`,   label: loc.kpis[2].label, icon: <TrendingDownRoundedIcon sx={{ fontSize: 22 }} />,  color: "#FBBF24" },
              { value: `${overloaded+highPressure}`,  label: loc.kpis[3].label, icon: <TrendingUpRoundedIcon sx={{ fontSize: 22 }} />,    color: "#FB7185" },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.25 + i * 0.1, ease: "easeOut" }}
                  style={{ height: "100%" }}
                >
                  <Box sx={{
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,.28)",
                    borderTop: `3px solid ${stat.color}`,
                    background: "rgba(255,255,255,.14)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.30)",
                    p: { xs: 2, md: 3 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: `${stat.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography sx={{ fontSize: { xs: "1.6rem", md: "2.2rem" }, fontWeight: 900, color: "#FFFFFF", lineHeight: 1, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ fontSize: ".82rem", color: "rgba(255,255,255,.75)", fontWeight: 600, lineHeight: 1.4 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: { xs: 6, md: 8 }, mb: 12 }}>

        {/* ── Section header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Box sx={{ mb: 5 }}>
            <Typography sx={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "#6366F1", mb: 0.75 }}>
              {loc.section.badge}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Typography sx={{ fontWeight: 900, color: "text.primary", fontSize: { xs: "1.3rem", md: "1.6rem" } }}>
                {loc.section.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.5, py: 0.85, borderRadius: "999px", border: "1px solid", borderColor: "divider", bgcolor: dark ? "rgba(99,102,241,.08)" : "rgba(99,102,241,.05)" }}>
                <Typography sx={{ fontSize: ".78rem", color: "text.secondary", fontWeight: 600 }}>{loc.section.monthLabel}:</Typography>
                <Typography sx={{ fontSize: ".85rem", fontWeight: 800, color: "#6366F1" }}>{locale.search.months[selectedMonth - 1]}</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: ".8rem", color: "text.secondary", mt: 0.75 }}>{loc.section.clickTip}</Typography>
          </Box>
        </motion.div>

        {/* ── Row 1: Monthly chart + Status breakdown ── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>

          {/* Monthly redistribution bar chart — interactive month selector */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ height: "100%" }}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", border: "1px solid", borderColor: "divider", background: dark ? "linear-gradient(160deg,#1E293B 0%,#111827 100%)" : "#FAFBFF", height: "100%" }}>
                <Typography sx={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "#6366F1", mb: 0.75 }}>
                  {loc.redistribution.badge}
                </Typography>
                <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.15rem", mb: 0.5 }}>
                  {loc.redistribution.title}
                </Typography>
                <Typography sx={{ fontSize: ".8rem", color: "text.secondary", mb: 3.5 }}>
                  {loc.redistribution.subtitle}
                </Typography>
                <MonthlyChart selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
                <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap", gap: 1.5 }}>
                  {[
                    { color: "#10B981", label: loc.redistribution.legend[0] },
                    { color: "#F59E0B", label: loc.redistribution.legend[1] },
                    { color: "#EF4444", label: loc.redistribution.legend[2] },
                  ].map((l) => (
                    <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: l.color }} />
                      <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>{l.label}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </motion.div>
          </Grid>

          {/* Status breakdown — dynamic per selectedMonth */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }} style={{ height: "100%" }}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", border: "1px solid", borderColor: "divider", background: dark ? "linear-gradient(160deg,#1E293B 0%,#111827 100%)" : "#FAFBFF", height: "100%" }}>
                <Typography sx={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "#6366F1", mb: 0.75 }}>
                  {loc.statusBreakdown.badge}
                </Typography>
                <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.15rem", mb: 3 }}>
                  {locale.search.months[selectedMonth - 1]} — {loc.statusBreakdown.titleBase}
                </Typography>

                {([
                  { key: "overloaded" as StatusKey, count: overloadedM },
                  { key: "high" as StatusKey, count: highPressureM },
                  { key: "moderate" as StatusKey, count: moderateM },
                  { key: "opportunity" as StatusKey, count: opportunityM },
                ]).map(({ key, count }) => {
                  const meta = STATUS_META[key];
                  return (
                    <Box key={key} sx={{ mb: 2.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                        <Typography sx={{ fontSize: ".82rem", fontWeight: 700, color: "text.primary" }}>{loc.table.statusLabels[key]}</Typography>
                        <Typography sx={{ fontSize: ".82rem", fontWeight: 900, color: meta.color }}>{count} / 20</Typography>
                      </Box>
                      <Box sx={{ height: 8, borderRadius: "999px", bgcolor: "rgba(128,128,128,.12)", overflow: "hidden" }}>
                        <motion.div
                          key={`${key}-${selectedMonth}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / 20) * 100}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          style={{ height: "100%", borderRadius: "999px", background: meta.color }}
                        />
                      </Box>
                    </Box>
                  );
                })}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "rgba(16,185,129,.07)", border: "1px solid rgba(16,185,129,.15)", flex: 1, textAlign: "center" }}>
                    <SpaRoundedIcon sx={{ color: "#10B981", fontSize: 20, mb: 0.5 }} />
                    <Typography sx={{ fontSize: ".72rem", fontWeight: 700, color: "#10B981" }}>{loc.statusBreakdown.sdgTarget}</Typography>
                    <Typography sx={{ fontSize: ".68rem", color: "text.secondary", lineHeight: 1.5 }}>{loc.statusBreakdown.sdgSub}</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "rgba(99,102,241,.07)", border: "1px solid rgba(99,102,241,.15)", flex: 1, textAlign: "center" }}>
                    <VerifiedRoundedIcon sx={{ color: "#6366F1", fontSize: 20, mb: 0.5 }} />
                    <Typography sx={{ fontSize: ".72rem", fontWeight: 700, color: "#6366F1" }}>{loc.statusBreakdown.engineStatus}</Typography>
                    <Typography sx={{ fontSize: ".68rem", color: "text.secondary", lineHeight: 1.5 }}>{loc.statusBreakdown.engineSub}</Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* ── Row 2: Scatter plot ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Box sx={{ mb: 4 }}>
            <DestinationBars month={selectedMonth} />
          </Box>
        </motion.div>

        {/* ── Destination table ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "#6366F1", mb: 0.75 }}>
              {loc.table.badge}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
              <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.15rem" }}>
                {loc.table.titleBase} · {locale.search.months[selectedMonth - 1]}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {(["all", "overloaded", "high", "moderate", "opportunity"] as const).map((f) => {
                  const meta = f === "all" ? null : STATUS_META[f];
                  const isActive = filter === f;
                  return (
                    <Chip
                      key={f}
                      label={f === "all" ? loc.table.allFilter : loc.table.statusLabels[f]}
                      onClick={() => setFilter(f)}
                      size="small"
                      sx={{
                        fontWeight: 700, fontSize: ".72rem", cursor: "pointer",
                        color: isActive ? (f === "all" ? "#2563EB" : meta!.color) : "#64748B",
                        bgcolor: isActive ? (f === "all" ? "rgba(37,99,235,.1)" : meta!.bg) : dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
                        border: isActive ? `1px solid ${f === "all" ? "rgba(37,99,235,.2)" : `${meta!.color}30`}` : "1px solid transparent",
                        transition: "all .2s",
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>

          <Box sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <Box sx={{ display: "flex", gap: 2, px: 2.5, py: 1.5, bgcolor: dark ? "rgba(255,255,255,.03)" : "#F8FAFC", borderBottom: "1px solid", borderBottomColor: "divider", flexWrap: "wrap" }}>
              {loc.table.headers.map((h, idx) => (
                <Typography key={h} sx={{ fontSize: ".72rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: ".08em", flex: idx === 0 ? "1 1 140px" : idx === 2 ? "1 1 100px" : "0 0 auto", minWidth: idx === 0 ? 160 : undefined }}>
                  {h}
                </Typography>
              ))}
            </Box>
            {filtered.map((dest, i) => (
              <DestRow key={dest.id} dest={dest} month={selectedMonth} index={i} />
            ))}
            {filtered.length === 0 && (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography sx={{ color: "text.secondary" }}>{loc.table.noResults}</Typography>
              </Box>
            )}
          </Box>
        </motion.div>

      </Container>

      <Footer />
    </>
  );
};

export default Analytics;
