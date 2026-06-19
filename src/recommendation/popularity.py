"""
Popularity scoring engine.
Derives a 0-100 score per destination from booking history:
70% booking volume + 30% average user rating.
"""

import pandas as pd


class PopularityEngine:
    """
    Calculate popularity metrics for destinations.
    """

    @staticmethod
    def calculate_popularity_scores(bookings_df):
        """
        Calculate popularity score for all destinations.

        Parameters
        ----------
        bookings_df : pandas.DataFrame

        Returns
        -------
        pandas.DataFrame
        """

        popularity = (
            bookings_df
            .groupby("destination_id")
            .agg(
                booking_count=("booking_id", "count"),
                average_rating=("user_rating", "mean")
            )
            .reset_index()
        )

        max_bookings = popularity["booking_count"].max()

        popularity["booking_volume_score"] = (
            popularity["booking_count"] / max_bookings
        ) * 100

        popularity["rating_score"] = (
            popularity["average_rating"] / 5
        ) * 100

        popularity["popularity_score"] = (
            0.70 * popularity["booking_volume_score"]
            + 0.30 * popularity["rating_score"]
        )

        return popularity.round(2)

    @staticmethod
    def get_destination_popularity(
        destination_id,
        popularity_df
    ):
        """
        Get popularity score for a specific destination.

        Parameters
        ----------
        destination_id : str
        popularity_df : pandas.DataFrame

        Returns
        -------
        float
        """

        result = popularity_df[
            popularity_df["destination_id"] == destination_id
        ]

        if result.empty:
            return 50.0

        return float(
            result.iloc[0]["popularity_score"]
        )