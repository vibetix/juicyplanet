import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

  // Optional: Warn in dev if price is invalid
  if (process.env.NODE_ENV === 'development') {
    items.forEach((item) => {
      if (typeof item.price !== 'number') {
        console.warn('Invalid item price:', item);
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 container mx-auto pt-[60px]">
        <h1 className="text-3xl font-raleway font-bold text-gray-800 mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center text-gray-500 font-quicksand">Your cart is empty.</div>
        ) : (
          <div className="space-y-8">
            {/* Cart Items */}
            <div className="space-y-4 border-b pb-6 border-juicy-yellow/20">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-juicy-yellow/20"
                >
                  {/* Product Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-lg font-quicksand font-medium text-gray-800">{item.name}</h2>
                      <p className="text-sm text-juicy-green font-quicksand">
                        ¢{(item.price ?? 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="border-juicy-yellow text-juicy-yellow hover:bg-juicy-yellow hover:text-white"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-quicksand text-gray-800 w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="border-juicy-yellow text-juicy-yellow hover:bg-juicy-yellow hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-juicy-red hover:text-juicy-red/80"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Total & Actions */}
            <div className="flex justify-end">
              <div className="bg-juicy-yellow/10 p-6 rounded-lg w-full max-w-md space-y-4">
                <div className="flex justify-between text-lg font-quicksand font-medium text-gray-800">
                  <span>Total:</span>
                  <span>¢{getTotalPrice().toFixed(2)}</span>
                </div>

                <Button className="w-full bg-juicy-yellow text-gray-800 hover:bg-juicy-yellow-light font-quicksand font-semibold rounded-full shadow-md hover:shadow-lg" asChild>
                  <Link to="/Checkout">Proceed to Checkout</Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-juicy-green text-juicy-green hover:bg-juicy-green hover:text-white transition-all font-quicksand rounded-full"
                  asChild
                >
                  <Link to="/Shop">Continue Shopping</Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-juicy-red hover:underline mt-2 font-quicksand"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
