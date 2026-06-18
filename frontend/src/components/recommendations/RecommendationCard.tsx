import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Box,
  List,
  ListItem,
  Grid,
  Chip,
} from "@mui/material";

import type { Recommendation } from "../../types/recommendation";

import SustainabilityBadge from "./SustainabilityBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import CongestionBadge from "./CongestionBadge";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard = ({
  recommendation,
}: RecommendationCardProps) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",

        borderRadius: "28px",

        border:
          "1px solid rgba(226,232,240,.8)",

        background:
          "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",

        transition:
          "all .35s ease",

        overflow: "hidden",

        position: "relative",

        "&::before": {
          content: '""',

          position: "absolute",

          top: 0,

          left: 0,

          width: "100%",

          height: 4,

          background:
            "linear-gradient(90deg,#38BDF8,#2563EB)",
        },

        "&:hover": {
          transform:
            "translateY(-8px)",

          boxShadow:
            "0 30px 60px rgba(15,23,42,.10)",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* RANK */}

        <Chip
          label={`#${recommendation.recommendation_rank} Recommended`}
          color="primary"
          size="small"
          sx={{
            mb: 3,

            fontWeight: 700,
          }}
        />

        {/* DESTINATION */}

        <Typography
          sx={{
            fontSize: "1.8rem",

            fontWeight: 800,

            color: "#0F172A",

            mb: 3,
          }}
        >
          {recommendation.destination_name}
        </Typography>

        {/* SCORE */}

        <Box
          sx={{
            display: "flex",

            justifyContent: "center",

            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 120,

              height: 120,

              borderRadius: "50%",

              background:
                "linear-gradient(135deg,#38BDF8,#2563EB)",

              color: "#FFF",

              display: "flex",

              flexDirection: "column",

              alignItems: "center",

              justifyContent: "center",

              boxShadow:
                "0 20px 40px rgba(37,99,235,.25)",
            }}
          >
            <Typography
              sx={{
                fontSize: "2rem",

                fontWeight: 800,

                lineHeight: 1,
              }}
            >
              {recommendation.final_score.toFixed(
                0
              )}
            </Typography>

            <Typography
              sx={{
                fontSize: ".8rem",

                opacity: .95,
              }}
            >
              Match Score
            </Typography>
          </Box>
        </Box>

        {/* BADGES */}

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{
            mb: 4,
          }}
        >
          <SustainabilityBadge
            score={
              recommendation.sustainability_score
            }
          />

          <ConfidenceBadge
            confidence={
              recommendation.confidence_score
            }
          />

          <CongestionBadge
            congestion={
              recommendation.congestion_score
            }
          />
        </Stack>

        {/* DRIVERS */}

        <Divider sx={{ mb: 3 }} />

        <Typography
          sx={{
            fontWeight: 700,

            color: "#0F172A",

            mb: 2,
          }}
        >
          Recommendation Drivers
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Grid size={4}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Preference
              </Typography>

              <Typography
                fontWeight={700}
              >
                {recommendation.preference_score.toFixed(
                  0
                )}
              </Typography>
            </Box>
          </Grid>

          <Grid size={4}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Sustainability
              </Typography>

              <Typography
                fontWeight={700}
              >
                {recommendation.sustainability_score.toFixed(
                  0
                )}
              </Typography>
            </Box>
          </Grid>

          <Grid size={4}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Popularity
              </Typography>

              <Typography
                fontWeight={700}
              >
                {recommendation.popularity_score.toFixed(
                  0
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* EXPLAINABILITY */}

        <Divider sx={{ mb: 2 }} />

        <Typography
          sx={{
            fontWeight: 700,

            color: "#0F172A",

            mb: 1,
          }}
        >
          Why Horizon Recommended This
        </Typography>

        <List dense>
          {recommendation.explanations.map(
            (
              explanation,
              index
            ) => (
              <ListItem
                key={index}
                sx={{
                  px: 0,

                  py: .5,

                  color: "#475569",
                }}
              >
                ✓ {explanation}
              </ListItem>
            )
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;