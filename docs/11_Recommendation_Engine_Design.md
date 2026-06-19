# Recommendation Engine Design

Document 11 – Recommendation Engine Design
TUI Smart Destination Recommender
Version 1.0

## Purpose

This document describes the design of the recommendation engine powering the TUI Smart Destination Recommender.

The objective is to generate personalized destination recommendations that balance:
- User preferences
- Historical travel behavior
- Sustainability goals
- Destination popularity
- Congestion mitigation
- Business objectives

The recommendation engine is designed as an explainable AI system that promotes responsible tourism while maximizing traveler satisfaction.


## 1. Recommendation Objectives

The recommendation engine has five primary objectives:

**Objective 1 – Personalization**

Recommend destinations aligned with user interests and travel preferences.

Examples:
- Beach lovers → coastal destinations
- Nature travelers → eco destinations
- Luxury travelers → premium destinations

**Objective 2 – Sustainability Optimization**

Promote environmentally responsible destinations.

The engine should favor destinations with:
- Lower environmental impact
- Strong sustainability practices
- Eco-certified tourism programs

**Objective 3 – Congestion Management**

Reduce pressure on overcrowded destinations. The system actively avoids directing excessive demand toward highly congested locations.

**Objective 4 – Traveler Satisfaction**

Maximize booking probability through relevant recommendations.

**Objective 5 – Explainability**

Provide transparent reasons behind every recommendation.

Example: "Recommended because you enjoy beach vacations, the destination has excellent sustainability ratings, and current visitor levels are moderate."


## 2. Recommendation Architecture

```
High-Level Architecture

Users
  │
  ▼
User Profile Builder
  │
  ▼
Feature Engineering Layer
  │
  ▼
Recommendation Scoring Engine
  │
  ├── Preference Matching
  ├── Sustainability Scoring
  ├── Congestion Scoring
  ├── Popularity Scoring
  │
  ▼
Ranking Engine
  │
  ▼
Top-N Recommendations
  │
  ▼
Explainability Layer
```

The architecture separates:
- Data preparation
- Scoring
- Ranking
- Explanation generation

allowing future ML models to replace individual components without redesigning the platform.


## 3. User Profile Construction

Each traveler is transformed into a structured profile.

Example:
```json
{
  "user_id": 104,
  "preferred_destination_type": "Beach",
  "preferred_budget": "Medium",
  "preferred_region": "Europe",
  "travel_frequency": 4,
  "avg_trip_duration": 7
}
```

Profile information comes from:

**users.csv** — Provides:
- Budget preference
- Destination type
- Home country

**bookings_history.csv** — Provides:
- Past bookings
- Travel frequency
- Historical preferences


## 4. Feature Engineering

The recommendation engine generates recommendation features.

**User Features** — Examples:
- preferred_budget
- preferred_destination_type
- booking_frequency
- past_destination_count
- avg_trip_duration

**Destination Features** — Examples:
- destination_type
- country
- sustainability_score
- congestion_score
- average_cost
- rating

**Interaction Features** — Examples:
- budget_match
- destination_type_match
- historical_similarity


## 5. Scoring Methodology

The recommendation engine uses a weighted hybrid scoring approach. Each destination receives multiple scores.

**A. Preference Score**

Measures alignment between destination attributes and user preferences.

Range: 0 – 100

Factors:
- Destination type match
- Budget match
- Region match

**B. Sustainability Score**

Obtained from: `sustainability_scores.csv`

Example: 87 / 100

Higher values are rewarded.

**C. Congestion Score**

Obtained from: `congestion_scores.csv`

Example: 72 / 100

Higher congestion receives penalties via business rule multipliers (see Section 8).

**D. Popularity Score**

Calculated from: `bookings_history.csv`

Formula: `Popularity = Destination Bookings / Total Bookings`

This helps balance relevance with discovery.


## 6. Hybrid Recommendation Formula

Final recommendation score:

```
Final Score = (0.45 × Preference Score) + (0.25 × Sustainability Score) + (0.15 × Popularity Score) + (0.15 × Congestion Score)
```

The congestion score is used directly (higher = more congested). Congestion's negative effect on ranking is handled by the business rule multipliers in Section 8 — not by inverting the score.

Example calculation:

| Component | Score |
|-----------|-------|
| Preference | 90 |
| Sustainability | 85 |
| Popularity | 70 |
| Congestion | 20 |

```
(0.45 × 90) + (0.25 × 85) + (0.15 × 70) + (0.15 × 20)
= 40.5 + 21.25 + 10.5 + 3.0
= 75.25
```

