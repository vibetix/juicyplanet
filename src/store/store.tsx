// src/store/store.ts
import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';
import authReducer from './authSlice';
import type { RootState } from './types'; // Ensure this defines the correct shape for your root state

// Load persisted state from localStorage
const loadState = (): PreloadedState<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.warn('Failed to load state:', error);
    return undefined;
  }
};

// Persist selected slices of state to localStorage
const saveState = (state: RootState): void => {
  try {
    const stateToSave: Partial<RootState> = {
      cart: state.cart,
      orders: state.orders,
      auth: state.auth,
    };
    localStorage.setItem('reduxState', JSON.stringify(stateToSave));
  } catch (error) {
    console.warn('Failed to save state:', error);
  }
};

// Preload persisted state
const preloadedState = loadState();

// Create Redux store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    auth: authReducer,
  },
  preloadedState,
});

// Subscribe to store changes and persist them
store.subscribe(() => {
  saveState(store.getState());
});

// Export types
export type AppDispatch = typeof store.dispatch;
export type { RootState };
