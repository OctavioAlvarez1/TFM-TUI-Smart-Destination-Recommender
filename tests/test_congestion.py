"""
=====================================================
TUI Smart Destination Recommender
Congestion Engine Test
=====================================================
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from src.data.data_loader import DataLoader
from src.recommendation.congestion import (
    CongestionEngine
)

congestion = DataLoader.load_congestion()

destination_id = "D001"
month = 7

score = (
    CongestionEngine.get_congestion_score(
        destination_id,
        month,
        congestion
    )
)

classification = (
    CongestionEngine.classify_congestion(
        score
    )
)

adjustment = (
    CongestionEngine.get_congestion_adjustment(
        score
    )
)

multiplier = (
    CongestionEngine.get_score_multiplier(
        score
    )
)

print(f"Destination: {destination_id}")
print(f"Month: {month}")
print(f"Congestion Score: {score}")
print(f"Classification: {classification}")
print(f"Adjustment: {adjustment}")
print(f"Multiplier: {multiplier}")