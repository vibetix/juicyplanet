// src/pages/Wishlist.tsx
import { useEffect, useState } from "react";
import { HeartOff } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useWishlist } from '@/context/WishlistContext';

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  images: string[];
}

const Wishlist = () => {
  const {items, addToWishlist, removeFromWishlist, isInWishlist} = useWishlist();
  const [loading, setLoading] = useState(true);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        <HeartOff className="w-12 h-12 mb-4" />
        <p className="text-lg">Your wishlist is empty.</p>
        <Link to="/shop" className="mt-4 text-blue-500 hover:underline">
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link to={`/product/${item.slug}`} key={item.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-md font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-700">GHC {item.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
