import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addOrder } from '@/store/ordersSlice';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // 👈 Added auth context
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const CheckoutPage = () => {
  const { user } = useAuth(); // get current user
  const { items, clearCart } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [mobileMoneyType, setMobileMoneyType] = useState('MTN');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [region, setRegion] = useState('');
  const [town, setTown] = useState('');
  const [orderCode, setOrderCode] = useState<string>('');

  const totalItems = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee =
    region === 'Greater Accra'
      ? 10
      : region === 'Ashanti'
      ? 20
      : region === 'Western'
      ? 25
      : region === 'Volta'
      ? 18
      : region === 'Eastern'
      ? 15
      : 0;
  const grandTotal = totalItems + deliveryFee;

  const generateOrderCode = () => `ORDER-${Date.now().toString().slice(-6)}`;
  const generateTrackingNumber = () => `TRK-${Date.now().toString().slice(-10)}`;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 Check auth before proceeding
    if (!user) {
      navigate('/Login', { state: { from: '/Checkout' } }); // or show a toast
      return;
    }

    setShowPaymentModal(true); // show modal
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    try {
      const response = await new Promise((res) =>
        setTimeout(() => res({ status: 'success' }), 2000)
      );

      if ((response as any).status === 'success') {
        const newOrderCode = generateOrderCode();
        const newTrackingNumber = generateTrackingNumber();

        dispatch(
          addOrder({
            code: newOrderCode,
            items,
            total: grandTotal,
            status: 'Completed',
            createdAt: new Date().toISOString(),
            trackingNumber: newTrackingNumber,
            trackingStatus: 'Pending',
          })
        );

        clearCart();

        setIsProcessing(false);
        setPaymentConfirmed(true);
        setOrderCode(newOrderCode);

        setTimeout(() => navigate('/Order'), 2000);
      }
    } catch (error) {
      setIsProcessing(false);
      alert('Oops! Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 container mx-auto max-w-4xl pt-[60px]">
        <h1 className="text-3xl font-raleway font-bold text-gray-800 mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center text-gray-500 font-quicksand">
            Your cart is empty.{' '}
            <a href="/Shop" className="text-juicy-green underline">Browse Products</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="p-6 border border-juicy-yellow/20 shadow-sm rounded-lg space-y-4">
              <h2 className="text-xl font-raleway font-semibold text-gray-800 mb-2">Order Summary</h2>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-gray-700 font-quicksand">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <hr className="border-juicy-yellow/20" />
              <div className="flex justify-between font-quicksand text-gray-800">
                <span>Items Total:</span>
                <span>GHS {totalItems.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-quicksand text-gray-800">
                <span>Delivery Fee:</span>
                <span>GHS {deliveryFee.toFixed(2)}</span>
              </div>
              <hr className="border-juicy-yellow/20" />
              <div className="flex justify-between text-lg font-quicksand font-medium text-gray-800">
                <span>Grand Total:</span>
                <span>GHS {grandTotal.toFixed(2)}</span>
              </div>
            </Card>
            
            {/* Payment and Delivery Info */}
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <Card className="p-6 border border-juicy-yellow/20 shadow-sm rounded-lg space-y-4">
                <h2 className="text-xl font-raleway font-semibold text-gray-800">Delivery Info</h2>
                <Input placeholder="Full Name" required className="font-quicksand" />
                <Input placeholder="Address" required className="font-quicksand" />

                <label className="text-sm font-quicksand text-gray-700 mt-2">Region:</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full border border-juicy-yellow/40 rounded-md p-2 font-quicksand text-sm text-gray-700"
                  required
                >
                  <option value="" disabled>
                    Select region
                  </option>
                  <option value="Greater Accra">Greater Accra</option>
                  <option value="Ashanti">Ashanti</option>
                  <option value="Western">Western</option>
                  <option value="Volta">Volta</option>
                  <option value="Eastern">Eastern</option>
                </select>

                <Input
                  placeholder="Town/City"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  required
                  className="font-quicksand"
                />

                <h2 className="text-xl font-raleway font-semibold text-gray-800 mt-6">Payment Info</h2>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-juicy-yellow/40 rounded-md p-2 font-quicksand text-sm text-gray-700"
                >
                  <option value="mobile-money">Mobile Money</option>
                  <option value="card">Credit/Debit Card</option>
                </select>

                {paymentMethod === 'mobile-money' && (
                  <>
                    <label className="text-sm font-quicksand text-gray-700 mt-2">
                      Mobile Money Provider:
                    </label>
                    <select
                      value={mobileMoneyType}
                      onChange={(e) => setMobileMoneyType(e.target.value)}
                      className="w-full border border-juicy-yellow/40 rounded-md p-2 font-quicksand text-sm text-gray-700"
                    >
                      <option value="MTN">MTN Mobile Money</option>
                      {/*<option value="Vodafone">Telecel Cash</option>
                      <option value="AirtelTigo">AirtelTigo Money</option>*/}
                    </select>

                    {/* Show the image/logo of the selected Mobile Money provider */}

                    <Input
                      placeholder="Mobile Money Number"
                      required
                      className="font-quicksand w-full mt-2"
                    />
                    <div className="flex justify-center mt-2">
                      {mobileMoneyType === 'MTN' && (
                        <img
                          src="/images/MTN.jpg"
                          alt="MTN Mobile Money"
                          className="h-20 w-40 rounded-full"
                        />
                      )}
                      {mobileMoneyType === 'Vodafone' && (
                        <img
                          src="/images/telecel.png"
                          alt="Vodafone Cash"
                          className="h-20 w-40 rounded-full"
                        />
                      )}
                      {mobileMoneyType === 'AirtelTigo' && (
                        <img
                          src="/images/AT.webp"
                          alt="AirtelTigo Money"
                          className="h-20 w-40 rounded-full"
                        />
                      )}
                    </div>
                  </>
                )}


                {paymentMethod === 'card' && (
                  <>
                    <label className="text-sm font-quicksand text-gray-700 mt-2">Card Number:</label>
                    <Input placeholder="Card Number" required className="font-quicksand w-full" />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Input placeholder="Expiry (MM/YY)" required className="font-quicksand w-full" />
                      <Input placeholder="CVV" required className="font-quicksand w-full" />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-juicy-yellow hover:bg-juicy-yellow-light text-gray-800 font-quicksand font-semibold rounded-full shadow-md"
                >
                  Place Order
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-juicy-green hover:underline mt-2 font-quicksand"
                  onClick={() => navigate('/Cart')}
                >
                  Back to Cart
                </Button>
              </Card>
            </form>
          </div>
        )}
      </main>

     {/* Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center space-y-4">
            {isProcessing ? (
              <>
                <p className="font-quicksand text-gray-800">Processing your payment...</p>
                <div className="animate-spin w-8 h-8 border-4 border-juicy-yellow border-t-transparent rounded-full mx-auto mt-2"></div>
              </>
            ) : paymentConfirmed ? (
              <>
                <h2 className="text-2xl font-raleway font-bold text-juicy-green">✅ Payment Successful</h2>
                <p className="font-quicksand text-gray-700 mt-2">Your order has been placed successfully! 🎉</p>
                <p className="font-quicksand text-sm text-gray-600 mt-2">Order code: <strong>{orderCode}</strong></p>
              </>
            ) : (
              <>
                <p className="font-quicksand text-gray-800">
                  We've sent a payment request to your {mobileMoneyType}. Please confirm on your phone.
                </p>
                <Button
                  onClick={handleConfirmPayment}
                  className="bg-juicy-yellow text-gray-800 font-quicksand font-medium px-6 py-2 rounded-full mt-2"
                >
                  Confirm Payment
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckoutPage;
