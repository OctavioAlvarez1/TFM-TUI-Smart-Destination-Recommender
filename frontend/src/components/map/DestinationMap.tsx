// Interactive Leaflet map of Spain's 20 monitored destinations.
// Circle markers are sized and coloured by congestion level for the selected month.
// Switches between CartoCDN light_all and dark_all tile layers based on theme.
// Recommended destinations (if a search was run) are highlighted at full opacity.
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import L from "leaflet";

// Fix default marker icon paths broken by Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Destination data with coordinates ───────────────────
export interface MapDestination {
  id: string;
  name: string;
  type: string;
  region: string;
  lat: number;
  lng: number;
  monthly: number[];
}

const DESTINATIONS: MapDestination[] = [
  { id: "D001", name: "Mallorca",        type: "Beach",  region: "Balearic Islands",    lat: 39.695,  lng: 2.998,   monthly: [] },
  { id: "D002", name: "Ibiza",           type: "Beach",  region: "Balearic Islands",    lat: 38.907,  lng: 1.421,   monthly: [] },
  { id: "D003", name: "Menorca",         type: "Beach",  region: "Balearic Islands",    lat: 39.950,  lng: 4.112,   monthly: [] },
  { id: "D004", name: "Tenerife",        type: "Mixed",  region: "Canary Islands",      lat: 28.292,  lng: -16.629, monthly: [] },
  { id: "D005", name: "Gran Canaria",    type: "Mixed",  region: "Canary Islands",      lat: 27.920,  lng: -15.547, monthly: [] },
  { id: "D006", name: "Lanzarote",       type: "Nature", region: "Canary Islands",      lat: 28.963,  lng: -13.550, monthly: [] },
  { id: "D007", name: "Costa del Sol",   type: "Beach",  region: "Andalusia",           lat: 36.530,  lng: -4.723,  monthly: [] },
  { id: "D008", name: "Marbella",        type: "Beach",  region: "Andalusia",           lat: 36.510,  lng: -4.882,  monthly: [] },
  { id: "D009", name: "Malaga",          type: "City",   region: "Andalusia",           lat: 36.721,  lng: -4.421,  monthly: [] },
  { id: "D010", name: "Valencia",        type: "City",   region: "Valencian Community", lat: 39.470,  lng: -0.376,  monthly: [] },
  { id: "D011", name: "Alicante",        type: "Beach",  region: "Valencian Community", lat: 38.345,  lng: -0.481,  monthly: [] },
  { id: "D012", name: "Benidorm",        type: "Beach",  region: "Valencian Community", lat: 38.535,  lng: -0.132,  monthly: [] },
  { id: "D013", name: "Barcelona",       type: "City",   region: "Catalonia",           lat: 41.385,  lng: 2.173,   monthly: [] },
  { id: "D014", name: "Madrid",          type: "City",   region: "Community of Madrid", lat: 40.417,  lng: -3.704,  monthly: [] },
  { id: "D015", name: "Seville",         type: "City",   region: "Andalusia",           lat: 37.389,  lng: -5.985,  monthly: [] },
  { id: "D016", name: "Granada",         type: "City",   region: "Andalusia",           lat: 37.177,  lng: -3.599,  monthly: [] },
  { id: "D017", name: "Bilbao",          type: "City",   region: "Basque Country",      lat: 43.263,  lng: -2.935,  monthly: [] },
  { id: "D018", name: "San Sebastian",   type: "Mixed",  region: "Basque Country",      lat: 43.318,  lng: -1.981,  monthly: [] },
  { id: "D019", name: "Picos de Europa", type: "Nature", region: "Asturias",            lat: 43.194,  lng: -4.845,  monthly: [] },
  { id: "D020", name: "Sierra Nevada",   type: "Nature", region: "Andalusia",           lat: 37.104,  lng: -3.391,  monthly: [] },
];

// Monthly congestion from real INE EOH data (matches congestion_scores.csv)
const MONTHLY_SCORES: Record<string, number[]> = {
  D001: [12, 16, 25, 47, 89, 98, 100, 100, 95, 70, 15, 13],
  D002: [10, 14, 22, 42, 80, 88, 100, 100, 85, 63, 13, 11],
  D003: [7,  10, 16, 30, 57, 63, 83, 88, 67, 45, 9,  8],
  D004: [59, 65, 61, 57, 62, 71, 87, 92, 77, 72, 66, 77],
  D005: [57, 62, 58, 54, 59, 68, 83, 88, 73, 69, 63, 73],
  D006: [43, 47, 44, 41, 44, 51, 62, 66, 55, 52, 47, 55],
  D007: [14, 18, 29, 54, 102, 113, 115, 115, 109, 80, 17, 15],
  D008: [11, 14, 23, 43, 82, 90, 92, 92, 87, 64, 14, 12],
  D009: [59, 58, 68, 82, 89, 77, 64, 58, 73, 82, 68, 57],
  D010: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D011: [19, 25, 36, 63, 103, 113, 118, 118, 111, 82, 22, 17],
  D012: [25, 32, 46, 80, 131, 144, 150, 150, 141, 105, 28, 22],
  D013: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D014: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D015: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D016: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D017: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D018: [55, 59, 66, 74, 82, 84, 88, 88, 79, 84, 64, 59],
  D019: [28, 30, 36, 44, 49, 55, 66, 72, 58, 48, 37, 33],
  D020: [14, 15, 18, 22, 25, 28, 33, 36, 29, 24, 18, 17],
};

