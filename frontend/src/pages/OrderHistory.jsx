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
                           <p className="font-black dark:text-white text-xl tracking-tighter text-[#FF4C3B]">₹{order.totalAmount.toLocaleString()}</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                      <div className="flex -space-x-4">
                         {order.items.slice(0, 4).map((item, i) => (
                           <div key={i} className="w-16 h-16 rounded-2xl border-4 border-[#F9FAFB] dark:border-[#111] bg-white dark:bg-white/5 p-3 overflow-hidden shadow-sm relative group-hover:z-10 transition-all">
                             <img src={getProductImage(item.productId)} className="w-full h-full object-contain" alt="" />
                           </div>
                         ))}
                         {order.items.length > 4 && (
                           <div className="w-16 h-16 rounded-2xl border-4 border-[#F9FAFB] dark:border-[#111] bg-slate-900 flex items-center justify-center text-xs font-black text-white">
                             +{order.items.length - 4}
                           </div>
                         )}
                      </div>

                      <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-8 py-4 bg-white dark:bg-white/10 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm border border-slate-100 dark:border-white/10">
                          Track Shipment
                        </button>
                        <button className="flex-1 md:flex-none px-10 py-4 bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#FF4C3B] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                          Full Audit <MoreHorizontal size={14} />
                        </button>
                      </div>
                   </div>
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
