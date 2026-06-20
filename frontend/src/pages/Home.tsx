// Main Destinations page.
// Renders the SearchBarHero input form and the RecommendationGrid results.
// Manages recommendation fetch state, loading/error handling and demand redistribution banner.
// Passes the selected month and results up to App for cross-page sharing.
import { useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";

import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";

import HeroSection from "../components/home/HeroSection";
import SearchBarHero from "../components/home/SearchBarHero";
import FeatureSection from "../components/home/FeatureSection";
import DestinationShowcase from "../components/home/DestinationShowcase";

import RecommendationGrid from "../components/recommendations/RecommendationGrid";
import KpiDashboard from "../components/dashboard/KpiDashboard";

import EmptyState from "../components/common/EmptyState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import Footer from "../components/layout/Footer";

import { getRecommendations } from "../api/recommendationApi";
import type { Recommendation } from "../types/recommendation";

// Destinations that exceed congestion > 80 threshold per month (from congestion_scores.csv)
const PENALIZED_BY_MONTH: Record<number, number> = {
  1: 0, 2: 0, 3: 0, 4: 8, 5: 8, 6: 0, 7: 12, 8: 12, 9: 0, 10: 8, 11: 0, 12: 0,
};


interface HomeProps {
  month: number;
  setMonth: (m: number) => void;
  recommendations: Recommendation[];
  setRecommendations: (r: Recommendation[]) => void;
}

const Home = ({ month, setMonth, recommendations, setRecommendations }: HomeProps) => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("U001");
  const [topN, setTopN] = useState(5);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateRecommendations = async () => {
    try {
      setLoading(true);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const response = await getRecommendations(userId, month, topN);
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const { locale } = useLanguage();
  const penalized = PENALIZED_BY_MONTH[month] ?? 0;
  const monthName = locale.search.months[month - 1];

  return (
    <>
      <HeroSection />

      {/* SEARCH BAR FLOATING */}
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 100,
          mt: { xs: "-80px", md: "-100px", lg: "-120px" },
        }}
      >
        <SearchBarHero
          userId={userId}
          month={month}
          topN={topN}
          setUserId={setUserId}
          setMonth={setMonth}
          setTopN={setTopN}
          onSearch={handleGenerateRecommendations}
        />
      </Container>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ mt: { xs: 6, md: 8 }, mb: 12 }}>
        <FeatureSection />

        <Box sx={{ mt: { xs: 8, md: 10 } }}>
          <DestinationShowcase />
        </Box>

        <Box ref={resultsRef} sx={{ mt: { xs: 8, md: 10 } }}>
          {loading ? (
            <LoadingSkeleton />
          ) : recommendations.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <KpiDashboard recommendations={recommendations} />

              {/* REDISTRIBUTION BANNER */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: { xs: 2, md: 2.5 },
                    mb: 5,
                    borderRadius: "16px",
                    bgcolor: penalized > 0
                      ? "rgba(239,68,68,.05)"
                      : "rgba(16,185,129,.05)",
                    border: penalized > 0
                      ? "1px solid rgba(239,68,68,.15)"
                      : "1px solid rgba(16,185,129,.15)",
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
                      bgcolor: penalized > 0 ? "rgba(239,68,68,.1)" : "rgba(16,185,129,.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: penalized > 0 ? "#EF4444" : "#10B981",
                    }}
                  >
                    <SwapHorizRoundedIcon sx={{ fontSize: 20 }} />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography sx={{ fontSize: ".88rem", color: "text.primary", lineHeight: 1.6 }}>
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        {locale.home.redistribution.title}
                      </Box>
                      {penalized > 0 ? (
                        <>
                          {" "}{locale.home.redistribution.penalizedPrefix}{" "}
                          <Box component="span" sx={{ fontWeight: 700, color: "#EF4444" }}>
                            {penalized} {locale.home.redistribution.penalizedSuffix}
                          </Box>{" "}
                          {locale.home.redistribution.withSaturation}{" "}
                          <Box component="span" sx={{ fontWeight: 700 }}>{monthName}</Box>.
                          {" "}{locale.home.redistribution.resultsNote}
                        </>
                      ) : (
                        <>
                          {" "}{locale.home.redistribution.allSustainable}{" "}
                          <Box component="span" sx={{ fontWeight: 700 }}>{monthName}</Box>.
                          {" "}{locale.home.redistribution.noPenalties}
                        </>
                      )}
                    </Typography>
                  </Box>

                  {penalized > 0 && (
                    <Chip
                      label={`${penalized} ${locale.home.redistribution.penalizedChip}`}
                      size="small"
                      sx={{
                        fontWeight: 700, fontSize: ".75rem",
                        bgcolor: "rgba(239,68,68,.1)",
                        color: "#EF4444",
                        border: "1px solid rgba(239,68,68,.2)",
                      }}
                    />
                  )}
                </Box>
              </motion.div>

              {/* RESULTS HEADER */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
              >
                <Box sx={{ mb: 5 }}>
                  <Stack
                    direction="row"
                    sx={{ alignItems: "center", gap: 2, flexWrap: "wrap", mb: 1.5 }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "1.75rem", md: "2.25rem" },
                        fontWeight: 800,
                        color: "text.primary",
                        lineHeight: 1.1,
                      }}
                    >
                      {locale.home.results.heading}
                    </Typography>
                    <Chip
                      label={`${recommendations.length} ${locale.home.results.resultsChip}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: "rgba(37,99,235,.08)",
                        color: "#2563EB",
                        border: "1px solid rgba(37,99,235,.15)",
                      }}
                    />
                  </Stack>

                  <Typography sx={{ color: "text.secondary", fontSize: ".95rem" }}>
                    {locale.home.results.showing}{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {recommendations.length} {locale.home.results.destinations}
                    </Box>{" "}
                    {locale.home.results.forProfile}{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "#2563EB" }}>
                      {userId}
                    </Box>{" "}
                    ·{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {monthName}
                    </Box>{" "}
                    {locale.home.results.ranked}
                  </Typography>
                </Box>
              </motion.div>

              <RecommendationGrid recommendations={recommendations} />
            </>
          )}
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default Home;
