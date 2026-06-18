import {
  Box,
  Container,
  Typography,
} from "@mui/material";

import heroImage from "../../assets/hero/hero.jpg";

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: "relative",

        height: {
          xs: "58vh",
          md: "60vh",
        },

        minHeight: {
          xs: 500,
          md: 560,
        },

        display: "flex",

        alignItems: "center",

        overflow: "hidden",

        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,0.40),
            rgba(0,0,0,0.48)
          ),
          url(${heroImage})
        `,

        backgroundSize: "cover",

        backgroundPosition: "center center",

        backgroundRepeat: "no-repeat",

        "&::before": {
          content: '""',

          position: "absolute",

          inset: 0,

          background: `
            radial-gradient(
              circle at 20% 30%,
              rgba(56,189,248,.06),
              transparent 35%
            )
          `,

          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 850,

            mt: {
              xs: 1,
              md: 2,
            },
          }}
        >
          {/* EYEBROW */}

          <Typography
            sx={{
              display: "inline-flex",

              alignItems: "center",

              px: 3,

              py: 1.2,

              borderRadius: "999px",

              color: "#38BDF8",

              fontWeight: 700,

              textTransform: "uppercase",

              letterSpacing: "0.25em",

              mb: 3,

              fontSize: ".85rem",

              border:
                "1px solid rgba(255,255,255,.15)",

              background:
                "rgba(255,255,255,.06)",

              backdropFilter: "blur(10px)",
            }}
          >
            AI-POWERED SUSTAINABLE TOURISM
          </Typography>

          {/* TITLE */}

          <Typography
            sx={{
              color: "#FFFFFF",

              fontWeight: 900,

              lineHeight: 0.95,

              mb: 3,

              textShadow:
                "0 12px 40px rgba(0,0,0,.35)",

              fontSize: {
                xs: "3rem",
                sm: "3.8rem",
                md: "4.5rem",
              },
            }}
          >
            Discover Better Destinations
          </Typography>

          {/* SUBTITLE */}

          <Typography
            sx={{
              color:
                "rgba(255,255,255,.92)",

              maxWidth: 700,

              lineHeight: 1.75,

              fontWeight: 400,

              fontSize: {
                xs: "1rem",
                md: "1.15rem",
              },
            }}
          >
            Explore destinations that balance
            traveler satisfaction, sustainability
            performance and congestion management
            through intelligent recommendations.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;