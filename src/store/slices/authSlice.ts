import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types/interfaces";
import { TokenService } from "../../services/TokenService";

const initialState: AuthState = {
  isAuthenticated: !!TokenService.getToken(),
  token: TokenService.getToken() || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      TokenService.updateToken(action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      TokenService.removeToken();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
