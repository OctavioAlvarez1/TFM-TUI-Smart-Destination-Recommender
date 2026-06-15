import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
} from "@mui/material";

import type { Recommendation } from "../../types/recommendation";

interface KpiDashboardProps {
  recommendations: Recommendation[];
}

const KpiDashboard = ({
  recommendations,
}: KpiDashboardProps) => {
  if (recommendations.length === 0) {
    return null;
  }

  const avgSustainability =
    recommendations.reduce(
      (sum, recommendation) =>
        sum +
        recommendation.sustainability_score,
      0
    ) / recommendations.length;

  const avgConfidence =
    recommendations.reduce(
      (sum, recommendation) =>
        sum +
        recommendation.confidence_score,
      0
    ) / recommendations.length;

  const avgCongestion =
    recommendations.reduce(
      (sum, recommendation) =>
        sum +
        recommendation.congestion_score,
      0
    ) / recommendations.length;

  const topDestination =
    recommendations[0]?.destination_name;

  const kpis = [
    {
      icon: "🌱",
      title: "Sustainability",
      value:
        avgSustainability.toFixed(1),
      background:
        "linear-gradient(135deg,#DCFCE7,#BBF7D0)",
    },
    {
      icon: "🎯",
      title: "Confidence",
      value:
        avgConfidence.toFixed(1),
      background:
        "linear-gradient(135deg,#DBEAFE,#BFDBFE)",
    },
    {
      icon: "🚦",
      title: "Congestion",
      value:
        avgCongestion.toFixed(1),
      background:
        "linear-gradient(135deg,#FEF3C7,#FDE68A)",
    },
    {
      icon: "🏆",
      title: "Top Destination",
      value: topDestination,
      background:
        "linear-gradient(135deg,#E0F2FE,#BAE6FD)",
    },
  ];

  return (
    <Grid
      container
      spacing={3}
      sx={{
        mb: 6,
      }}
    >
      {kpis.map((kpi) => (
        <Grid
          key={kpi.title}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 5,
              height: "100%",
              background:
                kpi.background,

              transition:
                "all 0.3s ease",

              "&:hover": {
                transform:
                  "translateY(-6px)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  fontSize: "2rem",
                  mb: 1,
                }}
              >
                {kpi.icon}
              </Box>

              <Typography
                variant="h3"
                fontWeight={800}
              >
                {kpi.value}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  fontWeight: 600,
                }}
              >
                {kpi.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiDashboard;