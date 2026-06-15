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
          xs: "70vh",
          md: "68vh",
        },

        display: "flex",

        alignItems: "center",

        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,0.45),
            rgba(0,0,0,0.55)
          ),
          url(${heroImage})
        `,

        backgroundSize: "cover",

        backgroundPosition: "center",

        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            maxWidth: 650,

            pt: 6,
          }}
        >
          <Typography
            sx={{
              color: "#38BDF8",

              fontWeight: 600,

              letterSpacing: 6,

              textTransform: "uppercase",

              mb: 3,

              fontSize: ".9rem",
            }}
          >
            AI-POWERED SUSTAINABLE TOURISM
          </Typography>

          <Typography
            sx={{
              color: "#FFFFFF",

              fontWeight: 800,

              lineHeight: .95,

              mb: 3,

              fontSize: {
                xs: "3.8rem",
                md: "5rem",
              },
            }}
          >
            Discover Better
            <br />
            Destinations
          </Typography>

          <Typography
            sx={{
              color:
                "rgba(255,255,255,.92)",

              maxWidth: 580,

              lineHeight: 1.7,

              fontSize: {
                xs: "1rem",
                md: "1.15rem",
              },
            }}
          >
            Explore destinations that
            balance traveler satisfaction,
            sustainability performance and
            congestion management through
            intelligent recommendations.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;