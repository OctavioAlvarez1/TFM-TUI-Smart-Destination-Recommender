// Axios HTTP client for the RAG chat endpoint (POST /chat).
// sendChatMessage(message, history) — sends the user message and conversation
// history to the FastAPI backend and returns the assistant reply string.

import axios from "axios";

const API_URL = "http://localhost:8000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
}

export const sendChatMessage = async (
  message: string,
  history: ChatMessage[]
): Promise<string> => {
  const response = await axios.post<ChatResponse>(`${API_URL}/chat`, {
    message,
    history,
  });
  return response.data.reply;
};
