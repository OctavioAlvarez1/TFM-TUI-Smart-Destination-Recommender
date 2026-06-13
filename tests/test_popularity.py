"""
=====================================================
TUI Smart Destination Recommender
Popularity Engine Test
=====================================================
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from src.data.data_loader import DataLoader
from src.recommendation.popularity import PopularityEngine


bookings = DataLoader.load_bookings()

popularity_df = (
    PopularityEngine.calculate_popularity_scores(
        bookings
    )
)

print(popularity_df.head())

print("\nMost Popular Destinations")
print(
    popularity_df
    .sort_values(
        by="popularity_score",
        ascending=False
    )
    .head(10)
)