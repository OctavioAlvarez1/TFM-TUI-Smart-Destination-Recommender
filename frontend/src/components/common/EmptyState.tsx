import {
  Box,
  Typography,
} from "@mui/material";

const EmptyState = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          mb: 2,
        }}
      >
        🌍
      </Typography>

      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
      >
        Ready to Discover Sustainable
        Destinations?
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          maxWidth: 700,
          mx: "auto",
        }}
      >
        Generate personalized destination
        recommendations powered by artificial
        intelligence, sustainability metrics and
        congestion-aware travel intelligence.
      </Typography>
    </Box>
  );
};

export default EmptyState;