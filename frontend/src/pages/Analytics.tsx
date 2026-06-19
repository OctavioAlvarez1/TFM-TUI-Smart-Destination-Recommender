// Analytics dashboard page — system governance view.
// Shows: KPI cards (destinations, profiles, penalised months, risk count),
// monthly redistribution activity bar chart, July destination status breakdown,
// and a filterable table of all 20 monitored destinations.
import { useState } from "react";
import { motion } from "framer-motion";
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
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Congestion penalized destinations per month (congestion > 80, from 20 total)
const PENALIZED: Record<number, number> = {
  1: 0, 2: 0, 3: 0, 4: 8, 5: 8, 6: 0, 7: 12, 8: 12, 9: 0, 10: 8, 11: 0, 12: 0,
};

const DESTINATIONS = [
  // Beach — seasonal hotspots
  { id:"D001", name:"Mallorca",       region:"Balearic Islands",       type:"Beach",  julyCongestion: 95, janCongestion: 25, sustainability: 72 },
  { id:"D002", name:"Ibiza",          region:"Balearic Islands",       type:"Beach",  julyCongestion: 95, janCongestion: 25, sustainability: 58 },
  { id:"D003", name:"Menorca",        region:"Balearic Islands",       type:"Beach",  julyCongestion: 95, janCongestion: 25, sustainability: 88 },
  { id:"D007", name:"Costa del Sol",  region:"Andalusia",              type:"Beach",  julyCongestion: 95, janCongestion: 25, sustainability: 65 },
  { id:"D008", name:"Marbella",       region:"Andalusia",              type:"Beach",  julyCongestion: 95, janCongestion: 25, sustainability: 60 },
  { id:"D011", name:"Alicante",       region:"Valencian Community",    type:"Beach",  julyCongestion: 95, janCongestion: 25, sustainability: 68 },
  { id:"D012", name:"Benidorm",       region:"Valencian Community",    type:"Beach",  julyCongestion: 95, janCongestion: 25, sustainability: 55 },
  // Canary Islands — year-round high
  { id:"D004", name:"Tenerife",       region:"Canary Islands",         type:"Mixed",  julyCongestion: 85, janCongestion: 65, sustainability: 75 },
  { id:"D005", name:"Gran Canaria",   region:"Canary Islands",         type:"Mixed",  julyCongestion: 85, janCongestion: 65, sustainability: 72 },
  { id:"D006", name:"Lanzarote",      region:"Canary Islands",         type:"Nature", julyCongestion: 85, janCongestion: 65, sustainability: 82 },
  // Cities — spring peaks
  { id:"D009", name:"Malaga",         region:"Andalusia",              type:"City",   julyCongestion: 65, janCongestion: 60, sustainability: 78 },
  { id:"D010", name:"Valencia",       region:"Valencian Community",    type:"City",   julyCongestion: 65, janCongestion: 60, sustainability: 80 },
  { id:"D013", name:"Barcelona",      region:"Catalonia",              type:"City",   julyCongestion: 65, janCongestion: 60, sustainability: 76 },
  { id:"D014", name:"Madrid",         region:"Community of Madrid",    type:"City",   julyCongestion: 65, janCongestion: 60, sustainability: 74 },
  { id:"D015", name:"Seville",        region:"Andalusia",              type:"City",   julyCongestion: 65, janCongestion: 60, sustainability: 77 },
  { id:"D016", name:"Granada",        region:"Andalusia",              type:"City",   julyCongestion: 65, janCongestion: 60, sustainability: 79 },
  { id:"D017", name:"Bilbao",         region:"Basque Country",         type:"City",   julyCongestion: 65, janCongestion: 60, sustainability: 82 },
  { id:"D018", name:"San Sebastián",  region:"Basque Country",         type:"Mixed",  julyCongestion: 65, janCongestion: 60, sustainability: 84 },
  // Hidden gems — redistribution targets
  { id:"D019", name:"Picos de Europa",region:"Asturias",               type:"Nature", julyCongestion: 85, janCongestion: 15, sustainability: 91 },
  { id:"D020", name:"Sierra Nevada",  region:"Andalusia",              type:"Nature", julyCongestion: 85, janCongestion: 15, sustainability: 88 },
];

