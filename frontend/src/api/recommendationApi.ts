// Axios HTTP client for the FastAPI backend (localhost:8000).
// getRecommendations(request) — POSTs to /recommendations, returns ranked destination list.
// getUserProfile(userId) — GETs /users/{userId}, returns traveler profile for SearchBar chips.
import axios from "axios";

const API_URL = "http://localhost:8000";

export interface UserProfile {
  user_id: string;
  country: string;
  age_group: string;
  budget_level: string;
  travel_style: string;
  sustainability_preference: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  return response.data;
};

export const getRecommendations = async (
  userId: string,
  month: number,
  topN: number
) => {
  const response = await axios.post(
    `${API_URL}/recommendations`,
    {
      user_id: userId,
      month,
      top_n: topN,
    }
  );

  return response.data;
};