"""
Data access layer.
Static methods to load each CSV into a pandas DataFrame.
All modules should go through DataLoader instead of reading CSVs directly.
"""

import pandas as pd

from src.config.settings import (
    DESTINATIONS_FILE,
    USERS_FILE,
    BOOKINGS_FILE,
    SUSTAINABILITY_FILE,
    CONGESTION_FILE
)


class DataLoader:
    """
    Centralized dataset loader.

    Provides standardized access to all datasets
    used by the recommendation engine.
    """

    @staticmethod
    def load_destinations():
        """
        Load destinations master dataset.

        Returns
        -------
        pandas.DataFrame
            Destinations dataset.
        """
        df = pd.read_csv(DESTINATIONS_FILE)

        # Remove empty columns accidentally exported from Excel
        df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

        return df

    @staticmethod
    def load_users():
        """
        Load user profiles dataset.

        Returns
        -------
        pandas.DataFrame
            User profiles dataset.
        """
        df = pd.read_csv(USERS_FILE)

        # Remove empty columns accidentally exported from Excel
        df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

        return df

    @staticmethod
    def load_bookings():
        """
        Load historical bookings dataset.

        Returns
        -------
        pandas.DataFrame
            Historical bookings dataset.
        """
        df = pd.read_csv(BOOKINGS_FILE)

        # Remove empty columns accidentally exported from Excel
        df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

        return df

    @staticmethod
    def load_sustainability():
        """
        Load sustainability scores dataset.

        Returns
        -------
        pandas.DataFrame
            Sustainability scores dataset.
        """
        df = pd.read_csv(SUSTAINABILITY_FILE)

        # Remove empty columns accidentally exported from Excel
        df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

        return df

    @staticmethod
    def load_congestion():
        """
        Load congestion scores dataset.

        Returns
        -------
        pandas.DataFrame
            Congestion scores dataset.
        """
        df = pd.read_csv(CONGESTION_FILE)

        # Remove empty columns accidentally exported from Excel
        df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

        return df