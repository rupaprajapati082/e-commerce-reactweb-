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
  ExternalLink,
  Search,
  ArrowLeft
} from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-100 dark:border-white/5 border-t-[#FF4C3B] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto px-6 md:px-20 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8"
        >
          <div>
            <Link to="/profile" className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#FF4C3B] transition-colors mb-4">
              <ArrowLeft size={14} /> Back to Profile
            </Link>
            <h1 className="text-4xl md:text-5xl font-black dark:text-white">Order Inventory</h1>
          </div>
          
          <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 w-full md:w-auto">
            <Search size={18} className="text-slate-400 ml-4" />
            <input 
              type="text" 
              placeholder="Search Orders..." 
              className="bg-transparent border-none outline-none text-sm font-bold dark:text-white py-2 w-full md:w-64"
            />
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Package size={32} />
            </div>
            <h3 className="text-2xl font-black dark:text-white mb-2">No deployments yet</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">You haven't placed any orders with us yet.</p>
            <Link 
              to="/products" 
              className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black rounded-2xl hover:bg-[#FF4C3B] dark:hover:bg-[#FF4C3B] transition-all shadow-xl"
            >
              Browse Equipment
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white dark:bg-[#111] rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row justify-between gap-8 mb-10 pb-10 border-b border-slate-50 dark:border-white/5">
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#FF4C3B]">
                        <Package size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Order ID</p>
                        <h4 className="font-black dark:text-white text-lg">#{order._id.slice(-8).toUpperCase()}</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Date Placed</p>
                        <p className="font-bold dark:text-slate-200 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Total Bill</p>
                        <p className="font-black dark:text-white text-lg">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex -space-x-4 overflow-hidden">
                      {order.items.slice(0, 4).map((item, i) => (
                        <div key={i} className="w-14 h-14 rounded-xl border-4 border-white dark:border-[#111] bg-slate-50 dark:bg-white/5 p-2 overflow-hidden">
                          <img src={getProductImage(item.productId)} className="w-full h-full object-contain" />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-14 h-14 rounded-xl border-4 border-white dark:border-[#111] bg-slate-200 dark:bg-white/10 flex items-center justify-center text-xs font-black">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-6 py-3 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#FF4C3B] hover:text-white transition-all">
                        Track Shipment
                      </button>
                      <button className="flex-1 md:flex-none px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#FF4C3B] dark:hover:bg-[#FF4C3B] hover:text-white transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;
