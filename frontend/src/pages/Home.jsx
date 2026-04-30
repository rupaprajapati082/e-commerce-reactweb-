import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
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
  ShoppingCart
} from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
        if (response.data && response.data.products) {
          const allProducts = response.data.products;
          setProducts(allProducts);
          
          const uniqueCats = [...new Set(allProducts.map(p => p.category))];
          const promoCats = uniqueCats.slice(0, 6).map(cat => {
            const sampleProd = allProducts.find(p => p.category === cat);
            return {
              title: cat,
              img: sampleProd?.images[0] || 'https://images.unsplash.com/photo-1581244276891-6677cf47c247?auto=format&fit=crop&q=80&w=300',
              category: cat
            };
          });
          setCategories(promoCats);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      await axios.post(`${import.meta.env.VITE_BASE_URL}/wishlist/add`, 
        { item: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to wishlist! ❤️');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add to wishlist');
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
    } catch (err) {
      console.error(err);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-[0.4]" 
          />
        </motion.div>
        
        <div className="container mx-auto px-6 md:px-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4C3B]/10 border border-[#FF4C3B]/20 text-[#FF4C3B] text-xs font-bold tracking-widest uppercase">
              <Zap size={14} fill="currentColor" />
              Premium Tool Collection 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
              Master Your <span className="text-[#FF4C3B]">Craft</span> With Precision
            </h1>
            <p className="text-xl text-slate-300 font-medium max-w-xl leading-relaxed">
              Discover professional-grade tools engineered for performance, durability, and absolute accuracy.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => navigate('/products')}
                className="group px-10 py-5 bg-[#FF4C3B] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-white hover:text-black transition-all shadow-2xl shadow-[#FF4C3B]/20"
              >
                Shop Collection
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/10"
              >
                View Services
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 right-0 p-20 hidden lg:block">
           <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4"
           >
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-[#FF4C3B] flex items-center justify-center text-white">
                 <Award size={24} />
               </div>
               <div>
                 <p className="text-white font-bold">Top Rated Store</p>
                 <div className="flex text-yellow-400">
                   {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                 </div>
               </div>
             </div>
           </motion.div>
        </div>
      </section>

      <section className="py-12 border-b border-slate-100 dark:border-white/5">
        <div className="container mx-auto px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Free Worldwide Shipping', icon: Truck, color: 'text-blue-500' },
              { label: '24/7 Expert Support', icon: Clock, color: 'text-purple-500' },
              { label: 'Buyer Protection', icon: ShieldCheck, color: 'text-green-500' },
              { label: 'Secure Payments', icon: CreditCard, color: 'text-orange-500' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-default group"
              >
                <div className={`p-3 rounded-xl bg-slate-100 dark:bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <span className="text-sm font-bold dark:text-slate-200">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-[#0F0F0F]/50">
        <div className="container mx-auto px-6 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div {...fadeInUp}>
              <h2 className="text-sm font-black text-[#FF4C3B] uppercase tracking-widest mb-4">Explore our inventory</h2>
              <h3 className="text-4xl md:text-5xl font-black dark:text-white">Shop By Category</h3>
            </motion.div>
            <motion.button 
              {...fadeInUp}
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 text-sm font-bold dark:text-slate-400 hover:text-[#FF4C3B] transition-colors"
            >
              View All Categories <ChevronRight size={16} />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/products?category=${cat.category}`)}
                className="group cursor-pointer bg-white dark:bg-[#111] p-6 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-[#FF4C3B] hover:shadow-2xl hover:shadow-[#FF4C3B]/10 transition-all text-center"
              >
                <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 overflow-hidden">
                  <img 
                    src={cat.img} 
                    alt={cat.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <h4 className="font-bold text-sm dark:text-white capitalize group-hover:text-[#FF4C3B] transition-colors">{cat.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 md:px-20">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.h2 {...fadeInUp} className="text-[#FF4C3B] font-bold uppercase tracking-widest text-xs mb-4">Staff Picks</motion.h2>
            <motion.h3 {...fadeInUp} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black dark:text-white mb-6">Popular Essentials</motion.h3>
            <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-slate-500 dark:text-slate-400 font-medium">Top-performing gear trusted by professionals worldwide for reliability and heavy-duty performance.</motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-3xl"></div>
                  <div className="h-4 bg-slate-100 dark:bg-white/5 w-1/2 rounded"></div>
                  <div className="h-4 bg-slate-100 dark:bg-white/5 w-3/4 rounded"></div>
                </div>
              ))
            ) : (
              products.slice(0, 8).map((product, i) => (
                <motion.div 
                  key={product._id} 
                  {...fadeInUp}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-white dark:bg-[#111] rounded-sm border border-slate-100 dark:border-white/5 p-0 hover:shadow-2xl transition-all overflow-hidden flex flex-col"
                >
                  <div 
                    onClick={() => navigate(`/product/${product._id}`)} 
                    className="relative aspect-square bg-white dark:bg-white/5 overflow-hidden cursor-pointer p-8"
                  >
                    <img 
                      src={getProductImage(product)} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-4 left-4 bg-[#FF4C3B] text-white text-[11px] font-bold px-3 py-1 rounded shadow-md tracking-wider">
                        -{product.discount}%
                      </span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(product._id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-3 flex-1 text-center">
                    <p className="text-[10px] text-[#FF4C3B] font-medium tracking-[0.2em] uppercase">
                      {product.brand || 'MultiKart'}
                    </p>
                    <h3 
                      onClick={() => navigate(`/product/${product._id}`)} 
                      className="text-slate-800 dark:text-white text-sm font-medium tracking-wide hover:text-[#FF4C3B] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <span className="text-[#FF4C3B] text-lg font-medium">
                        ${product.discount > 0 ? (product.price - (product.price * product.discount / 100)).toFixed(2) : product.price.toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-slate-400 text-xs font-medium line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-px bg-slate-100 dark:bg-white/10">
                    <button 
                      onClick={() => addToCart(product._id)}
                      className="w-full bg-[#FF4C3B] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-600 transition-colors"
                    >
                      Add To Cart
                    </button>
                    <button 
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 md:px-20">
          <motion.div 
            {...fadeInUp}
            className="relative h-[500px] rounded-[3rem] overflow-hidden group"
          >
            <img 
              src="https://images.unsplash.com/photo-1542330952-428a2048967b?auto=format&fit=crop&q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" 
              alt="Promo" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-12 md:p-24 space-y-6">
              <span className="text-[#FF4C3B] font-black uppercase tracking-widest text-sm">Industrial Grade Warranty</span>
              <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Quality You Can <br /> Build Your Future On
              </h3>
              <p className="text-slate-300 max-w-md font-medium">
                Every purchase comes with our 5-year replacement warranty. Join over 50,000 professionals who trust Multikart.
              </p>
              <button className="px-10 py-5 bg-white text-black font-black rounded-2xl w-fit hover:bg-[#FF4C3B] hover:text-white transition-all shadow-2xl">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { title: 'Fast Logistics', desc: 'Secure delivery for industrial equipment worldwide.', icon: Truck },
              { title: 'Tech Support', desc: 'Expert assistance 24/7 for all queries.', icon: Award },
              { title: 'Certified Quality', desc: 'Certified to meet international standards.', icon: ShieldCheck },
              { title: 'Secure Vault', desc: 'Multi-layer encrypted payment processing.', icon: CreditCard },
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                {...fadeInUp}
                transition={{ delay: idx * 0.1 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#FF4C3B]">
                  <feature.icon size={24} />
                </div>
                <h4 className="font-black text-lg dark:text-white">{feature.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;