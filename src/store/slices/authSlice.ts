import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types/interfaces";

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("jwt"),
  token: localStorage.getItem("jwt") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem("jwt", action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("jwt"); 
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
