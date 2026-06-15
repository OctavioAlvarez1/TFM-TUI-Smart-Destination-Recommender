import Chip from "@mui/material/Chip";

interface SustainabilityBadgeProps {
  score: number;
}

const SustainabilityBadge = ({
  score,
}: SustainabilityBadgeProps) => {
  const color =
    score >= 80
      ? "success"
      : score >= 60
      ? "warning"
      : "error";

  return (
    <Chip
      size="small"
      color={color}
      label={`🌱 Sustainability ${score}`}
    />
  );
};

export default SustainabilityBadge;