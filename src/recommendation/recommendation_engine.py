"""
Main recommendation orchestrator.
Calls all sub-engines (Scoring, Popularity, Sustainability, Congestion, Confidence,
Explainability) in sequence, merges results and returns a ranked destination list.
"""

from src.data.data_loader import DataLoader

from src.recommendation.scoring import (
    ScoringEngine
)

from src.recommendation.popularity import (
    PopularityEngine
)

from src.recommendation.sustainability import (
    SustainabilityEngine
)

from src.recommendation.congestion import (
    CongestionEngine
)

from src.recommendation.explainability import (
    ExplainabilityEngine
)

from src.recommendation.confidence import (
    ConfidenceEngine
)


class RecommendationEngine:
    """
    Main recommendation orchestration engine.
    """

    def __init__(self):
        """
        Load datasets required by the engine.
        """

        self.users = DataLoader.load_users()

        self.destinations = (
            DataLoader.load_destinations()
        )

        self.bookings = (
            DataLoader.load_bookings()
        )

        self.sustainability = (
            DataLoader.load_sustainability()
        )

        self.congestion = (
            DataLoader.load_congestion()
        )

        self.popularity_scores = (
            PopularityEngine.calculate_popularity_scores(
                self.bookings
            )
        )

        # -----------------------------------------
        # Explainability Engine
        # -----------------------------------------

        self.explainer = (
            ExplainabilityEngine()
        )

    def recommend(
        self,
        user_id,
        month,
        top_n=5
    ):
        """
        Generate destination recommendations.

        Parameters
        ----------
        user_id : str
            User identifier.

        month : int
            Travel month.

        top_n : int
            Number of recommendations to return.

        Returns
        -------
        list
            Ranked recommendation results.
        """

        user = self.users[
            self.users["user_id"] == user_id
        ]

        if user.empty:
            raise ValueError(
                f"User {user_id} not found."
            )

        user = user.iloc[0]

        recommendations = []

        for _, destination in (
            self.destinations.iterrows()
        ):

            destination_id = (
                destination["destination_id"]
            )

            # -----------------------------------------
            # Preference Score
            # -----------------------------------------

            preference_score = (
                ScoringEngine.calculate_preference_score(
                    user,
                    destination
                )
            )

            # -----------------------------------------
            # Popularity Score
            # -----------------------------------------

            popularity_score = (
                PopularityEngine.get_destination_popularity(
                    destination_id,
                    self.popularity_scores
                )
            )

            # -----------------------------------------
            # Sustainability Score
            # -----------------------------------------

            sustainability_score = (
                SustainabilityEngine.get_sustainability_score(
                    destination_id,
                    self.sustainability
                )
            )

            # -----------------------------------------
            # Congestion Score
            # -----------------------------------------

            congestion_score = (
                CongestionEngine.get_congestion_score(
                    destination_id,
                    month,
                    self.congestion
                )
            )

            # -----------------------------------------
            # Final Recommendation Score
            # -----------------------------------------

            final_score = (
                ScoringEngine.calculate_final_score(
                    preference_score=preference_score,
                    sustainability_score=sustainability_score,
                    popularity_score=popularity_score,
                    congestion_score=congestion_score
                )
            )

            # -----------------------------------------
            # Confidence Score
            # -----------------------------------------

            confidence_score = (
                ConfidenceEngine.calculate_confidence(
                    preference_score=preference_score,
                    popularity_score=popularity_score,
                    sustainability_score=sustainability_score
                )
            )

            # -----------------------------------------
            # Explainability
            # -----------------------------------------

            explanations = (
                self.explainer.generate_explanations(
                    travel_style=user[
                        "travel_style"
                    ],
                    preference_score=preference_score,
                    sustainability_score=sustainability_score,
                    congestion_score=congestion_score,
                    popularity_score=popularity_score
                )
            )

            recommendations.append(
                {
                    "destination_id":
                        destination_id,

                    "destination_name":
                        destination[
                            "destination_name"
                        ],

                    "final_score":
                        round(
                            final_score,
                            2
                        ),

                    "preference_score":
                        round(
                            preference_score,
                            2
                        ),

                    "popularity_score":
                        round(
                            popularity_score,
                            2
                        ),

                    "sustainability_score":
                        round(
                            sustainability_score,
                            2
                        ),

                    "congestion_score":
                        round(
                            congestion_score,
                            2
                        ),

                    "confidence_score":
                        confidence_score,

                    "explanations":
                        explanations,

                    "recommendation_rank":
                        None
                }
            )

        # -----------------------------------------
        # Sort Recommendations
        # -----------------------------------------

        recommendations.sort(
            key=lambda x: x["final_score"],
            reverse=True
        )

        recommendations = (
            recommendations[:top_n]
        )

        # -----------------------------------------
        # Assign Ranking Position
        # -----------------------------------------

        for rank, recommendation in enumerate(
            recommendations,
            start=1
        ):
            recommendation[
                "recommendation_rank"
            ] = rank

        return recommendations