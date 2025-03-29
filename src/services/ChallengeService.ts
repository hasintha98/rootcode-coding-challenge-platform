import axios from '../utils/axiosConfig';

const API = import.meta.env.VITE_CHALLENGE_API;

export const ChallengeService = {
  fetchQuestionsByID: async (id: number | string) => {
    try {
      const response = await axios.get(`${API}?id=${id}`);
      return response.data.data[0];
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  },
  fetchChallenges: async (
    page: number,
    limit: number,
    language?: number | null,
    level?: string | null
  ) => {
    try {
      let url = `${API}?page=${page}&limit=${limit}`;
      if (language) url += `&language=${language}`;
      if (level) url += `&level=${level}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  },
};
