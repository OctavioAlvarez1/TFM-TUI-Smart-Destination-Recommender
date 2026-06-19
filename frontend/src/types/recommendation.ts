// TypeScript interfaces for the recommendation API response.
// Recommendation — single destination result with all scores and explanations.
// UserProfile — traveler profile returned by GET /users/{userId}.
export interface Recommendation {
  destination_id: string;

  destination_name: string;

  final_score: number;

  preference_score: number;

  popularity_score: number;

  sustainability_score: number;

  congestion_score: number;

  confidence_score: number;

  explanations: string[];

  recommendation_rank: number;
}