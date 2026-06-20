import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Box,
  Container,
  Typography,
} from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";

import heroImage from "../../assets/hero/hero.jpg";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { locale } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // image moves up as user scrolls down → parallax depth
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        height: { xs: "58vh", md: "60vh" },
        minHeight: { xs: 500, md: 560 },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* PARALLAX IMAGE LAYER */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-20%",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.40), rgba(0,0,0,0.50)),
            url(${heroImage})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          y: imageY,
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.07],
          x: ["0%", "1.8%"],
        }}
        transition={{
          duration: 14,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* RADIAL GLOW */}
      <Box
        sx={{
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
          zIndex: 1,
        }}
      />

      {/* CONTENT */}
      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 2 }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              maxWidth: 850,
              mt: { xs: 1, md: 2 },
            }}
          >
            {/* EYEBROW */}
            <motion.div variants={itemVariants}>
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
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "rgba(255,255,255,.06)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {locale.hero.badge}
              </Typography>
            </motion.div>

            {/* TITLE */}
            <motion.div variants={itemVariants}>
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 900,
                  lineHeight: 0.95,
                  mb: 3,
                  textShadow: "0 12px 40px rgba(0,0,0,.35)",
                  fontSize: {
                    xs: "3rem",
                    sm: "3.8rem",
                    md: "4.5rem",
                  },
                }}
              >
                {locale.hero.title}
              </Typography>
            </motion.div>

            {/* SUBTITLE */}
            <motion.div variants={itemVariants}>
              <Typography
                sx={{
                  color: "rgba(255,255,255,.92)",
                  maxWidth: 700,
                  lineHeight: 1.75,
                  fontWeight: 400,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                }}
              >
                {locale.hero.subtitle}
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
