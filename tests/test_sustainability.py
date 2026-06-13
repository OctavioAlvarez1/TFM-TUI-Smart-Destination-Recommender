"""
=====================================================
TUI Smart Destination Recommender
Sustainability Engine Test
=====================================================
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from src.data.data_loader import DataLoader
from src.recommendation.sustainability import (
    SustainabilityEngine
)

sustainability = (
    DataLoader.load_sustainability()
)

destination_id = "D001"

score = (
    SustainabilityEngine.get_sustainability_score(
        destination_id,
        sustainability
    )
)

classification = (
    SustainabilityEngine.classify_sustainability(
        score
    )
)

multiplier = (
    SustainabilityEngine.get_score_multiplier(
        score
    )
)

print(f"Destination: {destination_id}")
print(f"Sustainability Score: {score}")
print(f"Classification: {classification}")
print(f"Multiplier: {multiplier}")