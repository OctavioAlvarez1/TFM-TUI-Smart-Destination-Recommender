from src.recommendation.confidence import (
    ConfidenceEngine
)


def test_confidence_score():

    score = (
        ConfidenceEngine.calculate_confidence(
            preference_score=90,
            popularity_score=80,
            sustainability_score=95
        )
    )

    assert score > 0
    assert score <= 100