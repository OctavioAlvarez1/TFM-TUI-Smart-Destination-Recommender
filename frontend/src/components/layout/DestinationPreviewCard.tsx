import {
  Box,
  Typography,
} from "@mui/material";

interface DestinationPreviewCardProps {
  title: string;
  image: string;
}

const DestinationPreviewCard = ({
  title,
  image,
}: DestinationPreviewCardProps) => {
  return (
    <Box
      sx={{
        position: "relative",

        height: 180,

        borderRadius: 4,

        overflow: "hidden",

        cursor: "pointer",

        transition: "all .3s ease",

        "&:hover": {
          transform:
            "translateY(-6px) scale(1.02)",
        },

        "&:hover img": {
          transform: "scale(1.08)",
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",

          transition:
            "transform .5s ease",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,

          background:
            "linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.1))",
        }}
      />

      <Typography
        sx={{
          position: "absolute",

          bottom: 16,
          left: 16,

          color: "#FFF",

          fontWeight: 700,

          fontSize: "1.1rem",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default DestinationPreviewCard;