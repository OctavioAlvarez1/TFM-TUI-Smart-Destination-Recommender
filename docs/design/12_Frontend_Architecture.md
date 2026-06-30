# Frontend Architecture

Document 12 – Frontend Architecture
Horizon — Smart Destination Recommender
Version 1.0

## 1. Overview

The Horizon frontend is a React 19 single-page application (SPA) built with TypeScript and Vite. It provides the user-facing interface for the Smart Destination Recommender, connecting to the FastAPI backend at `http://localhost:8000`.

Key characteristics:
- Single-page application with page-state router (no React Router dependency)
- Full dark/light mode support via Material UI v9 theme system
- Responsive design with animated transitions using Framer Motion
- Interactive map powered by Leaflet with CartoCDN tile layers
- Connects to FastAPI at `localhost:8000`; dev server runs at `localhost:5173`


## 2. Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI component framework |
| TypeScript | Latest | Type safety across the entire frontend |
| Vite | Latest | Build tool and dev server |
| Material UI | v9 | Component library and theme system |
| Framer Motion | Latest | Animated transitions and interactive elements |
| Leaflet / React-Leaflet | Latest | Interactive destination map |
| Axios | Latest | HTTP client for API communication |


## 3. Page Router

The frontend uses no React Router. Instead, `App.tsx` manages a `page` state variable that controls which page component renders.

```typescript
const [page, setPage] = useState<"home" | "insights" | "analytics" | "about">("home");
```

Navigation is handled via the `MegaMenu` in the `Header` component, which calls `setPage` with the target page name.

Pages:
- `home` — Destinations / main search page
- `insights` — Congestion and seasonality analysis
- `analytics` — Governance dashboard
- `about` — Project context and architecture overview


## 4. State Management

Global state is minimal and lives in `App.tsx`. No Redux or external state library is needed.

| State variable | Type | Purpose |
|----------------|------|---------|
| `page` | string | Controls which page is rendered |
| `recommendations` | `Recommendation[]` | Results from the last POST /recommendations call |
| `activeMonth` | number | Month selected by the user (1–12) |

Both `recommendations` and `activeMonth` are passed as props to the pages that need them. The Insights page uses both to highlight the user's searched destinations on the map and heatmap.


## 5. The Four Pages

### Destinations (Home) — `pages/Home.tsx`

The main search and results page.

Components:
- `HeroSection` — Full-width hero with tagline
- `SearchBarHero` — Inputs for user ID, travel month (1–12), and top-N results count; triggers POST /recommendations on submit
- `FeatureSection` — Describes the platform's key differentiators
- `DestinationShowcase` — Static showcase of featured destinations
- `KpiDashboard` — Appears after a search; shows summary metrics (avg score, avg sustainability, avg congestion, destinations shown)
- `RecommendationGrid` → `RecommendationCard` × N — One card per recommended destination, each showing name, score, explanation text, and three badges (Sustainability, Confidence, Congestion)

### Insights — `pages/Insights.tsx`

Seasonality and congestion analysis page.

Components:
- `StatCard` × 4 — High-level statistics (e.g., destinations monitored, peak congestion month)
- `DestinationMap` — Leaflet map of Spain with destination markers; highlights searched destinations when `recommendations` is set
- `LowSeasonCard` × N — Cards surfacing low-congestion months per destination (Low Season Optimizer)
- `CongestionHeatmap` — Month × destination grid showing congestion intensity; highlights the user's `activeMonth`
- `ScenarioCard` × 3 — Demand redistribution scenarios showing what happens when tourists are redirected from overcrowded to alternative destinations

### Analytics — `pages/Analytics.tsx`

Governance dashboard (Layer 5 of the 5-layer architecture). All sections are driven by `selectedMonth` state (1–12).

Components:
- **Hero** — Glassmorphism KPI stat cards (destinations monitored, traveler profiles, high-congestion months, destinations at risk) overlaid on a dark gradient. SVG area chart at the bottom shows the redistribution penalty curve across the year.
- **MonthlyChart** — Clickable bar chart; clicking a month bar calls `setSelectedMonth`. Selected bar renders at full opacity with a glow; others at 32% opacity.
- **DestinationBars** — Heat tile grid sorted by `sustainability × (1 − congestion/100)` for the selected month. Sidebar filter column (All / Beach / City / Nature / Mixed) with count badges. Tiles animate reorder via Framer Motion `layout` prop when month or filter changes.
- **Status breakdown** — Animated count cards for Overloaded / High Pressure / Moderate / Opportunity. Status computed dynamically via `getStatusForMonth(dest, selectedMonth)`. Re-animates on month change using `key={${statusKey}-${selectedMonth}}` pattern.
- **Destination table** — Month-aware monitoring table; congestion score and status badge update per `selectedMonth`. Filterable by status chip.

### About — `pages/About.tsx`

Project context and technical reference page.

Components:
- Challenge cards — Cards describing the overtourism problem and TUI's approach
- Animated formula bars — Visual representation of the scoring formula weights (Preference 45%, Sustainability 25%, Popularity 15%, Congestion 15%)
- `LayerCard` × 5 — One card per layer of the 5-layer architecture (Data, Engine, Scoring, Explainability, Dashboard)
- Scope section — Project boundaries and roadmap summary

### ChatWidget — `components/chat/ChatWidget.tsx`

