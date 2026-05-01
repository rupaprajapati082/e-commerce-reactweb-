import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage } from '../utils/imageHelper';
import { 
  Minus, 
  Plus, 
  Trash2, 
  Edit3, 
  ShoppingBag, 
  ArrowRight,
  ChevronRight,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cart/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, []);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_BASE_URL}/cart/update`, 
        { productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#FF4C3B] rounded-full animate-spin"></div>
    </div>
  );

  const subtotal = cart?.items?.reduce((acc, item) => {
    if (!item.productId) return acc;
    const price = item.productId.discount > 0 
      ? item.productId.price - (item.productId.price * item.productId.discount / 100)
      : item.productId.price;
    return acc + (price * item.quantity);
  }, 0) || 0;

  const discount = subtotal * 0.1; // Mock 10% discount
  const tax = 0;
  const shipping = 0;
  const total = subtotal - discount + tax + shipping;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <Navbar />

      <main className="max-w-[1250px] mx-auto px-6 py-12">
        {/* HEADER & STEPPER */}
        <div className="mb-16 space-y-8">
           <h1 className="text-6xl font-serif font-bold text-slate-900">Cart</h1>
           <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em]">
              <span className="text-[#FF4C3B] border-b-2 border-[#FF4C3B] pb-1">1. Cart</span>
              <span className="text-slate-300">—</span>
              <span className="text-slate-400">2. Checkout</span>
              <span className="text-slate-300">—</span>
              <span className="text-slate-400">3. Payment</span>
           </div>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
             <ShoppingBag size={48} className="mx-auto mb-6 text-slate-300" />
             <h2 className="text-3xl font-black text-slate-900 mb-2">Inventory Empty</h2>
             <p className="text-slate-500 mb-8 font-medium">Your procurement cycle hasn't started yet.</p>
             <button onClick={() => navigate('/products')} className="px-10 py-5 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FF4C3B] transition-all shadow-xl">Browse Catalog</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* ITEM LIST */}
            <div className="lg:col-span-8 space-y-12">
               {cart.items.map((item, idx) => {
                 if (!item.productId) return null;
                 const p = item.productId;
                 const currentPrice = p.discount > 0 ? (p.price - (p.price * p.discount / 100)) : p.price;
                 
                 return (
                   <motion.div 
                     key={p._id} 
                     initial={{ opacity: 0, x: -20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     transition={{ delay: idx * 0.1 }}
                     className="group border-b border-slate-100 pb-12"
                   >
                     <div className="flex gap-8 items-start mb-8">
                        <div className="w-32 aspect-square rounded-3xl bg-slate-50 overflow-hidden border border-slate-100 p-4 shrink-0">
                           <img src={getProductImage(p)} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="" />
                        </div>
                        <div className="flex-1 space-y-4">
                           <h3 className="text-2xl font-black text-slate-900 leading-tight">{p.name}</h3>
                           <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-md truncate uppercase tracking-tight">{p.description || "Premium selection curated for high-performance use."}</p>
                           <div className="flex gap-6 text-[11px] font-black uppercase tracking-widest text-slate-400">
                              <span>Size <span className="text-slate-900 ml-1">{item.size || 'XL'}</span></span>
                              <span className="text-slate-200">/</span>
                              <span>Color <span className="text-slate-900 ml-1">Black</span></span>
                           </div>
                           <div className="flex items-end gap-3 pt-2">
                              <span className="text-2xl font-black text-slate-900">₹{currentPrice.toLocaleString()}</span>
                              {p.discount > 0 && <span className="text-sm font-bold text-slate-300 line-through mb-1">₹{p.price.toLocaleString()}</span>}
                           </div>
                        </div>
                     </div>

                     {/* ACTIONS ROW */}
                     <div className="flex justify-between items-center bg-slate-50/50 rounded-2xl px-6 py-4 border border-slate-100">
                        <div className="flex items-center gap-4">
                           <button onClick={() => updateQuantity(p._id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-black shadow-sm border border-slate-100 transition-all"><Minus size={14} /></button>
                           <span className="w-8 text-center font-black text-slate-900">{item.quantity}</span>
                           <button onClick={() => updateQuantity(p._id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-black shadow-sm border border-slate-100 transition-all"><Plus size={14} /></button>
                        </div>
                        <div className="flex gap-4">
                           <button onClick={() => removeItem(p._id)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 shadow-sm transition-all"><Trash2 size={16} /></button>
                           <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-black shadow-sm transition-all"><Edit3 size={16} /></button>
                        </div>
                     </div>
                   </motion.div>
                 );
               })}
            </div>

            {/* SUMMARY SIDEBAR */}
            <aside className="lg:col-span-4 space-y-8 sticky top-32">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#F9FAFB] border border-slate-100 rounded-[3rem] p-10 space-y-10">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Summary</h2>
                  
                  <div className="space-y-6">
                     <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                        <span>Sub Total</span>
                        <span className="font-black text-slate-900">₹{subtotal.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                        <span>Discount</span>
                        <span className="font-black text-slate-900">₹{discount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                        <span>Tax</span>
                        <span className="font-black text-slate-900">₹{tax.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                        <span>Shipping</span>
                        <span className="font-black text-[#FF4C3B]">Free</span>
                     </div>
                     
                     <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                        <span className="text-lg font-black text-slate-900 uppercase tracking-widest text-[11px]">Total</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{total.toLocaleString()}</span>
                     </div>
                  </div>

                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-black text-white py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-[#FF4C3B] transition-all flex items-center justify-center gap-3"
                  >
                    Proceed to Checkout <ChevronRight size={18} />
                  </button>

                  <div className="flex items-center gap-3 justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <Clock size={14} /> Estimated Delivery by 25 April, 2026
                  </div>
               </motion.div>

               {/* COUPON BOX */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Tag size={16} className="text-[#FF4C3B]" /> Have a Coupon?
                  </h4>
                  <div className="flex gap-3">
                     <input type="text" placeholder="Coupon Code" className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-[#FF4C3B] transition-all" />
                     <button className="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF4C3B] hover:text-white transition-all">Apply</button>
                  </div>
               </motion.div>
            </aside>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
