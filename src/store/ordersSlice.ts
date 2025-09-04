import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  code: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  trackingStatus: string;
  trackingNumber?: string;
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    clearOrders: (state) => {
      state.orders = [];
    },
    updateOrderTracking: (
      state,
      action: PayloadAction<{ orderCode: string; trackingStatus: string }>
    ) => {
      const { orderCode, trackingStatus } = action.payload;
      const order = state.orders.find((order) => order.code === orderCode);
      if (order) {
        order.trackingStatus = trackingStatus;
      }
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((order) => order.code !== action.payload);
    },
  },
});

export const { addOrder, clearOrders, updateOrderTracking, removeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
