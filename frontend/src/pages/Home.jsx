import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage } from '../utils/imageHelper';
import { 
  Truck, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  Star,
  Zap,
  Award,
  ChevronRight,
  Heart
} from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        // Fetch Products
        const prodRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
        if (prodRes.data && prodRes.data.products) {
          setProducts(prodRes.data.products);
        }

        // Fetch Official Categories
        const catRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/category/all`);
        if (catRes.data && catRes.data.categories) {
          setCategories(catRes.data.categories.slice(0, 6).map(cat => ({
            title: cat.name,
            img: cat.image,
            category: cat.name
          })));
        }
      } catch (err) {
        console.error('Error fetching home content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, { productId, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/wishlist/add`, { item: productId }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Item successfully added to your Wishlist! ❤️');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img 
            key="hero"
            src="/hero.jpg"
            initial={{ opacity: 0, scale: 1.1 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }} 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" 
            alt="Hero Background" 
          />
        </AnimatePresence>
        
        <div className="max-w-[1250px] mx-auto px-6 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#FF4C3B]/10 border border-[#FF4C3B]/20 text-[#FF4C3B] text-[10px] font-black tracking-widest uppercase rounded-full">
              <Zap size={14} fill="currentColor" /> Welcome to the ultimate shopping experience
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter">
              Enjoy Your Every MInt <br /> <span className="text-[#FF4C3B]">with My Mart</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium max-w-xl">
              Discover premium collections and exclusive deals engineered for those who demand absolute quality.
            </p>
            <div className="flex gap-4 pt-4">
              <button onClick={() => navigate('/products')} className="group px-10 py-5 bg-[#FF4C3B] text-white font-black rounded-2xl flex items-center gap-2 hover:bg-white hover:text-black transition-all shadow-2xl">
                Browse Catalog <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-12 border-b border-slate-100 dark:border-white/5">
        <div className="max-w-[1250px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Express Logistics', icon: Truck, color: 'text-blue-500' },
            { label: 'Expert Support 24/7', icon: Clock, color: 'text-[#FF4C3B]' },
            { label: 'Security Guaranteed', icon: ShieldCheck, color: 'text-emerald-500' },
            { label: 'Global Payments', icon: CreditCard, color: 'text-orange-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-default">
              <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <span className="text-sm font-black dark:text-slate-200 uppercase tracking-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-slate-50 dark:bg-[#0F0F0F]/50">
        <div className="max-w-[1250px] mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-[#FF4C3B] uppercase tracking-[0.3em]">Operational Categories</h2>
              <h3 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter">Procure by Segment</h3>
            </div>
            <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-[#FF4C3B] transition-colors uppercase tracking-widest">
              Full Catalog <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <motion.div key={idx} whileHover={{ y: -5 }} onClick={() => navigate(`/products?category=${cat.category}`)} className="group cursor-pointer bg-white dark:bg-[#111] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-[#FF4C3B] hover:shadow-2xl transition-all text-center">
                <div className="aspect-square rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 overflow-hidden">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="font-black text-xs dark:text-white capitalize tracking-tight">{cat.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STAFF PICKS - UPDATED CARDS */}
      <section className="py-24">
        <div className="max-w-[1250px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-[#FF4C3B] font-black uppercase tracking-[0.3em] text-[10px]">Strategic Acquisitions</h2>
            <h3 className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter">Elite Selections</h3>
            <p className="text-slate-500 font-medium">Precision gear trusted by professionals for reliability and high-intensity performance.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="animate-pulse bg-slate-100 h-80 rounded-[2.5rem]" />)
            ) : (
              products.slice(0, 8).map((product, i) => {
                const finalPrice = product.discount > 0 ? (product.price - (product.price * product.discount / 100)) : product.price;
                return (
                  <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group bg-white dark:bg-[#111] rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-2xl transition-all flex flex-col">
                    <div onClick={() => navigate(`/product/${product._id}`)} className="relative aspect-square bg-slate-50 dark:bg-white/5 overflow-hidden cursor-pointer p-8">
                      <img src={getProductImage(product)} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt="" />
                      <button onClick={(e) => { e.stopPropagation(); addToWishlist(product._id); }} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-all z-10">
                        <Heart size={18} />
                      </button>
                    </div>
                    
                    <div className="p-8 space-y-4 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight line-clamp-2">{product.name}</h4>
                        <p className="text-xl font-black text-[#FF4C3B] shrink-0">₹{finalPrice.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase text-slate-400 rounded-lg">{product.category}</span>
                      </div>

                      <div className="pt-4 flex flex-col gap-2">
                        <button onClick={() => addToCart(product._id)} className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF4C3B] transition-all">
                          Add to Cart
                        </button>
                        <button onClick={() => navigate(`/product/${product._id}`)} className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-all">
                          Full Specifications
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* BANNER */}
      <section className="py-24">
        <div className="max-w-[1250px] mx-auto px-6">
          <div className="relative h-[550px] rounded-[4rem] overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1542330952-428a2048967b?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" alt="" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex flex-col justify-center p-12 md:p-24 space-y-8">
              <span className="text-[#FF4C3B] font-black uppercase tracking-[0.3em] text-xs">Tier-1 Logistics</span>
              <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">Global <br /> Infrastructure</h3>
              <p className="text-slate-300 max-w-md font-medium text-lg leading-relaxed">Join the network of over 50,000 professionals who rely on Multikart for industrial-grade excellence.</p>
              <button onClick={() => navigate('/products')} className="px-12 py-5 bg-white text-black font-black rounded-2xl w-fit hover:bg-[#FF4C3B] hover:text-white transition-all shadow-2xl uppercase text-[11px] tracking-widest">
                Procurement Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;