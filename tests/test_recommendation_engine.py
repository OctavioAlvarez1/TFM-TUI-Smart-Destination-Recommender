"""
=====================================================
TUI Smart Destination Recommender
Recommendation Engine Test
=====================================================

Purpose
-------
Validate end-to-end recommendation generation and
inspect detailed scoring components for the Top-N
recommended destinations.

Author
------
Octavio Alvarez

Project
-------
TUI Smart Destination Recommender
AI-Powered Sustainable Tourism Recommendation System
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from src.recommendation.recommendation_engine import (
    RecommendationEngine
)


engine = RecommendationEngine()

recommendations = engine.recommend(
    user_id="U001",
    month=7,
    top_n=5
)

print("\n========================================")
print("TOP DESTINATION RECOMMENDATIONS")
print("========================================")

for idx, rec in enumerate(
    recommendations,
    start=1
):

    print("\n----------------------------------------")
    print(f"Rank: {idx}")
    print(f"Destination: {rec['destination_name']}")
    print(f"Final Score: {rec['final_score']}")
    print(f"Preference Score: {rec['preference_score']}")
    print(f"Popularity Score: {rec['popularity_score']}")
    print(f"Sustainability Score: {rec['sustainability_score']}")
    print(f"Congestion Score: {rec['congestion_score']}")