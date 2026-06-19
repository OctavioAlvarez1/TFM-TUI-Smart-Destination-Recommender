import { motion } from "framer-motion";
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
        (recommendation, index) => (
          <Grid
            key={recommendation.destination_id}
            size={{ xs: 12 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              style={{ height: "100%" }}
            >
              <RecommendationCard
                recommendation={recommendation}
              />
            </motion.div>
          </Grid>
        )
      )}
    </Grid>
  );
};

export default RecommendationGrid;
