import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void; // ✅ Added clearCart
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        updated = [...prev, { ...item, quantity }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, quantity } : i));
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart'); // ✅ also clear localStorage
  };

  const getTotalCount = () => items.reduce((sum, i) => sum + i.quantity, 0);
  const getTotalPrice = () => items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotalCount, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
