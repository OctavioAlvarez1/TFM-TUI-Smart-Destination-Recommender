"""
=====================================================
TUI Smart Destination Recommender
Executive Dashboard
=====================================================

Purpose
-------
Interactive dashboard for generating and
visualizing sustainable destination
recommendations.

Features
--------
- User selection
- Travel month selection
- Top-N recommendations
- KPI dashboard
- User profile overview
- Explainable AI output
- Recommendation visualizations

Author
------
Octavio Alvarez
"""

import os
import sys
from pathlib import Path

# --------------------------------------------------
# Project Root Configuration
# --------------------------------------------------

PROJECT_ROOT = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".."
    )
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# --------------------------------------------------
# Imports
# --------------------------------------------------

import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt

from src.data.data_loader import DataLoader

from src.recommendation.recommendation_engine import (
    RecommendationEngine
)

from src.dashboard.components.sidebar import (
    render_sidebar
)

# --------------------------------------------------
# Page Configuration
# --------------------------------------------------

st.set_page_config(
    page_title="TUI Smart Destination Recommender",
    page_icon="🌍",
    layout="wide"
)

# --------------------------------------------------
# Theme Loader
# --------------------------------------------------

def load_css(file_name):
    """
    Load CSS theme file.
    """

    css_path = (
        Path(__file__).parent
        / "themes"
        / file_name
    )

    with open(
        css_path,
        encoding="utf-8"
    ) as file:

        st.markdown(
            f"""
            <style>
            {file.read()}
            </style>
            """,
            unsafe_allow_html=True
        )

# --------------------------------------------------
# Load Data
# --------------------------------------------------

users = DataLoader.load_users()

engine = RecommendationEngine()

# --------------------------------------------------
# Sidebar
# --------------------------------------------------

theme, user_id, month, top_n = (
    render_sidebar(users)
)

# --------------------------------------------------
# Theme Engine
# --------------------------------------------------

if theme == "Dark":

    load_css("dark.css")

else:

    load_css("light.css")

# --------------------------------------------------
# Dashboard Title
# --------------------------------------------------

st.title(
    "🌍 TUI Smart Destination Recommender"
)

st.markdown(
    """
    AI-powered destination recommendations
    incorporating sustainability, popularity,
    congestion management and explainability.
    """
)

# --------------------------------------------------
# Selected User
# --------------------------------------------------

selected_user = users[
    users["user_id"] == user_id
].iloc[0]

# --------------------------------------------------
# Generate Recommendations
# --------------------------------------------------

recommendations = engine.recommend(
    user_id=user_id,
    month=month,
    top_n=top_n
)

recommendations_df = pd.DataFrame(
    recommendations
)

# --------------------------------------------------
# KPI Metrics
# --------------------------------------------------

top_score = recommendations_df[
    "final_score"
].max()

avg_confidence = round(
    recommendations_df[
        "confidence_score"
    ].mean(),
    2
)

avg_sustainability = round(
    recommendations_df[
        "sustainability_score"
    ].mean(),
    2
)

recommendation_count = len(
    recommendations_df
)

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        "Top Score",
        top_score
    )

with col2:
    st.metric(
        "Avg Confidence",
        avg_confidence
    )

with col3:
    st.metric(
        "Avg Sustainability",
        avg_sustainability
    )

with col4:
    st.metric(
        "Recommendations",
        recommendation_count
    )

# --------------------------------------------------
# User Profile
# --------------------------------------------------

st.header(
    "User Profile"
)

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        "Country",
        selected_user["country"]
    )

with col2:
    st.metric(
        "Travel Style",
        selected_user["travel_style"]
    )

with col3:
    st.metric(
        "Budget",
        selected_user["budget_level"]
    )

with col4:
    st.metric(
        "Sustainability",
        selected_user[
            "sustainability_preference"
        ]
    )

# --------------------------------------------------
# Top Recommendation
# --------------------------------------------------

best = recommendations[0]

st.header(
    "🏆 Recommended Destination"
)

st.success(
    f"""
    Destination: {best['destination_name']}

    Final Score: {best['final_score']}

    Confidence Score: {best['confidence_score']}
    """
)

# --------------------------------------------------
# Top Recommendations
# --------------------------------------------------

st.header(
    "Top Recommendations"
)

st.dataframe(
    recommendations_df[
        [
            "recommendation_rank",
            "destination_name",
            "final_score",
            "confidence_score"
        ]
    ],
    use_container_width=True
)

# --------------------------------------------------
# Recommendation Metrics
# --------------------------------------------------

st.header(
    "Recommendation Metrics"
)

st.dataframe(
    recommendations_df[
        [
            "destination_name",
            "preference_score",
            "popularity_score",
            "sustainability_score",
            "congestion_score",
            "confidence_score"
        ]
    ],
    use_container_width=True
)

# --------------------------------------------------
# Explainable AI
# --------------------------------------------------

st.header(
    "Explainable AI"
)

for recommendation in recommendations:

    with st.expander(
        f"#{recommendation['recommendation_rank']} "
        f"{recommendation['destination_name']}"
    ):

        for explanation in recommendation[
            "explanations"
        ]:

            st.write(
                f"• {explanation}"
            )

# --------------------------------------------------
# Recommendation Score Chart
# --------------------------------------------------

st.header(
    "Recommendation Scores"
)

fig, ax = plt.subplots(
    figsize=(10, 5)
)

ax.bar(
    recommendations_df[
        "destination_name"
    ],
    recommendations_df[
        "final_score"
    ]
)

ax.set_title(
    "Final Recommendation Score"
)

ax.tick_params(
    axis="x",
    rotation=45
)

plt.tight_layout()

st.pyplot(fig)

# --------------------------------------------------
# Sustainability Analysis
# --------------------------------------------------

st.header(
    "Sustainability Analysis"
)

fig, ax = plt.subplots(
    figsize=(10, 5)
)

ax.bar(
    recommendations_df[
        "destination_name"
    ],
    recommendations_df[
        "sustainability_score"
    ]
)

ax.set_title(
    "Sustainability Score"
)

ax.tick_params(
    axis="x",
    rotation=45
)

plt.tight_layout()

st.pyplot(fig)

# --------------------------------------------------
# Recommendation Confidence
# --------------------------------------------------

st.header(
    "Recommendation Confidence"
)

fig, ax = plt.subplots(
    figsize=(10, 5)
)

ax.bar(
    recommendations_df[
        "destination_name"
    ],
    recommendations_df[
        "confidence_score"
    ]
)

ax.set_title(
    "Confidence Score"
)

ax.tick_params(
    axis="x",
    rotation=45
)

plt.tight_layout()

st.pyplot(fig)

# --------------------------------------------------
# Sustainability vs Recommendation
# --------------------------------------------------

st.header(
    "Sustainability vs Recommendation Score"
)

fig, ax = plt.subplots(
    figsize=(8, 6)
)

ax.scatter(
    recommendations_df[
        "sustainability_score"
    ],
    recommendations_df[
        "final_score"
    ]
)

for _, row in recommendations_df.iterrows():

    ax.annotate(
        row["destination_name"],
        (
            row["sustainability_score"],
            row["final_score"]
        )
    )

ax.set_xlabel(
    "Sustainability Score"
)

ax.set_ylabel(
    "Final Recommendation Score"
)

ax.set_title(
    "Destination Sustainability vs Recommendation Performance"
)

plt.tight_layout()

st.pyplot(fig)

# --------------------------------------------------
# Footer
# --------------------------------------------------

st.markdown("---")

st.caption(
    "TUI Smart Destination Recommender | AI-Powered Sustainable Tourism Recommendations"
)