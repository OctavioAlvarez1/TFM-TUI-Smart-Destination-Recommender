"""
Explainability Engine

Purpose
-------
Generate human-readable explanations for destination recommendations.

This module converts recommendation signals into transparent
explanations that can be displayed to travelers and executives.

Supports:
- Preference explanations
- Sustainability explanations
- Congestion explanations
- Popularity explanations

Author: TUI Smart Destination Recommender
"""

from typing import List


class ExplainabilityEngine:
    """
    Generates recommendation explanations based on scoring signals.
    """

    def generate_explanations(
        self,
        travel_style: str,
        preference_score: float,
        sustainability_score: float,
        congestion_score: float,
        popularity_score: float
    ) -> List[str]:
        """
        Generate a list of recommendation explanations.

        Parameters
        ----------
        travel_style : str
            User travel preference.

        preference_score : float
            Destination preference match score.

        sustainability_score : float
            Sustainability performance score.

        congestion_score : float
            Congestion level score.

        popularity_score : float
            Destination popularity score.

        Returns
        -------
        List[str]
            Human-readable recommendation explanations.
        """

        explanations = []

        # --------------------------------------------------
        # Preference explanation
        # --------------------------------------------------

        if preference_score >= 80:
            explanations.append(
                f"Strong match for your {travel_style} travel preferences."
            )

        elif preference_score >= 60:
            explanations.append(
                f"Good match for your {travel_style} travel preferences."
            )

        # --------------------------------------------------
        # Sustainability explanation
        # --------------------------------------------------

        if sustainability_score >= 85:
            explanations.append(
                "Excellent sustainability performance."
            )

        elif sustainability_score >= 70:
            explanations.append(
                "Good sustainability performance."
            )

        # --------------------------------------------------
        # Congestion explanation
        # --------------------------------------------------

        if congestion_score < 40:
            explanations.append(
                "Lower expected congestion than comparable destinations."
            )

        elif congestion_score > 80:
            explanations.append(
                "Higher expected congestion during the selected period."
            )

        # --------------------------------------------------
        # Popularity explanation
        # --------------------------------------------------

        if popularity_score >= 80:
            explanations.append(
                "Popular among travelers with similar interests."
            )

        elif popularity_score >= 60:
            explanations.append(
                "Well-rated by previous travelers."
            )

        return explanations