// ── Colour helpers ───────────────────────────────────────
const LEVEL_COLOR = (score: number) => {
  if (score <= 30) return { fill: "#16A34A", stroke: "#15803D" };
  if (score <= 60) return { fill: "#CA8A04", stroke: "#A16207" };
  if (score <= 80) return { fill: "#EA580C", stroke: "#C2410C" };
  return { fill: "#DC2626", stroke: "#B91C1C" };
};

const levelLabel = (score: number) => {
  if (score <= 30) return "Low";
  if (score <= 60) return "Moderate";
  if (score <= 80) return "High";
  return "Very High";
};

const TYPE_COLOR: Record<string, string> = {
  Beach: "#38BDF8", City: "#818CF8", Nature: "#34D399", Mixed: "#FBBF24",
};

// ── Auto-fit Spain bounds ────────────────────────────────
function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([[27.6, -18.2], [43.8, 4.4]], { padding: [24, 24] });
  }, [map]);
  return null;
}

// ── Main component ───────────────────────────────────────
interface DestinationMapProps {
  activeMonth: number | null;
  recommendedIds?: string[];
}

const DestinationMap = ({ activeMonth, recommendedIds }: DestinationMapProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const month = activeMonth ?? 7;

  return (
    <Box sx={{ borderRadius: "20px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
      {/* Map */}
      <MapContainer
        center={[40.0, -3.5]}
        zoom={5}
        style={{ height: 480, width: "100%", background: dark ? "#1E293B" : "#F1F5F9" }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <FitBounds />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={dark
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
        />

        {DESTINATIONS.map((dest) => {
          const scores = MONTHLY_SCORES[dest.id] ?? [];
          const score  = Math.min(100, scores[month - 1] ?? 50);
          const col    = LEVEL_COLOR(score);
          const isRec  = recommendedIds && recommendedIds.length > 0
            ? recommendedIds.includes(dest.id)
            : true;
          const radius = 6 + (score / 100) * 14;

          return (
            <CircleMarker
              key={dest.id}
              center={[dest.lat, dest.lng]}
              radius={radius}
              pathOptions={{
                fillColor: col.fill,
                fillOpacity: isRec ? 0.82 : 0.18,
                color: isRec ? col.stroke : "#94A3B8",
                weight: isRec ? 2 : 1,
              }}
            >
              <Popup>
                <Box sx={{ minWidth: 160, p: 0.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: ".9rem", color: "text.primary", mb: 0.5 }}>
                    {dest.name}
                  </Typography>
                  <Typography sx={{ fontSize: ".75rem", color: "text.secondary", mb: 1 }}>
                    {dest.region}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 0.75 }}>
                    <Chip
                      label={dest.type}
                      size="small"
                      sx={{ fontSize: ".65rem", fontWeight: 700, height: 18, bgcolor: `${TYPE_COLOR[dest.type]}22`, color: TYPE_COLOR[dest.type] }}
                    />
                    <Chip
                      label={levelLabel(score)}
                      size="small"
                      sx={{ fontSize: ".65rem", fontWeight: 700, height: 18, bgcolor: `${col.fill}22`, color: col.fill }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: ".78rem", color: "text.primary", fontWeight: 700 }}>
                    Congestion score: <span style={{ color: col.fill }}>{score}</span>/100
                  </Typography>
                  {isRec && recommendedIds && recommendedIds.length > 0 && (
                    <Typography sx={{ fontSize: ".72rem", color: "#2563EB", fontWeight: 600, mt: 0.5 }}>
                      ★ In your recommendations
                    </Typography>
                  )}
                </Box>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <Box
        sx={{
          display: "flex", alignItems: "center", flexWrap: "wrap",
          gap: 2, px: 2.5, py: 1.5,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderTopColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: ".72rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: ".1em" }}>
          Congestion
        </Typography>
        {[
          { label: "Low (≤30)",     color: "#16A34A" },
          { label: "Moderate (≤60)", color: "#CA8A04" },
          { label: "High (≤80)",    color: "#EA580C" },
          { label: "Very High (>80) — penalized", color: "#DC2626" },
        ].map((l) => (
          <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: l.color }} />
            <Typography sx={{ fontSize: ".7rem", color: "text.secondary" }}>{l.label}</Typography>
          </Box>
        ))}
        <Typography sx={{ fontSize: ".7rem", color: "text.secondary", ml: "auto" }}>
          Circle size ∝ congestion intensity · OpenStreetMap tiles
        </Typography>
      </Box>
    </Box>
  );
};

export default DestinationMap;
