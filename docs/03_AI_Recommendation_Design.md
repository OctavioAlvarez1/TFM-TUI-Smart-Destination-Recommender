# AI Recommendation Design

## Horizon — TUI Smart Destination Recommender

---

# 1. AI Engine Objective

The goal of the recommendation engine is to generate personalized suggestions for each traveler, promoting destinations that match their preferences while contributing to a more balanced distribution of tourist demand.

Unlike a traditional recommendation system, the proposed solution explicitly incorporates sustainability criteria into the decision-making process.

The challenge lies in finding the right balance between:
- Relevance for the user.
- Operational availability.
- Impact on tourist sustainability.

---

# 2. Design Principles

The recommendation engine is built on four fundamental principles:

## Personalization

Each user must receive recommendations aligned with their interests and historical behavior.

## Sustainability

Recommendations must favor a more balanced distribution of travelers.

## Explainability

The user must understand why a particular destination is being recommended.

## Scalability

The solution must be extendable to new countries, destinations, and markets.

---

# 3. Why Not Use Collaborative Filtering Alone?

Traditional recommendation systems often use Collaborative Filtering, where recommendations are generated based on the behavior of similar users.

Although this approach works well in entertainment or e-commerce platforms, it presents important limitations for this use case:

## Reinforces Popularity

The most visited destinations receive even more recommendations.

## Does Not Consider Sustainability

It does not incorporate information about congestion or available capacity.

## Cold Start Problem

Emerging destinations have few historical interactions.

## Lack of Context

It does not consider travel dates, season, or availability.

For these reasons, a hybrid approach is used.

---

# 4. Recommendation Model Architecture

The solution combines four complementary engines:

## Affinity Engine

Determines which destinations are most relevant for each user based on preference matching.

## Sustainability Engine

Calculates the potential impact of recommending a destination, considering carbon footprint, local business support, public transport access, and overall sustainability indicators.

## Popularity Engine

Scores destinations based on historical booking data and user ratings. See Section 9.

## Congestion Engine

Applies monthly INE hotel occupancy data to calculate a congestion score per destination, penalizing over-visited destinations and boosting under-visited ones.

The results of all four engines are combined through the final ranking system described in Section 10.

---

# 5. User Profile Construction

The system generates a dynamic profile for each traveler.

## Variables Used

### Booking History
- Visited destinations.
- Average length of stay.
- Preferred seasons.

### Declared Preferences
- Beach.
- Nature.
- Culture.
- Gastronomy.
- Rural tourism.

### Digital Behavior
- Searches performed.
- Destinations viewed.
- Previous interactions.

## Output

A preference vector representing the user's main interests. The MVP uses 100 synthetic GDPR-compliant traveler profiles stored in `data/raw/users.csv`.

---

# 6. Destination Profile Construction

Each destination is represented through structured attributes.

## Destination Characteristics

- Experience type.
- Geographic location.
- Seasonality.
- Popularity.
- Tourism capacity.
- Available activities.

## Examples

**Valencia:**
- Beach.
- Gastronomy.
- Urban culture.
- Family tourism.

**Asturias:**
- Nature.
- Hiking.
- Rural tourism.
- Regional gastronomy.

The MVP covers 20 Spanish destinations stored in `data/raw/destinations.csv`, each with beach, culture, nature, nightlife, family, and price attributes.

---

# 7. Affinity Score

The Affinity Score (referred to as Preference Score in the implementation) measures the level of compatibility between a user and a destination.

## Variables Considered

- Interest similarity.
- Booking history.
- Behavior of similar users.
- Explicit preferences.

## Output

Normalized value between 0 and 100. The higher the value, the greater the expected affinity between the user and the destination. This component carries the highest weight (45%) in the final scoring formula.

---

# 8. Sustainability Score

The Sustainability Score represents the potential sustainability impact of recommending a given destination.

## Variables Used

### Occupancy Level
Projected occupancy percentage.

### Available Capacity
Remaining capacity for the queried period.

### Congestion Index
Measurement of tourist pressure derived from INE monthly data.

### Seasonality
Expected saturation level for the selected dates.

### Regional Diversification
The destination's potential to redistribute demand.

## Output

Value between 0 and 100. Less congested, more sustainably managed destinations receive higher scores. Scores are classified as Excellent (> 85), Good (70–85), Moderate (50–70), or Poor (< 50).

