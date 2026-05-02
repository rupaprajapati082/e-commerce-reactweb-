import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { getProductImage } from '../utils/imageHelper';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Search,
  ArrowLeft,
  Calendar,
  CreditCard,
  Zap,
  MoreHorizontal
} from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/order/user-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handlePayment = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_BASE_URL}/order/pay/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // update local state
      setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: 'completed', paymentMethod: 'Card Protocol', status: 'processing' } : o));
      alert('Payment successful!');
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20';
      case 'shipped': return 'bg-blue-500 text-white shadow-lg shadow-blue-500/20';
      case 'pending': return 'bg-orange-500 text-white shadow-lg shadow-orange-500/20';
      default: return 'bg-slate-400 text-white';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-100 dark:border-white/5 border-t-[#FF4C3B] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] font-sans pb-20">
      <Navbar />

      <main className="max-w-[1250px] mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="space-y-4">
              <Link to="/profile" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#FF4C3B] transition-colors">
                <ArrowLeft size={14} /> Back to Terminal
              </Link>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Order <span className="text-[#FF4C3B]">Inventory</span></h1>
              <p className="text-slate-500 font-medium text-lg">A complete history of your professional acquisitions.</p>
           </div>
           
           <div className="w-full md:w-auto bg-[#F9FAFB] dark:bg-white/5 p-2 rounded-[2rem] border border-slate-100 dark:border-white/10 flex items-center gap-4">
              <Search size={18} className="text-slate-400 ml-6" />
              <input 
                type="text" 
                placeholder="Search Deployments..." 
                className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest dark:text-white py-4 w-full md:w-64"
              />
           </div>
        </header>

        {/* ── Metric Summary ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { 
              label: 'Active Deployments', 
              value: orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length, 
              icon: Zap, 
              color: 'from-[#FF4C3B] to-orange-500',
              bg: 'bg-orange-50 dark:bg-orange-500/5'
            },
            { 
              label: 'Successful Deliveries', 
              value: orders.filter(o => o.status === 'delivered').length, 
              icon: CheckCircle2, 
              color: 'from-emerald-500 to-teal-500',
              bg: 'bg-emerald-50 dark:bg-emerald-500/5'
            },
            { 
              label: 'Total Investment', 
              value: `₹${orders.reduce((acc, o) => acc + (o.totalbill || o.totalAmount || 0), 0).toLocaleString()}`, 
              icon: CreditCard, 
              color: 'from-blue-500 to-indigo-600',
              bg: 'bg-blue-50 dark:bg-blue-500/5'
            }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm group hover:border-[#FF4C3B]/30 transition-all ${stat.bg}`}
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg mb-6`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
              </div>
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-2xl transition-opacity`} />
            </motion.div>
          ))}
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-[#F9FAFB] dark:bg-white/5 rounded-[4rem] border border-dashed border-slate-200 dark:border-white/10"
          >
            <div className="w-24 h-24 bg-white dark:bg-[#111] rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-sm border border-slate-100 dark:border-white/10">
              <Package size={40} />
            </div>
            <h3 className="text-3xl font-black dark:text-white mb-3">No acquisition history.</h3>
            <p className="text-slate-500 font-medium mb-10">Your operational inventory is currently empty.</p>
            <Link 
              to="/products" 
              className="px-10 py-5 bg-[#FF4C3B] text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-2xl shadow-[#FF4C3B]/20 uppercase text-[10px] tracking-[0.2em]"
            >
              Start Procurement
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, idx) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-[#F9FAFB] dark:bg-white/5 rounded-[3.5rem] border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="p-10 md:p-12">
                   <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-slate-200/50 dark:border-white/5 mb-10">
                      <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-[#111] flex items-center justify-center text-[#FF4C3B] shadow-sm border border-slate-100 dark:border-white/10">
                          <Package size={28} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Batch Code</p>
                          <h4 className="font-black dark:text-white text-xl tracking-tighter">#{order._id.slice(-8).toUpperCase()}</h4>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-10 md:gap-16">
                         <div>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Calendar size={12} /> Deployment Date</p>
                           <p className="font-black dark:text-slate-200 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                         </div>
                         <div>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Truck size={12} /> Current Status</p>
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                             {order.status}
                           </span>
                         </div>
                         <div className="hidden lg:block">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><CreditCard size={12} /> Total Transaction</p>
                           <p className="font-black dark:text-white text-xl tracking-tighter text-[#FF4C3B]">₹{(order.totalbill || order.totalAmount || 0).toLocaleString()}</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                      <div className="flex -space-x-6">
                         {order.items.slice(0, 4).map((item, i) => (
                           <div key={i} className="w-24 h-24 rounded-3xl border-4 border-white dark:border-[#111] bg-white dark:bg-white/5 p-1 overflow-hidden shadow-xl relative group-hover:z-10 hover:scale-110 transition-all cursor-zoom-in">
                             <img src={getProductImage(item.productId)} className="w-full h-full object-contain" alt="" />
                           </div>
                         ))}
                         {order.items.length > 4 && (
                           <div className="w-24 h-24 rounded-3xl border-4 border-white dark:border-[#111] bg-slate-900 flex items-center justify-center text-sm font-black text-white shadow-xl">
                             +{order.items.length - 4}
                           </div>
                         )}
                      </div>

                      <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-8 py-4 bg-white dark:bg-white/10 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm border border-slate-100 dark:border-white/10">
                          Track Shipment
                        </button>
                        <button 
                          onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                          className="flex-1 md:flex-none px-10 py-4 bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#FF4C3B] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                          {expandedOrderId === order._id ? 'Close Audit' : 'Full Audit'} <MoreHorizontal size={14} />
                        </button>
                      </div>
                   </div>

                   {/* Expanded Details Section */}
                   {expandedOrderId === order._id && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       className="mt-8 pt-8 border-t border-slate-200/50 dark:border-white/5 space-y-6"
                     >
                        <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Order Contents</h5>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 bg-white dark:bg-[#111] p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                 <div className="w-24 h-24 rounded-2xl bg-white dark:bg-white/5 p-2 shrink-0 border border-slate-100 dark:border-white/10 shadow-sm">
                                   <img src={getProductImage(item.productId)} className="w-full h-full object-contain" alt="" />
                                 </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm dark:text-white truncate">
                                    {item.productId?.name || 'Unknown Product'}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity}</p>
                                    <p className="text-sm font-black dark:text-white">₹{(item.price || 0).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-100 dark:border-white/5 space-y-6">
                             <div>
                               <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Shipping Details</h6>
                               <div className="space-y-1">
                                 <p className="text-sm font-bold dark:text-white">{order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</p>
                                 <p className="text-sm text-slate-500">{order.shippingDetails?.address}</p>
                                 <p className="text-sm text-slate-500">{order.shippingDetails?.city}, {order.shippingDetails?.zip}</p>
                                 <p className="text-sm text-slate-500">Phone: {order.shippingDetails?.phone}</p>
                               </div>
                             </div>
                             
                             <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                               <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Payment Info</h6>
                               <div className="flex justify-between items-center mb-2">
                                 <p className="text-sm text-slate-500">Method</p>
                                 <p className="text-sm font-bold dark:text-white uppercase">{order.paymentMethod || 'N/A'}</p>
                               </div>
                               <div className="flex justify-between items-center mb-2">
                                 <p className="text-sm text-slate-500">Status</p>
                                 <div className="flex items-center gap-3">
                                   {order.paymentStatus !== 'completed' && (
                                     <button 
                                       onClick={() => handlePayment(order._id)}
                                       className="bg-[#FF4C3B] text-white text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest hover:bg-black transition-colors"
                                     >
                                       Pay Now
                                     </button>
                                   )}
                                   <p className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest ${order.paymentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                     {order.paymentStatus || 'Pending'}
                                   </p>
                                 </div>
                               </div>
                               <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                 <p className="font-black dark:text-white">Total Amount</p>
                                 <p className="font-black text-xl text-[#FF4C3B]">₹{(order.totalbill || order.totalAmount || 0).toLocaleString()}</p>
                               </div>
                             </div>
                          </div>
                        </div>
                     </motion.div>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistory;
