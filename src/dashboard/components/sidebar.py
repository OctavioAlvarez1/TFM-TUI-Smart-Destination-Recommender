import streamlit as st


def render_sidebar(users):

    st.sidebar.header(
        "Recommendation Settings"
    )

    theme = st.sidebar.radio(
        "Appearance",
        [
            "Dark",
            "Light"
        ]
    )

    user_id = st.sidebar.selectbox(
        "Select User",
        users["user_id"].tolist()
    )

    month = st.sidebar.slider(
        "Travel Month",
        1,
        12,
        7
    )

    top_n = st.sidebar.slider(
        "Number of Recommendations",
        3,
        10,
        5
    )

    return (
        theme,
        user_id,
        month,
        top_n
    )