// ── Helpers ───────────────────────────────────────────────
type StatusKey = "overloaded" | "high" | "moderate" | "opportunity";

const getStatus = (d: typeof DESTINATIONS[0]): StatusKey => {
  if (d.julyCongestion >= 95) return "overloaded";
  if (d.julyCongestion >= 80 && d.janCongestion < 30) return "opportunity";
  if (d.julyCongestion >= 80) return "high";
  return "moderate";
};

const STATUS_META: Record<StatusKey, { label: string; color: string; bg: string }> = {
  overloaded:  { label: "Overloaded",  color: "#EF4444", bg: "rgba(239,68,68,.1)" },
  high:        { label: "High Pressure",color:"#F59E0B",  bg: "rgba(245,158,11,.1)" },
  moderate:    { label: "Moderate",    color: "#6366F1", bg: "rgba(99,102,241,.1)" },
  opportunity: { label: "Opportunity", color: "#10B981", bg: "rgba(16,185,129,.1)" },
};

const TYPE_COLOR: Record<string, string> = {
  Beach: "#38BDF8", City: "#6366F1", Nature: "#10B981", Mixed: "#F59E0B",
};

const sustColor = (s: number) =>
  s >= 85 ? "#10B981" : s >= 70 ? "#6366F1" : s >= 55 ? "#F59E0B" : "#EF4444";

// ── Sub-components ────────────────────────────────────────

// KPI card
const KpiCard = ({
  value, label, sub, icon, color, delay,
}: { value: string; label: string; sub: string; icon: React.ReactNode; color: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    style={{ height: "100%" }}
  >
    <Box sx={{
      borderRadius: "20px", p: 3, height: "100%",
      border: `1px solid ${color}22`,
      background: `linear-gradient(145deg, ${color}08 0%, ${color}14 100%)`,
    }}>
      <Box sx={{ width: 42, height: 42, borderRadius: "11px", bgcolor: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color, mb: 2 }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: "2.2rem", fontWeight: 900, color: "text.primary", lineHeight: 1, mb: 0.4 }}>
        {value}
      </Typography>
      <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: ".88rem", mb: 0.3 }}>{label}</Typography>
      <Typography sx={{ fontSize: ".78rem", color: "text.secondary" }}>{sub}</Typography>
    </Box>
  </motion.div>
);

