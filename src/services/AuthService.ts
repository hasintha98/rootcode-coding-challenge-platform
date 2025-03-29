import axios from "axios";
import { LoginRequest } from "../types/types";

const API = import.meta.env.VITE_AUTH_API;

export const AuthService = {
  login: async (loginReqBody: LoginRequest) => {
    try {
      const response = await axios.post(`${API}/login`, loginReqBody);
      return response;
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  },
};
