"""
Inspect destinations dataset
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from src.data.data_loader import DataLoader

destinations = DataLoader.load_destinations()

print(destinations.columns.tolist())
print()
print(destinations.head())