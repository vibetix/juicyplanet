// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  username?: string;
  phone?: string;
  access_token: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;

      // Persist user info and token to localStorage
      localStorage.setItem('auth_user', JSON.stringify(action.payload));
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem('auth_user');
    },

    setUserFromToken(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;
