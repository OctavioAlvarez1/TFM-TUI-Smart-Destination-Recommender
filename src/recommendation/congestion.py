"""
Congestion scoring engine.
Reads monthly congestion levels from congestion_scores.csv (derived from INE EOH data).
Returns a 0-100 congestion score for the requested travel month;
destinations scoring > 80 receive a −10% redistribution penalty.
"""


class CongestionEngine:
    """
    Destination congestion management engine.
    """

    @staticmethod
    def get_congestion_score(
        destination_id,
        month,
        congestion_df
    ):
        """
        Retrieve congestion score for a destination
        in a given month.

        Parameters
        ----------
        destination_id : str
        month : int
        congestion_df : pandas.DataFrame

        Returns
        -------
        float
        """

        result = congestion_df[
            (congestion_df["destination_id"] == destination_id)
            &
            (congestion_df["month"] == month)
        ]

        if result.empty:
            return 50.0

        return float(
            result.iloc[0]["congestion_score"]
        )

    @staticmethod
    def classify_congestion(
        congestion_score
    ):
        """
        Classify congestion level.

        Parameters
        ----------
        congestion_score : float

        Returns
        -------
        str
        """

        if congestion_score < 40:
            return "Low"

        if congestion_score < 70:
            return "Moderate"

        return "High"

    @staticmethod
    def get_congestion_adjustment(
        congestion_score
    ):
        """
        Convert congestion score into a positive
        recommendation factor.

        Formula
        -------
        100 - congestion_score

        Returns
        -------
        float
        """

        return 100 - congestion_score

    @staticmethod
    def get_score_multiplier(
        congestion_score
    ):
        """
        Apply congestion business rules.

        Rules
        -----
        <40 : +5% boost
        >80 : -10% penalty

        Returns
        -------
        float
        """

        if congestion_score < 40:
            return 1.05

        if congestion_score > 80:
            return 0.90

        return 1.00