// Monthly bar chart (CSS only)
const MonthlyChart = () => {
  const max = 12;
  return (

    <Box>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: { xs: 0.5, sm: 1 }, height: 130, mb: 1 }}>
        {Object.entries(PENALIZED).map(([m, count]) => {
          const pct = count / max;
          const color = count === 0 ? "#10B981" : count <= 8 ? "#F59E0B" : "#EF4444";
          return (
            <Box key={m} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
              {count > 0 && (
                <Typography sx={{ fontSize: ".65rem", fontWeight: 800, color }}>{count}</Typography>
              )}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${Math.max(pct * 110, count === 0 ? 6 : 8)}px` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: parseInt(m) * 0.05, ease: "easeOut" }}
                style={{
                  width: "100%", borderRadius: "6px 6px 0 0",
                  background: color, minHeight: 6,
                }}
              />
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
        {MONTHS_SHORT.map((m) => (
          <Box key={m} sx={{ flex: 1, textAlign: "center" }}>
            <Typography sx={{ fontSize: ".65rem", color: "text.secondary", fontWeight: 600 }}>{m}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Destination row
const DestRow = ({ dest, index }: { dest: typeof DESTINATIONS[0]; index: number }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const status = getStatus(dest);
  const meta = STATUS_META[status];
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: "easeOut" }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: 2, px: 2.5, py: 1.75,
        borderBottom: "1px solid",
        borderBottomColor: "divider",
        flexWrap: "wrap",
        "&:hover": { bgcolor: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.018)" },
        transition: "background .15s",
      }}>
        {/* Name */}
        <Box sx={{ minWidth: 160, flex: "1 1 140px" }}>
          <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: ".88rem" }}>{dest.name}</Typography>
          <Typography sx={{ fontSize: ".72rem", color: "text.secondary" }}>{dest.region}</Typography>
        </Box>

        {/* Type */}
        <Chip label={dest.type} size="small" sx={{
          fontWeight: 700, fontSize: ".7rem",
          color: TYPE_COLOR[dest.type], bgcolor: `${TYPE_COLOR[dest.type]}14`,
          border: `1px solid ${TYPE_COLOR[dest.type]}22`,
        }} />

        {/* July congestion bar */}
        <Box sx={{ flex: "1 1 100px", minWidth: 100 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
            <Typography sx={{ fontSize: ".68rem", color: "text.secondary", fontWeight: 600 }}>July</Typography>
            <Typography sx={{ fontSize: ".68rem", fontWeight: 800, color: dest.julyCongestion >= 90 ? "#EF4444" : dest.julyCongestion >= 80 ? "#F59E0B" : "#6366F1" }}>
              {dest.julyCongestion}
            </Typography>
          </Box>
          <Box sx={{ height: 5, borderRadius: "999px", bgcolor: "rgba(128,128,128,.12)", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${dest.julyCongestion}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.025, ease: "easeOut" }}
              style={{
                height: "100%", borderRadius: "999px",
                background: dest.julyCongestion >= 90 ? "#EF4444" : dest.julyCongestion >= 80 ? "#F59E0B" : "#6366F1",
              }}
            />
          </Box>
        </Box>

        {/* Sustainability */}
        <Box sx={{ textAlign: "center", minWidth: 56 }}>
          <Typography sx={{ fontSize: ".75rem", fontWeight: 900, color: sustColor(dest.sustainability) }}>
            {dest.sustainability}
          </Typography>
          <Typography sx={{ fontSize: ".62rem", color: "text.secondary" }}>Sustain.</Typography>
        </Box>

        {/* Status badge */}
        <Chip label={meta.label} size="small" sx={{
          fontWeight: 700, fontSize: ".7rem",
          color: meta.color, bgcolor: meta.bg,
          border: `1px solid ${meta.color}25`, minWidth: 110,
        }} />
      </Box>
    </motion.div>
  );
};

// ── Summary counts ────────────────────────────────────────
const overloaded   = DESTINATIONS.filter(d => getStatus(d) === "overloaded").length;
const highPressure = DESTINATIONS.filter(d => getStatus(d) === "high").length;
const moderate     = DESTINATIONS.filter(d => getStatus(d) === "moderate").length;
const opportunity  = DESTINATIONS.filter(d => getStatus(d) === "opportunity").length;

const peakPenalizedMonths = Object.values(PENALIZED).filter(v => v > 0).length;

// ── Main page ─────────────────────────────────────────────
const Analytics = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const [filter, setFilter] = useState<StatusKey | "all">("all");

  const filtered = filter === "all"
    ? DESTINATIONS
    : DESTINATIONS.filter(d => getStatus(d) === filter);

  return (
    <>
      {/* PAGE HEADER */}
      <Box sx={{
        background: "linear-gradient(160deg, #070C16 0%, #0F1A2E 100%)",
        pt: { xs: 14, md: 16 }, pb: { xs: 8, md: 10 },
        position: "relative", overflow: "hidden",
      }}>
        {/* Dot grid texture */}
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        {/* Animated orb 1 — strong indigo, top-right */}
        <motion.div
          style={{ position: "absolute", top: "-10%", right: "-8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.55) 0%, rgba(99,102,241,.2) 40%, transparent 70%)", filter: "blur(45px)", pointerEvents: "none" }}
          animate={{ x: [0, -45, 22, 0], y: [0, 35, -22, 0], scale: [1, 1.12, 0.91, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Animated orb 2 — violet/purple, left */}
        <motion.div
          style={{ position: "absolute", top: "20%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.48) 0%, rgba(139,92,246,.15) 45%, transparent 70%)", filter: "blur(42px)", pointerEvents: "none" }}
          animate={{ x: [0, 35, -18, 0], y: [0, -28, 14, 0], scale: [1, 0.87, 1.12, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Animated orb 3 — pink/magenta accent, bottom-center */}
        <motion.div
          style={{ position: "absolute", bottom: "-10%", left: "35%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,.38) 0%, rgba(236,72,153,.1) 45%, transparent 70%)", filter: "blur(48px)", pointerEvents: "none" }}
          animate={{ x: [0, 25, -30, 0], y: [0, -18, 22, 0], scale: [1, 1.2, 0.88, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        {/* Animated orb 4 — blue cool accent, bottom-left */}
        <motion.div
          style={{ position: "absolute", bottom: "-5%", left: "5%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,.4) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }}
          animate={{ x: [0, 18, -22, 0], y: [0, 12, -18, 0], scale: [1, 1.08, 0.9, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 80% 30%, rgba(99,102,241,.06), transparent 50%)" }} />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <Typography sx={{
              display: "inline-block", px: 2.5, py: 0.9, borderRadius: "999px",
              color: "#6366F1", fontWeight: 700, fontSize: ".78rem",
              textTransform: "uppercase", letterSpacing: ".2em", mb: 3,
              border: "1px solid rgba(99,102,241,.2)", background: "rgba(99,102,241,.06)",
            }}>
              Governance · Layer 5 / TUI Care Foundation
            </Typography>
            <Typography sx={{ color: "#FFFFFF", fontWeight: 900, lineHeight: 1.05, fontSize: { xs: "2.5rem", md: "3.5rem" }, maxWidth: 800, mb: 2.5 }}>
              Analytics Dashboard
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,.65)", fontSize: { xs: "1rem", md: "1.1rem" }, maxWidth: 680, lineHeight: 1.8 }}>
              System-level governance view of all 20 monitored destinations.
              Track demand redistribution activity, congestion risks and sustainable opportunity zones
              across Spain's tourism network in real time.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: { xs: 6, md: 8 }, mb: 12 }}>

        {/* KPIs */}
        <Grid container spacing={2.5} sx={{ mb: 8 }}>
          {[
            { value: "20", label: "Destinations Monitored", sub: "Active in Horizon's scoring engine", icon: <PlaceRoundedIcon sx={{ fontSize: 22 }} />, color: "#6366F1", delay: 0 },
            { value: "100", label: "Traveler Profiles", sub: "Synthetic GDPR-compliant user dataset", icon: <PeopleRoundedIcon sx={{ fontSize: 22 }} />, color: "#2563EB", delay: 0.08 },
            { value: `${peakPenalizedMonths}/12`, label: "High-Congestion Months", sub: "Months where redistribution penalties are active", icon: <TrendingDownRoundedIcon sx={{ fontSize: 22 }} />, color: "#F59E0B", delay: 0.16 },
            { value: `${overloaded + highPressure}`, label: "Destinations at Risk", sub: "Exceeding sustainable congestion threshold in July", icon: <TrendingUpRoundedIcon sx={{ fontSize: 22 }} />, color: "#EF4444", delay: 0.24 },
          ].map((k) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={k.label}>
              <KpiCard {...k} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mb: 8 }}>

          {/* Monthly redistribution activity */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: "easeOut" }}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", border: "1px solid", borderColor: "divider", background: dark ? "linear-gradient(160deg, #1E293B 0%, #111827 100%)" : "#FAFBFF", height: "100%" }}>
                <Typography sx={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "#6366F1", mb: 0.75 }}>
                  Redistribution Activity
                </Typography>
                <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.15rem", mb: 0.5 }}>
                  Penalized Destinations by Month
                </Typography>
                <Typography sx={{ fontSize: ".8rem", color: "text.secondary", mb: 3.5 }}>
                  Number of destinations exceeding the congestion threshold ({">"} 80) — triggering −10% scoring penalty
                </Typography>
                <MonthlyChart />

                <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap", gap: 1.5 }}>
                  {[
                    { color: "#10B981", label: "Sustainable (0 penalized)" },
                    { color: "#F59E0B", label: "Moderate pressure (8)" },
                    { color: "#EF4444", label: "Peak pressure (12)" },
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

          {/* Status breakdown */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", border: "1px solid", borderColor: "divider", background: dark ? "linear-gradient(160deg, #1E293B 0%, #111827 100%)" : "#FAFBFF", height: "100%" }}>
                <Typography sx={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "#6366F1", mb: 0.75 }}>
                  Destination Status
                </Typography>
                <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.15rem", mb: 3.5 }}>
                  July Peak — Distribution
                </Typography>

                {[
                  { key: "overloaded" as StatusKey, count: overloaded },
                  { key: "high" as StatusKey, count: highPressure },
                  { key: "moderate" as StatusKey, count: moderate },
                  { key: "opportunity" as StatusKey, count: opportunity },
                ].map(({ key, count }) => {
                  const meta = STATUS_META[key];
                  return (
                    <Box key={key} sx={{ mb: 2.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                        <Typography sx={{ fontSize: ".82rem", fontWeight: 700, color: "text.primary" }}>{meta.label}</Typography>
                        <Typography sx={{ fontSize: ".82rem", fontWeight: 900, color: meta.color }}>{count} / 20</Typography>
                      </Box>
                      <Box sx={{ height: 8, borderRadius: "999px", bgcolor: "rgba(128,128,128,.12)", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(count / 20) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
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
                    <Typography sx={{ fontSize: ".72rem", fontWeight: 700, color: "#10B981" }}>SDG 8.9 Target</Typography>
                    <Typography sx={{ fontSize: ".68rem", color: "text.secondary", lineHeight: 1.5 }}>5–10% demand redistribution</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "rgba(99,102,241,.07)", border: "1px solid rgba(99,102,241,.15)", flex: 1, textAlign: "center" }}>
                    <VerifiedRoundedIcon sx={{ color: "#6366F1", fontSize: 20, mb: 0.5 }} />
                    <Typography sx={{ fontSize: ".72rem", fontWeight: 700, color: "#6366F1" }}>Engine Status</Typography>
                    <Typography sx={{ fontSize: ".68rem", color: "text.secondary", lineHeight: 1.5 }}>Active · All modules online</Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Destination table */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "#6366F1", mb: 0.75 }}>
              Destination Monitor
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
              <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.15rem" }}>
                All 20 Destinations · July Snapshot
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {(["all", "overloaded", "high", "moderate", "opportunity"] as const).map((f) => {
                  const meta = f === "all" ? null : STATUS_META[f];
                  const isActive = filter === f;
                  return (
                    <Chip
                      key={f}
                      label={f === "all" ? "All" : meta!.label}
                      onClick={() => setFilter(f)}
                      size="small"
                      sx={{
                        fontWeight: 700, fontSize: ".72rem", cursor: "pointer",
                        color: isActive ? (f === "all" ? "#2563EB" : meta!.color) : "#64748B",
                        bgcolor: isActive ? (f === "all" ? "rgba(37,99,235,.1)" : meta!.bg) : dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
                        border: isActive
                          ? `1px solid ${f === "all" ? "rgba(37,99,235,.2)" : `${meta!.color}30`}`
                          : "1px solid transparent",
                        transition: "all .2s",
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>

          <Box sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider", overflow: "hidden", background: "background.paper" }}>
            {/* Table header */}
            <Box sx={{
              display: "flex", gap: 2, px: 2.5, py: 1.5,
              bgcolor: dark ? "rgba(255,255,255,.03)" : "#F8FAFC",
              borderBottom: "1px solid",
              borderBottomColor: "divider",
              flexWrap: "wrap",
            }}>
              {["Destination", "Type", "July Congestion", "Sustainability", "Status"].map((h) => (
                <Typography key={h} sx={{ fontSize: ".72rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: ".08em", flex: h === "Destination" ? "1 1 140px" : h === "July Congestion" ? "1 1 100px" : "0 0 auto", minWidth: h === "Destination" ? 160 : undefined }}>
                  {h}
                </Typography>
              ))}
            </Box>

            {filtered.map((dest, i) => (
              <DestRow key={dest.id} dest={dest} index={i} />
            ))}

            {filtered.length === 0 && (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography sx={{ color: "text.secondary" }}>No destinations match this filter.</Typography>
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
