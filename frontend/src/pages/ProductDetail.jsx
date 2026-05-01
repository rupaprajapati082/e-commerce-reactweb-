import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage, getMultipleProductImages } from '../utils/imageHelper';
import { 
  Minus,
  Plus,
  Heart,
  AlertTriangle,
  ShieldCheck,
  Zap,
  MoreHorizontal,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Flame,
  Scale
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/${id}`);
        const productData = response.data.product;
        setProduct(productData);
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        
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
        { productId: id, quantity: quantity, size: selectedSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#FF4C3B] rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return null;

  const displayImages = getMultipleProductImages(product);
  const discountedPrice = product.discount > 0 ? product.price - (product.price * product.discount / 100) : product.price;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] font-sans pb-20">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-6 py-10 lg:py-16">
        <div className="bg-white dark:bg-[#111] rounded-[4rem] border border-slate-100 dark:border-white/10 overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row items-stretch">
            
            {/* LEFT: IMAGE SECTION */}
            <div className="w-full lg:w-1/2 bg-slate-50 dark:bg-white/5 relative">
               <button onClick={() => navigate(-1)} className="absolute top-8 left-8 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-black">
                 <ChevronLeft size={20} />
               </button>
               <button className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500">
                 <Heart size={20} />
               </button>

               <div className="aspect-square w-full flex items-center justify-center p-12">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeImage}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      src={displayImages[activeImage]} 
                      className="w-full h-full object-contain" 
                      alt=""
                    />
                  </AnimatePresence>
               </div>

               <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
                  {displayImages.map((_, idx) => (
                    <button key={idx} onClick={() => setActiveImage(idx)} className={`h-1.5 rounded-full transition-all ${activeImage === idx ? 'w-8 bg-[#FF4C3B]' : 'w-2 bg-slate-300'}`} />
                  ))}
               </div>
            </div>

            {/* RIGHT: CONTENT SECTION */}
            <div className="w-full lg:w-1/2 p-12 lg:p-16 space-y-10">
               <div className="flex justify-between items-start gap-4">
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{product.name}</h1>
                  <p className="text-4xl font-black text-slate-900 dark:text-white">₹{discountedPrice.toLocaleString()}</p>
               </div>

               {/* FOOD ICONS */}
               <div className="flex gap-4 text-slate-300">
                  <Leaf size={24} className={product.category === 'Food' ? 'text-emerald-500' : ''} />
                  <Flame size={24} className="text-orange-500" />
                  <Scale size={24} />
               </div>

               <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100">Description</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {product.description || "Simple, fresh vegetable options designed for those who appreciate quality and purity in every detail."}
                  </p>
                  {product.category === 'Food' && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      <span className="font-bold text-slate-900 dark:text-white">Ingredients:</span> rice paper wrappers, soy sauce, rice vinegar, purple cabbage, carrots, green beans, cucumber.
                    </p>
                  )}
               </div>

               {/* TAGS */}
               <div className="flex flex-wrap gap-3">
                  {['Asian', 'Appetizers', 'Vegan', 'Spicy', 'Fresh'].map(tag => (
                    <span key={tag} className="px-6 py-2.5 border border-slate-100 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-[#FF4C3B]/5 hover:text-[#FF4C3B] cursor-pointer transition-all">
                      {tag}
                    </span>
                  ))}
               </div>

               {/* SIZE SELECTOR (IF ANY) */}
               {product.sizes?.length > 0 && (
                 <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Configurations</p>
                   <div className="flex gap-3">
                      {product.sizes.map(s => (
                        <button key={s} onClick={() => setSelectedSize(s)} className={`w-14 h-14 rounded-2xl text-[10px] font-black transition-all ${selectedSize === s ? 'bg-black text-white shadow-xl scale-110' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}>
                          {s}
                        </button>
                      ))}
                   </div>
                 </div>
               )}

               {/* FOOTER ACTION AREA */}
               <div className="flex gap-6 pt-10 border-t border-slate-100 dark:border-white/10">
                  <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-2 border border-slate-100 dark:border-white/10">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-slate-300 hover:text-black dark:hover:text-white transition-colors"><Minus size={18} /></button>
                     <span className="w-12 text-center font-black text-slate-900 dark:text-white text-lg">{quantity}.0</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-slate-300 hover:text-black dark:hover:text-white transition-colors"><Plus size={18} /></button>
                  </div>
                  <button 
                    onClick={addToCart}
                    className="flex-1 bg-[#F59E0B] text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all"
                  >
                    Add To Cart
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* TRUST SIGNALS */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
           {[
             { icon: ShieldCheck, title: 'Safe Acquisition', desc: 'Secure industrial-grade packaging.' },
             { icon: Zap, title: 'Rapid Delivery', desc: 'Ships within 24 hours of audit.' },
             { icon: CheckCircle2, title: 'Certified Quality', desc: 'ISO certified performance standards.' },
           ].map((item, idx) => (
             <div key={idx} className="flex items-center gap-6 p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-black flex items-center justify-center text-[#FF4C3B] shadow-sm">
                  <item.icon size={24} />
                </div>
                <div>
                   <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{item.title}</h4>
                   <p className="text-xs text-slate-400 font-medium mt-1">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
