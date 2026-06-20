import {
  Box,
  Typography,
} from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";

const EmptyState = () => {
  const { locale } = useLanguage();
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
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {locale.empty.title}
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          maxWidth: 700,
          mx: "auto",
        }}
      >
        {locale.empty.subtitle}
      </Typography>
    </Box>
  );
};

export default EmptyState;