Then business rule multipliers are applied (see Section 8).


## 7. Sustainability Optimization Layer

A dedicated optimization layer ensures recommendations align with TUI sustainability goals.

**Green Boost**

If Sustainability Score > 85, apply ×1.05 (+5% ranking boost).

**Eco Priority**

If two destinations have similar scores (difference < 3%), prefer the more sustainable destination.

**Sustainability Threshold**

Destinations below 50/100 receive a ×0.90 ranking penalty (−10%).


## 8. Congestion Balancing Layer

To support overtourism reduction strategies:

**Low Congestion Bonus**

If Congestion Score < 40, apply ×1.05 (+5%).

**High Congestion Penalty**

If Congestion Score > 80, apply ×0.90 (−10%).

**Dynamic Demand Redistribution**

If multiple destinations satisfy user preferences, the engine prioritizes less crowded alternatives.

Example: Instead of Barcelona, recommend Valencia when both satisfy traveler interests.

These multipliers are applied after the base weighted formula. They directly penalize highly congested destinations to discourage overtourism concentration.


## 9. Ranking Engine

After scoring:

```
All destinations
  │
  ▼
Calculate Final Score
  │
  ▼
Apply Sustainability Rules (×multiplier)
  │
  ▼
Apply Congestion Rules (×multiplier)
  │
  ▼
Sort Descending
  │
  ▼
Top N Recommendations
```

Example output:
```json
[
  { "destination": "Madeira", "score": 91.2 },
  { "destination": "Valencia", "score": 88.7 },
  { "destination": "Girona", "score": 86.4 }
]
```


## 10. Explainability Layer

Explainability is a core requirement.

For every recommendation the system generates plain-language explanation strings.

Recommendation Reasons (examples):
- 95% match with your preferred destination type
- High sustainability rating
- Currently experiencing moderate visitor levels
- Popular among travelers with similar interests

Example Output:
```json
{
  "destination": "Madeira",
  "score": 88.7,
  "explanations": [
    "Matches your nature travel preferences",
    "Sustainability score of 91/100",
    "Low congestion level",
    "Popular among eco-conscious travelers"
  ]
}
```


## 11. Recommendation Flow

```
User Request
  │
  ▼
Load User Profile
  │
  ▼
Load Destination Data
  │
  ▼
Generate Features
  │
  ▼
Calculate Component Scores
  │
  ▼
Apply Sustainability Optimization
  │
  ▼
Apply Congestion Balancing
  │
  ▼
Rank Destinations
  │
  ▼
Generate Explanations
  │
  ▼
Return Top Recommendations
```


## 12. Recommendation Engine Pseudocode

```python
for destination in destinations:
    preference_score = calculate_preference(user, destination)

    sustainability_score = destination.sustainability_score

    congestion_score = destination.congestion_score

    popularity_score = calculate_popularity(destination)

    final_score = (
        0.45 * preference_score +
        0.25 * sustainability_score +
        0.15 * popularity_score +
        0.15 * congestion_score
    )

    # Apply business rule multipliers
    final_score = apply_sustainability_rules(final_score)
    # Sustainability > 85 -> x1.05; Sustainability < 50 -> x0.90

    final_score = apply_congestion_rules(final_score)
    # Congestion < 40 -> x1.05; Congestion > 80 -> x0.90

rank_destinations()
return_top_recommendations()
```


## 13. Future ML Roadmap

The MVP uses a hybrid scoring engine. Future versions can evolve toward AI-driven recommendations.

**Phase 2 — Content-Based Filtering**

Using:
- Destination embeddings
- User preference vectors

**Phase 3 — Collaborative Filtering**

Using:
- User similarity
- Booking patterns
- Behavioral clustering

**Phase 4 — Machine Learning Ranking**

Models:
- XGBoost Ranker
- LightGBM Ranker
- CatBoost Ranking

Inputs:
- User features
- Destination features
- Historical interactions

Output: Booking Probability

**Phase 5 — Generative AI Recommendations**

Using LLMs to generate:
- Personalized explanations
- Travel narratives
- Sustainable travel suggestions


## Conclusion

The Recommendation Engine combines personalization, sustainability optimization, congestion management, and explainable AI to deliver intelligent destination recommendations.

The architecture is modular and scalable, enabling future evolution from a rule-enhanced scoring engine to a fully machine-learning-powered recommendation platform aligned with TUI's sustainability strategy.
