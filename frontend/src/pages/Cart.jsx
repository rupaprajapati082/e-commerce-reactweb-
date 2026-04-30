import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage } from '../utils/imageHelper';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2,
  Trash,
  Save,
  CreditCard,
  Package,
  BarChart3,
  PartyPopper,
  ShieldCheck,
  Eye
} from 'lucide-react';

// Checkout Flow Steps
const FLOW_STEPS = [
  { icon: ShoppingCart, label: 'Add to Cart',      desc: 'Item added',        color: '#22c55e' },
  { icon: Save,         label: 'Cart Saved',        desc: 'Synced to DB',      color: '#3b82f6' },
  { icon: ShieldCheck,  label: 'Checkout',          desc: 'Fill details',      color: '#8b5cf6' },
  { icon: CreditCard,   label: 'Payment',           desc: 'Stripe / COD',      color: '#f59e0b' },
  { icon: Package,      label: 'Order Created',     desc: 'Saved to MongoDB',  color: '#ef4444' },
  { icon: BarChart3,    label: 'Stock Updated',     desc: 'Inventory deducted',color: '#06b6d4' },
  { icon: PartyPopper,  label: 'Confirmed!',        desc: 'Order on its way',  color: '#ec4899' },
];

const CheckoutStepper = ({ currentStep }) => (
  <div className="w-full overflow-x-auto pb-2 mb-10">
    <div className="flex items-center min-w-max mx-auto px-2 py-6">
      {FLOW_STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx < currentStep;
        const isActive    = idx === currentStep;
        return (
          <React.Fragment key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex flex-col items-center gap-2 relative"
            >
              {/* Circle */}
              <div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500"
                style={{
                  background: isCompleted || isActive
                    ? `linear-gradient(135deg, ${step.color}cc, ${step.color})`
                    : 'rgba(148,163,184,0.1)',
                  border: isActive ? `2.5px solid ${step.color}` : '2.5px solid transparent',
                  boxShadow: isActive ? `0 0 24px ${step.color}55` : 'none',
                }}
              >
                {isCompleted
                  ? <CheckCircle2 size={24} color="#fff" />
                  : <Icon size={22} color={isActive ? '#fff' : '#94a3b8'} />
                }
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                    style={{ background: step.color }} />
                )}
              </div>

              {/* Label */}
              <div className="text-center w-20">
                <p className={`text-[11px] font-black uppercase tracking-tight leading-tight
                  ${isActive ? 'text-slate-800 dark:text-white' : isCompleted ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{step.desc}</p>
              </div>
            </motion.div>

            {/* Connector */}
            {idx < FLOW_STEPS.length - 1 && (
              <div className="mx-1 mt-[-20px] flex-shrink-0 w-10 h-[3px] rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: idx < currentStep ? '100%' : '0%' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  style={{ background: FLOW_STEPS[idx].color }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

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

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, 
        { productId, quantity: newQuantity, overwrite: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.dispatchEvent(new Event('cartUpdated'));
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/remove`, 
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.dispatchEvent(new Event('cartUpdated'));
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-100 dark:border-white/5 border-t-[#22c55e] rounded-full animate-spin"></div>
    </div>
  );

  const subtotal = cart?.items.reduce((acc, item) => {
    if (!item.productId) return acc;
    const price = item.productId.discount > 0 
      ? item.productId.price - (item.productId.price * item.productId.discount / 100)
      : item.productId.price;
    return acc + (price * item.quantity);
  }, 0) || 0;

  const shipping = 600;
  const tax = 137;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-[#0A0A0A] transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto px-6 md:px-20 py-12">

        {/* ── Checkout Progress Stepper ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm px-6 mb-8 overflow-x-auto"
        >
          <CheckoutStepper currentStep={cart && cart.items?.length > 0 ? 1 : 0} />
        </motion.div>

        {!cart || cart.items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10"
          >
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-400">
              <ShoppingCart size={40} />
            </div>
            <h2 className="text-3xl font-black dark:text-white mb-4">Your Cart is Empty</h2>
            <Link 
              to="/products" 
              className="px-10 py-5 bg-[#22c55e] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-2xl inline-flex items-center gap-2"
            >
              Shop Now <ChevronRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Select All Header */}
              <div className="flex items-center gap-4 bg-white dark:bg-[#111] p-4 rounded-xl border border-slate-100 dark:border-white/5">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-slate-300 dark:border-white/10 accent-black dark:accent-white cursor-pointer" 
                  defaultChecked
                />
                <span className="text-sm font-medium dark:text-white">Select All</span>
              </div>

              <AnimatePresence mode='popLayout'>
                {cart.items.filter(item => item.productId).map((item, idx) => {
                  const currentPrice = item.productId.discount > 0 
                    ? item.productId.price - (item.productId.price * item.productId.discount / 100)
                    : item.productId.price;
                  
                  return (
                    <motion.div 
                      key={item.productId._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white dark:bg-[#111] p-6 rounded-2xl flex items-center gap-6 border border-slate-100 dark:border-white/5 group relative"
                    >
                      {/* Checkbox */}
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 accent-black dark:accent-white cursor-pointer"
                        defaultChecked
                      />

                      {/* Image */}
                      <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-2xl overflow-hidden flex-shrink-0">
                        <img 
                          src={getProductImage(item.productId)} 
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          alt={item.productId.name}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-sm dark:text-white line-clamp-1">{item.productId.name}</h3>
                        <p className="text-sm font-bold dark:text-white">Rp {currentPrice.toLocaleString()}</p>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">Size: S</p>
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-lg p-1 border border-slate-100 dark:border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                            className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-all dark:text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold dark:text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                            className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-all dark:text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeItem(item.productId._id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-[#22c55e]/30 shadow-xl shadow-green-500/5"
                >
                  <h2 className="text-xl font-bold dark:text-white mb-8">Order Summary</h2>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="text-sm font-medium">Sub Total:</span>
                      <span className="font-bold text-black dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="text-sm font-medium">Shipping estimate:</span>
                      <span className="font-bold text-black dark:text-white">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/5 pb-6">
                      <span className="text-sm font-medium">Tax estimate:</span>
                      <span className="font-bold text-black dark:text-white">${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-black uppercase tracking-widest dark:text-white">Order Total:</span>
                      <span className="text-xl font-black dark:text-white">${total.toFixed(2)}</span>
                    </div>

                    <button 
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-[#22c55e] hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-green-500/20 mt-4 active:scale-95"
                    >
                      Checkout
                    </button>
                  </div>
                </motion.div>

                {/* Additional Info */}
                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                  <ArrowLeft size={14} /> 
                  <Link to="/products" className="hover:text-[#22c55e] transition-colors">Continue Shopping</Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
