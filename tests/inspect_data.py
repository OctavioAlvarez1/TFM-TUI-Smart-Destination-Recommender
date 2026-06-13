"""
=====================================================
TUI Smart Destination Recommender
Dataset Inspection Script
=====================================================

Purpose
-------
Inspect datasets structure before implementing
the recommendation engine.
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from src.data.data_loader import DataLoader


print("\n========== USERS ==========")
users = DataLoader.load_users()
print(users.head())
print(users.columns.tolist())

print("\n========== BOOKINGS ==========")
bookings = DataLoader.load_bookings()
print(bookings.head())
print(bookings.columns.tolist())

print("\n========== SUSTAINABILITY ==========")
sustainability = DataLoader.load_sustainability()
print(sustainability.head())
print(sustainability.columns.tolist())

print("\n========== CONGESTION ==========")
congestion = DataLoader.load_congestion()
print(congestion.head())
print(congestion.columns.tolist())