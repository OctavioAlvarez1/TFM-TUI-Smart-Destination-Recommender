"""
=====================================================
TUI Smart Destination Recommender
Scoring Engine
=====================================================

Purpose
-------
Calculate recommendation scores for candidate
destinations.

Scoring Components
------------------
- Preference Score
- Sustainability Score
- Popularity Score
- Congestion Adjustment

Business Rules
--------------
- Sustainability boost
- Sustainability penalty
- Congestion boost
- Congestion penalty

Formula
-------
Final Score =
(0.45 × Preference Score)
+
(0.25 × Sustainability Score)
+
(0.15 × Popularity Score)
+
(0.15 × Congestion Adjustment)

Author
------
Octavio Alvarez

Project
-------
TUI Smart Destination Recommender
AI-Powered Sustainable Tourism Recommendation System
"""


class ScoringEngine:
    """
    Core scoring engine responsible for calculating
    recommendation scores for destinations.
    """

    STYLE_MAPPING = {
        "Nature": "nature_score",
        "Relax": "beach_score",
        "Family": "family_friendly_score",
        "Nightlife": "nightlife_score",
        "Culture": "culture_score"
    }

    @classmethod
    def calculate_preference_score(cls, user, destination):
        """
        Calculate preference score based on the user's
        travel style and destination attributes.

        Parameters
        ----------
        user : pandas.Series
        destination : pandas.Series

        Returns
        -------
        float
            Preference score normalized to 0-100.
        """

        travel_style = user["travel_style"]

        score_column = cls.STYLE_MAPPING.get(travel_style)

        if score_column is None:
            return 50.0

        raw_score = destination[score_column]

        return raw_score * 10

    @staticmethod
    def calculate_congestion_adjustment(congestion_score):
        """
        Convert congestion score into a positive
        recommendation factor.

        Parameters
        ----------
        congestion_score : float

        Returns
        -------
        float
        """

        return 100 - congestion_score

    @staticmethod
    def calculate_final_score(
        preference_score,
        sustainability_score,
        popularity_score,
        congestion_score
    ):
        """
        Calculate final recommendation score using
        the official TUI scoring formula.

        Parameters
        ----------
        preference_score : float
        sustainability_score : float
        popularity_score : float
        congestion_score : float

        Returns
        -------
        float
            Final destination score.
        """

        congestion_adjustment = (
            ScoringEngine.calculate_congestion_adjustment(
                congestion_score
            )
        )

        final_score = (
            0.45 * preference_score
            + 0.25 * sustainability_score
            + 0.15 * popularity_score
            + 0.15 * congestion_adjustment
        )

        # Sustainability boost
        if sustainability_score > 85:
            final_score *= 1.05

        # Sustainability penalty
        elif sustainability_score < 50:
            final_score *= 0.90

        # Low congestion boost
        if congestion_score < 40:
            final_score *= 1.05

        # High congestion penalty
        elif congestion_score > 80:
            final_score *= 0.90

        return round(final_score, 2)