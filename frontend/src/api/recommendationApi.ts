import axios from "axios";

const API_URL = "http://localhost:8000";

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