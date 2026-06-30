# Data Dictionary

Document 9 – Data Dictionary

## 1. Overview

This document provides the data dictionary for the Smart Destination Recommender dataset. The purpose of this document is to define the structure, meaning, and expected values of each dataset used in the MVP.

The data dictionary supports data governance, transparency, maintainability, and future scalability of the solution.

The dataset consists of five core entities:
- destinations
- sustainability_scores
- congestion_scores
- users
- bookings_history


## 2. destinations.csv

**Description**

Master catalog containing tourist destinations available for recommendation.

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| destination_id | String | Unique identifier of the destination |
| destination_name | String | Destination name |
| region | String | Spanish region or autonomous community |
| destination_type | String | Destination category (Beach, City, Nature, Mixed) |
| beach_score | Integer | Attractiveness for beach tourism (1–10) |
| culture_score | Integer | Attractiveness for cultural tourism (1–10) |
| nature_score | Integer | Attractiveness for nature tourism (1–10) |
| nightlife_score | Integer | Attractiveness for nightlife activities (1–10) |
| family_friendly_score | Integer | Suitability for family travel (1–10) |
| avg_price_per_day | Integer | Estimated average daily travel cost in EUR |

Example:

| destination_id | destination_name |
|----------------|-----------------|
| D001 | Mallorca |
| D013 | Barcelona |


## 3. sustainability_scores.csv

**Description**

Contains sustainability indicators associated with each destination. These indicators are used by the recommendation engine to promote sustainable tourism alternatives.

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| destination_id | String | Destination identifier |
| carbon_score | Integer | Environmental impact score (0–100) |
| local_business_score | Integer | Support for local economy score (0–100) |
| public_transport_score | Integer | Public transportation quality score (0–100) |
| sustainability_score | Decimal | Overall sustainability score (0–100) |

**Business Usage**

The recommendation engine may prioritize destinations with higher sustainability scores when sustainability is an important traveler preference.


## 4. congestion_scores.csv

**Description**

Contains monthly destination congestion estimates. This dataset supports overtourism mitigation and destination balancing recommendations.

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| destination_id | String | Destination identifier |
| month | Integer | Month number (1–12) |
| congestion_score | Integer | Estimated congestion level (0–100) |

**Interpretation**

| Score Range | Meaning |
|-------------|---------|
| 0–30 | Low congestion |
| 31–60 | Moderate congestion |
| 61–80 | High congestion |
| 81–100 | Very high congestion |

Example:

| destination_id | month | congestion_score |
|----------------|-------|-----------------|
| D001 | 8 | 100 |
| D019 | 8 | 90 |


## 5. users.csv

**Description**

Contains synthetic traveler profiles representing major TUI source markets. No real customer information is included.

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| user_id | String | Unique traveler identifier |
| country | String | Country of origin |
| age_group | String | Traveler age range |
| budget_level | String | Budget category (Low, Medium, High) |
| travel_style | String | Preferred travel style |
| sustainability_preference | String | Interest in sustainable travel |

**Allowed Values**

budget_level:
- Low
- Medium
- High

travel_style:
- Beach
- Culture
- Nature
- Family
- Nightlife
- Relax

sustainability_preference:
- Low
- Medium
- High


## 6. bookings_history.csv

**Description**

Historical booking dataset used to simulate traveler behavior and recommendation training data.

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| booking_id | String | Unique booking identifier |
| user_id | String | Traveler identifier |
| destination_id | String | Destination identifier |
| booking_date | Date | Date when booking was made |
| travel_month | Integer | Planned travel month |
| stay_days | Integer | Length of stay |
| total_price | Decimal | Total booking value in EUR |
| user_rating | Integer | Customer satisfaction rating (1–5) |

Example:

| booking_id | user_id | destination_id |
|------------|---------|----------------|
| B0001 | U014 | D001 |
| B0002 | U082 | D004 |


## 7. Entity Relationships

The datasets are connected through the following relationships:

- Users → Bookings
- Destinations → Bookings
- Destinations → Sustainability Scores
- Destinations → Congestion Scores

These relationships allow the recommendation engine to combine traveler preferences, destination characteristics, sustainability metrics, and historical booking behavior.


## 8. Data Quality Rules

The following validation rules apply:
- All primary keys must be unique.
- destination_id must exist in destinations.csv before being referenced elsewhere.
- user_id must exist in users.csv before being referenced in bookings_history.csv.
- Scores must remain within their defined ranges.
- Null values are not permitted in key identifier fields.
- Sustainability scores must be between 0 and 100.
- Congestion scores must be between 0 and 100.


## 9. Privacy and Compliance

All traveler records contained in the dataset are synthetically generated.

The dataset contains:
- No Personally Identifiable Information (PII)
- No real customer records
- No sensitive personal data
- No GDPR-restricted information

The dataset is intended exclusively for demonstration, prototyping, analytics, and AI recommendation experiments.
