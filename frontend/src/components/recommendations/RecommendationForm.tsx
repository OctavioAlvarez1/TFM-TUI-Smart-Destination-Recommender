import { useState } from "react";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Paper,
} from "@mui/material";

import { getRecommendations } from "../../api/recommendationApi";

const RecommendationForm = () => {
  const [userId, setUserId] = useState("U001");
  const [month, setMonth] = useState(7);
  const [topN, setTopN] = useState(5);

  const handleSubmit = async () => {
    try {
      const data = await getRecommendations(
        userId,
        month,
        topN
      );

      console.log("API Response:");
      console.log(data);
    } catch (error) {
      console.error(
        "Error fetching recommendations:",
        error
      );
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mt: 4,
      }}
    >
      <Box
        display="flex"
        gap={2}
        alignItems="center"
        flexWrap="wrap"
      >
        <TextField
          label="User ID"
          value={userId}
          onChange={(e) =>
            setUserId(e.target.value)
          }
        />

        <TextField
          select
          label="Month"
          value={month}
          onChange={(e) =>
            setMonth(Number(e.target.value))
          }
        >
          {[...Array(12)].map((_, index) => (
            <MenuItem
              key={index + 1}
              value={index + 1}
            >
              {index + 1}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Top Recommendations"
          type="number"
          value={topN}
          onChange={(e) =>
            setTopN(Number(e.target.value))
          }
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          Generate Recommendations
        </Button>
      </Box>
    </Paper>
  );
};

export default RecommendationForm;