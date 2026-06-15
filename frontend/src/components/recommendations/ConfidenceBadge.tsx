import Chip from "@mui/material/Chip";

interface ConfidenceBadgeProps {
  confidence: number;
}

const ConfidenceBadge = ({
  confidence,
}: ConfidenceBadgeProps) => {
  return (
    <Chip
      size="small"
      color="primary"
      label={`🎯 Confidence ${confidence.toFixed(
        1
      )}`}
    />
  );
};

export default ConfidenceBadge;