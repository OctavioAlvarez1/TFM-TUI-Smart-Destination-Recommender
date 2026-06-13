"""
=====================================================
TUI Smart Destination Recommender
Data Loader Tests
=====================================================

Purpose
-------
Validate that all datasets can be loaded
successfully through the DataLoader module.

Author
------
Octavio Alvarez
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from src.data.data_loader import DataLoader


def test_load_destinations():
    """
    Validate destinations dataset.
    """

    destinations = DataLoader.load_destinations()

    assert not destinations.empty

    assert "destination_id" in destinations.columns
    assert "destination_name" in destinations.columns


def test_load_users():
    """
    Validate users dataset.
    """

    users = DataLoader.load_users()

    assert not users.empty

    assert "user_id" in users.columns
    assert "travel_style" in users.columns


def test_load_bookings():
    """
    Validate bookings dataset.
    """

    bookings = DataLoader.load_bookings()

    assert not bookings.empty

    assert "booking_id" in bookings.columns
    assert "user_id" in bookings.columns
    assert "destination_id" in bookings.columns


def test_load_sustainability():
    """
    Validate sustainability dataset.
    """

    sustainability = (
        DataLoader.load_sustainability()
    )

    assert not sustainability.empty

    assert "destination_id" in sustainability.columns
    assert "sustainability_score" in sustainability.columns


def test_load_congestion():
    """
    Validate congestion dataset.
    """

    congestion = (
        DataLoader.load_congestion()
    )

    assert not congestion.empty

    assert "destination_id" in congestion.columns
    assert "congestion_score" in congestion.columns