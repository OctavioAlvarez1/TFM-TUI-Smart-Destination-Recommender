import { useState } from "react";
import { motion } from "framer-motion";

import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

import Header from "../components/layout/Header";

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

const Home = () => {
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [userId, setUserId] =
    useState("U001");

  const [month, setMonth] =
    useState(7);

  const [topN, setTopN] =
    useState(5);

  const handleGenerateRecommendations =
    async () => {
      try {
        setLoading(true);

        const response =
          await getRecommendations(
            userId,
            month,
            topN
          );

        setRecommendations(
          response.recommendations
        );
      } catch (error) {
        console.error(
          "Error loading recommendations:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <Header />

      <HeroSection />

      {/* SEARCH BAR FLOATING */}

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",

          zIndex: 100,

          mt: {
            xs: "-80px",
            md: "-100px",
            lg: "-120px",
          },
        }}
      >
        <SearchBarHero
          userId={userId}
          month={month}
          topN={topN}
          setUserId={setUserId}
          setMonth={setMonth}
          setTopN={setTopN}
          onSearch={
            handleGenerateRecommendations
          }
        />
      </Container>

      {/* MAIN CONTENT */}

      <Container
        maxWidth="xl"
        sx={{
          mt: {
            xs: 6,
            md: 8,
          },

          mb: 12,
        }}
      >
        <FeatureSection />

        <Box
          sx={{
            mt: {
              xs: 8,
              md: 10,
            },
          }}
        >
          <DestinationShowcase />
        </Box>

        <Box
          sx={{
            mt: {
              xs: 8,
              md: 10,
            },
          }}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : recommendations.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <KpiDashboard
                recommendations={
                  recommendations
                }
              />

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
                      Your Top Recommendations
                    </Typography>
                    <Chip
                      label={`${recommendations.length} results`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: "rgba(37,99,235,.08)",
                        color: "#2563EB",
                        border: "1px solid rgba(37,99,235,.15)",
                      }}
                    />
                  </Stack>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: ".95rem",
                    }}
                  >
                    Showing{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {recommendations.length} destinations
                    </Box>{" "}
                    for profile{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "#2563EB" }}>
                      {userId}
                    </Box>{" "}
                    ·{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {new Date(2024, month - 1).toLocaleString("en", { month: "long" })}
                    </Box>{" "}
                    · ranked by AI match score
                  </Typography>
                </Box>
              </motion.div>

              <RecommendationGrid
                recommendations={recommendations}
              />
            </>
          )}
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default Home;