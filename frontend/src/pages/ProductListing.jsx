import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProductImage } from '../utils/imageHelper';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Timer, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  PackageIcon, 
  Truck, 
  CheckCircle2,
  Minus,
  Plus,
  Leaf,
  Flame,
  Scale
} from 'lucide-react';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [priceRange, setPriceRange] = useState(100000);
  const [sortBy, setSortBy] = useState('Featured Items');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
        if (response.data && response.data.products) {
          setProducts(response.data.products);
          // Only filter with 'All' if no category in URL
          const params = new URLSearchParams(location.search);
          const initialCat = params.get('category') || 'All';
          applyFilters(response.data.products, initialCat, 100000, 'Featured Items');
        }

        const catRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/category/all`);
        if (catRes.data && catRes.data.categories) {
          setCategories(['All', ...catRes.data.categories.map(c => c.name)]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlCat = params.get('category');
    if (urlCat) {
      setCategory(urlCat);
    } else if (!location.search.includes('search')) {
      setCategory('All');
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters(products, category, priceRange, sortBy);
  }, [category, products, location.search, priceRange, sortBy]);

  const applyFilters = (allProducts, cat, price, sort) => {
    let filtered = [...allProducts];
    
    // 1. Category Filter (Simple & Direct)
    if (cat && cat !== 'All') {
      filtered = filtered.filter(p => {
        if (!p.category) return false;
        return p.category.trim().toLowerCase() === cat.trim().toLowerCase();
      });
    }

    // 2. Price Filter
    filtered = filtered.filter(p => {
      const actualPrice = p.discount > 0 ? (p.price - (p.price * p.discount / 100)) : p.price;
      return actualPrice <= price;
    });
    
    // 3. Search Query Filter
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // 4. Sorting
    if (sort === 'Price: Low to High') {
      filtered.sort((a, b) => (a.price - (a.price * (a.discount || 0) / 100)) - (b.price - (b.price * (b.discount || 0) / 100)));
    } else if (sort === 'Price: High to Low') {
      filtered.sort((a, b) => (b.price - (b.price * (b.discount || 0) / 100)) - (a.price - (a.price * (a.discount || 0) / 100)));
    }

    setFilteredProducts(filtered);
  };

  const addToCart = async (productId, qty = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, { productId, quantity: qty }, { headers: { Authorization: `Bearer ${token}` } });
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
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

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-12">
          {/* Categories Section */}
          <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#FF4C3B]"></span>
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map(cat => {
                const isActive = category === cat;
                const count = products.filter(p => {
                  const pCat = (p.category || '').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                  return pCat === cat || cat === 'All';
                }).length;

                return (
                  <button 
                    key={cat} 
                    onClick={() => {
                      setCategory(cat);
                      navigate(`/products${cat === 'All' ? '' : `?category=${encodeURIComponent(cat)}`}`);
                    }}
                    className={`group relative flex justify-between items-center w-full p-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#FF4C3B] text-white shadow-lg shadow-[#FF4C3B]/20' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 hover:text-black dark:hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      {isActive && <motion.div layoutId="activeCat" className="w-1.5 h-1.5 rounded-full bg-white" />}
                      <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? '' : 'group-hover:translate-x-1 transition-transform'}`}>{cat}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Filter Section */}
          <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                 <span className="w-8 h-[2px] bg-[#FF4C3B]"></span>
                 Price Limit
               </h3>
               <button onClick={() => setPriceRange(100000)} className="text-[9px] font-black uppercase text-[#FF4C3B] hover:underline">Reset</button>
            </div>
            
            <div className="space-y-6">
              <div className="relative pt-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100000" 
                  step="1000" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(parseInt(e.target.value))} 
                  className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#FF4C3B]" 
                />
                <div className="absolute -top-4 right-0">
                   <span className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-lg">MAX</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Starting From</p>
                   <p className="text-sm font-black dark:text-white tracking-tight">₹0</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Capped At</p>
                   <p className="text-xl font-black text-[#FF4C3B] tracking-tighter">₹{priceRange.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1 space-y-10">
          <div className="flex justify-between items-center border-b pb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory: {filteredProducts.length} Units</p>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer">
               <option>Featured Items</option>
               <option>Price: Low to High</option>
               <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredProducts.map(product => {
              const finalPrice = product.discount > 0 ? (product.price - (product.price * product.discount / 100)) : product.price;
              return (
                <motion.div 
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50 p-6">
                    <img 
                      src={getProductImage(product)} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                      alt={product.name}
                    />
                    <button onClick={(e) => { e.stopPropagation(); addToWishlist(product._id); }} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-all z-10">
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg font-black text-slate-900 leading-tight line-clamp-2">{product.name}</h3>
                      <p className="text-xl font-black text-[#FF4C3B] shrink-0">₹{finalPrice.toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-slate-50 text-[10px] font-black uppercase text-slate-400 rounded-lg">{product.category}</span>
                       {product.discount > 0 && <span className="px-3 py-1 bg-red-50 text-[10px] font-black uppercase text-red-500 rounded-lg">-{product.discount}% OFF</span>}
                    </div>

                    <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                      {product.description || 'Premium quality professional gear designed for performance and durability.'}
                    </p>

                    <div className="pt-4 flex gap-3">
                       <button 
                         onClick={() => addToCart(product._id)}
                         className="flex-1 bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF4C3B] transition-all"
                       >
                         Add to Cart
                       </button>
                       <button 
                         onClick={() => { setSelectedProduct(product); setIsQuickViewOpen(true); }}
                         className="px-6 bg-slate-50 text-slate-900 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
                       >
                         View Details
                       </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK VIEW MODAL - RE-DESIGNED TO MATCH IMAGE */}
      <AnimatePresence>
        {isQuickViewOpen && selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsQuickViewOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-lg bg-white rounded-[3.5rem] overflow-hidden shadow-2xl"
            >
              <button onClick={() => setIsQuickViewOpen(false)} className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-black">
                 <X size={18} />
              </button>
              <button className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500">
                 <Heart size={18} />
              </button>

              {/* IMAGE TOP */}
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img src={getProductImage(selectedProduct)} className="w-full h-full object-cover" alt="Product" />
              </div>

              {/* CONTENT BODY */}
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-start gap-4">
                   <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h2>
                   <p className="text-2xl font-black text-slate-900">₹{selectedProduct.price.toLocaleString()}</p>
                </div>

                {/* FOOD ICONS (Dynamic) */}
                <div className="flex gap-4 text-slate-300">
                   <Leaf size={20} className={selectedProduct.category === 'Food' ? 'text-green-500' : ''} />
                   <Flame size={20} className="text-orange-400" />
                   <Scale size={20} />
                </div>

                <div className="space-y-4">
                   <h4 className="text-lg font-serif font-bold text-slate-800">Description</h4>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">
                     {selectedProduct.description || 'Premium selection curated for the finest quality and performance standards.'}
                   </p>
                   {selectedProduct.category === 'Food' && (
                     <p className="text-sm text-slate-500 font-medium">
                       <span className="font-bold text-slate-800">Ingredients:</span> rice paper wrappers, soy sauce, rice vinegar, purple cabbage, carrots, green beans, cucumber.
                     </p>
                   )}
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 pt-2">
                   {['Asian', 'Appetizers', 'Vegan', 'Spicy', 'Fresh'].map(tag => (
                     <span key={tag} className="px-6 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition-all">
                       {tag}
                     </span>
                   ))}
                </div>

                {/* FOOTER ACTION */}
                <div className="flex gap-4 pt-6">
                   <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-300 hover:text-black"><Minus size={16} /></button>
                      <span className="w-12 text-center font-black text-slate-900">{quantity}.0</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-slate-300 hover:text-black"><Plus size={16} /></button>
                   </div>
                   <button 
                     onClick={() => { addToCart(selectedProduct._id, quantity); setIsQuickViewOpen(false); }}
                     className="flex-1 bg-[#F59E0B] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all"
                   >
                     Add To Cart
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProductListing;
