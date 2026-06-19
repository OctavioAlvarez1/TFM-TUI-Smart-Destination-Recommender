# TUI Care Foundation — Future Shapers Spain
## Proyecto TFM — Universidad Complutense de Madrid
### Reto 2: Motor de Recomendaciones con IA & Redistribución de Demanda

---

## 1. Contexto Organizacional

**TUI Group** es la multinacional líder en turismo global:
- 34.7M clientes en 180 países
- 400 hoteles, 17 cruceros, 1,200+ agencias
- +90,000 empleados
- Revenue 2019: €18.9B / 2023: €20.7B
- 10M interacciones digitales, tours activados por IA

**TUI Care Foundation → target 8.9** es el brazo de innovación abierta de TUI. Se dedica a identificar problemas de medioambiente, empleo y tecnología que beneficien al grupo. El nombre "8.9" refiere al ODS 8.9 de la ONU: turismo sostenible que genere empleo digno.

**Future Shapers Spain** = programa de TUI + Telefónica para encontrar soluciones tecnológicas a los problemas de over-tourism. Trabajan con universidades (UCM entre ellas) para que los TFM se conviertan en soluciones reales con impacto empresarial.

---

## 2. El Problema Principal: Over-Tourism en España

España recibe **casi 100 millones de turistas** al año — está en el top mundial.

**Datos clave:**
- 134.7 Billion Euros de impacto económico
- 13% del PIB nacional
- 3 millones de empleos directos (14% del empleo total)
- 96.8M turistas internacionales

### Los 3 problemas que genera este flujo:

### 2.1 Temporalidad (Demand Asymmetry)
Asimetría de la demanda: segmento muy grande de gente que va a España entre julio y agosto.
Como si fuesen 25 millones de personas yendo a la vez, además de la demanda interna del país.
→ Genera concentración que necesita ser redistribuida.

### 2.2 Concentración Espacial (Hotspot Saturation)
**85% de los turistas visita solo el 10% de los destinos.**
Concentración geográfica en la costa. Mallorca al 40% de capacidad en algunos meses.
Hay una "España vacía" — zonas espectaculares desaprovechadas y desconocidas.
El resto de España está desaprovechada.

### 2.3 Fugas Económicas (Economic Leakages / Value Capturing)
134.7 Billion Euros generados, pero el valor no llega a las PyMEs pequeñas.
Ejemplo: tiendas de dulces en Tenerife, vinos locales — cosas únicas que el turista no conoce porque no tiene el posicionamiento ni es parte de la ruta de integración donde va la gente.
Los turistas van a las playas y resorts, no a los lugares a 35km.
→ Fuga de valor que la IA podría capturar para redirigir hacia esos lugares.

---

## 3. Los 4 Retos — Nosotros elegimos el Reto 2

### Reto 1: Monitor de Ofertas Experienciales & Tendencias de Sentimiento generado por IA
- Problema: escasa visibilidad sobre lo que realmente quieren los viajeros, info fragmentada
- Objetivo: plataforma centralizada para analizar info de redes sociales, reseñas, foros
- Fuentes: Instagram, TikTok, Reddit, TripAdvisor, Google Reviews, Trip.com, foros de viajes, contenido generado por IA (Gemini, Claude, Perplexity), medios digitales, portales turísticos
- Ideal para: NLP, análisis de sentimientos, modelos generativos, minería de datos

### ⭐ Reto 2: Motor de Recomendaciones con IA & Redistribución de Demanda (EL NUESTRO)
Ver sección 4 para detalle completo.

### Reto 3: AI-Dashboard para Gestión Oferta Turística Georreferenciada & Integración con Datos Abiertos
- Dashboard con Power BI, Tableau, Streamlit con mapas interactivos
- Filtros por zona, tipo de actividad, categoría turística, nivel de congestión, sostenibilidad, temporalidad, mercado emisor
- Métricas: densidad turística, concentración espacial, accesibilidad por transporte, sentimiento promedio, volumen de reseñas, huella de demanda, zonas infrautilizadas, índice de congestión, crecimiento de oferta, cobertura ESG, estacionalidad, niveles de producto, oportunidades de inversión
- Ideal para: business intelligence, analítica avanzada, planificación turística

