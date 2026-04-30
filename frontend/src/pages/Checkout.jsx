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
  ChevronRight, 
  MapPin, 
  Package, 
  ShoppingCart, 
  CheckCircle2,
  Lock,
  Info,
  Phone,
  Mail,
  User,
  Building,
  Hash,
  ArrowRight
} from 'lucide-react';

const FLOW_STEPS = [
  { icon: ShoppingCart, label: 'Add to Cart', color: '#22c55e' },
  { icon: ShieldCheck,  label: 'Checkout',    color: '#FF4C3B' },
  { icon: CreditCard,   label: 'Payment',     color: '#FF4C3B' },
  { icon: Package,      label: 'Confirmed!',  color: '#22c55e' },
];

const CheckoutStepper = ({ currentStep }) => (
  <div className="w-full py-8 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#0A0A0A]">
    <div className="max-w-4xl mx-auto flex items-center justify-between px-6">
      {FLOW_STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx < currentStep;
        const isActive    = idx === currentStep;
        return (
          <div key={idx} className="flex flex-col items-center relative group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCompleted || isActive ? 'bg-[#FF4C3B] text-white shadow-xl shadow-[#FF4C3B]/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}
            >
              {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={22} />}
            </motion.div>
            <div className="mt-4 text-center">
              <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-[#FF4C3B]' : 'text-slate-400'}`}>{step.label}</p>
            </div>
            {idx < FLOW_STEPS.length - 1 && (
              <div className="absolute top-7 left-[calc(100%+1rem)] w-12 md:w-24 h-[2px] bg-slate-100 dark:bg-white/5 -translate-y-1/2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  className="h-full bg-[#FF4C3B]"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

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
      
      // Removed Stripe integration as requested - using a mock "Card Success" flow
      if (paymentMethod === 'stripe') {
        // Simulate a 2-second payment verification for "WOW" effect
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
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-100 dark:border-white/5 border-t-[#FF4C3B] rounded-full animate-spin"></div>
    </div>
  );

  // Safety calculation for subtotal
  const subtotal = cart?.items?.reduce((acc, item) => {
    if (!item.productId || typeof item.productId !== 'object') return acc;
    const price = item.productId.discount > 0 
      ? item.productId.price - (item.productId.price * item.productId.discount / 100)
      : item.productId.price;
    return acc + (price * item.quantity);
  }, 0) || 0;

  const shipping = 50.00;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] transition-colors duration-300">
      <Navbar />
      
      <CheckoutStepper currentStep={1} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-20 py-16">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-12">
            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FF4C3B]/10 flex items-center justify-center text-[#FF4C3B]">
                  <Truck size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#222] dark:text-white tracking-tight">Shipping Details</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Delivery Address & Contact</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><User size={12} className="inline mr-1" /> First Name</label>
                  <input required type="text" value={formData.firstName} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#FF4C3B]/20 outline-none transition-all" onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="John" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last Name</label>
                  <input required type="text" value={formData.lastName} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#FF4C3B]/20 outline-none transition-all" onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><Mail size={12} className="inline mr-1" /> Email</label>
                  <input required type="email" value={formData.email} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#FF4C3B]/20 outline-none transition-all" onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><Phone size={12} className="inline mr-1" /> Phone</label>
                  <input required type="tel" className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#FF4C3B]/20 outline-none transition-all" onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+62 812..." />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><MapPin size={12} className="inline mr-1" /> Full Address</label>
                  <input required type="text" className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#FF4C3B]/20 outline-none transition-all" onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street name, Building No..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><Building size={12} className="inline mr-1" /> City</label>
                  <input required type="text" className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#FF4C3B]/20 outline-none transition-all" onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Jakarta" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500"><Hash size={12} className="inline mr-1" /> Postal Code</label>
                  <input required type="text" className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#FF4C3B]/20 outline-none transition-all" onChange={e => setFormData({...formData, zip: e.target.value})} placeholder="12345" />
                </div>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-8 pt-12 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF4C3B]/10 flex items-center justify-center text-[#FF4C3B]"><CreditCard size={24} /></div>
                <div>
                  <h2 className="text-3xl font-black text-[#222] dark:text-white tracking-tight">Payment Method</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select your preferred option</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setPaymentMethod('stripe')}
                  className={`relative p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group ${paymentMethod === 'stripe' ? 'border-[#FF4C3B] bg-[#FF4C3B]/5 shadow-xl shadow-[#FF4C3B]/5' : 'border-slate-100 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-[#FF4C3B]' : 'border-slate-200'}`}>
                      {paymentMethod === 'stripe' && <div className="w-3 h-3 rounded-full bg-[#FF4C3B]" />}
                    </div>
                    <Lock size={18} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-black dark:text-white mb-2">Secure Card Payment</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">Fast & Secure mock payment. No API keys required.</p>
                </div>
                <div onClick={() => setPaymentMethod('cod')} className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group ${paymentMethod === 'cod' ? 'border-[#FF4C3B] bg-[#FF4C3B]/5 shadow-xl shadow-[#FF4C3B]/5' : 'border-slate-100 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}>
                  <div className="flex justify-between items-start mb-6"><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#FF4C3B]' : 'border-slate-200'}`}>{paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-[#FF4C3B]" />}</div><Truck size={18} className="text-slate-300" /></div>
                  <h3 className="text-lg font-black dark:text-white mb-2">Cash on Delivery</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">Pay with cash when package arrives.</p>
                </div>
              </div>
            </motion.section>
          </div>

          <div className="lg:col-span-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-32 bg-white dark:bg-[#111] rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4C3B]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h2 className="text-2xl font-black text-[#222] dark:text-white mb-8 tracking-tighter flex items-center gap-3">Order <span className="text-[#FF4C3B]">Summary</span></h2>

              <div className="space-y-6 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar mb-10">
                {cart?.items?.map((item, idx) => {
                  if (!item.productId || typeof item.productId !== 'object') return null;
                  return (
                    <div key={item.productId._id || idx} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-white/5 p-3 shrink-0 overflow-hidden relative border border-slate-100 dark:border-white/10">
                        <img src={getProductImage(item.productId)} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="text-[13px] font-black dark:text-white truncate uppercase tracking-tight">{item.productId.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                        <p className="text-sm font-black text-[#FF4C3B] mt-2">
                          Rp {((item.productId.discount > 0 ? item.productId.price - (item.productId.price * item.productId.discount / 100) : item.productId.price)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center text-sm"><span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Subtotal</span><span className="font-black dark:text-white">Rp {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Shipping</span><span className="font-black text-[#22c55e]">Rp {shipping.toLocaleString()}</span></div>
                <div className="flex justify-between items-center pt-6 mt-4 border-t-2 border-dashed border-slate-100 dark:border-white/5">
                  <div><p className="text-[10px] font-black text-[#FF4C3B] uppercase tracking-[0.2em]">Total Amount</p><p className="text-3xl font-black dark:text-white tracking-tighter mt-1">Rp {total.toLocaleString()}</p></div>
                </div>
                <button type="submit" disabled={isProcessing} className="w-full bg-[#FF4C3B] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs mt-8 hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all shadow-xl shadow-[#FF4C3B]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3">
                  {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Complete Order <ArrowRight size={18} /></>}
                </button>
                <div className="flex items-center justify-center gap-2 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><ShieldCheck size={14} className="text-[#22c55e]" /> SSL Secure Checkout</div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
