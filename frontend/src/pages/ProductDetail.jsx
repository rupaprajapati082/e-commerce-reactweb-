import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage, getMultipleProductImages } from '../utils/imageHelper';
import { 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Star, 
  ChevronLeft,
  MoreVertical,
  ChevronRight,
  Info,
  Clock,
  Zap
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/${id}`);
        setProduct(response.data.product);
        
        const allRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
        if (allRes.data && allRes.data.products) {
          const related = allRes.data.products
            .filter(p => p.category === response.data.product.category && p._id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, 
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const buyNow = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, 
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/checkout');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-100 border-t-[#FF4C3B] rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return null;

  const displayImages = getMultipleProductImages(product);
  const discountedPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#0A0A0A] font-sans pb-24 transition-colors duration-300">
      <Navbar />

      <div className="max-w-[1400px] mx-auto pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16">
          
          {/* ── Left: Premium Image Section ── */}
          <div className="lg:col-span-7 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] lg:aspect-square rounded-b-[4rem] lg:rounded-[4rem] overflow-hidden bg-white shadow-2xl"
            >
              {/* Overlay Buttons */}
              <div className="absolute top-8 left-8 z-10 flex gap-4">
                <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-all">
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute top-8 right-8 z-10">
                <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-all">
                  <MoreVertical size={24} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={displayImages[activeImage]} 
                  className="w-full h-full object-cover" 
                  alt={product.name}
                />
              </AnimatePresence>
              
              {/* Price Tag Floating (Mobile Only) */}
              <div className="lg:hidden absolute bottom-12 right-8 bg-[#FF4C3B] text-white px-6 py-3 rounded-2xl font-black text-xl shadow-xl">
                ${discountedPrice.toLocaleString()}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Content Section ── */}
          <div className="lg:col-span-5 px-6 lg:px-0 -mt-12 lg:mt-0 relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111] rounded-[4rem] p-10 lg:p-0 lg:bg-transparent dark:lg:bg-transparent shadow-2xl shadow-black/5 lg:shadow-none"
            >
              {/* Thumbnails */}
              <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
                {displayImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 aspect-square rounded-[1.5rem] overflow-hidden border-4 transition-all flex-shrink-0 ${activeImage === idx ? 'border-slate-100 dark:border-white/10' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Title & Price Row */}
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter max-w-[70%] leading-none">
                  {product.name}
                </h1>
                <div className="hidden lg:block text-3xl font-black text-slate-800 dark:text-white">
                  ${discountedPrice.toLocaleString()}
                </div>
              </div>

              {/* Subtitle & Rating */}
              <div className="flex justify-between items-center mb-10">
                <p className="text-slate-400 font-bold text-sm tracking-tight">{product.brand || 'Premium Collection'}</p>
                <div className="flex items-center gap-2">
                  <Star size={16} fill="#FFB800" className="text-[#FFB800]" />
                  <span className="text-sm font-black dark:text-white">4.8</span>
                  <span className="text-[10px] font-bold text-slate-400">(1K+ Review)</span>
                </div>
              </div>

              {/* Specification Grid (Attribute Cards) */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  { label: 'Category', value: product.category || 'General' },
                  { label: 'Stock', value: `${product.stock || 0} Units` },
                  { label: 'Discount', value: `${product.discount || 0}% Off` },
                ].map((spec, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2rem] p-5 text-center transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-xl hover:shadow-black/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                    <p className="text-xs font-black dark:text-white truncate">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="space-y-4 mb-12">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Summary</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {product.description || 'Experience the perfect blend of style and durability. This product is designed to meet the highest standards of quality and aesthetics...'}
                  <button className="text-slate-800 dark:text-white font-black ml-1">See more</button>
                </p>
              </div>

              {/* Action Bar (Desktop) */}
              <div className="hidden lg:flex gap-4">
                <button 
                  onClick={addToCart}
                  className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={buyNow}
                  className="flex-1 bg-[#B7EB2C] text-slate-900 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#B7EB2C]/20"
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Floating Mobile Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 p-6 z-[100] flex gap-4">
        <button 
          onClick={addToCart}
          className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
        >
          Add to Cart
        </button>
        <button 
          onClick={buyNow}
          className="flex-[1.5] bg-[#B7EB2C] text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#B7EB2C]/20"
        >
          Buy Now
        </button>
      </div>

      {/* ── Related Products ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-20 mt-32">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">You might <span className="text-[#FF4C3B]">also like</span></h2>
          <Link to="/products" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#FF4C3B] transition-colors">See all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {relatedProducts.map(p => (
            <motion.div whileHover={{ y: -10 }} key={p._id}>
              <Link to={`/product/${p._id}`} className="group block space-y-6">
                <div className="aspect-square rounded-[3rem] bg-white dark:bg-[#111] overflow-hidden p-8 border border-slate-50 dark:border-white/5 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <img src={getProductImage(p)} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div>
                  <h4 className="text-sm font-black dark:text-white group-hover:text-[#FF4C3B] transition-colors truncate">{p.name}</h4>
                  <p className="text-lg font-black dark:text-white mt-1">Rp {p.price.toLocaleString()}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;
