# Data Model and Synthetic Dataset Design

Document 7 – Data Model & Synthetic Dataset Design
Smart Destination Recommender for Sustainable Tourism

## 1. Purpose

The Smart Destination Recommender relies on data to generate personalized travel recommendations while balancing tourist demand, destination sustainability, and traveler preferences. As part of the MVP, a structured dataset has been designed to simulate realistic tourism scenarios across Spain. The dataset enables the recommendation engine to evaluate destination characteristics, traveler interests, congestion levels, and sustainability indicators in order to produce explainable recommendations.

The objective is to demonstrate how Artificial Intelligence can help TUI improve customer experience while supporting sustainable tourism strategies and ESG objectives.


## 2. Dataset Overview

The MVP dataset is organized into five logical domains:

| Domain | Description |
|--------|-------------|
| Destinations | Tourist destinations available for recommendation |
| Users | Simulated traveler profiles |
| Bookings History | Historical traveler interactions |
| Congestion Scores | Seasonal destination demand indicators |
| Sustainability Scores | ESG-related destination indicators |

Together, these datasets provide the minimum viable information required to support recommendation generation, explainability, and future machine learning enhancements.


## 3. Data Model

The recommendation engine is based on a simple relational model connecting travelers, destinations, and destination performance indicators.

```
Users --[1:N]--> Bookings History --[N:1]--> Destinations
                                                 |
                                    +------------+------------+
                                    |                         |
                             Congestion Scores     Sustainability Scores
```

| Entity | Description |
|--------|-------------|
| Users | Represents traveler profiles and travel preferences. |
| Destinations | Represents tourist destinations available within Spain. |
| Bookings History | Stores simulated traveler interactions and ratings. |
| Congestion Scores | Stores seasonal tourism demand indicators. |
| Sustainability Scores | Stores environmental, mobility, and local economic sustainability metrics. |


## 4. Dataset Structure

### 4.1 Destinations Dataset

Stores destination attributes used by the recommendation engine.

Table: `destinations.csv`

| Field | Type | Description |
|-------|------|-------------|
| destination_id | String | Unique destination identifier |
| city | String | Destination name |
| region | String | Spanish region |
| country | String | Country |
| beach | Integer | Beach attractiveness score (1–5) |
| culture | Integer | Cultural attractiveness score (1–5) |
| nature | Integer | Nature attractiveness score (1–5) |
| nightlife | Integer | Nightlife attractiveness score (1–5) |
| family_friendly | Integer | Family suitability score (1–5) |
| avg_price_per_day | Integer | Estimated daily travel cost (€) |

Example Destinations:
- Mallorca, Ibiza, Tenerife, Barcelona, Valencia, Málaga, Seville, Granada, Bilbao, San Sebastián, Alicante, Menorca, Lanzarote, Cádiz, Zaragoza, Córdoba, Santiago de Compostela, Murcia, Salamanca, Girona


### 4.2 Users Dataset

Stores traveler demographic information and travel preferences.

Table: `users.csv`

| Field | Type | Description |
|-------|------|-------------|
| user_id | String | Unique user identifier |
| age | Integer | Traveler age |
| country | String | Country of origin |
| beach_pref | Integer | Preference for beach destinations |
| culture_pref | Integer | Preference for cultural experiences |
| nature_pref | Integer | Preference for nature activities |
| nightlife_pref | Integer | Preference for nightlife |
| family_pref | Integer | Preference for family-oriented travel |
| sustainability_interest | Integer | Interest in sustainable tourism |

The MVP simulates approximately 100 traveler profiles representing key TUI source markets.

Proposed Distribution:

| Country | Percentage |
|---------|------------|
| Germany | 30% |
| United Kingdom | 25% |
| Netherlands | 20% |
| France | 15% |
| Nordic Countries | 10% |


### 4.3 Bookings History Dataset

Represents previous traveler interactions with destinations.

Table: `bookings_history.csv`

| Field | Type | Description |
|-------|------|-------------|
| user_id | String | Traveler identifier |
| destination_id | String | Destination identifier |
| rating | Integer | Traveler rating (1–5) |

This dataset supports future collaborative filtering and recommendation personalization techniques.


### 4.4 Congestion Scores Dataset

Stores destination crowding levels by season.

Table: `congestion_scores.csv`

| Field | Type | Description |
|-------|------|-------------|
| destination_id | String | Destination identifier |
| month | String | Month |
| congestion_score | Integer | Crowding indicator (0–100) |

Congestion Scale:

| Score | Interpretation |
|-------|---------------|
| 0–30 | Low congestion |
| 31–60 | Medium congestion |
| 61–80 | High congestion |
| 81–100 | Very high congestion |

The congestion score represents estimated tourism pressure and is used to encourage more balanced destination recommendations.


