# Horizon — API Reference

Base URL: `http://localhost:8000`

---

## Endpoints

### `GET /health`

Health check. Returns status of the API.

**Response**
```json
{ "status": "ok" }
```

---

### `GET /users/{user_id}`

Returns a traveler profile for the given user ID.

**Path Parameters**

| Parameter | Type | Example | Description |
|---|---|---|---|
| `user_id` | string | `U001` | Must match pattern `U` + 3 digits (`U001`–`U100`) |

**Response — 200 OK**
```json
{
  "user_id": "U001",
  "travel_style": "Nature",
  "budget_level": "Medium",
  "sustainability_preference": "High",
  "age_group": "26-35",
  "country": "Germany"
}
```

**Response — 404 Not Found**
```json
{ "detail": "User not found" }
```

---

### `POST /recommendations`

Generates a ranked list of destination recommendations for a traveler.

**Request Body**

```json
{
  "user_id": "U001",
  "month": 7,
  "top_n": 5
}
```

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `user_id` | string | Yes | — | Traveler profile ID (`U001`–`U100`) |
| `month` | integer | Yes | — | Travel month (1=January … 12=December) |
| `top_n` | integer | No | 5 | Number of results to return (1–20) |

**Response — 200 OK**

Returns an array of `RecommendationResponse` objects, sorted by `recommendation_rank` ascending.

```json
[
  {
    "destination_id": "D019",
    "destination_name": "Picos de Europa",
    "final_score": 82.4,
    "preference_score": 78.0,
    "sustainability_score": 91.0,
    "popularity_score": 65.0,
    "congestion_score": 85.0,
    "confidence_score": 76.5,
    "recommendation_rank": 1,
    "explanations": [
      "Matches your Nature travel style",
      "Excellent sustainability rating",
      "Less-visited destination in August — supports local economies",
      "High popularity among similar travelers"
    ]
  },
  {
    "destination_id": "D020",
    "destination_name": "Sierra Nevada",
    "final_score": 79.1,
    "preference_score": 74.0,
    "sustainability_score": 88.0,
    "popularity_score": 61.0,
    "congestion_score": 90.0,
    "confidence_score": 72.3,
    "recommendation_rank": 2,
    "explanations": [
      "Matches your Nature travel style",
      "Excellent sustainability — supports local businesses",
      "Moderate congestion in August"
    ]
  }
]
```

**Response Fields**

| Field | Type | Range | Description |
|---|---|---|---|
| `destination_id` | string | D001–D020 | Internal destination identifier |
| `destination_name` | string | — | Human-readable destination name |
| `final_score` | float | 0–100 | Weighted final recommendation score |
| `preference_score` | float | 0–100 | How well the destination matches the traveler profile |
| `sustainability_score` | float | 0–100 | Destination sustainability rating (from sustainability_scores.csv) |
| `popularity_score` | float | 0–100 | Popularity score (70% booking volume + 30% rating) |
| `congestion_score` | float | 0–100 | Monthly congestion level (from INE EOH data) |
| `confidence_score` | float | 0–100 | Confidence in the recommendation (0.50×pref + 0.30×pop + 0.20×sust) |
| `recommendation_rank` | integer | 1–N | Position in the ranked list (1 = best match) |
| `explanations` | string[] | — | Plain-language reasons for the recommendation |

**Response — 422 Unprocessable Entity**

Returned when request validation fails.

```json
{
  "detail": [
    {
      "loc": ["body", "month"],
      "msg": "ensure this value is less than or equal to 12",
      "type": "value_error.number.not_le"
    }
  ]
}
```

**Response — 404 Not Found**

Returned when the user ID is not found in `users.csv`.

```json
{ "detail": "User U999 not found" }
```

---

## Score Interpretation

### Final Score Ranges

| Score | Interpretation |
|---|---|
| 85–100 | Excellent match — strongly recommended |
| 70–84 | Good match — well-suited for this traveler |
| 55–69 | Moderate match — acceptable alternative |
| < 55 | Weak match — appears in results only if top_n is large |

### Congestion Score Interpretation

| Score | Level | Effect on Final Score |
|---|---|---|
| 0–30 | Low | +5% boost (under-visited) |
| 31–60 | Moderate | No adjustment |
| 61–80 | High | No adjustment |
| 81–100 | Very High | −10% redistribution penalty |

### Sustainability Score Interpretation

| Score | Classification | Effect on Final Score |
|---|---|---|
| ≥ 85 | Excellent | +5% boost |
| 70–84 | Good | No adjustment |
| 55–69 | Moderate | No adjustment |
| < 50 | Poor | −10% penalty |

---

## Example — cURL

```bash
# Health check
curl http://localhost:8000/health

# Get user profile
curl http://localhost:8000/users/U001

# Get recommendations
curl -X POST http://localhost:8000/recommendations \
  -H "Content-Type: application/json" \
  -d '{"user_id": "U042", "month": 8, "top_n": 3}'
```

## Example — JavaScript (Fetch)

```js
const response = await fetch("http://localhost:8000/recommendations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user_id: "U001", month: 7, top_n: 5 }),
});
const recommendations = await response.json();
```

## Example — Python (requests)

```python
import requests

resp = requests.post(
    "http://localhost:8000/recommendations",
    json={"user_id": "U001", "month": 7, "top_n": 5},
)
recommendations = resp.json()
for r in recommendations:
    print(f"#{r['recommendation_rank']} {r['destination_name']} — {r['final_score']:.1f}")
```
