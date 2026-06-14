import {
  Container,
  Typography,
  Box,
} from "@mui/material";

import Header from "../components/layout/Header";

import RecommendationForm from "../components/recommendations/RecommendationForm";

const Home = () => {
  return (
    <>
      <Header />

      <Container maxWidth="lg">
        <Box mt={6}>
          <Typography
            variant="h3"
            gutterBottom
          >
            Discover Sustainable Destinations
          </Typography>

          <Typography variant="h6">
            AI-powered recommendations based on
            sustainability, congestion and traveler
            preferences.
          </Typography>
        </Box>

        <RecommendationForm />
      </Container>
    </>
  );
};

export default Home;