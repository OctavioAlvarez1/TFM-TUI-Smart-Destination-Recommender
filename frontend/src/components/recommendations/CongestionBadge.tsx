import Chip from "@mui/material/Chip";

interface CongestionBadgeProps {
  congestion: number;
}

const CongestionBadge = ({
  congestion,
}: CongestionBadgeProps) => {
  const label =
    congestion < 30
      ? "Low"
      : congestion < 70
      ? "Medium"
      : "High";

  const color =
    congestion < 30
      ? "success"
      : congestion < 70
      ? "warning"
      : "error";

  return (
    <Chip
      size="small"
      color={color}
      label={`🚦 ${label}`}
    />
  );
};

export default CongestionBadge;