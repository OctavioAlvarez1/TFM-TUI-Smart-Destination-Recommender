import { useState } from "react";

import {
  Container,
  Box,
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

              <Box mt={5}>
                <RecommendationGrid
                  recommendations={
                    recommendations
                  }
                />
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;