### Reto 4: Generador de Mapas de Accesibilidad & Movilidad Sostenible con IA
- Mapas: Mapbox, Kepler.gl, Streamlit, Power BI, Tableau con filtros
- Métricas: tiempo de acceso, distancias, conectividad con transporte público, cobertura peatonal, emisiones evitadas, accesibilidad universal, densidad de oferta, sentimiento sobre movilidad, seguridad percibida, brechas de infraestructura
- Ideal para: sistemas de información geográfica, análisis espacial, smart destinations

---

## 4. Reto 2 — Detalle Completo

### 4.1 El Problema
La mayoría de los sistemas de recomendación están diseñados para maximizar la satisfacción del usuario = mostrar lo que tiene más probabilidad de gustarte.

Esto funciona muy bien para vender más, pero provoca que 1,000,000 de personas terminen visitando los mismos lugares → masificación, saturación de infraestructuras, concentración de beneficios económicos en pocas zonas.

**La pregunta central:** ¿Podemos usar la IA para recomendar experiencias atractivas para el viajero Y al mismo tiempo distribuir mejor la demanda turística?

**Ejemplo concreto del documento:** Un visitante interesado en patrimonio cultural y gastronomía local que quiere visitar Sevilla. En lugar de recomendarle únicamente los lugares más conocidos, el sistema podría identificar destinos alternativos más pequeños y menos conocidos que encajen perfectamente con sus intereses y que soporten mucha menos presión turística.

### 4.2 Objetivos del Reto 2
- Motor de recomendación turístico impulsado por IA
- Personalización de experiencias según intereses y contexto del destino
- Integración de criterios de sostenibilidad en las recomendaciones
- **Redistribución inteligente de los flujos turísticos**
- Promoción de destinos alternativos y zonas menos saturadas
- **Impulso de temporadas bajas y medias**

### 4.3 Fuentes de Datos Esperadas
- Reservas históricas / perfiles de usuarios / comportamientos de compra
- Puntuaciones de congestión, rutas, mapas de destinos
- Datos meteorológicos, eventos locales, festivales
- Reseñas, sentimientos, comentarios de viajeros
- Expectativas de ocupación (hotelera)
- Tiempos de transporte

### 4.4 Resultado Esperado
- **Motor de recomendación funcional**
- **Herramientas para visualizar y simular el impacto de las recomendaciones sobre el territorio**
- Métricas clave:
  - Redistribución geográfica de la demanda
  - Reducción de la concentración turística
  - Satisfacción prevista de los usuarios
  - Capacidad para impulsar zonas menos visitadas

### 4.5 Arquitectura de 5 Capas del Sistema

```
Layer 5 — Governance (Control Panel)
  Panel de control que establece reglas, supervisa recomendaciones,
  capacidad de carga y sostenibilidad por zona/destino.

Layer 4 — Personalization (The Interface)
  "Invisible interface" — conversational, usa el contexto del usuario,
  no dice "este destino está lleno", sino que fluye naturalmente.

Layer 3 — Intervention Triggers (The Action)
  Automatización de cuándo activar recomendaciones alternativas,
  supervisa intervenciones, ajusta en tiempo real.

Layer 2 — Prediction Engine (The Intelligence)
  Motor de predicción e inteligencia. Usamos diferentes modelos
  para plantear soluciones. Aquí está nuestro scoring engine.

Layer 1 — Unified Ingestion (The Foundation)
  Consolida datos open source + datos sintéticos.
  Consolida: datos de ocupación, IoT, sensores de demanda, etc.
```

### 4.6 Fórmula de Scoring (Implementada)
```
Final Score = 0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion
```
Business Rules:
- Sustainability > 85 → +5% boost
- Sustainability < 50 → -10% penalty
- Congestion < 40 → +5% boost
- Congestion > 80 → -10% penalty

---

## 5. Estrategia de Datos

### 5.1 Por qué NO podemos usar datos de TUI directamente
TUI es empresa **cotizada (listed company)**. El tema de datos de clientes es super complejo y no nos lo pueden pasar por regulación y compliance.

