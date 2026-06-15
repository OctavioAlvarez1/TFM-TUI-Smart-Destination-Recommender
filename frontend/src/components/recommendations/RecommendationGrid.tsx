import Grid from "@mui/material/Grid";

import RecommendationCard from "./RecommendationCard";

import type { Recommendation } from "../../types/recommendation";

interface RecommendationGridProps {
  recommendations: Recommendation[];
}

const RecommendationGrid = ({
  recommendations,
}: RecommendationGridProps) => {
  return (
    <Grid
      container
      spacing={3}
      sx={{ mt: 1 }}
    >
      {recommendations.map(
        (recommendation) => (
          <Grid
            key={
              recommendation.destination_id
            }
            size={{
              xs: 12,
              sm: 6,
              lg: 4,
            }}
          >
            <RecommendationCard
              recommendation={
                recommendation
              }
            />
          </Grid>
        )
      )}
    </Grid>
  );
};

export default RecommendationGrid;