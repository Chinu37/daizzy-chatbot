import { useState, useEffect } from 'react';
import { X, ChevronLeft, Package, Truck, MapPin, CheckCircle, Clock, Phone, Mail, Home } from 'lucide-react';
import { getUserOrders } from '../../api';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  tracking?: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    currentLocation: string;
  };
  timeline: {
    status: string;
    message: string;
    timestamp: string;
    completed: boolean;
  }[];
}

interface OrderTrackingProps {
  onClose: () => void;
  userEmail?: string;
}

const statusConfig = {
  pending: { color: '#F59E0B', label: 'Pending', icon: Clock },
  confirmed: { color: '#3B82F6', label: 'Confirmed', icon: CheckCircle },
  processing: { color: '#8B5CF6', label: 'Processing', icon: Package },
  shipped: { color: '#10B981', label: 'Shipped', icon: Truck },
  out_for_delivery: { color: '#D4AF37', label: 'Out for Delivery', icon: Truck },
  delivered: { color: '#059669', label: 'Delivered', icon: CheckCircle },
  cancelled: { color: '#EF4444', label: 'Cancelled', icon: X }
};

// Generate timeline based on order status and date
const generateTimeline = (status: string, createdAt: string) => {
  const date = new Date(createdAt);
  const fmt = (d: Date) => d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const steps = [
    { status: 'Order Placed', message: 'Your order has been received', time: new Date(date), alwaysDone: true },
    { status: 'Confirmed', message: 'Order confirmed and being prepared', time: new Date(date.getTime() + 30 * 60000), doneFor: ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'] },
    { status: 'Packed', message: 'Items packed and ready to ship', time: new Date(date.getTime() + 24 * 3600000), doneFor: ['processing', 'shipped', 'out_for_delivery', 'delivered'] },
    { status: 'Shipped', message: 'Package handed over to courier', time: new Date(date.getTime() + 48 * 3600000), doneFor: ['shipped', 'out_for_delivery', 'delivered'] },
    { status: 'Out for Delivery', message: 'Package is out for delivery', time: new Date(date.getTime() + 72 * 3600000), doneFor: ['out_for_delivery', 'delivered'] },
    { status: 'Delivered', message: 'Delivered successfully', time: new Date(date.getTime() + 96 * 3600000), doneFor: ['delivered'] }
  ];

  return steps.map(step => ({
    status: step.status,
    message: step.message,
    timestamp: fmt(step.time),
    completed: step.alwaysDone || (step.doneFor?.includes(status) ?? false)
  }));
};

export function OrderTracking({ onClose, userEmail }: OrderTrackingProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('daizzy_user_id');
    if (userId) {
      setIsLoading(true);
      getUserOrders(userId).then(result => {
        if (result.success && result.orders.length > 0) {
          const mapped: Order[] = result.orders.map((o: any) => ({
            id: o.id,
            orderNumber: `VLR${o.id.slice(0, 8).toUpperCase()}`,
            date: o.created_at,
            total: o.total,
            status: o.status as Order['status'],
            items: o.items.map((item: any) => ({
              id: item.product_id,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity
            })),
            tracking: {
              carrier: 'BlueDart Express',
              trackingNumber: `BD${o.id.slice(0, 9).toUpperCase()}`,
              estimatedDelivery: 'Within 5-7 business days',
              currentLocation: o.status === 'confirmed' ? 'Warehouse - Processing' : 'In Transit'
            },
            timeline: generateTimeline(o.status, o.created_at)
          }));
          setOrders(mapped);
        }
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    }
  }, []);

  const handleTrackOrder = () => {
    const order = orders.find(
      o => o.orderNumber === trackingInput || o.tracking?.trackingNumber === trackingInput
    );
    if (order) {
      setSelectedOrder(order);
      setTrackingInput('');
    }
  };

  if (selectedOrder) {
    const config = statusConfig[selectedOrder.status] || statusConfig.confirmed;
    const StatusIcon = config.icon;

    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <header className="h-16 flex-shrink-0 bg-white border-b border-[#D4AF37] px-6 flex items-center justify-between shadow-sm">
          <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
            <ChevronLeft className="w-5 h-5 text-[#2C2C2C]" />
          </button>
          <h1 className="text-xl font-serif text-[#2C2C2C]">Order Details</h1>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
            <X className="w-5 h-5 text-[#2C2C2C]" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#F8F5F0] to-white">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-[#7A7A7A]">Order Number</p>
                  <p className="text-xl font-serif text-[#2C2C2C]">{selectedOrder.orderNumber}</p>
                </div>
                <div className="px-4 py-2 rounded-full text-white font-medium flex items-center gap-2" style={{ backgroundColor: config.color }}>
                  <StatusIcon className="w-4 h-4" />
                  {config.label}
                </div>
              </div>
              {selectedOrder.tracking && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-[#7A7A7A] mb-1">Tracking Number</p>
                    <p className="text-sm font-medium text-[#2C2C2C]">{selectedOrder.tracking.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#7A7A7A] mb-1">Carrier</p>
                    <p className="text-sm font-medium text-[#2C2C2C]">{selectedOrder.tracking.carrier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#7A7A7A] mb-1">Estimated Delivery</p>
                    <p className="text-sm font-medium text-[#D4AF37]">{selectedOrder.tracking.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#7A7A7A] mb-1">Current Location</p>
                    <p className="text-sm font-medium text-[#2C2C2C] flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      {selectedOrder.tracking.currentLocation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-serif text-[#2C2C2C] mb-6">Order Timeline</h3>
              <div className="space-y-6">
                {selectedOrder.timeline.map((event, index) => (
                  <div key={index} className="relative flex gap-4">
                    {index !== selectedOrder.timeline.length - 1 && (
                      <div className="absolute left-4 top-10 w-0.5 h-full" style={{ backgroundColor: event.completed ? '#D4AF37' : '#E5E7EB' }} />
                    )}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${event.completed ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}>
                      {event.completed ? <CheckCircle className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-[#7A7A7A]" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className={`font-medium ${event.completed ? 'text-[#2C2C2C]' : 'text-[#7A7A7A]'}`}>{event.status}</p>
                      <p className="text-sm text-[#7A7A7A] mt-1">{event.message}</p>
                      <p className="text-xs text-[#7A7A7A] mt-1">{event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-serif text-[#2C2C2C] mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1">
                      <p className="font-medium text-[#2C2C2C]">{item.name}</p>
                      <p className="text-sm text-[#7A7A7A]">Quantity: {item.quantity}</p>
                      <p className="text-sm font-semibold text-[#D4AF37]">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-serif text-[#2C2C2C]">Total Amount</span>
                <span className="text-2xl font-serif font-semibold text-[#D4AF37]">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#C9A961]/10 rounded-2xl p-6 border border-[#D4AF37]/30">
              <h3 className="font-medium text-[#2C2C2C] mb-4">Need Help?</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  <div className="text-left">
                    <p className="text-xs text-[#7A7A7A]">Call Us</p>
                    <p className="text-sm font-medium text-[#2C2C2C]">1800-123-456</p>
                  </div>
                </button>
                <button className="p-4 bg-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  <div className="text-left">
                    <p className="text-xs text-[#7A7A7A]">Email</p>
                    <p className="text-sm font-medium text-[#2C2C2C]">support@velour.com</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <header className="h-16 flex-shrink-0 bg-gradient-to-r from-white via-[#F8F5F0] to-white border-b border-[#D4AF37] px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C9A961] flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-serif text-[#2C2C2C]">Track Order</h1>
            <p className="text-xs text-[#7A7A7A]">Monitor your deliveries</p>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
          <X className="w-5 h-5 text-[#2C2C2C]" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#F8F5F0] to-white">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-serif text-[#2C2C2C] mb-4">Track by Order Number</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                placeholder="Enter order number e.g. VLR8E31A4A5"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
              />
              <button
                onClick={handleTrackOrder}
                className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-xl font-medium hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                Track
              </button>
            </div>
          </div>

          {/* Real orders from backend */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-serif text-[#2C2C2C] mb-4">Your Orders</h3>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-[#7A7A7A]">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-[#7A7A7A]">No orders found. Please login to see your orders.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const config = statusConfig[order.status] || statusConfig.confirmed;
                  const StatusIcon = config.icon;
                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="w-full p-4 bg-gradient-to-r from-[#F8F5F0] to-white rounded-xl border border-gray-200 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-[#2C2C2C]">{order.orderNumber}</p>
                          <p className="text-xs text-[#7A7A7A]">
                            {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1" style={{ backgroundColor: config.color }}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        {order.items.slice(0, 3).map((item, index) => (
                          <img key={index} src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                            <p className="text-xs font-medium text-[#D4AF37]">+{order.items.length - 3}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#7A7A7A]">{order.items.length} item(s)</p>
                        <p className="text-lg font-serif font-semibold text-[#D4AF37]">₹{order.total.toLocaleString('en-IN')}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#C9A961]/10 rounded-2xl p-6 border border-[#D4AF37]/30">
            <div className="flex gap-4">
              <Home className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
              <div>
                <h3 className="font-medium text-[#2C2C2C] mb-2">Hassle-Free Delivery</h3>
                <p className="text-sm text-[#7A7A7A]">We partner with trusted courier services to ensure your luxury items reach you safely.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}