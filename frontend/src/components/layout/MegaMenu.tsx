import {
  Paper,
  Grid,
  Typography,
  Box,
} from "@mui/material";

import DestinationPreviewCard from "./DestinationPreviewCard";

import mallorca from "../../assets/destinations/mallorca.png";
import menorca from "../../assets/destinations/menorca.jpg";
import lanzarote from "../../assets/destinations/lanzarote.jpg";
import sanSebastian from "../../assets/destinations/san-sebastian.jpeg";

const MegaMenu = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "absolute",

        top: 80,

        left: "50%",

        transform:
          "translateX(-50%)",

        width: 950,

        p: 4,

        borderRadius: 5,

        background:
          "rgba(10,15,25,.92)",

        backdropFilter:
          "blur(30px)",

        border:
          "1px solid rgba(255,255,255,.08)",

        boxShadow:
          "0 30px 80px rgba(0,0,0,.45)",

        zIndex: 9999,
      }}
    >
      <Typography
        sx={{
          color: "#38BDF8",

          fontWeight: 700,

          mb: 3,

          letterSpacing: 2,
        }}
      >
        FEATURED DESTINATIONS
      </Typography>

      <Grid
        container
        spacing={3}
      >
        <Grid size={6}>
          <DestinationPreviewCard
            title="Mallorca"
            image={mallorca}
          />
        </Grid>

        <Grid size={6}>
          <DestinationPreviewCard
            title="Menorca"
            image={menorca}
          />
        </Grid>

        <Grid size={6}>
          <DestinationPreviewCard
            title="Lanzarote"
            image={lanzarote}
          />
        </Grid>

        <Grid size={6}>
          <DestinationPreviewCard
            title="San Sebastián"
            image={sanSebastian}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 4,

          pt: 3,

          borderTop:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <Typography
          sx={{
            color:
              "rgba(255,255,255,.8)",
          }}
        >
          Explore destinations selected by
          Horizon's sustainability and
          traveler preference engine.
        </Typography>
      </Box>
    </Paper>
  );
};

export default MegaMenu;