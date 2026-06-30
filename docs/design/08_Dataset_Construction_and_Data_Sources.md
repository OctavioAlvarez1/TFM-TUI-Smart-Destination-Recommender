# Dataset Construction and Data Sources

Document 8 – Dataset Construction & Data Sources

## 1. Objective

The purpose of this dataset is to support the development and demonstration of the Smart Destination Recommender MVP for TUI. Since access to real customer booking data is not available within the scope of this challenge, a synthetic but industry-calibrated dataset has been created to simulate realistic tourism demand patterns, traveler preferences, destination characteristics, and sustainability indicators.

The dataset is designed to enable the development, testing, and validation of AI-driven recommendation models while maintaining full compliance with privacy and data protection regulations.


## 2. Data Sources

The dataset has been generated using publicly available tourism information and industry reports as reference sources. These sources were used to calibrate destination characteristics, pricing ranges, seasonality patterns, and sustainability assumptions.

| Source | Purpose |
|--------|---------|
| Booking.com | Reference for destination popularity, accommodation pricing, and tourism offerings |
| Tripadvisor | Reference for destination attractiveness, traveler interests, and tourism categories |
| Turespaña | Tourism statistics, destination relevance, and visitor trends in Spain |
| National Statistics Institute (INE Spain) — EOH Table 49371 | Seasonality patterns, monthly hotel occupancy by province — integrated via `fetch_open_data.py`. 13/13 provinces confirmed. |
| FRONTUR — Table 23988 | International tourist arrivals by autonomous community — integrated via `fetch_open_data.py`. 8/8 CCAA confirmed. |
| AEMET OpenData | 30-year climate normals (temperature, precipitation, sunshine) by province — optional, requires free API key. Endpoint: `/valores/climatologicos/mensualesanuales/`. Saves to `data/enriched/aemet_climate.csv`. |
| UN Tourism (United Nations Tourism) | Sustainability trends and responsible tourism practices |
| Public transportation and tourism reports | Sustainability and accessibility assumptions |

The project does not replicate or redistribute data from any external platform. Instead, publicly available information has been used solely to guide the generation of realistic synthetic records.


## 3. Synthetic Data Generation Strategy

A semi-synthetic data generation approach has been adopted to balance realism, scalability, and privacy.

The dataset combines:
- Real tourist destinations located in Spain.
- Synthetic traveler profiles generated according to TUI's major source markets.
- Simulated booking histories based on realistic tourism behavior.
- Sustainability indicators derived from public tourism and transportation trends.
- Seasonal congestion patterns inspired by historical tourism demand.

Business rules were incorporated into the generation process to ensure consistency across datasets. For example:
- Travelers interested in nightlife are more likely to book destinations such as Ibiza or Barcelona.
- Nature-oriented travelers are more likely to visit destinations with strong outdoor tourism offerings.
- Sustainability-conscious travelers tend to favor destinations with higher sustainability scores and lower congestion levels.
- Peak-season destinations exhibit increased congestion during summer months.

This approach enables the creation of a coherent dataset suitable for demonstrating AI recommendation capabilities.


## 4. Dataset Components

The complete dataset consists of five interconnected data assets.

### destinations.csv

Contains the master catalog of tourist destinations.

Main attributes include:
- Destination identifier
- Destination name
- Beach score
- Culture score
- Nature score
- Nightlife score
- Family-friendly score
- Average daily travel cost

### sustainability_scores.csv

Contains sustainability indicators for each destination.

Main attributes include:
- Carbon impact score
- Local business support score
- Public transportation score
- Overall sustainability score

### congestion_scores.csv

Contains monthly congestion estimates for each destination.

Main attributes include:
- Destination identifier
- Month
- Congestion score

These values simulate seasonal tourism demand patterns.

### users.csv

Contains synthetic traveler profiles.

Main attributes include:
- User identifier
- Country of origin
- Age group
- Budget level
- Travel style
- Sustainability preference

### bookings_history.csv

Contains historical booking records used to simulate customer behavior.

Main attributes include:
- Booking identifier
- User identifier
- Destination identifier
- Booking date
- Travel month
- Length of stay
- Total booking value
- Customer rating


## 5. Dataset Assumptions

Several assumptions were introduced to improve realism while maintaining simplicity suitable for an MVP implementation.

### Tourism Seasonality

Beach destinations experience higher demand during summer months, particularly July and August. Urban destinations maintain more stable demand throughout the year but experience peaks during holiday periods and cultural events. Nature destinations attract travelers primarily during spring and summer seasons.

### Traveler Preferences

Family travelers tend to select destinations with high family-friendly scores. Nightlife travelers prefer destinations with strong entertainment offerings. Culture-oriented travelers prioritize destinations with significant historical and cultural attractions. Nature travelers favor destinations with high nature scores.

### Sustainability Behavior

Travelers with high sustainability preferences are more likely to select destinations with stronger sustainability indicators and lower congestion levels.

### Pricing

Average daily prices reflect relative differences between premium, mid-range, and budget-friendly destinations commonly observed in the Spanish tourism market.


## 6. GDPR and Data Privacy Considerations

The dataset has been designed to comply with GDPR principles and privacy-by-design practices.

Key considerations include:
- No real customer information is used.
- All traveler profiles are synthetically generated.
- No personally identifiable information (PII) is stored.
- No personal booking history is collected from external systems.
- External tourism sources are used exclusively for calibration and benchmarking purposes.

As a result, the dataset can be safely used for prototyping, demonstrations, model experimentation, and stakeholder presentations without exposing sensitive customer information.


## 7. Expected Outcome

The resulting dataset provides a realistic representation of tourism demand, traveler behavior, destination characteristics, and sustainability indicators across Spain.

This dataset serves as the foundation for the Smart Destination Recommender MVP, enabling the development of AI-powered destination recommendations that balance customer preferences, sustainability objectives, and destination capacity management goals.