### 4.5 Sustainability Scores Dataset

Stores ESG-related indicators used by the recommendation engine.

Table: `sustainability_scores.csv`

| Field | Type | Description |
|-------|------|-------------|
| destination_id | String | Destination identifier |
| carbon_score | Integer | Environmental performance score |
| local_business_score | Integer | Local economy support score |
| public_transport_score | Integer | Sustainable mobility score |
| sustainability_score | Integer | Composite sustainability metric |

Sustainability Formula:

```
Sustainability Score = 0.4 × Carbon Score + 0.3 × Local Business Score + 0.3 × Public Transport Score
```

The resulting score provides a simplified sustainability indicator for recommendation ranking.


## 5. Data Generation and Source Strategy

The MVP combines real destination metadata with synthetic traveler and booking information. This approach balances realism, privacy, and rapid prototyping while maintaining a clear path toward enterprise deployment.

### Real-World Inspired Data

Destination information is based on publicly available tourism information, destination descriptions, and travel industry sources. Examples include:
- Spanish tourism websites
- Travel booking platforms
- Public tourism statistics
- Destination marketing organizations
- Sustainability and mobility reports

The selected destinations correspond to real Spanish tourist destinations commonly offered by TUI and other travel operators. Destination attributes such as beach appeal, cultural attractions, nature experiences, and nightlife are derived from publicly available destination information and expert assessment.

### Synthetic Data

The following datasets are synthetically generated:
- Traveler profiles
- Historical bookings
- User ratings
- Recommendation interactions

No customer information or personally identifiable information (PII) is used. This ensures compliance with privacy requirements while enabling realistic recommendation scenarios.

### Congestion and Sustainability Indicators

For the MVP, congestion and sustainability scores are modeled using realistic tourism patterns and ESG criteria. The values are designed to represent relative destination performance rather than official measurements.

In a production implementation, these indicators could be calculated from:
- Tourism arrival statistics
- Hotel occupancy rates
- Mobility and transportation datasets
- Environmental sustainability indicators
- Local economic impact metrics
- Seasonal demand forecasting models

### Production Evolution

The proposed architecture is designed to replace synthetic inputs with operational data feeds without requiring changes to the recommendation engine.

Future versions could integrate data from:
- TUI booking platforms
- Destination management systems
- Tourism authorities
- Sustainability reporting providers
- Mobility and transportation platforms

This enables a smooth transition from MVP validation to enterprise-scale deployment.


## 6. Dataset Statistics

The MVP dataset is intentionally limited in size to support rapid development and demonstration.

| Dataset | Estimated Records |
|---------|------------------|
| Destinations | 20 |
| Users | 100 |
| Bookings History | ~1,000 |
| Congestion Records | 240 |
| Sustainability Records | 20 |

Despite its limited size, the dataset is sufficient to demonstrate recommendation logic, explainability, and sustainability-aware decision making.


## 7. AI Features

The recommendation engine combines traveler preferences with destination characteristics and sustainability metrics.

Key features include:
- Preference Match Score
- Sustainability Score
- Congestion Score
- Historical Rating Signals

**Preference Match** — Measures similarity between traveler interests and destination attributes.

**Sustainability Score** — Measures environmental and social performance.

**Congestion Score** — Measures tourism pressure and overcrowding. Higher score = more congested = lower ranking (via business rule penalties).

**Historical Ratings** — Captures previous traveler satisfaction.


## 8. Recommendation Scoring Logic

The MVP uses a weighted recommendation formula.

```
Final Score = 0.45 × Preference Match + 0.25 × Sustainability Score + 0.15 × Popularity Score + 0.15 × Congestion Score
```

Business rules (multiplicative):
- Sustainability Score > 85 → ×1.05 (+5% boost)
- Sustainability Score < 50 → ×0.90 (−10% penalty)
- Congestion Score < 40 → ×1.05 (+5% boost)
- Congestion Score > 80 → ×0.90 (−10% redistribution penalty)

This approach rewards destinations that:
- Match traveler preferences
- Demonstrate stronger sustainability performance
- Experience lower tourism congestion

The formula can later be replaced by machine learning models while preserving the same feature structure.


## 9. Expected Business Outcome

The dataset enables the Smart Destination Recommender to generate personalized and explainable travel recommendations.

The solution demonstrates how TUI can:
- Improve traveler satisfaction
- Reduce pressure on overcrowded destinations
- Promote sustainable tourism practices
- Increase visibility of alternative destinations
- Support ESG objectives through AI-driven decision making
- Create a foundation for future AI-powered recommendation services

The dataset serves as the foundational data layer of the MVP and is designed to evolve into a production-grade recommendation platform through integration with operational tourism and booking data sources.
