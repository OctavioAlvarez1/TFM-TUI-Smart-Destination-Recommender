import {
  Paper,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

interface SearchBarHeroProps {
  userId: string;
  month: number;
  topN: number;

  setUserId: (
    value: string
  ) => void;

  setMonth: (
    value: number
  ) => void;

  setTopN: (
    value: number
  ) => void;

  onSearch: () => void;
}

const SearchBarHero = ({
  userId,
  month,
  topN,
  setUserId,
  setMonth,
  setTopN,
  onSearch,
}: SearchBarHeroProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",

        maxWidth: 1500,

        mx: "auto",

        zIndex: 20,

        borderRadius: "40px",

        p: 3,

        backdropFilter: "blur(24px)",

        background:
          "rgba(255,255,255,0.94)",

        border:
          "1px solid rgba(255,255,255,0.5)",

        boxShadow:
          "0 20px 60px rgba(15,23,42,0.12)",

        transition:
          "all .3s ease",

        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.4fr 1fr 1fr auto",
          },

          gap: {
            xs: 2,
            lg: 0,
          },

          alignItems: "center",
        }}
      >
        {/* PROFILE */}

        <Box
          sx={{
            px: 4,
            py: 2,

            borderRight: {
              lg:
                "1px solid rgba(148,163,184,.18)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#64748B",

              fontWeight: 600,

              fontSize: ".95rem",

              mb: 1,
            }}
          >
            Traveler Profile
          </Typography>

          <TextField
            fullWidth
            variant="standard"
            value={userId}
            onChange={(e) =>
              setUserId(
                e.target.value
              )
            }
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "1.4rem",
                fontWeight: 500,
                color: "#0F172A",
              },
            }}
          />
        </Box>

        {/* MONTH */}

        <Box
          sx={{
            px: 4,
            py: 2,

            borderRight: {
              lg:
                "1px solid rgba(148,163,184,.18)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#64748B",

              fontWeight: 600,

              fontSize: ".95rem",

              mb: 1,
            }}
          >
            Travel Month
          </Typography>

          <TextField
            select
            fullWidth
            variant="standard"
            value={month}
            onChange={(e) =>
              setMonth(
                Number(
                  e.target.value
                )
              )
            }
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "1.4rem",
                fontWeight: 500,
                color: "#0F172A",
              },
            }}
          >
            {[...Array(12)].map(
              (_, index) => (
                <MenuItem
                  key={index + 1}
                  value={index + 1}
                >
                  {index + 1}
                </MenuItem>
              )
            )}
          </TextField>
        </Box>

        {/* DESTINATIONS */}

        <Box
          sx={{
            px: 4,
            py: 2,
          }}
        >
          <Typography
            sx={{
              color: "#64748B",

              fontWeight: 600,

              fontSize: ".95rem",

              mb: 1,
            }}
          >
            Destinations
          </Typography>

          <TextField
            fullWidth
            variant="standard"
            value={topN}
            onChange={(e) =>
              setTopN(
                Number(
                  e.target.value
                )
              )
            }
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "1.4rem",
                fontWeight: 500,
                color: "#0F172A",
              },
            }}
          />
        </Box>

        {/* BUTTON */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            px: {
              lg: 2,
            },
          }}
        >
          <Button
            onClick={onSearch}
            startIcon={<SearchIcon />}
            sx={{
              width: 220,

              height: 72,

              borderRadius: 999,

              color: "#FFF",

              fontWeight: 700,

              fontSize: "1.05rem",

              textTransform: "none",

              background:
                "linear-gradient(135deg,#0EA5E9,#2563EB)",

              boxShadow:
                "0 15px 40px rgba(37,99,235,.22)",

              transition:
                "all .3s ease",

              "&:hover": {
                background:
                  "linear-gradient(135deg,#38BDF8,#2563EB)",

                transform:
                  "translateY(-2px)",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchBarHero;