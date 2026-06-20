// Features overview section on the Home page.
// Renders four feature cards: Sustainability Intelligence, Traveler Satisfaction,
// Congestion Analytics and AI Recommendation Engine.
// Dark-mode aware card backgrounds.
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";

import NatureRoundedIcon        from "@mui/icons-material/NatureRounded";
import FavoriteRoundedIcon      from "@mui/icons-material/FavoriteRounded";
import SpeedRoundedIcon         from "@mui/icons-material/SpeedRounded";
import AutoAwesomeRoundedIcon   from "@mui/icons-material/AutoAwesomeRounded";
import { useLanguage } from "../../context/LanguageContext";

const FEATURE_META = [
  { color: "#10B981", icon: <NatureRoundedIcon      sx={{ fontSize: 32 }} /> },
  { color: "#2563EB", icon: <FavoriteRoundedIcon   sx={{ fontSize: 32 }} /> },
  { color: "#F59E0B", icon: <SpeedRoundedIcon      sx={{ fontSize: 32 }} /> },
  { color: "#6366F1", icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 32 }} /> },
];

const FeatureSection = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { locale } = useLanguage();

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
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
            {locale.features.badge}
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "2.25rem",
                md: "3rem",
              },

              fontWeight: 800,

              color: "text.primary",

              lineHeight: 1.1,

              maxWidth: 850,

              mb: 2,
            }}
          >
            {locale.features.heading}
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",

              fontSize: {
                xs: "1rem",
                md: "1.1rem",
              },

              maxWidth: 720,

              lineHeight: 1.8,

              mb: 6,
            }}
          >
            {locale.features.subtitle}
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {locale.features.items.map((feature, index) => {
            const { color, icon } = FEATURE_META[index];
            return (
            <Grid key={feature.title} size={{ xs: 12, md: 6, lg: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                style={{ height: "100%" }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: "28px",
                    background: dark
                      ? `linear-gradient(180deg, ${color}10 0%, #111827 100%)`
                      : `linear-gradient(180deg, ${color}08 0%, #FFFFFF 100%)`,
                    border: `1px solid ${color}25`,
                    overflow: "hidden",
                    position: "relative",
                    transition: "all .35s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0, left: 0,
                      width: "100%",
                      height: 3,
                      background: color,
                      opacity: 0.6,
                    },
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: dark
                        ? `0 24px 50px ${color}22`
                        : `0 24px 50px ${color}20`,
                      border: `1px solid ${color}55`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "18px",
                        background: dark ? `${color}22` : `${color}12`,
                        color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                      }}
                    >
                      {icon}
                    </Box>

                    <Typography sx={{ fontWeight: 700, fontSize: "1.15rem", color: "text.primary", mb: 2 }}>
                      {feature.title}
                    </Typography>

                    <Typography sx={{ color: "text.secondary", lineHeight: 1.8, fontSize: ".95rem" }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureSection;
