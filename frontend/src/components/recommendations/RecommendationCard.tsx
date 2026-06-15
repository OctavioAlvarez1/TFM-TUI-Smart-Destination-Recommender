import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Box,
  List,
  ListItem,
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
      elevation={4}
      sx={{
        height: "100%",
        borderRadius: 3,
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 12,
        },
      }}
    >
      <CardContent>
        <Typography
          variant="overline"
          color="primary"
        >
          Rank #
          {recommendation.recommendation_rank}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
        >
          {recommendation.destination_name}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Recommendation Score
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="primary"
          >
            {recommendation.final_score.toFixed(
              0
            )}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 3 }}
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

        <Divider sx={{ mb: 2 }} />

        <Typography
          variant="subtitle1"
          fontWeight={600}
        >
          Why Recommended
        </Typography>

        <List dense>
          {recommendation.explanations.map(
            (explanation, index) => (
              <ListItem
                key={index}
                sx={{
                  px: 0,
                  py: 0.5,
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