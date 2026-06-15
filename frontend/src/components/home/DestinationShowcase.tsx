import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const destinations = [
  {
    name: "Menorca",
    region: "Spain",
    sustainability: 81,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    name: "Lanzarote",
    region: "Canary Islands",
    sustainability: 74,
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  },
  {
    name: "San Sebastian",
    region: "Basque Country",
    sustainability: 85,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
];

const DestinationShowcase = () => {
  return (
    <Box sx={{ mb: 8 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        gutterBottom
      >
        Featured Sustainable Destinations
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        textAlign="center"
        sx={{
          mb: 5,
        }}
      >
        Discover destinations balancing
        traveler experience and sustainability.
      </Typography>

      <Grid
        container
        spacing={4}
      >
        {destinations.map(
          (destination) => (
            <Grid
              key={destination.name}
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Card
                sx={{
                  overflow: "hidden",
                  borderRadius: 5,
                  transition:
                    "all 0.3s ease",
                  "&:hover": {
                    transform:
                      "translateY(-10px)",
                    boxShadow: 12,
                  },
                }}
              >
                <Box
                  sx={{
                    height: 250,
                    backgroundImage: `url(${destination.image})`,
                    backgroundSize:
                      "cover",
                    backgroundPosition:
                      "center",
                  }}
                />

                <CardContent>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    {destination.name}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {destination.region}
                  </Typography>

                  <Chip
                    color="success"
                    label={`Sustainability ${destination.sustainability}`}
                  />
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default DestinationShowcase;