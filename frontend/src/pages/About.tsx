// About page — project context and methodology.
// Covers: the over-tourism challenge, scoring formula with animated weight bars,
// 5-layer system architecture, project scope (in-scope Reto 2 vs out-of-scope retos),
// and institutional context (UCM TFM + TUI Care Foundation).
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

import Footer from "../components/layout/Footer";

// ── Scoring formula visual ────────────────────────────────
const FormulaBar = ({
  label, weight, color, delay,
}: {
  label: string; weight: number; color: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
        <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: ".9rem" }}>{label}</Typography>
        <Typography sx={{ fontWeight: 900, color, fontSize: ".9rem" }}>{(weight * 100).toFixed(0)}%</Typography>
      </Box>
      <Box sx={{ height: 10, borderRadius: "999px", bgcolor: "rgba(128,128,128,.12)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${weight * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: delay + 0.2, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: "999px", background: color }}
        />
      </Box>
    </Box>
  </motion.div>
);

// ── Layer card ────────────────────────────────────────────
const LayerCard = ({
  num, title, desc, color, delay,
}: {
  num: string; title: string; desc: string; color: string; delay: number;
}) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay, ease: "easeOut" }}
  >
    <Box
      sx={{
        display: "flex", gap: 2.5, p: 2.5,
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        background: dark
          ? `linear-gradient(145deg, ${color}12 0%, ${color}1A 100%)`
          : `linear-gradient(145deg, ${color}06 0%, ${color}0D 100%)`,
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 40, height: 40, borderRadius: "10px",
          bgcolor: `${color}18`, display: "flex",
          alignItems: "center", justifyContent: "center",
          color, fontWeight: 900, fontSize: ".85rem", flexShrink: 0,
        }}
      >
        {num}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: ".9rem", mb: 0.5 }}>{title}</Typography>
        <Typography sx={{ fontSize: ".82rem", color: "text.secondary", lineHeight: 1.65 }}>{desc}</Typography>
      </Box>
    </Box>
  </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────────
