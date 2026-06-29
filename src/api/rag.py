"""
RAG (Retrieval-Augmented Generation) module for the TUI Smart Destination Recommender.

TourismRAG:
  - Loads destinations, sustainability, and congestion CSVs via DataLoader.
  - Converts each destination into a rich text document (all attributes included).
  - Creates OpenAI text-embedding-3-small embeddings in one batch call.
  - Builds a FAISS IndexFlatIP (inner-product on L2-normalised vectors ≡ cosine similarity).
  - retrieve(query, k) → top-k document texts.
  - chat(history, user_message) → GPT-4o-mini response string.

If OPENAI_API_KEY is not set the class degrades gracefully without crashing FastAPI.
"""

import os

import numpy as np
import pandas as pd

from src.data.data_loader import DataLoader


# ---------------------------------------------------------------------------
# Lazy imports — only needed when the key is present and RAG is actually used
# ---------------------------------------------------------------------------

def _import_faiss():
    import faiss  # noqa: PLC0415
    return faiss


def _get_openai_client(api_key: str):
    from openai import OpenAI  # noqa: PLC0415
    return OpenAI(api_key=api_key)


# ---------------------------------------------------------------------------
# Helper: build a rich text document for one destination
# ---------------------------------------------------------------------------

_MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]


def _build_document(
    dest_row: pd.Series,
    sust_df: pd.DataFrame,
    cong_df: pd.DataFrame,
) -> str:
    """
    Combine destination, sustainability and congestion data into a single
    plain-text document that will be embedded and stored in the vector index.
    """
    dest_id = dest_row["destination_id"]

    # ---- destination base attributes ----
    lines = [
        f"Destination: {dest_row['destination_name']} (ID: {dest_id})",
        f"Region: {dest_row['region']}",
        f"Type: {dest_row['destination_type']}",
        f"Beach score: {dest_row['beach_score']}/10",
        f"Culture score: {dest_row['culture_score']}/10",
        f"Nature score: {dest_row['nature_score']}/10",
        f"Nightlife score: {dest_row['nightlife_score']}/10",
        f"Family-friendly score: {dest_row['family_friendly_score']}/10",
        f"Average price per day: €{dest_row['avg_price_per_day']}",
    ]

    # ---- sustainability ----
    sust_row = sust_df[sust_df["destination_id"] == dest_id]
    if not sust_row.empty:
        sr = sust_row.iloc[0]
        lines += [
            f"Overall sustainability score: {sr['sustainability_score']}/100",
            f"Carbon footprint score: {sr['carbon_score']}/100",
            f"Local business support score: {sr['local_business_score']}/100",
            f"Public transport score: {sr['public_transport_score']}/100",
        ]

    # ---- congestion by month ----
    dest_cong = cong_df[cong_df["destination_id"] == dest_id].sort_values("month")
    if not dest_cong.empty:
        monthly_parts: list[str] = []
        for _, cr in dest_cong.iterrows():
            m_idx = int(cr["month"]) - 1
            m_name = _MONTH_NAMES[m_idx] if 0 <= m_idx < 12 else str(cr["month"])
            monthly_parts.append(
                f"{m_name}: {cr['congestion_score']} ({cr['congestion_level']})"
            )
        lines.append("Monthly congestion — " + "; ".join(monthly_parts))

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# TourismRAG
# ---------------------------------------------------------------------------

class TourismRAG:
    """
    RAG engine that answers tourism questions using destination data embedded
    with OpenAI and retrieved via FAISS cosine similarity (IndexFlatIP on
    L2-normalised vectors).
    """

    _EMBEDDING_MODEL = "text-embedding-3-small"
    _EMBEDDING_DIM = 1536          # output dimension of text-embedding-3-small
    _CHAT_MODEL = "gpt-4o-mini"

    _SYSTEM_PROMPT = (
        "You are an expert TUI tourism guide specialised in sustainable Spanish destinations. "
        "Your mission is to help travellers discover authentic, less overcrowded destinations across Spain. "
        "Answer ONLY using the destination context provided to you — do not invent data. "
        "Be concise, friendly, and professional. "
        "If the context does not contain enough information to answer accurately, say so honestly. "
        "Always end your responses with: '¿Puedo ayudarte con algo más?'"
    )

    def __init__(self) -> None:
        self._ready = False
        self._api_key: str | None = os.environ.get("OPENAI_API_KEY")

        if not self._api_key:
            # Graceful degradation — FastAPI still starts normally
            return

        faiss = _import_faiss()
        self._client = _get_openai_client(self._api_key)

        # ---- load data through the project's DataLoader ----
        dest_df = DataLoader.load_destinations()
        sust_df = DataLoader.load_sustainability()
        cong_df = DataLoader.load_congestion()

        # ---- build one text document per destination ----
        self._documents: list[str] = []
        for _, dest_row in dest_df.iterrows():
            doc = _build_document(dest_row, sust_df, cong_df)
            self._documents.append(doc)

        # ---- embed all documents in a single batch API call ----
        embed_response = self._client.embeddings.create(
            model=self._EMBEDDING_MODEL,
            input=self._documents,
        )
        raw_vecs = np.array(
            [item.embedding for item in embed_response.data],
            dtype=np.float32,
        )

        # L2-normalise → inner-product search equals cosine similarity
        norms = np.linalg.norm(raw_vecs, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1.0, norms)
        normalised = raw_vecs / norms

        # ---- build FAISS index ----
        self._index = faiss.IndexFlatIP(self._EMBEDDING_DIM)
        self._index.add(normalised)

        self._ready = True

    # ------------------------------------------------------------------
    # Public interface
    # ------------------------------------------------------------------

    def retrieve(self, query: str, k: int = 4) -> list[str]:
        """
        Embed *query* and return the texts of the top-k most similar documents.
        Returns an empty list if the engine is not ready (missing API key).
        """
        if not self._ready:
            return []

        q_response = self._client.embeddings.create(
            model=self._EMBEDDING_MODEL,
            input=[query],
        )
        q_vec = np.array(q_response.data[0].embedding, dtype=np.float32).reshape(1, -1)
        norm = np.linalg.norm(q_vec)
        if norm > 0:
            q_vec = q_vec / norm

        k = min(k, len(self._documents))
        _scores, indices = self._index.search(q_vec, k)

        return [self._documents[idx] for idx in indices[0] if idx >= 0]

    def chat(self, history: list[dict], user_message: str) -> str:
        """
        Build a RAG-augmented prompt and call GPT-4o-mini.

        Parameters
        ----------
        history:
            Prior conversation turns as list of {"role": ..., "content": ...} dicts.
        user_message:
            The latest message from the user.

        Returns
        -------
        str
            The assistant's reply.
        """
        if not self._ready:
            return (
                "El asistente inteligente no está disponible. "
                "Por favor configura la variable de entorno OPENAI_API_KEY para activarlo. "
                "¿Puedo ayudarte con algo más?"
            )

        # Retrieve relevant destination context
        context_docs = self.retrieve(user_message, k=4)
        context_block = "\n\n---\n\n".join(context_docs)

        system_content = (
            f"{self._SYSTEM_PROMPT}\n\n"
            "Below is the current destination data you must use to answer:\n\n"
            f"{context_block}"
        )

        # Assemble message list
        messages: list[dict] = [{"role": "system", "content": system_content}]

        for turn in history:
            role = turn.get("role", "")
            content = turn.get("content", "")
            if role in {"user", "assistant"} and content:
                messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": user_message})

        completion = self._client.chat.completions.create(
            model=self._CHAT_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=600,
        )

        return completion.choices[0].message.content or ""
