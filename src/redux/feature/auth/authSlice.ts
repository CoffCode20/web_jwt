import { getStoredTokens, isTokenValid } from "@/lib/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  name?: string;
  provider?: "google" | "github" | "facebook" | "email";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initialize state with stored tokens
const storedTokens = getStoredTokens();
const isAuthenticated = !!(
  storedTokens.accessToken && isTokenValid(storedTokens.accessToken)
);

console.log("Auth Slice Initialization:", {
  storedTokens,
  isAuthenticated,
  hasAccessToken: !!storedTokens.accessToken,
  tokenValid: isTokenValid(storedTokens.accessToken),
});

const initialState: AuthState = {
  user: null,
  accessToken: storedTokens.accessToken,
  refreshToken: storedTokens.refreshToken,
  isAuthenticated,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      console.log("Login Success:", action.payload);
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;

      // Store tokens in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      console.log("Login Failure:", action.payload);
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = action.payload;

      // Clear tokens from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
    logout: (state) => {
      console.log("Logout");
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;

      // Clear tokens from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      console.log("Update Tokens:", action.payload);
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Update tokens in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const tokens = getStoredTokens();
      console.log("Initialize Auth:", tokens);
      if (tokens.accessToken && isTokenValid(tokens.accessToken)) {
        state.isAuthenticated = true;
        state.accessToken = tokens.accessToken;
        state.refreshToken = tokens.refreshToken;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateTokens,
  clearError,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
