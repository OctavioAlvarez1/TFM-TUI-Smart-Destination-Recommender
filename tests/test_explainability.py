"""
=====================================================
TUI Smart Destination Recommender
Explainability Engine Tests
=====================================================

Purpose
-------
Validate explanation generation logic.

Author
------
Octavio Alvarez
"""

from src.recommendation.explainability import (
    ExplainabilityEngine
)


def test_generate_explanations():
    """
    Test explanation generation.
    """

    engine = ExplainabilityEngine()

    explanations = (
        engine.generate_explanations(
            travel_style="Nature",
            preference_score=90,
            sustainability_score=92,
            congestion_score=30,
            popularity_score=85
        )
    )

    assert len(explanations) > 0

    assert (
        "Strong match"
        in explanations[0]
    )


def test_returns_list():
    """
    Verify output type.
    """

    engine = ExplainabilityEngine()

    explanations = (
        engine.generate_explanations(
            travel_style="Culture",
            preference_score=70,
            sustainability_score=75,
            congestion_score=50,
            popularity_score=60
        )
    )

    assert isinstance(
        explanations,
        list
    )


def test_empty_explanations():
    """
    Verify low-scoring destinations
    can still return a valid list.
    """

    engine = ExplainabilityEngine()

    explanations = (
        engine.generate_explanations(
            travel_style="Nightlife",
            preference_score=20,
            sustainability_score=30,
            congestion_score=60,
            popularity_score=20
        )
    )

    assert isinstance(
        explanations,
        list
    )