"""
=====================================================
TUI Smart Destination Recommender
Scoring Engine Test
=====================================================
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from src.data.data_loader import DataLoader
from src.recommendation.scoring import ScoringEngine


users = DataLoader.load_users()
destinations = DataLoader.load_destinations()

user = users.iloc[0]
destination = destinations.iloc[0]

preference_score = ScoringEngine.calculate_preference_score(
    user,
    destination
)

print("User Travel Style:")
print(user["travel_style"])

print("\nDestination:")
print(destination["destination_name"])

print("\nPreference Score:")
print(preference_score)

final_score = ScoringEngine.calculate_final_score(
    preference_score=preference_score,
    sustainability_score=75,
    popularity_score=70,
    congestion_score=30
)

print("\nFinal Score:")
print(final_score)