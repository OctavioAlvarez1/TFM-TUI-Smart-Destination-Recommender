"""
=====================================================
TUI Smart Destination Recommender
Sustainability Engine
=====================================================

Purpose
-------
Manage sustainability metrics and business rules
for destination recommendations.

Responsibilities
----------------
- Retrieve sustainability scores
- Classify sustainability performance
- Apply sustainability business rules

Author
------
Octavio Alvarez

Project
-------
TUI Smart Destination Recommender
AI-Powered Sustainable Tourism Recommendation System
"""


class SustainabilityEngine:
    """
    Sustainability scoring and classification engine.
    """

    @staticmethod
    def get_sustainability_score(
        destination_id,
        sustainability_df
    ):
        """
        Retrieve sustainability score for a destination.

        Parameters
        ----------
        destination_id : str
        sustainability_df : pandas.DataFrame

        Returns
        -------
        float
        """

        result = sustainability_df[
            sustainability_df["destination_id"] == destination_id
        ]

        if result.empty:
            return 50.0

        return float(
            result.iloc[0]["sustainability_score"]
        )

    @staticmethod
    def classify_sustainability(
        sustainability_score
    ):
        """
        Classify sustainability performance.

        Parameters
        ----------
        sustainability_score : float

        Returns
        -------
        str
        """

        if sustainability_score >= 85:
            return "Excellent"

        if sustainability_score >= 70:
            return "Good"

        if sustainability_score >= 50:
            return "Moderate"

        return "Poor"

    @staticmethod
    def get_score_multiplier(
        sustainability_score
    ):
        """
        Apply sustainability business rules.

        Rules
        -----
        >85 : +5% boost
        <50 : -10% penalty

        Returns
        -------
        float
        """

        if sustainability_score > 85:
            return 1.05

        if sustainability_score < 50:
            return 0.90

        return 1.00