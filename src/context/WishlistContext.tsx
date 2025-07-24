// src/context/WishlistContext.tsx
import React, { createContext, useContext, useState } from "react";

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const addToWishlist = (item: WishlistItem) => {
    if (!items.find((i) => i.id === item.id)) {
      setItems([...items, item]);
    }
  };

  const removeFromWishlist = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const isInWishlist = (id: number) => items.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
