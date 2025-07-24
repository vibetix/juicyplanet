import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Cart Item interface
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Define the initial state
interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [
    // Optional: pre-fill with test data
    // {
    //   id: 1,
    //   name: 'Glow-Up Greens',
    //   price: 8.99,
    //   quantity: 2,
    //   image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=800&fit=crop&crop=center',
    // },
  ],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Remove an item completely
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Update quantity (+1 or -1)
    updateQuantity(
      state,
      action: PayloadAction<{ id: number; change: number }>
    ) {
      const { id, change } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        const newQuantity = item.quantity + change;
        item.quantity = newQuantity > 1 ? newQuantity : 1;
      }
    },

    // Optional: add an item
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    // Optional: clear the cart
clearCart: (state) => {
  state.items = []; // or however you store the cart
}

  },
});

export const { removeItem, updateQuantity, addItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