The sustainability data is stored in `data/raw/sustainability_scores.csv` (20 records covering carbon, local business, public transport, and overall scores).

---

# 9. Popularity Score

The Popularity Score evaluates how well a destination performs based on historical booking activity and user ratings.

## Calculation

```
Popularity Score = 0.70 × Booking Volume Score + 0.30 × Average Rating Score
```

Both components are normalized to a 0–100 scale before combination.

## Variables

- **Booking volume:** total historical bookings for the destination, drawn from `data/raw/bookings_history.csv` (~1,000 records).
- **Average rating:** mean user rating for the destination across all historical bookings.

## Objective

Provide a signal of proven traveler appeal while keeping it subordinate to preference and sustainability in the final ranking. Popularity alone should not over-promote already saturated destinations — the congestion and sustainability components counterbalance this effect.

---

# 10. Final Ranking Engine

The final ranking combines all four components using a weighted formula.

## Implemented Formula

```
Final Score = 0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion
```

**Important:** The Congestion score is used directly. A higher congestion value means a more congested destination, which scores worse in the ranking. There is no inversion (no "100 - Congestion") — the business rules handle penalization through multipliers.

## Business Rules (Multiplicative)

Applied after the weighted sum:

| Condition | Multiplier | Effect |
|-----------|-----------|--------|
| Sustainability > 85 | ×1.05 | +5% green boost |
| Sustainability < 50 | ×0.90 | −10% penalty |
| Congestion < 40 | ×1.05 | +5% under-visited bonus |
| Congestion > 80 | ×0.90 | −10% redistribution penalty |

## Design Rationale

The weights ensure the system continues to prioritize user experience (Preference at 45%) while incorporating sustainability (25%) as a genuine decision criterion. Popularity and Congestion each contribute 15%, providing market signal and crowd-management respectively.

These weights were validated against the MVP dataset and may be adjusted through A/B experimentation in production.

---

# 11. Explainable Recommendations

One of the primary objectives is to build user trust in the recommendations.

For each suggestion, a plain-language explanation is generated.

## Example

> "We recommend Valencia because it offers beach, gastronomy, and culture experiences similar to Barcelona, with a lower congestion level during your selected dates."

## Benefits

- Greater transparency.
- Higher acceptance rate.
- Better user experience.

The explainability module is implemented in `src/recommendation/explainability.py` and produces human-readable explanation strings for each recommendation returned by the API.

---

# 12. Training Strategy

## Initial Training

Use of historical booking data and user behavior data available in the CSV dataset.

## Periodic Update

Scheduled retraining using new data as the dataset grows.

## Continuous Learning

Progressive incorporation of feedback generated by user interactions, feeding back into preference profiles and model weights.

---

# 13. Model Evaluation

## Traditional Metrics

- Precision@K
- Recall@K
- NDCG
- CTR (Click-Through Rate)

## Business Metrics

- Recommendation acceptance rate.
- Conversion to booking.
- Occupancy increase in secondary destinations.

## Sustainability Metrics

- Demand redistribution.
- Reduction of bookings in saturated destinations.
- Geographic diversification of tourism.

---

# 14. Experimentation Strategy

A/B testing is proposed for production validation.

## Control Group

Traditional recommendation engine (popularity-only or collaborative filtering).

## Experimental Group

Hybrid engine with sustainability component using the implemented weighted formula.

## Objective

Measure the real impact of incorporating sustainability criteria on user experience and business indicators.

---

# 15. Expected Benefits

## For Travelers

- More relevant recommendations.
- Discovery of new destinations.
- Greater transparency through explainable suggestions.

## For TUI

- Better utilization of tourism inventory.
- Increase in bookings at secondary destinations.
- Competitive differentiation.

## For Sustainability

- Lower tourist concentration.
- Reduction of overtourism.
- Direct contribution to Sustainable Development Goal 8.9.

---

# Conclusion

The implemented solution combines modern recommendation techniques with explicit sustainability criteria, enabling TUI to transform the tourism recommendation process into an active tool for redistributing demand and promoting a more balanced and sustainable tourism model.

The MVP is fully operational, covering 20 Spanish destinations with a FastAPI backend, React 19 frontend, and open data integration from INE and FRONTUR. The architecture is designed to scale toward a cloud-based enterprise platform in subsequent phases.
