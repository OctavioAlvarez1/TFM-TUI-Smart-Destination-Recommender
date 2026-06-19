import { motion } from "framer-motion";
import {
  Box,
  Chip,
  Container,
  Stack,
  Typography,
  Grid,
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
    description:
      "Mediterranean gem balancing iconic beaches with undiscovered rural interior. Ideal for sustainable travel with low-pressure zones.",
  },
  {
    name: "Menorca",
    country: "Spain",
    sustainability: 91,
    congestion: "Low",
    image: menorcaImage,
    description:
      "UNESCO Biosphere Reserve with pristine coastlines. One of Spain's most sustainably managed island destinations.",
  },
  {
    name: "Lanzarote",
    country: "Canary Islands",
    sustainability: 82,
    congestion: "Medium",
    image: lanzaroteImage,
    description:
      "Volcanic landscapes and year-round sunshine inside a UNESCO World Biosphere Reserve. Perfect for shoulder-season travel.",
  },
  {
    name: "San Sebastián",
    country: "Basque Country",
    sustainability: 86,
    congestion: "Medium",
    image: sanSebastianImage,
    description:
      "World-class gastronomy meets coastal culture. Strong local SME ecosystem makes it a model for sustainable urban tourism.",
  },
];

const getCongestionColor = (c: string) =>
  c === "Low" ? "success" : c === "Medium" ? "warning" : "error";

interface FlipCardProps {
  destination: (typeof destinations)[0];
  index: number;
}

const FlipCard = ({ destination, index }: FlipCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 44 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{
      duration: 0.6,
      delay: index * 0.1,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    }}
    style={{ height: "100%" }}
  >
    {/* PERSPECTIVE WRAPPER */}
    <Box
      sx={{
        height: { xs: 320, md: 380 },
        perspective: "1100px",
        cursor: "pointer",
      }}
    >
      {/* INNER — rotates */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition:
            "transform .7s cubic-bezier(0.4, 0, 0.2, 1)",
          transformStyle: "preserve-3d",
          borderRadius: "24px",
          "&:hover": {
            transform: "rotateY(180deg)",
          },
        }}
      >
        {/* ── FRONT ── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: "24px",
            overflow: "hidden",
            backgroundImage: `url(${destination.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,.78) 0%, rgba(0,0,0,.15) 55%, transparent 100%)",
            }}
          />

          {/* hover hint */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              px: 1.5,
              py: 0.5,
              borderRadius: "999px",
              bgcolor: "rgba(255,255,255,.15)",
              backdropFilter: "blur(8px)",
              color: "rgba(255,255,255,.8)",
              fontSize: ".72rem",
              fontWeight: 600,
              letterSpacing: ".05em",
            }}
          >
            HOVER FOR INFO
          </Box>

          {/* name / country */}
          <Box
            sx={{
              position: "absolute",
              bottom: 32,
              left: 32,
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontSize: { xs: "1.6rem", md: "1.9rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 0.5,
              }}
            >
              {destination.name}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,.75)",
                fontSize: ".9rem",
              }}
            >
              {destination.country}
            </Typography>
          </Box>
        </Box>

        {/* ── BACK ── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "24px",
            overflow: "hidden",
            background:
              "linear-gradient(145deg, #0F172A 0%, #1E293B 100%)",
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* top: name + badges */}
          <Box>
            <Typography
              sx={{
                color: "#FFF",
                fontSize: { xs: "1.4rem", md: "1.65rem" },
                fontWeight: 800,
                mb: 0.5,
              }}
            >
              {destination.name}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.5)",
                fontSize: ".85rem",
                mb: 2.5,
              }}
            >
              {destination.country}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 3 }}>
              <Chip
                color="success"
                size="small"
                label={`Sustainability ${destination.sustainability}`}
                sx={{ fontWeight: 700 }}
              />
              <Chip
                color={
                  getCongestionColor(destination.congestion) as
                    | "success"
                    | "warning"
                    | "error"
                }
                size="small"
                label={`Congestion ${destination.congestion}`}
                sx={{ fontWeight: 700 }}
              />
            </Stack>

            <Typography
              sx={{
                color: "rgba(255,255,255,.65)",
                fontSize: ".9rem",
                lineHeight: 1.75,
              }}
            >
              {destination.description}
            </Typography>
          </Box>

          {/* bottom: CTA */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: "#38BDF8",
              fontWeight: 700,
              fontSize: ".9rem",
              mt: 3,
            }}
          >
            Explore Destination
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  </motion.div>
);

const DestinationShowcase = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
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

          <Typography
            sx={{
              fontSize: { xs: "2.25rem", md: "3rem" },
              fontWeight: 800,
              color: "text.primary",
              lineHeight: 1.1,
              maxWidth: 900,
              mb: 2,
            }}
          >
            Featured Destination Insights
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.8,
              maxWidth: 700,
              mb: 6,
            }}
          >
            Hover each destination to discover its sustainability profile,
            congestion level and why Horizon recommends it.
          </Typography>
        </motion.div>

        {/* 2×2 FLIP GRID */}
        <Grid container spacing={3}>
          {destinations.map((dest, index) => (
            <Grid
              key={dest.name}
              size={{ xs: 12, sm: 6 }}
            >
              <FlipCard destination={dest} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DestinationShowcase;
