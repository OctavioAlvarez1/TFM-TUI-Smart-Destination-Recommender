import {
  Box,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import horizonLogo from "../../assets/logo/horizon-logo.svg";

const footerLinks = {
  Features: [
    "Sustainability Score",
    "Congestion Index",
    "Preference Match",
    "AI Explanation",
  ],
  Technology: [
    "FastAPI Backend",
    "React + TypeScript",
    "Scikit-learn ML",
    "Synthetic Datasets",
  ],
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#070C16",
        color: "#FFF",
        pt: { xs: 6, md: 10 },
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 5, md: 6 }}>
          {/* BRAND */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", mb: 2.5 }}
            >
              <img
                src={horizonLogo}
                alt="Horizon"
                style={{ width: 28, height: 28 }}
              />
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  letterSpacing: ".08em",
                  color: "#FFF",
                }}
              >
                HORIZON
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "rgba(255,255,255,.5)",
                fontSize: ".85rem",
                mb: 2.5,
              }}
            >
              Smart Destination Recommender
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.55)",
                lineHeight: 1.8,
                fontSize: ".9rem",
                maxWidth: 340,
                mb: 3.5,
              }}
            >
              AI-powered system for sustainable tourism
              demand redistribution. Built as part of
              the TUI Care Foundation target 8.9
              open innovation challenge.
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
              {["TUI Care Foundation", "target 8.9", "Future Shapers Spain"].map(
                (tag) => (
                  <Box
                    key={tag}
                    sx={{
                      px: 2,
                      py: 0.75,
                      borderRadius: "8px",
                      border:
                        "1px solid rgba(255,255,255,.1)",
                      fontSize: ".75rem",
                      color: "rgba(255,255,255,.45)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tag}
                  </Box>
                )
              )}
            </Stack>
          </Grid>

          {/* FEATURES + TECHNOLOGY */}
          {Object.entries(footerLinks).map(
            ([section, items]) => (
              <Grid
                key={section}
                size={{ xs: 6, md: 2 }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    fontSize: ".8rem",
                    textTransform: "uppercase",
                    letterSpacing: ".12em",
                    color: "rgba(255,255,255,.35)",
                  }}
                >
                  {section}
                </Typography>
                {items.map((item) => (
                  <Typography
                    key={item}
                    sx={{
                      color: "rgba(255,255,255,.55)",
                      mb: 1.5,
                      fontSize: ".9rem",
                      cursor: "default",
                      transition: "color .2s",
                      "&:hover": {
                        color: "#38BDF8",
                      },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Grid>
            )
          )}

          {/* PROJECT */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: ".8rem",
                textTransform: "uppercase",
                letterSpacing: ".12em",
                color: "rgba(255,255,255,.35)",
              }}
            >
              About the Project
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.7)",
                fontWeight: 600,
                fontSize: ".95rem",
                mb: 1,
              }}
            >
              TFM — Universidad Complutense de Madrid
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.5)",
                lineHeight: 1.8,
                fontSize: ".9rem",
                mb: 3,
              }}
            >
              Reto 2: Motor de recomendaciones con IA
              y redistribución de demanda turística para
              combatir el sobreturismo en España.
            </Typography>

            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "rgba(56,189,248,.06)",
                border: "1px solid rgba(56,189,248,.14)",
              }}
            >
              <Typography
                sx={{
                  color: "#38BDF8",
                  fontWeight: 700,
                  fontSize: ".85rem",
                  mb: 1.5,
                }}
              >
                Problem Statement
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,.5)",
                  fontSize: ".85rem",
                  lineHeight: 1.75,
                }}
              >
                85% of tourists visit only 10% of
                destinations. Horizon uses AI to
                redistribute demand toward sustainable,
                less-saturated alternatives — without
                sacrificing traveler satisfaction.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{ my: { xs: 5, md: 6 }, borderColor: "rgba(255,255,255,.07)" }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,.3)",
              fontSize: ".82rem",
            }}
          >
            © 2025 Horizon — TFM UCM × TUI Care Foundation
          </Typography>

          <Stack direction="row" spacing={3}>
            {["About", "Methodology", "Data Sources"].map(
              (item) => (
                <Typography
                  key={item}
                  sx={{
                    color: "rgba(255,255,255,.3)",
                    fontSize: ".82rem",
                    cursor: "default",
                    transition: "color .2s",
                    "&:hover": {
                      color: "rgba(255,255,255,.65)",
                    },
                  }}
                >
                  {item}
                </Typography>
              )
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
