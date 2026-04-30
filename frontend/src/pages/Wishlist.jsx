import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProductImage } from '../utils/imageHelper';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart, Heart, ArrowRight, Star } from 'lucide-react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/wishlist/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // The API returns { message: "...", products: [...] }
      setWishlist(response.data.products || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/wishlist/remove`, 
        { item: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistically update UI
      setWishlist(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, 
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-100 dark:border-white/5 border-t-[#FF4C3B] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] transition-colors duration-300">
      <Navbar />
      
      {/* Premium Header */}
      <div className="bg-[#222] py-20 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FF4C3B]/10 blur-[120px] rounded-full"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white capitalize mb-4 tracking-tighter">
            My <span className="text-[#FF4C3B]">Wishlist</span>
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 uppercase tracking-[0.2em] font-bold">
            <Link to="/" className="hover:text-[#FF4C3B] transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-white">Collection</span>
          </div>
        </motion.div>
      </div>

      <div className="px-6 md:px-20 py-24">
        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto text-center py-24 bg-white dark:bg-[#111] rounded-[3rem] shadow-2xl shadow-black/5 border border-slate-50 dark:border-white/5"
          >
            <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart size={40} className="text-slate-200 dark:text-slate-800" />
            </div>
            <h2 className="text-3xl font-black text-[#222] dark:text-white mb-4">Your wishlist is lonely</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-md mx-auto leading-relaxed">
              Looks like you haven't saved any professional gear yet. Explore our latest catalog and find the tools you need.
            </p>
            <Link to="/products" className="inline-flex items-center gap-3 px-10 py-5 bg-[#FF4C3B] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-xl shadow-[#FF4C3B]/20">
              Explore Collection <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product, i) => (
                <motion.div 
                  key={product._id} 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white dark:bg-[#111] rounded-[2rem] border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-[#F9F9F9] dark:bg-white/5 overflow-hidden p-10">
                    <img 
                      src={getProductImage(product)} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 cursor-pointer" 
                      onClick={() => navigate(`/product/${product._id}`)}
                    />
                    <button 
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-6 right-6 w-12 h-12 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-[#FF4C3B] shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                    {product.discount > 0 && (
                      <span className="absolute top-6 left-6 bg-[#FF4C3B] text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 space-y-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] text-[#FF4C3B] font-black uppercase tracking-widest">
                          {product.category || 'Gear'}
                        </p>
                        <h3 className="font-bold text-lg text-[#222] dark:text-white leading-tight hover:text-[#FF4C3B] transition-colors">
                          <Link to={`/product/${product._id}`}>{product.name}</Link>
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-[#FFB800]">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[10px] font-black text-black dark:text-white">4.8</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-2xl font-black text-[#222] dark:text-white">
                        Rp {product.price.toLocaleString()}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-slate-400 line-through font-medium">
                          Rp {(product.price * 1.2).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 mt-auto">
                      <button 
                        onClick={() => addToCart(product._id)}
                        className="flex-1 bg-black dark:bg-white text-white dark:text-black py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/10"
                      >
                        Move To Cart
                      </button>
                      <button 
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="w-14 h-14 rounded-full border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white transition-all"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
