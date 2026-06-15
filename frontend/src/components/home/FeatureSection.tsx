import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

const features = [
  {
    icon: "🌱",
    title: "Sustainability First",
    description:
      "Promote environmentally responsible tourism choices.",
  },
  {
    icon: "🎯",
    title: "Personalized Recommendations",
    description:
      "AI-powered matching based on traveler preferences.",
  },
  {
    icon: "🚦",
    title: "Congestion Awareness",
    description:
      "Reduce overtourism and improve destination balance.",
  },
];

const FeatureSection = () => {
  return (
    <Grid
      container
      spacing={3}
      sx={{ mb: 6 }}
    >
      {features.map((feature) => (
        <Grid
          key={feature.title}
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              transition: "0.3s",
              "&:hover": {
                transform:
                  "translateY(-6px)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h3"
                gutterBottom
              >
                {feature.icon}
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
              >
                {feature.title}
              </Typography>

              <Typography
                color="text.secondary"
              >
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureSection;