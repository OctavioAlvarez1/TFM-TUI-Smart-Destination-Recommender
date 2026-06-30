# Business Case, KPIs and ESG Impact

## 1. Introduction

The tourism industry currently faces one of its greatest challenges: sustaining economic growth without compromising the sustainability of the most visited destinations.

This proposal demonstrates how an AI-powered recommendation platform can generate economic value while contributing to a more balanced distribution of tourist activity.

The initiative is aligned with United Nations Sustainable Development Goal 8.9: "Promote sustainable tourism that creates jobs and promotes local culture and products."

---

## 2. Business Objectives

**Primary Objective**

Redistribute part of the tourist demand from highly congested destinations towards alternative destinations with available capacity.

**Complementary Objectives**

- **Increase occupancy of secondary destinations** — improve utilisation of existing tourism infrastructure.
- **Improve customer experience** — offer personalised and relevant alternatives.
- **Strengthen TUI's sustainable positioning** — consolidate TUI as a reference in responsible tourism.
- **Optimise use of tourism inventory** — reduce imbalances in booking distribution.

---

## 3. Value Proposition

**For Travellers**
- More personalised recommendations.
- Discovery of new destinations.
- Reduced exposure to saturated destinations.
- Better travel experience.

**For TUI**
- Increased sales opportunities.
- Better distribution of bookings.
- Competitive differentiation.
- Greater alignment with ESG objectives.

**For Local Communities**
- More equitable distribution of income.
- Reduced pressure on infrastructure.
- Support for regional development.

**For the Environment**
- Less tourist concentration.
- Reduced pressure on natural resources.
- More efficient use of existing capacity.

---

## 4. Strategic Business KPIs

**Demand Redistribution Rate (DRR)**
Measures the percentage of users who end up booking an alternative destination recommended by the system.
Target: 5% to 10% during the pilot phase.

**Recommendation Acceptance Rate**
Percentage of recommendations accepted by users.
Target: 20% to 30%.

**Secondary Destination Growth**
Increase in bookings at secondary destinations.
Target: 10% annually.

**Revenue Impact**
Difference between revenue generated before and after implementation.
Target: Maintain or increase revenue while improving demand distribution.

---

## 5. ESG Indicators

### Environmental KPIs

**Tourist Pressure Reduction**
Reduction in booking volume at destinations identified as saturated.

**Destination Diversification Index**
Measures the geographic distribution of bookings. The higher the index, the more balanced the tourist distribution.

**Sustainable Recommendation Rate**
Percentage of recommendations favouring destinations with low congestion.

### Social KPIs

**Regional Economic Distribution**
Distribution of tourism income across regions.

**Local Community Impact**
Increase in economic activity in emerging destinations.

**Balanced Tourism Score**
A composite indicator measuring the balanced distribution of visitors.

### Governance KPIs

**Explainable Recommendations Ratio**
Percentage of recommendations accompanied by a comprehensible explanation.

**Model Monitoring Coverage**
Percentage of decisions that are monitored and auditable.

**Responsible AI Compliance**
Level of compliance with principles of transparency and responsible AI use.

---

## 6. Impact Measurement Methodology

The impact assessment is conducted across three dimensions:

**Economic Impact**
- Revenue generated.
- Hotel occupancy.
- Recommendation conversion.

**Social Impact**
- Regional redistribution.
- Local economic benefit.
- Tourism diversification.

**Environmental Impact**
- Reduction in tourist pressure.
- Balanced use of capacity.
- Lower concentration of visitors.

---

## 7. Experimentation Strategy

Validation is carried out through A/B testing.

**Control Group**
Users exposed to the traditional recommendation system.

**Experimental Group**
Users exposed to the sustainability-aware recommendation engine.

**Variables Measured**
- Conversion.
- Satisfaction.
- Demand redistribution.
- Economic impact.

---

## 8. Executive Dashboard

The solution includes a dashboard oriented toward decision-making.

**Business Indicators**
- Bookings generated.
- Conversion.
- Revenue.

**Sustainability Indicators**
- Demand redistribution.
- Congestion index.
- Regional diversification.

**Customer Experience Indicators**
- NPS.
- CSAT.
- Recommendation acceptance rate.

---

## 9. Risks and Mitigations

**Risk 1 — User rejection of alternative destinations**
Mitigation: Implement explainable and highly personalised recommendations.

**Risk 2 — Unintended revenue reduction**
Mitigation: Maintain commercial constraints within the ranking engine.

**Risk 3 — Insufficient data for new destinations**
Mitigation: Use hybrid approaches based on attributes and content-based filtering.

**Risk 4 — Lack of business adoption**
Mitigation: Define clear KPIs and demonstrate value through controlled pilots.

---

## 10. Implementation Roadmap

**Phase 1 — MVP (3 months): COMPLETED — June 2026**

Delivered:
- Recommendation engine with weighted scoring formula.
- Sustainability Score (carbon, local business, public transport).
- Congestion scoring from INE EOH monthly data.
- REST API (FastAPI, localhost:8000).
- React 19 frontend with 4 pages: Destinations, Insights, Analytics, About.
- Streamlit dashboard (optional, localhost:8501).
- Full test suite (pytest, one file per module).

**Phase 2 — Pilot (3 months): Pending**

Requires real booking integration with TUI systems. Includes:
- A/B testing with live users.
- KPI validation against real booking data.
- Weight and algorithm adjustment based on observed behaviour.

**Phase 3 — Production (6 months): Future**

Includes:
- Full integration with TUI digital channels.
- Enterprise scalability (GCP, BigQuery, Vertex AI, Cloud Run).
- Continuous monitoring and model governance.

---

## 11. Expected Benefits

**Economic Benefits**
- Increased occupancy at secondary destinations.
- Better utilisation of tourism inventory.
- New commercial opportunities.

**Social Benefits**
- More balanced tourism distribution.
- Support for regional development.
- Reduction of negative impacts on saturated communities.

**Environmental Benefits**
- Reduced pressure on congested destinations.
- More efficient use of tourism resources.
- Contribution to sustainability objectives.

---

## Conclusion

Horizon (TUI Smart Destination Recommender) represents an opportunity to combine Artificial Intelligence, customer experience, and sustainability into a single solution.

The initiative transforms the tourism recommendation process into a strategic tool capable of generating economic value for TUI, improving the experience of travellers, and actively contributing to a more sustainable distribution of tourist activity in Spain.
