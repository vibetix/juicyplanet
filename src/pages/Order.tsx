import { useSelector, useDispatch } from 'react-redux';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { clearCart } from '@/store/cartSlice';
import { removeOrder } from '@/store/ordersSlice';
import { CheckCircle, Truck, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderHistoryPage = () => {
  const orders = useSelector((state: RootState) => state.orders.orders);
  const dispatch = useDispatch();

  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    const oneMinuteAgo = Date.now() - 60_000;
    const hasRecentOrder = orders.some(
      (order) => new Date(order.createdAt).getTime() > oneMinuteAgo
    );

    if (hasRecentOrder) {
      dispatch(clearCart());
    }
  }, [orders, dispatch]);

  const getStepClass = (orderStatus: string, step: string) =>
    orderStatus === step ||
    (orderStatus === 'Shipped' && step === 'Pending') ||
    (orderStatus === 'Delivered' && (step === 'Pending' || step === 'Shipped'))
      ? 'bg-juicy-green text-white'
      : 'bg-gray-200 text-gray-500';

  const confirmDelete = (orderCode: string) => setOrderToDelete(orderCode);

  const handleDelete = () => {
    if (orderToDelete) {
      dispatch(removeOrder(orderToDelete));
      setOrderToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 container mx-auto max-w-4xl relative pt-[60px]">
        <h1 className="text-3xl font-raleway font-bold text-gray-800 mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 font-quicksand">
            You haven't placed any orders yet.{' '}
            <a href="/Shop" className="text-juicy-green underline">
              Browse Products
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders
              .slice()
              .reverse()
              .map((order) => (
                <Card
                  key={order.code}
                  className="relative p-6 border border-juicy-yellow/20 shadow-sm rounded-lg"
                >
                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    onClick={() => confirmDelete(order.code)}
                    className="absolute top-4 right-4 flex items-center gap-1 text-juicy-red hover:text-juicy-red/80 text-xs border border-juicy-red rounded-full px-2 py-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>

                  <h2 className="text-xl font-raleway font-semibold text-gray-800 mb-2">
                    Order #{order.code}
                  </h2>
                  <p className="text-sm text-gray-600 font-quicksand mb-2">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-juicy-green font-quicksand mb-4">
                    Tracking #: {order.trackingNumber || 'N/A'}
                  </p>

                  {/* Progress tracker */}
                  <div className="flex items-center justify-between mb-4 space-x-2">
                    <div
                      className={`flex flex-col items-center p-2 rounded-full w-16 h-16 ${getStepClass(
                        order.trackingStatus,
                        'Pending'
                      )}`}
                    >
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-xs mt-1">Pending</span>
                    </div>
                    <div className="flex-1 border-t border-juicy-yellow" />
                    <div
                      className={`flex flex-col items-center p-2 rounded-full w-16 h-16 ${getStepClass(
                        order.trackingStatus,
                        'Shipped'
                      )}`}
                    >
                      <Truck className="w-6 h-6" />
                      <span className="text-xs mt-1">Shipped</span>
                    </div>
                    <div className="flex-1 border-t border-juicy-yellow" />
                    <div
                      className={`flex flex-col items-center p-2 rounded-full w-16 h-16 ${getStepClass(
                        order.trackingStatus,
                        'Delivered'
                      )}`}
                    >
                      <Package className="w-6 h-6" />
                      <span className="text-xs mt-1">Delivered</span>
                    </div>
                  </div>

                  <ul className="my-4 space-y-1">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between text-sm text-gray-700 font-quicksand"
                      >
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  <hr className="my-2 border-juicy-yellow/20" />

                  <div className="flex justify-between text-lg font-quicksand font-medium text-gray-800">
                    <span>Total:</span>
                    <span>GHS {order.total.toFixed(2)}</span>
                  </div>
                </Card>
              ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {orderToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
              <h2 className="text-xl font-raleway font-semibold text-gray-800">Delete Order?</h2>
              <p className="text-sm font-quicksand text-gray-700">
                Are you sure you want to delete order <span className="font-medium">{orderToDelete}</span>? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setOrderToDelete(null)}
                  className="border-juicy-green text-juicy-green hover:bg-juicy-green hover:text-white font-quicksand"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-juicy-red text-white font-quicksand hover:bg-juicy-red/80"
                >
                  Delete
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

export default OrderHistoryPage;
