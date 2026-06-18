import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const features = [
  {
    icon: (
      <TravelExploreRoundedIcon
        sx={{ fontSize: 34 }}
      />
    ),
    title: "Sustainability Intelligence",
    description:
      "Evaluate destinations through environmental impact indicators, sustainability scoring and responsible tourism metrics.",
  },
  {
    icon: (
      <PersonOutlineRoundedIcon
        sx={{ fontSize: 34 }}
      />
    ),
    title: "Traveler Satisfaction",
    description:
      "Leverage traveler behavior and preference signals to identify destinations that consistently deliver exceptional experiences.",
  },
  {
    icon: (
      <CalendarMonthRoundedIcon
        sx={{ fontSize: 34 }}
      />
    ),
    title: "Congestion Analytics",
    description:
      "Monitor tourism pressure and crowd dynamics to promote balanced destination distribution and better visitor experiences.",
  },
  {
    icon: (
      <SearchRoundedIcon
        sx={{ fontSize: 34 }}
      />
    ),
    title: "AI Recommendation Engine",
    description:
      "Generate explainable destination recommendations by combining traveler preferences, sustainability and congestion insights.",
  },
];

const FeatureSection = () => {
  return (
    <Box
      sx={{
        py: {
          xs: 6,
          md: 8,
        },
      }}
    >
      <Container maxWidth="xl">
        <Typography
          sx={{
            color: "#2563EB",

            fontWeight: 700,

            fontSize: ".85rem",

            letterSpacing: ".25em",

            textTransform: "uppercase",

            mb: 2,
          }}
        >
          Built For Smart Travelers
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "2.25rem",
              md: "3rem",
            },

            fontWeight: 800,

            color: "#0F172A",

            lineHeight: 1.1,

            maxWidth: 850,

            mb: 2,
          }}
        >
          AI-Powered. Sustainable.
          Personalized.
        </Typography>

        <Typography
          sx={{
            color: "#64748B",

            fontSize: {
              xs: "1rem",
              md: "1.1rem",
            },

            maxWidth: 720,

            lineHeight: 1.8,

            mb: 6,
          }}
        >
          Horizon combines artificial intelligence,
          sustainability metrics and traveler insights
          to recommend destinations that create
          better outcomes for travelers and local
          communities.
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid
              key={feature.title}
              size={{
                xs: 12,
                md: 6,
                lg: 3,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",

                  borderRadius: "28px",

                  background:
                    "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",

                  border:
                    "1px solid rgba(226,232,240,.8)",

                  overflow: "hidden",

                  position: "relative",

                  transition:
                    "all .35s ease",

                  "&::before": {
                    content: '""',

                    position: "absolute",

                    top: 0,

                    left: 0,

                    width: "100%",

                    height: 4,

                    background:
                      "linear-gradient(90deg,#38BDF8,#2563EB)",

                    opacity: 0,

                    transition:
                      "all .3s ease",
                  },

                  "&:hover": {
                    transform:
                      "translateY(-8px)",

                    boxShadow:
                      "0 24px 50px rgba(15,23,42,.08)",

                    border:
                      "1px solid rgba(37,99,235,.15)",

                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                  }}
                >
                  <Box
                    sx={{
                      width: 72,

                      height: 72,

                      borderRadius: "22px",

                      background:
                        "rgba(37,99,235,.08)",

                      color: "#2563EB",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 700,

                      fontSize: "1.15rem",

                      color: "#0F172A",

                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B",

                      lineHeight: 1.8,

                      fontSize: ".95rem",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureSection;