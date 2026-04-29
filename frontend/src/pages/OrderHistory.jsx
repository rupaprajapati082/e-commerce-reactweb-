import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/order/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'shipped':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        );
      case 'delivered':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default: return null;
    }
  };

  const getStepProgress = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4C3B]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#f9f9f9] py-10 px-6 md:px-20 border-b border-slate-100">
        <h1 className="text-3xl font-medium text-[#222] capitalize">My Orders</h1>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 capitalize">
          <Link to="/" className="hover:text-[#FF4C3B] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-600">Order History</span>
        </div>
      </div>

      <div className="px-6 md:px-20 py-16">
        {orders.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20 bg-white border border-dashed border-slate-200 rounded-sm">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-medium text-[#222] mb-4 capitalize">No orders yet</h2>
            <p className="text-slate-500 mb-8">You haven't placed any orders yet. Start shopping!</p>
            <Link to="/products" className="inline-block px-10 py-4 bg-[#FF4C3B] text-white text-[11px] font-medium capitalize rounded-sm hover:bg-black transition-all shadow-md shadow-[#FF4C3B]/20">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-slate-100 rounded-sm p-5 text-center">
                <p className="text-2xl font-semibold text-[#222]">{orders.length}</p>
                <p className="text-[11px] text-slate-400 mt-1 capitalize">Total Orders</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-sm p-5 text-center">
                <p className="text-2xl font-semibold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
                <p className="text-[11px] text-slate-400 mt-1 capitalize">Pending</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-sm p-5 text-center">
                <p className="text-2xl font-semibold text-blue-600">{orders.filter(o => o.status === 'shipped').length}</p>
                <p className="text-[11px] text-slate-400 mt-1 capitalize">Shipped</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-sm p-5 text-center">
                <p className="text-2xl font-semibold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
                <p className="text-[11px] text-slate-400 mt-1 capitalize">Delivered</p>
              </div>
            </div>

            {/* Order Cards */}
            {orders.map(order => (
              <div key={order._id} className="bg-white border border-slate-100 rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div 
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[11px] text-slate-400 capitalize">Order ID</p>
                      <p className="text-sm font-medium text-[#222]">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
                    <div>
                      <p className="text-[11px] text-slate-400 capitalize">Date</p>
                      <p className="text-sm font-medium text-[#222]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
                    <div>
                      <p className="text-[11px] text-slate-400 capitalize">Items</p>
                      <p className="text-sm font-medium text-[#222]">{order.items.length} product{order.items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400 capitalize">Total</p>
                      <p className="text-lg font-semibold text-[#FF4C3B]">${order.totalbill.toFixed(2)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium capitalize rounded-sm border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order._id && (
                  <div className="border-t border-slate-100">
                    {/* Progress Tracker */}
                    {order.status !== 'cancelled' && (
                      <div className="px-6 py-8 bg-slate-50">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                          {['Pending', 'Shipped', 'Delivered'].map((step, idx) => {
                            const progress = getStepProgress(order.status);
                            const isCompleted = idx + 1 <= progress;
                            const isCurrent = idx + 1 === progress;
                            return (
                              <React.Fragment key={step}>
                                <div className="flex flex-col items-center gap-2">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                    isCompleted ? 'bg-[#FF4C3B] text-white shadow-md shadow-[#FF4C3B]/20' : 'bg-white border-2 border-slate-200 text-slate-400'
                                  } ${isCurrent ? 'ring-4 ring-[#FF4C3B]/20' : ''}`}>
                                    {isCompleted ? '✓' : idx + 1}
                                  </div>
                                  <span className={`text-[10px] font-medium capitalize ${isCompleted ? 'text-[#FF4C3B]' : 'text-slate-400'}`}>{step}</span>
                                </div>
                                {idx < 2 && (
                                  <div className={`flex-1 h-0.5 mx-2 mb-6 ${isCompleted && idx + 1 < progress ? 'bg-[#FF4C3B]' : 'bg-slate-200'}`}></div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="p-6 space-y-4">
                      <p className="text-[11px] text-slate-400 capitalize mb-4 font-medium">Order Items</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                          <div className="w-14 h-14 bg-white border border-slate-100 rounded-sm p-1.5 shrink-0">
                            {item.productId?.images?.[0] ? (
                              <img src={item.productId.images[0]} alt={item.productId.name} className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]">N/A</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#222] capitalize">
                              {item.productId?.name || 'Product'}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <p className="text-sm font-medium text-[#222]">${item.total.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Details */}
                    {order.shippingDetails && (
                      <div className="px-6 pb-6">
                        <div className="bg-slate-50 rounded-sm p-5">
                          <p className="text-[11px] text-slate-400 capitalize mb-3 font-medium">Shipping Address</p>
                          <p className="text-sm text-[#222]">
                            {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {order.shippingDetails.address}, {order.shippingDetails.city} - {order.shippingDetails.zip}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Phone: {order.shippingDetails.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;
