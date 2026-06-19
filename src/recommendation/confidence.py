"""
Recommendation confidence calculator.
Combines: 50% preference match + 30% popularity + 20% sustainability.
Outputs a 0-100 confidence score indicating how well the destination fits the traveler.
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