A floating MUI `Fab` button fixed to the bottom-right corner of the screen. Present on all pages (rendered in `MainLayout`, outside the page slot). Clicking the button opens a 380px-wide MUI `Drawer` with a full conversation UI.

Behaviour:
- Sends messages to `POST /chat` with the full conversation `history`
- Displays a "Buscando destinos…" spinner while waiting for a response
- **Enter** submits the message; **Shift+Enter** inserts a newline
- Degrades gracefully if the backend lacks an `OPENAI_API_KEY` — shows the fallback reply from the server without crashing


## 6. Component Hierarchy

```
App.tsx
├── ThemeProvider.tsx
└── MainLayout
    ├── Header
    │   ├── ThemeToggle
    │   └── MegaMenu (navigation links)
    ├── [active page]
    │   ├── Home.tsx
    │   │   ├── HeroSection
    │   │   ├── SearchBarHero
    │   │   ├── FeatureSection
    │   │   ├── DestinationShowcase
    │   │   ├── KpiDashboard
    │   │   └── RecommendationGrid
    │   │       └── RecommendationCard × N
    │   │           ├── SustainabilityBadge
    │   │           ├── ConfidenceBadge
    │   │           └── CongestionBadge
    │   ├── Insights.tsx
    │   │   ├── StatCard × 4
    │   │   ├── DestinationMap (Leaflet)
    │   │   ├── LowSeasonCard × N
    │   │   ├── CongestionHeatmap
    │   │   └── ScenarioCard × 3
    │   ├── Analytics.tsx
    │   │   ├── Hero (glassmorphism KPI cards + SVG area chart)
    │   │   ├── MonthlyChart (interactive, controls selectedMonth)
    │   │   ├── DestinationBars (heat tiles + sidebar type filter)
    │   │   ├── Status breakdown (month-aware animated counts)
    │   │   └── Destination table (month-aware, status filter)
    │   └── About.tsx
    │       ├── Challenge cards
    │       ├── Formula bars
    │       ├── LayerCard × 5
    │       └── Scope section
    ├── ChatWidget (floating Fab — rendered on all pages)
    │   └── Drawer (380px, conversation UI)
    │       ├── Message history list
    │       ├── "Buscando destinos…" spinner (during API call)
    │       └── TextField (Enter to send · Shift+Enter for newline)
    └── Footer
```


## 7. Theme System

### Provider

`frontend/src/theme/ThemeProvider.tsx` wraps the application and exposes a `useThemeContext()` hook. The selected mode (`"dark"` or `"light"`) is persisted in `localStorage` under the key `horizon-theme`.

### Theme Files

- `darkTheme.ts` — `background.default: #0B1220`, `background.paper: #111827`
- `lightTheme.ts` — Standard MUI light palette

### Color Rules

All color values must use MUI theme tokens in `sx` props. Hardcoded hex values are never used in `sx`.

| Use case | Correct token |
|----------|---------------|
| Primary text | `color: "text.primary"` |
| Secondary text | `color: "text.secondary"` |
| Borders | `border: "1px solid"` + `borderColor: "divider"` |
| Card backgrounds | `bgcolor: "background.paper"` |
| Page background | `bgcolor: "background.default"` |

For inline `style` props (not `sx`), a conditional is required:

```tsx
const { palette: { mode } } = useTheme();
const dark = mode === "dark";

<element style={{ color: dark ? "#F1F5F9" : "#0F172A" }} />
```

Note: `InputProps` is deprecated in MUI v9. Use `slotProps` instead:
```tsx
<TextField slotProps={{ input: { startAdornment: ... }, htmlInput: { min: 1 } }} />
```


## 8. Map Integration

`frontend/src/components/map/DestinationMap.tsx` uses React-Leaflet to render an interactive map of Spain.

**Tile Layer Switching**

CartoCDN tile URLs are switched based on the current theme mode:

- Light mode: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
- Dark mode: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`

The component listens to the theme context and updates the tile layer URL whenever the user toggles between dark and light mode.

**Destination Markers**

Each destination has a map marker. When `recommendations` props are populated (after a search), markers for recommended destinations are highlighted to show the user where their results are located geographically.


## 9. API Client

`frontend/src/api/recommendationApi.ts` wraps all HTTP calls using Axios. The base URL is `http://localhost:8000`.

Endpoints used:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/recommendations` | Submit user ID, month, and top-N to get ranked destinations |
| GET | `/users/{id}` | Fetch user profile for display |
| POST | `/chat` | Send a message and conversation history; receive an AI-generated reply from the RAG chatbot |

The API client handles request/response typing using the interfaces defined in `recommendation.ts`.


## 10. TypeScript Types

`frontend/src/types/recommendation.ts` defines the TypeScript interfaces that match the FastAPI response shape.

Key interfaces:

```typescript
interface Recommendation {
  destination_id: string;
  destination_name: string;
  final_score: number;
  preference_score: number;
  sustainability_score: number;
  popularity_score: number;
  congestion_score: number;
  confidence_score: number;
  explanation: string;
  sustainability_category: "Excellent" | "Good" | "Moderate" | "Poor";
}

interface RecommendationResponse {
  user_id: string;
  month: number;
  recommendations: Recommendation[];
}
```

These types ensure that all component props and API responses are fully typed, catching shape mismatches at compile time via `npm run build`.