### 5.2 Los datos sintéticos son emulación
Los datos sintéticos que tenemos son una emulación, pero no tienen la calidad de datos reales. Por eso buscan que usemos datos abiertos.

### 5.3 Lo que TUI nos pide: MAXIMIZAR DATOS ABIERTOS
**"Lo que buscan es que nosotros utilicemos al máximo los datos abiertos que existen en línea."**
Esto es de categoría mandatoria desde el principio.

### 5.4 Lo que hicieron otros participantes
Los participantes del año pasado **agarraron datos de Booking u otras plataformas similares.**
→ Nota: España tiene regulación importante con tratamiento de datos y hay multas grandes. Booking/Airbnb no tienen APIs abiertas — sus ToS prohíben scraping. Usar datos sintéticos como emulación + fuentes open data oficiales es el enfoque correcto y seguro.

### 5.5 Fuentes Open Data

| Fuente | Dato | Estado |
|--------|------|--------|
| INE — Encuesta Ocupación Hotelera | Pernoctaciones y ocupación mensual por destino/provincia | ✅ Integrado — `fetch_open_data.py` |
| FRONTUR (via INE) | Llegadas turistas internacionales por mes y origen | ✅ Integrado — `fetch_open_data.py` |
| AEMET Open Data | Datos meteorológicos por provincia (afecta temporalidad) | ✅ Disponible — requiere `AEMET_API_KEY` env var |
| datos.gob.es | Portal open data Gobierno de España | No integrado |
| Eurostat | Estadísticas turismo UE | No integrado |
| OpenStreetMap / Overpass API | Densidad de alojamientos, POIs por zona | No integrado |

**Seguridad:** La clave AEMET nunca debe hardcodearse. Usar exclusivamente `export AEMET_API_KEY=...`.

---

## 6. Ejemplos de Startups en el Espacio

### Generative AI Startups (Planning & Communication)
- **Mindtrip** — conversational AI for travel itineraries (chat-based)
- **Narrativ, n1/ai, Elivity, apply.ai** — marketing, planning, content

### Map-based Startups (De-Seasonation & Decentralization)
- **Weekender** — map-based travel planning unique to each user
- **Explorar** — another map-based tool
- **Wanderlog** — trip planning maps

### Dashboard de Referencia: SYNERGIA
Dashboard de ejemplo que muestran en el documento:
- Real-time destination pulse (mapa con métricas por zona)
- Predictive intelligence & Social Licence (predicción de tendencias)
- Economic Equity & Governance Controls (distribución gasto turístico)
- Risk Level indicator + Intervention triggers ("Activate Hard Caps")

---

## 7. Qué NO es este proyecto

- **No es solo académico** — TUI quiere soluciones reales que puedan servir a empresas
- **No es solo tecnología** — requiere impacto demostrable en redistribución de demanda
- El entregable debería poder pasarse al **Departamento de Innovación o al Departamento de Datos de TUI**
- **Retos 1, 3 y 4 están fuera del alcance** — el sistema se enfoca exclusivamente en Reto 2

---

## 8. Estado Actual del Sistema (junio 2026)

### ✅ Backend

| Módulo | Archivo | Estado |
|--------|---------|--------|
| FastAPI server | `src/api/app.py` | ✅ Completo |
| Pydantic models | `src/api/models.py` | ✅ Completo |
| Recommendation engine (orchestrator) | `src/recommendation/recommendation_engine.py` | ✅ Completo |
| Preference scoring | `src/recommendation/scoring.py` | ✅ Completo |
| Sustainability engine | `src/recommendation/sustainability.py` | ✅ Completo |
| Popularity engine | `src/recommendation/popularity.py` | ✅ Completo |
| Congestion engine | `src/recommendation/congestion.py` | ✅ Completo |
| Confidence calculator | `src/recommendation/confidence.py` | ✅ Completo |
| Explainability generator | `src/explainability/explainability.py` | ✅ Completo |
| Data loader | `src/data/data_loader.py` | ✅ Completo |
| Open data fetch script | `data/scripts/fetch_open_data.py` | ✅ INE + FRONTUR + AEMET |
| Streamlit alternative UI | `src/dashboard/app.py` | ✅ Completo |
| Pytest suite | `tests/` | ✅ Un archivo por módulo |

