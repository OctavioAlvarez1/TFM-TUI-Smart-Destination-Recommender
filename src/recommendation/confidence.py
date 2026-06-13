"""
=====================================================
TUI Smart Destination Recommender
Confidence Engine
=====================================================

Purpose
-------
Calculate recommendation confidence scores.

Confidence indicates how reliable a recommendation
is based on available signals.

Author
------
Octavio Alvarez
"""

class ConfidenceEngine:
    """
    Recommendation confidence calculator.
    """

    @staticmethod
    def calculate_confidence(
        preference_score,
        popularity_score,
        sustainability_score
    ):
        """
        Calculate confidence score.

        Returns
        -------
        float
            Confidence score (0-100).
        """

        confidence = (
            0.50 * preference_score +
            0.30 * popularity_score +
            0.20 * sustainability_score
        )

        return round(
            min(confidence, 100),
            2
        )