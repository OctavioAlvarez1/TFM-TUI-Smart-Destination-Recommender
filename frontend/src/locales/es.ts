import type { Locale } from "./en";

export const es: Locale = {
  nav: {
    destinations: "Destinos",
    insights: "Análisis",
    analytics: "Analítica",
    about: "Acerca de",
  },
  hero: {
    badge: "TURISMO SOSTENIBLE CON IA",
    title: "Descubre mejores destinos en España",
    subtitle:
      "Explora destinos que equilibran la satisfacción del viajero, el rendimiento sostenible y la gestión de la congestión a través de recomendaciones inteligentes.",
  },
  search: {
    travelerProfile: "Perfil del viajero",
    travelMonth: "Mes de viaje",
    destinations: "Destinos",
    searchButton: "Buscar",
    months: [
      "Enero","Febrero","Marzo","Abril","Mayo","Junio",
      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
    ],
    monthsShort: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
    budget: "presupuesto",
    eco: "Eco",
  },
  features: {
    badge: "Para viajeros inteligentes",
    heading: "Con IA. Sostenible.\nPersonalizado.",
    subtitle:
      "Horizon combina inteligencia artificial, métricas de sostenibilidad e insights de viajeros para recomendar destinos que crean mejores resultados para viajeros y comunidades locales.",
    items: [
      {
        title: "Inteligencia de sostenibilidad",
        description:
          "Evalúa destinos mediante indicadores de impacto ambiental, puntuación de sostenibilidad y métricas de turismo responsable.",
      },
      {
        title: "Satisfacción del viajero",
        description:
          "Aprovecha el comportamiento y las preferencias de los viajeros para identificar destinos que ofrecen experiencias excepcionales de forma consistente.",
      },
      {
        title: "Analítica de congestión",
        description:
          "Monitoriza la presión turística y la dinámica de afluencia para promover una distribución equilibrada de destinos y mejores experiencias.",
      },
      {
        title: "Motor de recomendaciones IA",
        description:
          "Genera recomendaciones explicables combinando preferencias del viajero, sostenibilidad e inteligencia de congestión.",
      },
    ],
  },
  empty: {
    title: "¿Listo para descubrir destinos sostenibles?",
    subtitle:
      "Genera recomendaciones de destinos personalizadas impulsadas por inteligencia artificial, métricas de sostenibilidad e inteligencia de viaje basada en congestión.",
  },
  card: {
    rank: "Posición",
    matchScore: "Puntuación",
    country: "España",
    metrics: {
      preference: "Preferencia",
      sustainability: "Sostenibilidad",
      popularity: "Popularidad",
      congestion: "Congestión",
    },
    whyRecommended: "Por qué Horizon lo recomienda",
    bestMonths: "Mejores meses para visitar",
    bestMonthsSub: "— menor congestión, mejor precio",
    explanations: {
      strongMatch:             "Excelente coincidencia con tus preferencias de viaje {style}.",
      goodMatch:               "Buena coincidencia con tus preferencias de viaje {style}.",
      excellentSustainability: "Rendimiento de sostenibilidad excelente.",
      goodSustainability:      "Buen rendimiento de sostenibilidad.",
      lowCongestion:           "Menor congestión esperada que en destinos comparables.",
      highCongestion:          "Mayor congestión esperada durante el período seleccionado.",
      popularTravelers:        "Popular entre viajeros con intereses similares.",
      wellRated:               "Muy valorado por viajeros anteriores.",
      styles: { Nature:"Naturaleza", Relax:"Relax", Culture:"Cultura", Family:"Familia", Nightlife:"Vida nocturna", Adventure:"Aventura" },
    },
  },
  kpi: {
    badge: "Análisis de IA",
    heading: "Resumen de resultados",
    sustainability: { title: "Sostenibilidad", subtitle: "Puntuación ambiental media" },
    confidence: { title: "Confianza", subtitle: "Certeza del modelo" },
    congestion: { title: "Congestión", subtitle: "Presión turística media" },
    topPick: "Top Elegido",
    matchScore: "Puntuación",
    country: "España",
    statusLabels: {
      excellent: "Excelente",
      good: "Bueno",
      moderate: "Moderado",
      low: "Bajo",
      lowPressure: "Presión baja",
      highPressure: "Presión alta",
    },
  },
  home: {
    redistribution: {
      title: "Redistribución de demanda activa",
      penalizedPrefix: "— Horizon aplicó penalizaciones de congestión a",
      penalizedSuffix: "destinos",
      withSaturation: "con saturación Muy Alta en",
      resultsNote: "Los resultados priorizan alternativas sostenibles.",
      allSustainable: "— Todos los destinos están dentro de límites sostenibles en",
      noPenalties: "No se aplicaron penalizaciones por congestión.",
      penalizedChip: "penalizados",
    },
    results: {
      heading: "Tus mejores recomendaciones",
      resultsChip: "resultados",
      showing: "Mostrando",
      destinations: "destinos",
      forProfile: "para el perfil",
      ranked: "· ordenados por puntuación de IA",
    },
  },
  footer: {
    tagline: "Recomendador inteligente de destinos",
    description:
      "Sistema impulsado por IA para la redistribución sostenible de la demanda turística. Desarrollado como parte del desafío de innovación abierta target 8.9 de TUI Care Foundation.",
    features: {
      heading: "Características",
      items: ["Puntuación de sostenibilidad","Índice de congestión","Compatibilidad de preferencias","Explicación IA"],
    },
    technology: {
      heading: "Tecnología",
      items: ["Backend FastAPI","React + TypeScript","ML Scikit-learn","Datasets sintéticos"],
    },
    project: {
      heading: "Sobre el proyecto",
      university: "TFM — Universidad Complutense de Madrid",
      description:
        "Reto 2: Motor de recomendaciones con IA y redistribución de demanda turística para combatir el sobreturismo en España.",
      problemTitle: "El problema",
      problemText:
        "El 85% de los turistas visita solo el 10% de los destinos. Horizon usa IA para redistribuir la demanda hacia alternativas sostenibles y menos saturadas — sin sacrificar la satisfacción del viajero.",
    },
    copyright: "© 2025 Horizon — TFM UCM × TUI Care Foundation",
    bottomLinks: ["Acerca de","Metodología","Fuentes de datos"],
  },
  about: {
    badge: "TFM · UCM · Future Shapers Spain",
    title: "Sobre este proyecto",
    subtitle:
      "Horizon es un Trabajo Final de Máster en la Universidad Complutense de Madrid, desarrollado en colaboración con el programa target 8.9 de TUI Care Foundation para combatir el sobreturismo en España mediante redistribución de demanda con IA.",
    challenge: {
      badge: "El reto",
      title: "Reto 2: Motor de recomendaciones con IA y redistribución de demanda",
      body1:
        "La mayoría de los sistemas de recomendación están diseñados para maximizar la satisfacción del usuario mostrando lo que más le va a gustar. Esto funciona bien para vender más, pero hace que 1.000.000 de personas acaben visitando los mismos lugares, creando masificación, saturación de infraestructuras y fuga económica.",
      question: "La pregunta que responde Horizon:",
      body2:
        "¿Podemos usar inteligencia artificial para recomendar experiencias atractivas para el viajero mientras distribuimos la demanda turística de forma más sostenible por el territorio español?",
      cards: [
        { title: "Universidad Complutense de Madrid", desc: "Trabajo Final de Máster — marco académico y metodología de investigación" },
        { title: "TUI Care Foundation · target 8.9", desc: "Programa de innovación abierta alineado con el ODS 8.9 de la ONU — turismo sostenible y trabajo decente" },
        { title: "Future Shapers Spain", desc: "Acelerador TUI + Telefónica que conecta universidades con retos reales de la industria turística" },
        { title: "IA y Datos Abiertos", desc: "Construido con FastAPI, React y APIs de datos abiertos reales: INE EOH (ocupación hotelera), FRONTUR (llegadas internacionales), AEMET (normales climáticas) — cumple con el RGPD" },
      ],
    },
    scoring: {
      badge: "Fórmula de puntuación IA",
      title: "Cómo Horizon puntúa cada destino",
      subtitle:
        "Cada recomendación se calcula combinando cuatro módulos de puntuación independientes, cada uno midiendo una dimensión diferente de la calidad del destino. Los criterios de sostenibilidad tienen un peso significativo para incentivar elecciones más verdes.",
      weightLabel: "Distribución de pesos",
      formulaLabels: {
        preference: "Compatibilidad de preferencias",
        sustainability: "Puntuación de sostenibilidad",
        popularity: "Puntuación de popularidad",
        congestion: "Ajuste de congestión",
      },
      descriptions: [
        "Preferencia: relaciona el estilo de viaje, presupuesto e intereses del usuario con los atributos del destino",
        "Sostenibilidad: huella de carbono, apoyo al comercio local, transporte público, puntuación ESG global",
        "Popularidad: 70% volumen de reservas + 30% puntuación de valoración — garantiza calidad recomendada",
        "Congestión: índice mensual de sobreturismo — penaliza destinos saturados en temporadas pico",
      ],
    },
    architecture: {
      badge: "Arquitectura del sistema",
      title: "Pipeline de 5 capas",
      subtitle:
        "Horizon está construido como un sistema en capas, cada una con una responsabilidad específica — desde la ingesta de datos brutos hasta la gobernanza y el monitoreo.",
      layers: [
        { num: "L1", title: "Ingesta unificada (Fundación)", desc: "Consolida fuentes de datos abiertos, datasets sintéticos, sensores IoT y señales de demanda en una capa de datos unificada." },
        { num: "L2", title: "Motor de predicción (Inteligencia)", desc: "Patrones históricos de reservas, análisis de sentimiento, modelado de estacionalidad. Aquí vive nuestro motor de recomendaciones FastAPI." },
        { num: "L3", title: "Disparadores de intervención (Acción)", desc: "Capa de automatización que decide cuándo activar recomendaciones alternativas basadas en umbrales de congestión en tiempo real." },
        { num: "L4", title: "Personalización (Interfaz)", desc: "'Interfaz invisible' — flujo conversacional con contexto del usuario. Recomienda alternativas sin decir 'este destino está lleno'." },
        { num: "L5", title: "Gobernanza (Panel de control)", desc: "Dashboard de monitoreo para autoridades regionales y equipos de sostenibilidad — rastrea la redistribución de demanda y los KPIs de congestión." },
      ],
    },
    scope: {
      badge: "Alcance del proyecto",
      title: "Qué cubre este TFM — y qué no",
      subtitlePrefix: "Future Shapers Spain es un desafío multi-reto. Horizon está enfocado en el",
      subtitleSuffix: "— motor de recomendaciones con IA y redistribución de demanda. Otros retos son manejados por equipos separados y están fuera del alcance de este proyecto.",
      inScopeTitle: "En alcance — Reto 2",
      outScopeTitle: "Fuera de alcance — Otros retos",
      inScopeItems: [
        "Motor de recomendaciones de destinos con IA (FastAPI + pipeline de puntuación)",
        "Redistribución de demanda mediante penalizaciones de congestión y pesos de sostenibilidad",
        "Boost de temporada baja — mejores meses para visitar basados en datos de congestión del INE",
        "Integración de datos abiertos: INE EOH (viajeros hoteleros), FRONTUR (internacionales), AEMET (normales climáticas)",
        "Mapa georreferenciado interactivo con superposición mensual de congestión en tiempo real",
        "Matching de perfiles de usuario (estilo de viaje, presupuesto, preferencia de sostenibilidad)",
        "Capa de explicabilidad — razonamiento legible por humanos para cada recomendación",
        "Dashboard de gobernanza analítica — gráfico mensual interactivo, ranking de destinos con heat tiles, KPIs de sostenibilidad y monitoreo completo de congestión en los 20 destinos",
      ],
      outScopeItems: [
        { text: "Análisis de sentimiento y procesamiento de reseñas de viajeros — acotado al Reto 1 (NLP y escucha social)", reto: "Reto 1" },
        { text: "Tiempo de transporte y optimización de rutas multimodal — acotado al Reto 4 (capa de movilidad)", reto: "Reto 4" },
        { text: "Feeds de sensores IoT en tiempo real y detección de afluencia — infraestructura del Reto 3", reto: "Reto 3" },
        { text: "Asistente de reservas conversacional e interfaz de chatbot — capa de personalización del Reto 4", reto: "Reto 4" },
      ],
      disclaimer: "Estos están listados en el documento TFM como",
      disclaimerBold: "fuentes de datos deseables para el futuro",
      disclaimerSuffix: ", no como entregables de este reto. El alcance de Horizon está intencionadamente enfocado en el Reto 2 para entregar un motor de IA completo y listo para producción.",
    },
  },
  analytics: {
    badge: "Gobernanza",
    title: "Panel de analítica",
    subtitle:
      "Vista de gobernanza a nivel de sistema de los 20 destinos monitorizados. Rastrea la actividad de redistribución de demanda, riesgos de congestión y zonas de oportunidad sostenible en la red turística de España en tiempo real.",
    kpis: [
      { label: "Destinos monitorizados", sub: "Activos en el motor de puntuación de Horizon" },
      { label: "Perfiles de viajeros", sub: "Dataset sintético conforme al RGPD" },
      { label: "Meses de alta congestión", sub: "Meses en que las penalizaciones de redistribución están activas" },
      { label: "Destinos en riesgo", sub: "Superando el umbral sostenible de congestión en julio" },
    ],
    section: {
      badge: "Gobernanza en Tiempo Real",
      title: "Panel de Monitorización y Control",
      monthLabel: "Analizando",
      clickTip: "Haz clic en una barra para seleccionar el mes",
    },
    perfChart: {
      badge: "Rendimiento de Destinos",
      title: "Ranking: Sostenibilidad y Congestión",
      subtitle: "Ordenado por la mejor combinación — destinos más sostenibles con menor congestión para el mes seleccionado.",
      sustLabel: "Sostenibilidad",
      congLabel: "Congestión",
      rankTip: "Puesto #1 = mejor perfil este mes",
    },
    redistribution: {
      badge: "Actividad de redistribución",
      title: "Destinos penalizados por mes",
      subtitle: "Número de destinos que superan el umbral de congestión (> 80) — activando penalización de puntuación −10%",
      legend: ["Sostenible (0 penalizados)","Presión moderada (8)","Presión pico (12)"],
    },
    statusBreakdown: {
      badge: "Estado de destinos",
      titleBase: "Distribución",
      sdgTarget: "Objetivo ODS 8.9",
      sdgSub: "5–10% redistribución de demanda",
      engineStatus: "Estado del motor",
      engineSub: "Activo · Todos los módulos en línea",
    },
    table: {
      badge: "Monitor de destinos",
      titleBase: "Los 20 destinos",
      allFilter: "Todos",
      headers: ["Destino","Tipo","Congestión","Sostenibilidad","Estado"],
      noResults: "Ningún destino coincide con este filtro.",
      statusLabels: {
        overloaded: "Saturado",
        high: "Alta presión",
        moderate: "Moderado",
        opportunity: "Oportunidad",
      },
      sustainLabel: "Sosten.",
    },
  },
  insights: {
    badge: "Inteligencia turística",
    title: "El problema de concentración turística en España",
    subtitle:
      "96,8 millones de turistas visitan España cada año — pero el 85% va a los mismos 10% de destinos. Horizon usa IA para identificar este desequilibrio y redistribuir la demanda de forma sostenible.",
    stats: [
      { value: "96,8M", label: "Turistas internacionales al año — España es uno de los principales destinos del mundo" },
      { value: "85%",   label: "se concentran en solo el 10% de los destinos — asimetría espacial extrema" },
      { value: "134,7B€", label: "impacto económico, pero los beneficios no llegan a las pymes y comunidades locales" },
      { value: "22,5M", label: "turistas llegan solo entre julio y agosto — extrema estacionalidad de la demanda" },
    ],
    map: {
      badge: "Impacto territorial",
      title: "Mapa de congestión de España",
      subtitle:
        "Cada círculo representa uno de los 20 destinos monitorizados. El tamaño y el color reflejan la intensidad de congestión del mes seleccionado, derivada de datos reales de ocupación hotelera del INE.",
      highlightChip: "Destacando tus {n} destinos recomendados",
    },
    optimizer: {
      badge: "Boost de temporada baja",
      title: "Optimizador de temporada baja",
      subtitlePart1: "Para cada destino, Horizon identifica los",
      subtitleBold: "mejores meses para visitar",
      subtitlePart2: "— cuando la congestión es mínima, los precios son hasta un 30% más baratos y los locales se benefician realmente de tu visita.",
      dataChip: "Basado en datos de ocupación hotelera EOH del INE",
      peak: "Pico — evitar",
      lowSeason: "Temporada baja — recomendado",
      congestionDrop: "-{n}% congestión",
      cheaperTip: "~30% más barato",
    },
    heatmap: {
      badge: "Inteligencia de congestión",
      title: "Niveles de congestión mensual por destino",
      subtitlePart1: "Selecciona un mes para ver qué destinos superan los límites sostenibles. Las celdas con punto rojo activan la",
      subtitleRed: "penalización −10% de congestión",
      subtitlePart2: "en la fórmula de puntuación.",
      penalizedLabel: "penalizados",
      bannerPenalized: "{n} de 20 destinos superan el umbral de congestión sostenible en {month}. Horizon aplica penalizaciones de redistribución a estas ubicaciones.",
      bannerSafe: "Los 20 destinos están dentro de los límites sostenibles de congestión en {month}. No se aplican penalizaciones de redistribución.",
      sourceBannerRecs: "Mostrando tus {n} destinos recomendados — ve a Destinos para cambiar tu búsqueda",
      sourceBannerDefault: "Mostrando 8 destinos representativos — realiza una búsqueda en Destinos para ver tus resultados específicos",
      legend: [
        "Bajo (0–30)",
        "Moderado (31–60)",
        "Alto (61–80)",
        "Muy alto (81–100) — penalizado",
      ],
      penaltyDot: "Punto disparador de penalización",
      levelLabels: { low: "Bajo", moderate: "Moderado", high: "Alto", veryHigh: "Muy alto" },
      levelShort: { low: "Bajo", moderate: "Mod", high: "Alto", veryHigh: "M.Alt" },
    },
    redistribution: {
      badge: "Escenarios de redistribución",
      title: "Cómo Horizon redirige la demanda",
      subtitle:
        "Cuando un destino supera el umbral de congestión, Horizon muestra alternativas sostenibles. Estos ejemplos reales muestran la redistribución de demanda en acción.",
    },
    scenarios: {
      overSaturated: "Sobre-saturado",
      horizonRecommends: "Horizon recomienda",
      congestionLabel: "Congestión:",
      redirects: "Horizon redirige",
      ptsLess: "pts menos congestionado",
      labels: ["Julio — Temporada pico", "Mayo — Pico de primavera", "Agosto — Pico de verano"],
    },
    impactTargets: {
      badge: "Objetivos de Impacto ODS 8.9",
      title: "Impacto Medible en el Turismo Español",
      items: [
        { value: "5–10%",  label: "redistribución de demanda",          desc: "Objetivo de desvío del flujo turístico de destinos saturados a sostenibles durante pilotos" },
        { value: "200+",   label: "destinos alternativos",              desc: "Ubicaciones en España con potencial de crecimiento identificadas como objetivos de redistribución" },
        { value: "20–30%", label: "aceptación de recomendaciones",      desc: "Tasa de aceptación objetivo para las sugerencias de destinos alternativos de Horizon" },
        { value: "+10%",   label: "crecimiento de destinos secundarios", desc: "Objetivo de crecimiento anual de reservas en destinos sostenibles menos visitados" },
      ],
    },
  },
};
