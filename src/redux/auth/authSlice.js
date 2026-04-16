import { createSlice } from "@reduxjs/toolkit";
import { loginMessage, errorMessage } from "../toasts";
import {
  loginApi,
  signUpApi,
  logoutApi,
  updateUserDataApi,
} from "./authApis";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateCart: (state, action) => {
      if (state.user) {
        state.user.cartInfo = action.payload;
      }
    },
    clearCart: (state) => {
      if (state.user) {
        state.user.cartInfo = {
          cart: [],
          isEmpty: true,
          totalPrice: 0,
        };
      }
    },
    // Called on app initialization to restore session from localStorage
    restoreSession: (state, action) => {
      // Note: actual auth state comes from Firebase onAuthStateChanged
      // This is just for loading stored user metadata
      const stored = action.payload;
      if (stored) {
        state.user = stored;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUpApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpApi.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        loginMessage("Registration successful");
      })
      .addCase(signUpApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        loginMessage("Login successful");
      })
      .addCase(loginApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutApi.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Update User
      .addCase(updateUserDataApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDataApi.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        loginMessage("Profile updated successfully");
      })
      .addCase(updateUserDataApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  logout,
  updateCart,
  clearCart,
  restoreSession,
} = authSlice.actions;
export default authSlice.reducer;