import {
  Box,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import horizonLogo from "../../assets/logo/horizon-logo.svg";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { locale } = useLanguage();
  const footerLinks = [
    { heading: locale.footer.features.heading, items: locale.footer.features.items },
    { heading: locale.footer.technology.heading, items: locale.footer.technology.items },
  ];
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
              {locale.footer.tagline}
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
              {locale.footer.description}
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
          {footerLinks.map(({ heading, items }) => (
            <Grid key={heading} size={{ xs: 6, md: 2 }}>
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
                {heading}
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
                    "&:hover": { color: "#38BDF8" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>
          ))}

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
              {locale.footer.project.heading}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.7)",
                fontWeight: 600,
                fontSize: ".95rem",
                mb: 1,
              }}
            >
              {locale.footer.project.university}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.5)",
                lineHeight: 1.8,
                fontSize: ".9rem",
                mb: 3,
              }}
            >
              {locale.footer.project.description}
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
                {locale.footer.project.problemTitle}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,.5)",
                  fontSize: ".85rem",
                  lineHeight: 1.75,
                }}
              >
                {locale.footer.project.problemText}
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
            {locale.footer.copyright}
          </Typography>

          <Stack direction="row" spacing={3}>
            {locale.footer.bottomLinks.map(
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
