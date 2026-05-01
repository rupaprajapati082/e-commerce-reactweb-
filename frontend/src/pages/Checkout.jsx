import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage } from '../utils/imageHelper';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  MapPin, 
  Package, 
  ShoppingCart, 
  Lock,
  Phone,
  Mail,
  User,
  Building,
  Hash,
  ArrowRight,
  ChevronRight,
  Clock,
  Shield
} from 'lucide-react';

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '', city: '', zip: '', phone: '', email: ''
  });
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cart/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(response.data.cart);
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setFormData(prev => ({
            ...prev,
            firstName: user.username?.split(' ')[0] || '',
            lastName: user.username?.split(' ')[1] || '',
            email: user.email || ''
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart || !cart.items?.length) return alert('Your cart is empty');
    
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      
      if (paymentMethod === 'stripe') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/order/add`, 
        { shippingDetails: formData, paymentMethod: paymentMethod === 'stripe' ? 'Card' : 'COD' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        navigate('/order-confirmation', { state: { orderId: response.data.order._id } });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
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

  const discount = subtotal * 0.1;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-20">
      <Navbar />
      
      <main className="max-w-[1250px] mx-auto px-6 py-12">
        {/* HEADER & STEPPER */}
        <div className="mb-16 space-y-8">
           <h1 className="text-6xl font-serif font-bold text-slate-900">Checkout</h1>
           <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em]">
              <Link to="/cart" className="text-slate-400 hover:text-black transition-colors">1. Cart</Link>
              <span className="text-slate-300">—</span>
              <span className="text-[#FF4C3B] border-b-2 border-[#FF4C3B] pb-1">2. Checkout</span>
              <span className="text-slate-300">—</span>
              <span className="text-slate-400">3. Payment</span>
           </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-16">
            {/* SHIPPING SECTION */}
            <section className="space-y-10">
               <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#FF4C3B]">
                   <Truck size={24} />
                 </div>
                 <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Shipping Logistics</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Operational Delivery Data</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">First Identity</label>
                   <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-[#FF4C3B] transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last Identity</label>
                   <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-[#FF4C3B] transition-all" />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Deployment Address</label>
                   <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-[#FF4C3B] transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Urban Center</label>
                   <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-[#FF4C3B] transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Postal Index</label>
                   <input required type="text" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-[#FF4C3B] transition-all" />
                 </div>
               </div>
            </section>

            {/* PAYMENT SECTION */}
            <section className="space-y-10">
               <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#FF4C3B]">
                   <CreditCard size={24} />
                 </div>
                 <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Transaction Method</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Secured Financial Protocol</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div 
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-10 rounded-[3rem] border-2 cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-[#FF4C3B] bg-[#FF4C3B]/5 shadow-xl' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                     <div className="flex justify-between mb-8">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-[#FF4C3B]' : 'border-slate-200'}`}>
                          {paymentMethod === 'stripe' && <div className="w-3 h-3 rounded-full bg-[#FF4C3B]" />}
                        </div>
                        <Lock size={18} className="text-slate-300" />
                     </div>
                     <h3 className="text-xl font-black text-slate-900 mb-2">Secured Card</h3>
                     <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">256-bit AES Encrypted</p>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-10 rounded-[3rem] border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#FF4C3B] bg-[#FF4C3B]/5 shadow-xl' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                     <div className="flex justify-between mb-8">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#FF4C3B]' : 'border-slate-200'}`}>
                          {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-[#FF4C3B]" />}
                        </div>
                        <Truck size={18} className="text-slate-300" />
                     </div>
                     <h3 className="text-xl font-black text-slate-900 mb-2">Direct COD</h3>
                     <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Pay upon deployment</p>
                  </div>
               </div>
            </section>
          </div>

          {/* SIDEBAR SUMMARY */}
          <aside className="lg:col-span-5 space-y-8 sticky top-32">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#F9FAFB] border border-slate-100 rounded-[4rem] p-12 space-y-12 shadow-2xl shadow-black/5">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">Operational <span className="text-[#FF4C3B]">Summary</span></h2>
                
                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                   {cart?.items?.map((item, idx) => {
                     if (!item.productId) return null;
                     const p = item.productId;
                     const currentPrice = p.discount > 0 ? (p.price - (p.price * p.discount / 100)) : p.price;
                     return (
                       <div key={idx} className="flex gap-6 items-center group">
                          <div className="w-20 h-20 rounded-2xl bg-white p-3 border border-slate-100 shrink-0">
                             <img src={getProductImage(p)} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{p.name}</h4>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Batch Qty: {item.quantity}</p>
                             <p className="text-sm font-black text-[#FF4C3B] mt-2">₹{currentPrice.toLocaleString()}</p>
                          </div>
                       </div>
                     );
                   })}
                </div>

                <div className="space-y-6 pt-10 border-t border-slate-200">
                   <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Inventory Total</span>
                      <span className="text-slate-900">₹{subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Operational Rebate</span>
                      <span className="text-slate-900">₹{discount.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Logistics Fee</span>
                      <span className="text-[#22c55e]">Inclusive</span>
                   </div>
                   
                   <div className="pt-8 flex justify-between items-end border-t-2 border-dashed border-slate-200">
                      <div>
                         <p className="text-[10px] font-black text-[#FF4C3B] uppercase tracking-[0.3em]">Total Acquisition</p>
                         <p className="text-4xl font-black text-slate-900 tracking-tighter mt-1">₹{total.toFixed(2)}</p>
                      </div>
                   </div>

                   <button type="submit" disabled={isProcessing} className="w-full bg-black text-white py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:bg-[#FF4C3B] transition-all flex items-center justify-center gap-3">
                     {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Authorize Deployment <ArrowRight size={18} /></>}
                   </button>

                   <div className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Shield size={14} className="text-[#22c55e]" /> SSL Secured Logistics Pipeline
                   </div>
                </div>
             </motion.div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
