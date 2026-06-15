import { useState } from "react";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Paper,
  Typography,
  Grid,
} from "@mui/material";

interface RecommendationFormProps {
  onSubmit: (
    userId: string,
    month: number,
    topN: number
  ) => void;
}

const RecommendationForm = ({
  onSubmit,
}: RecommendationFormProps) => {
  const [userId, setUserId] =
    useState("U001");

  const [month, setMonth] =
    useState(7);

  const [topN, setTopN] =
    useState(5);

  const handleSubmit = () => {
    onSubmit(
      userId,
      month,
      topN
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        mb: 6,
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(12px)",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
      >
        Plan Your Next Journey
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Generate AI-powered destination
        recommendations based on traveler
        preferences, sustainability metrics
        and congestion awareness.
      </Typography>

      <Grid
        container
        spacing={3}
      >
        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <TextField
            fullWidth
            label="Traveler Profile"
            value={userId}
            onChange={(e) =>
              setUserId(
                e.target.value
              )
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <TextField
            fullWidth
            select
            label="Travel Month"
            value={month}
            onChange={(e) =>
              setMonth(
                Number(
                  e.target.value
                )
              )
            }
          >
            {[...Array(12)].map(
              (_, index) => (
                <MenuItem
                  key={
                    index + 1
                  }
                  value={
                    index + 1
                  }
                >
                  {index + 1}
                </MenuItem>
              )
            )}
          </TextField>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <TextField
            fullWidth
            label="Destinations"
            type="number"
            value={topN}
            onChange={(e) =>
              setTopN(
                Number(
                  e.target.value
                )
              )
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems:
                "center",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={
                handleSubmit
              }
              sx={{
                height: 56,
                borderRadius: 3,
                fontWeight: 700,
                fontSize:
                  "1rem",
              }}
            >
              Explore Destinations
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RecommendationForm;