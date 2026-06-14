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