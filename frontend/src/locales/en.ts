export const en = {
  nav: {
    destinations: "Destinations",
    insights: "Insights",
    analytics: "Analytics",
    about: "About",
  },
  hero: {
    badge: "AI-POWERED SUSTAINABLE TOURISM",
    title: "Discover Better Destinations in Spain",
    subtitle:
      "Explore destinations that balance traveler satisfaction, sustainability performance and congestion management through intelligent recommendations.",
  },
  search: {
    travelerProfile: "Traveler Profile",
    travelMonth: "Travel Month",
    destinations: "Destinations",
    searchButton: "Search",
    months: [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ],
    monthsShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    budget: "budget",
    eco: "Eco",
  },
  features: {
    badge: "Built For Smart Travelers",
    heading: "AI-Powered. Sustainable.\nPersonalized.",
    subtitle:
      "Horizon combines artificial intelligence, sustainability metrics and traveler insights to recommend destinations that create better outcomes for travelers and local communities.",
    items: [
      {
        title: "Sustainability Intelligence",
        description:
          "Evaluate destinations through environmental impact indicators, sustainability scoring and responsible tourism metrics.",
      },
      {
        title: "Traveler Satisfaction",
        description:
          "Leverage traveler behavior and preference signals to identify destinations that consistently deliver exceptional experiences.",
      },
      {
        title: "Congestion Analytics",
        description:
          "Monitor tourism pressure and crowd dynamics to promote balanced destination distribution and better visitor experiences.",
      },
      {
        title: "AI Recommendation Engine",
        description:
          "Generate explainable destination recommendations by combining traveler preferences, sustainability and congestion insights.",
      },
    ],
  },
  empty: {
    title: "Ready to Discover Sustainable Destinations?",
    subtitle:
      "Generate personalized destination recommendations powered by artificial intelligence, sustainability metrics and congestion-aware travel intelligence.",
  },
  card: {
    rank: "Rank",
    matchScore: "Match Score",
    country: "Spain",
    metrics: {
      preference: "Preference",
      sustainability: "Sustainability",
      popularity: "Popularity",
      congestion: "Congestion",
    },
    whyRecommended: "Why Horizon Recommended This",
    bestMonths: "Best Months to Visit",
    bestMonthsSub: "— lowest congestion, best value",
    explanations: {
      strongMatch:            "Strong match for your {style} travel preferences.",
      goodMatch:              "Good match for your {style} travel preferences.",
      excellentSustainability:"Excellent sustainability performance.",
      goodSustainability:     "Good sustainability performance.",
      lowCongestion:          "Lower expected congestion than comparable destinations.",
      highCongestion:         "Higher expected congestion during the selected period.",
      popularTravelers:       "Popular among travelers with similar interests.",
      wellRated:              "Well-rated by previous travelers.",
      styles: { Nature:"Nature", Relax:"Relax", Culture:"Culture", Family:"Family", Nightlife:"Nightlife", Adventure:"Adventure" },
    },
  },
  kpi: {
    badge: "AI Analysis",
    heading: "Results Overview",
    sustainability: { title: "Sustainability", subtitle: "Avg environmental score" },
    confidence: { title: "Confidence", subtitle: "Model certainty level" },
    congestion: { title: "Congestion", subtitle: "Avg tourism pressure" },
    topPick: "Top Pick",
    matchScore: "Match Score",
    country: "Spain",
    statusLabels: {
      excellent: "Excellent",
      good: "Good",
      moderate: "Moderate",
      low: "Low",
      lowPressure: "Low pressure",
      highPressure: "High pressure",
    },
  },
  home: {
    redistribution: {
      title: "Demand Redistribution Active",
      penalizedPrefix: "— Horizon applied congestion penalties to",
      penalizedSuffix: "destinations",
      withSaturation: "with Very High saturation in",
      resultsNote: "The results below prioritize sustainable alternatives.",
      allSustainable: "— All destinations are within sustainable limits in",
      noPenalties: "No congestion penalties applied.",
      penalizedChip: "penalized",
    },
    results: {
      heading: "Your Top Recommendations",
      resultsChip: "results",
      showing: "Showing",
      destinations: "destinations",
      forProfile: "for profile",
      ranked: "· ranked by AI match score",
    },
  },
  footer: {
    tagline: "Smart Destination Recommender",
    description:
      "AI-powered system for sustainable tourism demand redistribution. Built as part of the TUI Care Foundation target 8.9 open innovation challenge.",
    features: {
      heading: "Features",
      items: ["Sustainability Score","Congestion Index","Preference Match","AI Explanation"],
    },
    technology: {
      heading: "Technology",
      items: ["FastAPI Backend","React + TypeScript","Scikit-learn ML","Synthetic Datasets"],
    },
    project: {
      heading: "About the Project",
      university: "TFM — Universidad Complutense de Madrid",
      description:
        "Reto 2: Motor de recomendaciones con IA y redistribución de demanda turística para combatir el sobreturismo en España.",
      problemTitle: "Problem Statement",
      problemText:
        "85% of tourists visit only 10% of destinations. Horizon uses AI to redistribute demand toward sustainable, less-saturated alternatives — without sacrificing traveler satisfaction.",
    },
    copyright: "© 2025 Horizon — TFM UCM × TUI Care Foundation",
    bottomLinks: ["About","Methodology","Data Sources"],
  },
  about: {
    badge: "TFM · UCM · Future Shapers Spain",
    title: "About This Project",
    subtitle:
      "Horizon is a final-year Master's thesis at Universidad Complutense de Madrid, developed in collaboration with TUI Care Foundation's target 8.9 program to address over-tourism in Spain through AI-powered demand redistribution.",
    challenge: {
      badge: "The Challenge",
      title: "Challenge 2: AI Recommendation Engine & Demand Redistribution",
      body1:
        "Most recommendation systems are designed to maximize user satisfaction by showing what's most likely to please you. This works well for selling more — but it causes 1,000,000 people to end up visiting the same places, creating overcrowding, infrastructure saturation and economic leakage.",
      question: "The question Horizon answers:",
      body2:
        "Can we use artificial intelligence to recommend attractive experiences for the traveler while simultaneously distributing tourism demand more sustainably across Spain's territory?",
      cards: [
        { title: "Universidad Complutense de Madrid", desc: "Trabajo Final de Máster — academic framework and research methodology" },
        { title: "TUI Care Foundation · target 8.9", desc: "Open innovation program aligned with UN SDG 8.9 — sustainable tourism and decent work" },
        { title: "Future Shapers Spain", desc: "TUI + Telefónica accelerator connecting universities with real tourism industry challenges" },
        { title: "AI & Open Data", desc: "Built with FastAPI, React and public open data sources (INE, datos.gob.es) — GDPR compliant" },
      ],
    },
    scoring: {
      badge: "AI Scoring Formula",
      title: "How Horizon Scores Each Destination",
      subtitle:
        "Every recommendation is computed by combining four independent scoring modules, each measuring a different dimension of destination quality. Sustainability criteria receive a significant weight to incentivize greener choices.",
      weightLabel: "Score Weight Distribution",
      formulaLabels: {
        preference: "Preference Match",
        sustainability: "Sustainability Score",
        popularity: "Popularity Score",
        congestion: "Congestion Adjustment",
      },
      descriptions: [
        "Preference: matches user's travel style, budget and interests against destination attributes",
        "Sustainability: carbon footprint, local business support, public transport, ESG overall score",
        "Popularity: 70% booking volume + 30% rating score — ensures recommended quality",
        "Congestion: monthly over-tourism index — penalizes saturated destinations in peak periods",
      ],
    },
    architecture: {
      badge: "System Architecture",
      title: "5-Layer Pipeline",
      subtitle:
        "Horizon is built as a layered system, each layer handling a specific responsibility — from raw data ingestion to governance and monitoring.",
      layers: [
        { num: "L1", title: "Unified Ingestion (Foundation)", desc: "Consolidates open data sources, synthetic datasets, IoT sensors and demand signals into a unified data layer." },
        { num: "L2", title: "Prediction Engine (Intelligence)", desc: "Historical booking patterns, sentiment analysis, seasonality modeling. Our FastAPI recommendation engine lives here." },
        { num: "L3", title: "Intervention Triggers (Action)", desc: "Automation layer that decides when to activate alternative recommendations based on real-time congestion thresholds." },
        { num: "L4", title: "Personalization (Interface)", desc: "'Invisible interface' — conversational flow using user context. Recommends alternatives without saying 'this destination is full'." },
        { num: "L5", title: "Governance (Control Panel)", desc: "Monitoring dashboard for regional authorities and sustainability teams — tracks demand redistribution and congestion KPIs." },
      ],
    },
    scope: {
      badge: "Project Scope",
      title: "What This TFM Covers — and What It Doesn't",
      subtitlePrefix: "Future Shapers Spain is a multi-reto challenge. Horizon is scoped to",
      subtitleSuffix: "— AI recommendation engine and demand redistribution. Other retos are handled by separate teams and are out of scope for this project.",
      inScopeTitle: "In Scope — Reto 2",
      outScopeTitle: "Out of Scope — Other Retos",
      inScopeItems: [
        "AI-powered destination recommendation engine (FastAPI + scoring pipeline)",
        "Demand redistribution via congestion penalties and sustainability weights",
        "Low-season boost — best months to visit based on INE congestion data",
        "Open data integration: INE EOH (hotel travelers), FRONTUR (international), AEMET (climate normals)",
        "Interactive georreferenced map with real-time month/congestion overlay",
        "User profile matching (travel style, budget, sustainability preference)",
        "Explainability layer — human-readable reasoning for each recommendation",
        "React dashboard with sustainability KPIs and congestion heatmap",
      ],
      outScopeItems: [
        { text: "Sentiment analysis & traveler review processing — scoped to Reto 1 (NLP & social listening)", reto: "Reto 1" },
        { text: "Transport time & multimodal route optimization — scoped to Reto 4 (mobility layer)", reto: "Reto 4" },
        { text: "Real-time IoT sensor feeds and live crowd detection — infrastructure handled by Reto 3", reto: "Reto 3" },
        { text: "Conversational booking assistant & chatbot interface — Reto 4 personalization layer", reto: "Reto 4" },
      ],
      disclaimer: "These are listed in the TFM document as",
      disclaimerBold: "desirable future data sources",
      disclaimerSuffix: ", not as deliverables of this reto. Horizon's scope is intentionally focused on Reto 2 to deliver a complete, production-ready AI engine.",
    },
  },
  analytics: {
    badge: "Governance · Layer 5 / TUI Care Foundation",
    title: "Analytics Dashboard",
    subtitle:
      "System-level governance view of all 20 monitored destinations. Track demand redistribution activity, congestion risks and sustainable opportunity zones across Spain's tourism network in real time.",
    kpis: [
      { label: "Destinations Monitored", sub: "Active in Horizon's scoring engine" },
      { label: "Traveler Profiles", sub: "Synthetic GDPR-compliant user dataset" },
      { label: "High-Congestion Months", sub: "Months where redistribution penalties are active" },
      { label: "Destinations at Risk", sub: "Exceeding sustainable congestion threshold in July" },
    ],
    redistribution: {
      badge: "Redistribution Activity",
      title: "Penalized Destinations by Month",
      subtitle: "Number of destinations exceeding the congestion threshold (> 80) — triggering −10% scoring penalty",
      legend: ["Sustainable (0 penalized)","Moderate pressure (8)","Peak pressure (12)"],
    },
    statusBreakdown: {
      badge: "Destination Status",
      title: "July Peak — Distribution",
      sdgTarget: "SDG 8.9 Target",
      sdgSub: "5–10% demand redistribution",
      engineStatus: "Engine Status",
      engineSub: "Active · All modules online",
    },
    table: {
      badge: "Destination Monitor",
      title: "All 20 Destinations · July Snapshot",
      allFilter: "All",
      headers: ["Destination","Type","July Congestion","Sustainability","Status"],
      noResults: "No destinations match this filter.",
      statusLabels: {
        overloaded: "Overloaded",
        high: "High Pressure",
        moderate: "Moderate",
        opportunity: "Opportunity",
      },
      sustainLabel: "Sustain.",
    },
  },
  insights: {
    badge: "Tourism Intelligence",
    title: "Spain's Tourism Concentration Problem",
    subtitle:
      "96.8 million tourists visit Spain every year — but 85% of them go to the same 10% of destinations. Horizon uses AI to identify this imbalance and redistribute demand sustainably.",
    stats: [
      { value: "96.8M", label: "International tourists per year — Spain ranks among world's top destinations" },
      { value: "85%",   label: "concentrate in only 10% of destinations — extreme spatial asymmetry" },
      { value: "134.7B€", label: "economic impact, but economic benefits don't reach SMEs and local communities" },
      { value: "22.5M", label: "tourists arrive just between July and August — extreme demand seasonality" },
    ],
    map: {
      badge: "Territorial Impact",
      title: "Spain Congestion Map",
      subtitle:
        "Each circle represents one of the 20 monitored destinations. Size and colour reflect congestion intensity for the selected month — derived from real INE hotel occupancy data.",
      highlightChip: "Highlighting your {n} recommended destinations",
    },
    optimizer: {
      badge: "Low Season Boost",
      title: "Low Season Optimizer",
      subtitlePart1: "For each destination, Horizon identifies the",
      subtitleBold: "best months to visit",
      subtitlePart2: "— when congestion is lowest, prices are up to 30% cheaper, and locals actually benefit from your visit.",
      dataChip: "Based on INE EOH hotel occupancy data",
      peak: "Peak — avoid",
      lowSeason: "Low season — recommended",
      congestionDrop: "-{n}% congestion",
    },
    heatmap: {
      badge: "Congestion Intelligence",
      title: "Monthly Congestion Levels by Destination",
      subtitlePart1: "Select a month to see which destinations exceed sustainable limits. Cells with a red dot trigger Horizon's",
      subtitleRed: "−10% congestion penalty",
      subtitlePart2: "in the scoring formula.",
      penalizedLabel: "penalized",
      bannerPenalized: "{n} of 20 destinations exceed the sustainability congestion threshold in {month}. Horizon applies redistribution penalties to these locations.",
      bannerSafe: "All 20 destinations are within sustainable congestion limits in {month}. No redistribution penalties applied.",
      sourceBannerRecs: "Showing your {n} recommended destinations — go to Destinations to change your search",
      sourceBannerDefault: "Showing 8 representative destinations — run a search in Destinations to see your specific results",
      legend: [
        "Low (0–30)",
        "Moderate (31–60)",
        "High (61–80)",
        "Very High (81–100) — penalized",
      ],
      penaltyDot: "Penalty trigger dot",
      levelLabels: { low: "Low", moderate: "Moderate", high: "High", veryHigh: "Very High" },
      levelShort: { low: "Low", moderate: "Mod", high: "High", veryHigh: "V.Hi" },
    },
    redistribution: {
      badge: "Redistribution Scenarios",
      title: "How Horizon Redirects Demand",
      subtitle:
        "When a destination exceeds the congestion threshold, Horizon surfaces sustainable alternatives. These real examples show demand redistribution in action.",
    },
    scenarios: {
      overSaturated: "✗ Over-saturated",
      horizonRecommends: "✓ Horizon recommends",
      congestionLabel: "Congestion:",
    },
    impactTargets: {
      badge: "SDG 8.9 Impact Targets",
      title: "Measurable Impact on Spanish Tourism",
      items: [
        { value: "5–10%",  label: "demand redistribution",        desc: "Target shift of tourist flow from saturated to sustainable destinations during pilots" },
        { value: "200+",   label: "alternative destinations",     desc: "Locations in Spain with growth potential identified as redistribution targets" },
        { value: "20–30%", label: "recommendation acceptance",    desc: "Target acceptance rate for Horizon's alternative destination suggestions" },
        { value: "+10%",   label: "secondary destination growth", desc: "Annual growth target for bookings in less-visited sustainable destinations" },
      ],
    },
  },
};

export type Locale = typeof en;
