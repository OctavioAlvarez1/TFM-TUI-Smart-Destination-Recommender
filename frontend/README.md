# Horizon — Frontend

React 19 + TypeScript + Vite + Material UI v9 single-page application for the **TUI Smart Destination Recommender**.

Horizon helps travelers discover sustainable, less-congested destinations in Spain by surfacing AI-ranked recommendations based on user preferences, sustainability scores, and real tourism congestion data from INE.

---

## Pages

| Page | Description |
|---|---|
| **Home** | Search form, ranked recommendation results, KPI dashboard |
| **Insights** | Congestion map (Leaflet), Low Season Optimizer, monthly heatmap, redistribution scenarios |
| **Analytics** | Governance dashboard — penalised destinations, status breakdown, full destination table |
| **About** | Project context, scoring formula, system architecture, project scope |

---

## Key Components

- **ChatWidget** (`components/chat/ChatWidget.tsx`) — RAG-powered floating chat assistant. Floating Fab button opens a Drawer with a full conversation UI backed by `POST /chat` on the FastAPI backend (FAISS + GPT-4o-mini). Present on all pages.
- **DestinationMap** (`components/map/DestinationMap.tsx`) — Leaflet map with CartoCDN tiles. Switches between `light_all` and `dark_all` tile layers to match the active theme.
- **RecommendationCard** (`components/recommendations/`) — displays destination name, scores, sustainability badge, congestion badge, confidence badge, and AI-generated explanation.
- **KpiDashboard** (`components/dashboard/KpiDashboard.tsx`) — summary metrics panel rendered after a successful search.
- **SearchBarHero** (`components/home/`) — travel style selector, month picker, user ID input.

---

## Quick Start

```bash
# From the frontend/ directory
npm install
npm run dev
```

Dev server starts at **http://localhost:5173**.

The app expects the FastAPI backend running at `http://localhost:8000`. Start the backend first:

```bash
# From the project root
python -m uvicorn src.api.app:app --reload --port 8000
```

Or use Docker to start both services together (see Docker section below).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR at localhost:5173 |
| `npm run build` | TypeScript type-check + production Vite build |
| `npm run lint` | ESLint across all `.ts` / `.tsx` files |
| `npm run preview` | Serve the production build locally for inspection |

---

## Environment

| Dependency | Version |
|---|---|
| React | 19 |
| TypeScript | 5.x |
| Vite | 6.x |
| Material UI | v9 |
| Leaflet / react-leaflet | 4.x |
| Axios | 1.x |

The frontend communicates exclusively with the FastAPI backend at `http://localhost:8000`. CORS is configured on the backend to allow `localhost:5173`.

No frontend environment variables are required for local development.

---

## Docker

The frontend is containerized via `Dockerfile.frontend` (Node build stage + Nginx serving stage). Nginx configuration is in `nginx.conf` at the project root.

To run the full stack (backend + frontend) with Docker:

```bash
# From the project root
docker compose up --build
```

Frontend is served at **http://localhost:80**.

---

## Architecture Notes

- **Page routing**: no React Router — page state is managed in `App.tsx` via a `page` string prop passed down to `MainLayout`.
- **State sharing**: `activeMonth` and `recommendations` live in `App.tsx` and flow down as props. The Insights page uses both to highlight searched destinations on the map and heatmap.
- **Theme**: dark/light mode via `ThemeProvider.tsx` with `localStorage` persistence. All colors use MUI theme tokens (`text.primary`, `divider`, etc.) — no hardcoded hex values in `sx` props.
- **MUI v9**: `InputProps` is deprecated — use `slotProps={{ input: {}, htmlInput: {} }}` instead.