### ✅ Frontend (React 19 + TypeScript + MUI v9)

| Página / Componente | Descripción | Estado |
|---------------------|-------------|--------|
| **Destinations (Home)** | Búsqueda, ranking de recomendaciones, KPI dashboard con redistribución banner | ✅ Completo |
| **Insights** | Mapa de España (Leaflet), Low Season Optimizer, heatmap mensual, escenarios redistribución | ✅ Completo |
| **Analytics** | Dashboard de gobernanza — destinos penalizados por mes, distribución julio, tabla filtreable | ✅ Completo |
| **About** | Contexto del proyecto, fórmula de scoring animada, arquitectura de 5 capas, scope | ✅ Completo |
| Dark / Light mode | Toggle en header, persiste en localStorage, aplicado a todos los componentes | ✅ Completo |
| Mapa interactivo | Leaflet + CartoCDN (tiles cambian con dark/light mode) | ✅ Completo |
| Recommendation cards | Score breakdown, badges de sustainability/confidence/congestion, best months chips | ✅ Completo |

### ✅ Documentación

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Quick start, estructura del proyecto, API reference, SDG 8.9 alignment |
| `CLAUDE.md` | Guía para Claude Code — comandos, arquitectura, patrones MUI v9 dark mode |
| `docs/PROJECT_CONTEXT.md` | Este archivo — contexto del reto y estado completo del sistema |
| `docs/ARCHITECTURE.md` | Arquitectura completa con diagramas ASCII, 5 capas, data flow end-to-end |
| `docs/API_REFERENCE.md` | Spec completo de los 3 endpoints REST con ejemplos cURL/JS/Python |
| `docs/USER_MANUAL.md` | Manual de usuario completo — 10 secciones, guía de scores, troubleshooting |

---

## 9. Implementación de las 5 Capas (mapeada al código)

| Capa | Nombre | Implementación en Horizon |
|------|--------|--------------------------|
| **L1** | Unified Ingestion | `data/raw/` CSVs + `fetch_open_data.py` → INE EOH (tabla 49371) + FRONTUR (tabla 23988) |
| **L2** | Prediction Engine | `src/recommendation/` — 5 módulos de scoring + confidence + explainability |
| **L3** | Intervention Triggers | Congestion penalty (>80 → −10%) y boost (<40 → +5%) en `scoring.py` |
| **L4** | Personalization | Preference scoring + explicaciones en lenguaje natural por recomendación |
| **L5** | Governance | Página Analytics — destinos penalizados por mes, tabla de estado, KPIs del sistema |

---

## 10. Gap Analysis Actualizado

### ✅ Gaps originales — todos resueltos

| Gap original | Solución implementada |
|---|---|
| Redistribución invisible en la UI | Banner de redistribución en Home + Analytics page + escenarios en Insights |
| Solo datos sintéticos | INE EOH + FRONTUR integrados via `fetch_open_data.py` |
| Sin visualización territorial | Mapa Leaflet + heatmap mensual + Low Season Optimizer en Insights |
| Perfil de usuario no visible | Chips en SearchBar muestran travel_style, budget, eco preference, país, edad |
| Sin estacionalidad visible | Heatmap 12 meses × 20 destinos + Low Season cards con delta de congestión |
| Sin métricas de redistribución | Analytics: destinos penalizados por mes + breakdown de estado |
| Menú sin contenido | 4 páginas completamente implementadas |

### ⚠️ Fuera del alcance de Reto 2
- Datos de reseñas / sentimiento → Reto 1
- Mapas de accesibilidad / movilidad → Reto 4
- Dashboard georreferenciado tipo Power BI → Reto 3

### 🔧 Posibles mejoras post-TFM
- Ejecutar `fetch_open_data.py` con `AEMET_API_KEY` para refinar estacionalidad por clima
- Expandir de 20 a más destinos añadiendo filas a los CSV
- Añadir filtros de travel_style y budget directamente en la búsqueda