const About = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
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
      <Box
        sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(circle at 70% 40%, rgba(16,185,129,.07), transparent 55%)",
        }}
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
              color: "#10B981", fontWeight: 700, fontSize: ".78rem",
              textTransform: "uppercase", letterSpacing: ".2em", mb: 3,
              border: "1px solid rgba(16,185,129,.2)",
              background: "rgba(16,185,129,.06)",
            }}
          >
            TFM · UCM · Future Shapers Spain
          </Typography>

          <Typography
            sx={{
              color: "#FFFFFF", fontWeight: 900, lineHeight: 1.05,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              maxWidth: 800, mb: 2.5,
            }}
          >
            About This Project
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,.65)", fontSize: { xs: "1rem", md: "1.1rem" },
              maxWidth: 680, lineHeight: 1.8,
            }}
          >
            Horizon is a final-year Master's thesis at Universidad Complutense de Madrid,
            developed in collaboration with TUI Care Foundation's target 8.9 program
            to address over-tourism in Spain through AI-powered demand redistribution.
          </Typography>
        </motion.div>
      </Container>
    </Box>

    <Container maxWidth="xl" sx={{ py: { xs: 8, md: 10 } }}>

      {/* THE CHALLENGE */}
      <Grid container spacing={{ xs: 6, md: 10 }} sx={{ mb: 10, alignItems: "center" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Typography sx={{ fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", color: "#2563EB", mb: 1 }}>
              The Challenge
            </Typography>
            <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 800, color: "text.primary", lineHeight: 1.1, mb: 3 }}>
              Challenge 2: AI Recommendation Engine & Demand Redistribution
            </Typography>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.9, mb: 2.5, fontSize: ".95rem" }}>
              Most recommendation systems are designed to maximize user satisfaction by showing what's most
              likely to please you. This works well for selling more — but it causes 1,000,000 people to end
              up visiting the same places, creating overcrowding, infrastructure saturation and economic leakage.
            </Typography>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.9, fontSize: ".95rem" }}>
              <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>The question Horizon answers:</Box>{" "}
              Can we use artificial intelligence to recommend attractive experiences for the traveler
              while simultaneously distributing tourism demand more sustainably across Spain's territory?
            </Typography>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2}>
            {[
              { icon: <SchoolRoundedIcon />, title: "Universidad Complutense de Madrid", desc: "Trabajo Final de Máster — academic framework and research methodology", color: "#6366F1" },
              { icon: <PublicRoundedIcon />, title: "TUI Care Foundation · target 8.9", desc: "Open innovation program aligned with UN SDG 8.9 — sustainable tourism and decent work", color: "#10B981" },
              { icon: <PeopleRoundedIcon />, title: "Future Shapers Spain", desc: "TUI + Telefónica accelerator connecting universities with real tourism industry challenges", color: "#F59E0B" },
              { icon: <PsychologyRoundedIcon />, title: "AI & Open Data", desc: "Built with FastAPI, React and public open data sources (INE, datos.gob.es) — GDPR compliant", color: "#2563EB" },
            ].map((card, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={card.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      p: 2.5, borderRadius: "16px",
                      border: "1px solid",
                    borderColor: "divider",
                      background: `linear-gradient(145deg, ${card.color}06 0%, ${card.color}10 100%)`,
                      height: "100%",
                    }}
                  >
                    <Box sx={{ color: card.color, mb: 1.5 }}>{card.icon}</Box>
                    <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: ".88rem", mb: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ fontSize: ".78rem", color: "text.secondary", lineHeight: 1.65 }}>
                      {card.desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 10 }} />

      {/* SCORING FORMULA */}
      <Grid container spacing={{ xs: 6, md: 10 }} sx={{ mb: 10, alignItems: "center" }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Typography sx={{ fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", color: "#2563EB", mb: 1 }}>
              AI Scoring Formula
            </Typography>
            <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" }, fontWeight: 800, color: "text.primary", lineHeight: 1.1, mb: 2.5 }}>
              How Horizon Scores Each Destination
            </Typography>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.9, mb: 3, fontSize: ".9rem" }}>
              Every recommendation is computed by combining four independent scoring modules,
              each measuring a different dimension of destination quality. Sustainability criteria
              receive a significant weight to incentivize greener choices.
            </Typography>

            {/* Formula box */}
            <Box
              sx={{
                p: 2.5, borderRadius: "16px",
                background: "#0F172A",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <Typography sx={{ fontFamily: "monospace", color: "#38BDF8", fontSize: ".85rem", lineHeight: 2 }}>
                Final Score =<br />
                {"  "}0.45 × <Box component="span" sx={{ color: "#818CF8" }}>Preference</Box><br />
                {"+ "}0.25 × <Box component="span" sx={{ color: "#34D399" }}>Sustainability</Box><br />
                {"+ "}0.15 × <Box component="span" sx={{ color: "#FCD34D" }}>Popularity</Box><br />
                {"+ "}0.15 × <Box component="span" sx={{ color: "#F87171" }}>Congestion Adj.</Box>
              </Typography>
              <Divider sx={{ borderColor: "rgba(255,255,255,.06)", my: 1.5 }} />
              <Typography sx={{ fontSize: ".75rem", color: "rgba(255,255,255,.35)", lineHeight: 1.7 }}>
                + Sustainability {">"} 85 → +5% boost &nbsp;|&nbsp; {"<"} 50 → −10% penalty<br />
                + Congestion {"<"} 40 → +5% boost &nbsp;|&nbsp; {">"} 80 → −10% penalty
              </Typography>
            </Box>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", border: "1px solid", borderColor: "divider", background: dark ? "linear-gradient(160deg, #1E293B 0%, #111827 100%)" : "#FAFBFF" }}>
              <Typography sx={{ fontWeight: 700, color: "text.primary", mb: 3, fontSize: "1rem" }}>
                Score Weight Distribution
              </Typography>
              <FormulaBar label="Preference Match" weight={0.45} color="#6366F1" delay={0} />
              <FormulaBar label="Sustainability Score" weight={0.25} color="#10B981" delay={0.1} />
              <FormulaBar label="Popularity Score" weight={0.15} color="#F59E0B" delay={0.2} />
              <FormulaBar label="Congestion Adjustment" weight={0.15} color="#EF4444" delay={0.3} />

              <Divider sx={{ my: 3 }} />

              <Stack spacing={1.5}>
                {[
                  { icon: <BarChartRoundedIcon sx={{ fontSize: 16 }} />, text: "Preference: matches user's travel style, budget and interests against destination attributes", color: "#6366F1" },
                  { icon: <SpaRoundedIcon sx={{ fontSize: 16 }} />, text: "Sustainability: carbon footprint, local business support, public transport, ESG overall score", color: "#10B981" },
                  { icon: <PeopleRoundedIcon sx={{ fontSize: 16 }} />, text: "Popularity: 70% booking volume + 30% rating score — ensures recommended quality", color: "#F59E0B" },
                  { icon: <PeopleRoundedIcon sx={{ fontSize: 16 }} />, text: "Congestion: monthly over-tourism index — penalizes saturated destinations in peak periods", color: "#EF4444" },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <Box sx={{ color: item.color, mt: 0.2, flexShrink: 0 }}>{item.icon}</Box>
                    <Typography sx={{ fontSize: ".8rem", color: "text.secondary", lineHeight: 1.65 }}>{item.text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 10 }} />

      {/* 5-LAYER ARCHITECTURE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Typography sx={{ fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", color: "#2563EB", mb: 1 }}>
          System Architecture
        </Typography>
        <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 800, color: "text.primary", lineHeight: 1.1, mb: 1.5 }}>
          5-Layer Pipeline
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: ".95rem", lineHeight: 1.8, maxWidth: 680, mb: 6 }}>
          Horizon is built as a layered system, each layer handling a specific responsibility —
          from raw data ingestion to governance and monitoring.
        </Typography>
      </motion.div>

      <Grid container spacing={2}>
        {[
          { num: "L1", title: "Unified Ingestion (Foundation)", desc: "Consolidates open data sources, synthetic datasets, IoT sensors and demand signals into a unified data layer.", color: "#6366F1", delay: 0 },
          { num: "L2", title: "Prediction Engine (Intelligence)", desc: "Historical booking patterns, sentiment analysis, seasonality modeling. Our FastAPI recommendation engine lives here.", color: "#10B981", delay: 0.08 },
          { num: "L3", title: "Intervention Triggers (Action)", desc: "Automation layer that decides when to activate alternative recommendations based on real-time congestion thresholds.", color: "#F59E0B", delay: 0.16 },
          { num: "L4", title: "Personalization (Interface)", desc: "'Invisible interface' — conversational flow using user context. Recommends alternatives without saying 'this destination is full'.", color: "#2563EB", delay: 0.24 },
          { num: "L5", title: "Governance (Control Panel)", desc: "Monitoring dashboard for regional authorities and sustainability teams — tracks demand redistribution and congestion KPIs.", color: "#EF4444", delay: 0.32 },
        ].map((l) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={l.num}>
            <LayerCard {...l} />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ mb: 10 }} />

      {/* PROJECT SCOPE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Typography sx={{ fontSize: ".82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", color: "#2563EB", mb: 1 }}>
          Project Scope
        </Typography>
        <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 800, color: "text.primary", lineHeight: 1.1, mb: 1.5 }}>
          What This TFM Covers — and What It Doesn't
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: ".95rem", lineHeight: 1.8, maxWidth: 720, mb: 6 }}>
          Future Shapers Spain is a multi-reto challenge. Horizon is scoped to <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>Reto 2</Box> — AI recommendation engine and demand redistribution. Other retos are handled by separate teams and are out of scope for this project.
        </Typography>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* In scope */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Box sx={{ p: 3.5, borderRadius: "20px", border: "1px solid rgba(16,185,129,.2)", bgcolor: "rgba(16,185,129,.03)", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "rgba(16,185,129,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircleOutlineRoundedIcon sx={{ color: "#10B981", fontSize: 20 }} />
                </Box>
                <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1rem" }}>
                  In Scope — Reto 2
                </Typography>
              </Box>
              <Stack spacing={1.5}>
                {[
                  "AI-powered destination recommendation engine (FastAPI + scoring pipeline)",
                  "Demand redistribution via congestion penalties and sustainability weights",
                  "Low-season boost — best months to visit based on INE congestion data",
                  "Open data integration: INE EOH (hotel travelers), FRONTUR (international), AEMET (climate normals)",
                  "Interactive georreferenced map with real-time month/congestion overlay",
                  "User profile matching (travel style, budget, sustainability preference)",
                  "Explainability layer — human-readable reasoning for each recommendation",
                  "React dashboard with sustainability KPIs and congestion heatmap",
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <CheckCircleOutlineRoundedIcon sx={{ fontSize: 15, color: "#10B981", mt: 0.2, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: ".82rem", color: "text.secondary", lineHeight: 1.65 }}>{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </motion.div>
        </Grid>

        {/* Out of scope */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          >
            <Box sx={{ p: 3.5, borderRadius: "20px", border: "1px solid rgba(100,116,139,.15)", bgcolor: "rgba(100,116,139,.03)", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "rgba(100,116,139,.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RadioButtonUncheckedRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </Box>
                <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1rem" }}>
                  Out of Scope — Other Retos
                </Typography>
              </Box>
              <Stack spacing={1.5}>
                {[
                  { text: "Sentiment analysis & traveler review processing — scoped to Reto 1 (NLP & social listening)", reto: "Reto 1" },
                  { text: "Transport time & multimodal route optimization — scoped to Reto 4 (mobility layer)", reto: "Reto 4" },
                  { text: "Real-time IoT sensor feeds and live crowd detection — infrastructure handled by Reto 3", reto: "Reto 3" },
                  { text: "Conversational booking assistant & chatbot interface — Reto 4 personalization layer", reto: "Reto 4" },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <RadioButtonUncheckedRoundedIcon sx={{ fontSize: 15, color: "#94A3B8", mt: 0.2, flexShrink: 0 }} />
                    <Box>
                      <Typography sx={{ fontSize: ".82rem", color: "text.secondary", lineHeight: 1.65 }}>{item.text}</Typography>
                      <Chip label={item.reto} size="small" sx={{ mt: 0.5, height: 18, fontSize: ".65rem", fontWeight: 700, bgcolor: "rgba(100,116,139,.10)", color: "text.secondary", border: "1px solid rgba(100,116,139,.18)" }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
              <Box sx={{ mt: 3, p: 2, borderRadius: "12px", bgcolor: "rgba(37,99,235,.04)", border: "1px solid rgba(37,99,235,.10)" }}>
                <Typography sx={{ fontSize: ".78rem", color: "#2563EB", lineHeight: 1.7 }}>
                  These are listed in the TFM document as <Box component="span" sx={{ fontWeight: 700 }}>desirable future data sources</Box>, not as deliverables of this reto. Horizon's scope is intentionally focused on Reto 2 to deliver a complete, production-ready AI engine.
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Container>

    <Footer />
  </>
  );
};

export default About;
