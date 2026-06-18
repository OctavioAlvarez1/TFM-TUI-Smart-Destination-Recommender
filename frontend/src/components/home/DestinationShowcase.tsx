import {
  Box,
  Card,
  Chip,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import mallorcaImage from "../../assets/destinations/mallorca.png";
import menorcaImage from "../../assets/destinations/menorca.jpg";
import lanzaroteImage from "../../assets/destinations/lanzarote.jpg";
import sanSebastianImage from "../../assets/destinations/san-sebastian.jpeg";

const destinations = [
  {
    name: "Mallorca",
    country: "Spain",
    sustainability: 88,
    congestion: "Low",
    image: mallorcaImage,
  },
  {
    name: "Menorca",
    country: "Spain",
    sustainability: 91,
    congestion: "Low",
    image: menorcaImage,
  },
  {
    name: "Lanzarote",
    country: "Canary Islands",
    sustainability: 82,
    congestion: "Medium",
    image: lanzaroteImage,
  },
  {
    name: "San Sebastian",
    country: "Basque Country",
    sustainability: 86,
    congestion: "Medium",
    image: sanSebastianImage,
  },
];

const getCongestionColor = (
  congestion: string
) => {
  switch (congestion) {
    case "Low":
      return "success";

    case "Medium":
      return "warning";

    default:
      return "error";
  }
};

const DestinationShowcase = () => {
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
        {/* LABEL */}

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
          Sustainable Destinations
        </Typography>

        {/* TITLE */}

        <Typography
          sx={{
            fontSize: {
              xs: "2.25rem",
              md: "3rem",
            },

            fontWeight: 800,

            color: "#0F172A",

            lineHeight: 1.1,

            maxWidth: 900,

            mb: 2,
          }}
        >
          Featured Destination Insights
        </Typography>

        {/* SUBTITLE */}

        <Typography
          sx={{
            color: "#64748B",

            fontSize: {
              xs: "1rem",
              md: "1.1rem",
            },

            lineHeight: 1.8,

            maxWidth: 700,

            mb: 6,
          }}
        >
          Explore destinations selected for
          their sustainability performance,
          traveler satisfaction and balanced
          tourism impact.
        </Typography>

        <Grid container spacing={4}>
          {destinations.map(
            (destination) => (
              <Grid
                key={destination.name}
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

                    overflow: "hidden",

                    border:
                      "1px solid rgba(226,232,240,.8)",

                    transition:
                      "all .35s ease",

                    background:
                      "#FFFFFF",

                    "&:hover": {
                      transform:
                        "translateY(-10px)",

                      boxShadow:
                        "0 30px 60px rgba(15,23,42,.10)",
                    },
                  }}
                >
                  {/* IMAGE */}

                  <Box
                    sx={{
                      height: 260,

                      backgroundImage: `url(${destination.image})`,

                      backgroundSize: "cover",

                      backgroundPosition:
                        "center",

                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",

                        inset: 0,

                        background:
                          "linear-gradient(to top, rgba(0,0,0,.55), transparent)",
                      }}
                    />

                    <Box
                      sx={{
                        position: "absolute",

                        bottom: 20,

                        left: 20,

                        color: "#FFF",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize:
                            "1.4rem",

                          fontWeight: 700,
                        }}
                      >
                        {destination.name}
                      </Typography>

                      <Typography
                        sx={{
                          opacity: .9,
                        }}
                      >
                        {destination.country}
                      </Typography>
                    </Box>
                  </Box>

                  {/* CONTENT */}

                  <Box p={3}>
                    <Box
                      sx={{
                        display: "flex",

                        gap: 1,

                        flexWrap: "wrap",

                        mb: 3,
                      }}
                    >
                      <Chip
                        color="success"
                        label={`Sustainability ${destination.sustainability}`}
                      />

                      <Chip
                        color={
                          getCongestionColor(
                            destination.congestion
                          ) as
                            | "success"
                            | "warning"
                            | "error"
                        }
                        label={`Congestion ${destination.congestion}`}
                      />
                    </Box>

                    <Typography
                      sx={{
                        color: "#64748B",

                        lineHeight: 1.8,

                        fontSize: ".95rem",

                        mb: 3,
                      }}
                    >
                      Recommended based on
                      sustainability metrics,
                      traveler experience and
                      tourism impact analysis.
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 1,

                        color: "#2563EB",

                        fontWeight: 700,

                        cursor: "pointer",
                      }}
                    >
                      Explore Destination

                      <ArrowForwardRoundedIcon />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default DestinationShowcase;