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
  CheckCircle2 
} from 'lucide-react';

const ProductListing = () => {
 const [products, setProducts] = useState([]);
 const [filteredProducts, setFilteredProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [category, setCategory] = useState('All');
 const [selectedProduct, setSelectedProduct] = useState(null);
 const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
 const [expandedSection, setExpandedSection] = useState('description');
 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
 const fetchProducts = async () => {
 try {
 setLoading(true);
 const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
 if (response.data && response.data.products) {
 setProducts(response.data.products);
 applyFilters(response.data.products, category);
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
 applyFilters(products, category);
 }, [category, products, location.search]);

 const applyFilters = (allProducts, cat) => {
 let filtered = [...allProducts];
 
 // Filter by category
 if (cat !== 'All') {
 filtered = filtered.filter(p => p.category === cat);
 }

 // Filter by search query from URL
 const searchParams = new URLSearchParams(location.search);
 const query = searchParams.get('search');
 if (query) {
 filtered = filtered.filter(p => 
 p.name.toLowerCase().includes(query.toLowerCase()) ||
 p.category.toLowerCase().includes(query.toLowerCase()) ||
 p.brand?.toLowerCase().includes(query.toLowerCase())
 );
 }

 setFilteredProducts(filtered);
 };

 const predefinedCategories = [
   'Dress',
   'Electronic',
   'Fashion',
   'Top',
   'Cosmetic'
 ];
 const dynamicCats = [...new Set(products.map(p => p.category))].filter(c => !predefinedCategories.includes(c));
 const categories = ['All', ...predefinedCategories, ...dynamicCats];

 const addToCart = async (productId) => {
 try {
 const token = localStorage.getItem('token');
 if (!token) return navigate('/login');
 
 await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, 
 { productId, quantity: 1 },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 alert('Added to cart!');
 } catch (err) {
 console.error(err);
 alert(err.response?.data?.message || 'Failed to add to cart');
 }
 };

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

 return (
 <div className="min-h-screen bg-[#FDFDFD]">
 <Navbar />
 
 {/* Breadcrumbs / Header */}
 <div className="bg-[#222] py-16 px-6 md:px-20 border-b border-white/5">
 <h1 className="text-4xl md:text-5xl font-normal text-white capitalize mb-4">
 {category === 'All' ? 'Tool Catalog' : category}
 </h1>
 <div className="flex items-center gap-2 text-[10px] text-slate-400 capitalize font-normal tracking-[0.2em]">
 <span className="cursor-pointer hover:text-[#FF4C3B] transition-colors" onClick={() => navigate('/')}>Home</span>
 <span className="text-slate-600">/</span>
 <span className="text-slate-200">Shop</span>
 {category !== 'All' && (
 <>
 <span className="text-slate-600">/</span>
 <span className="text-[#FF4C3B]">{category}</span>
 </>
 )}
 </div>
 </div>

 <div className="px-6 md:px-20 py-20 flex flex-col md:flex-row gap-16">
 {/* Sidebar Filters */}
 <div className="w-full md:w-72 shrink-0 space-y-12">
 <div>
 <h3 className="text-[13px] font-normal capitalize tracking-[0.2em] text-[#222] mb-8 border-b-2 border-slate-100 pb-3">Categories</h3>
 <div className="space-y-4">
 {categories.map(cat => (
 <button 
 key={cat}
 onClick={() => setCategory(cat)}
 className={`flex justify-between items-center w-full text-[12px] font-bold capitalize tracking-wider transition-all group ${category === cat ? 'text-[#FF4C3B]' : 'text-slate-500 hover:text-[#FF4C3B]'}`}
 >
 <span>{cat}</span>
 <span className={`text-[9px] px-2 py-0.5 rounded-sm transition-colors ${category === cat ? 'bg-[#FF4C3B] text-white' : 'bg-slate-100 group-hover:bg-[#FF4C3B]/10'}`}>
 {cat === 'All' ? products.length : products.filter(p => p.category === cat).length}
 </span>
 </button>
 ))}
 </div>
 </div>

 <div>
 <h3 className="text-[13px] font-normal capitalize tracking-[0.2em] text-[#222] mb-8 border-b-2 border-slate-100 pb-3">Price Range</h3>
 <div className="space-y-6">
 <input type="range" className="w-full accent-[#FF4C3B]" />
 <div className="flex justify-between text-[10px] font-normal text-slate-400 capitalize ">
 <span>$0</span>
 <span>$2000</span>
 </div>
 </div>
 </div>

 <div className="bg-black p-8 rounded-sm space-y-4">
 <h4 className="font-normal text-white capitalize text-sm ">Pro Member Deal</h4>
 <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Save an extra 15% on all heavy duty power tools this week.</p>
 <button className="text-[10px] font-normal capitalize tracking-[0.2em] text-[#FF4C3B] border-b-2 border-[#FF4C3B] hover:text-white hover:border-white transition-all">Claim Now</button>
 </div>
 </div>

 {/* Product Grid */}
 <div className="flex-1">
 <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-6">
 <p className="text-[11px] text-slate-400 font-bold capitalize ">Results Found: {filteredProducts.length}</p>
 <div className="flex gap-4">
 <select className="text-[11px] font-normal capitalize bg-transparent outline-none cursor-pointer border-b border-transparent focus:border-[#FF4C3B] transition-all">
 <option>Featured Items</option>
 <option>Price: Low to High</option>
 <option>Price: High to Low</option>
 <option>New Arrivals</option>
 </select>
 </div>
 </div>

 {loading ? (
 <div className="flex justify-center py-20">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4C3B]"></div>
 </div>
 ) : filteredProducts.length === 0 ? (
 <div className="text-center py-20">
 <div className="text-4xl mb-4">🔍</div>
 <h3 className="text-2xl font-normal text-[#222] mb-2 capitalize ">No products found</h3>
 <p className="text-slate-500 text-[11px] font-bold capitalize ">Try adjusting your filters or search query.</p>
 <button 
 onClick={() => {setCategory('All'); navigate('/products')}} 
 className="mt-10 px-10 py-4 bg-black text-white text-[11px] font-normal capitalize tracking-[0.2em] hover:bg-[#FF4C3B] transition-all"
 >
 Clear All Filters
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {filteredProducts.map(product => (
  <div key={product._id} className="group cursor-pointer bg-white border border-slate-100 p-0 hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full overflow-hidden">
  <div onClick={() => navigate(`/product/${product._id}`)} className="relative aspect-square overflow-hidden bg-white p-8">
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
  className="text-slate-800 dark:text-white text-sm font-medium tracking-wide hover:text-[#FF4C3B] transition-colors cursor-pointer capitalize"
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
  onClick={() => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  }}
  className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors"
  >
  View Details
  </button>
  </div>
  </div>
  ))}
 </div>
 )}
 </div>
 </div>

 <AnimatePresence>
    {isQuickViewOpen && selectedProduct && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsQuickViewOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-[#0A0A0A] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsQuickViewOpen(false)}
            className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center hover:rotate-90 transition-transform duration-300 shadow-lg"
          >
            <X size={20} className="dark:text-white" />
          </button>

          {/* Left: Images */}
          <div className="w-full md:w-1/2 p-10 bg-slate-50 dark:bg-[#111] overflow-y-auto custom-scrollbar">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-white dark:bg-white/5 mb-6 shadow-sm flex items-center justify-center">
              <img src={getProductImage(selectedProduct)} className="w-full h-full object-contain p-8" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 overflow-hidden cursor-pointer hover:border-[#FF4C3B] transition-colors">
                  <img src={getProductImage(selectedProduct)} className="w-full h-full object-cover p-2 opacity-50 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-12 overflow-y-auto space-y-10 custom-scrollbar bg-white dark:bg-[#0A0A0A]">
            <div className="space-y-4">
              <span className="inline-block px-6 py-2 bg-slate-50 dark:bg-white/5 rounded-full text-[11px] font-medium text-slate-600 dark:text-slate-300">
                {selectedProduct.category || 'Man Fashion'}
              </span>
              <h2 className="text-5xl font-medium dark:text-white tracking-tight leading-[1.1]">
                {selectedProduct.name}
              </h2>
              <p className="text-3xl font-medium dark:text-white">
                Rp {selectedProduct.price.toLocaleString()}
              </p>
            </div>

            {/* Delivery Timer */}
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl">
              <Timer size={16} className="text-slate-400" />
              <p className="text-[12px] text-slate-500 font-medium">
                Order in <span className="text-black dark:text-white font-bold">02:30:25</span> to get next day delivery
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <p className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">Select Size</p>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button key={size} className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-medium transition-all ${size === 'S' ? 'bg-black text-white scale-110 shadow-lg shadow-black/20' : 'bg-slate-50 dark:bg-white/5 dark:text-white hover:bg-slate-100'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  addToCart(selectedProduct._id);
                  setIsQuickViewOpen(false);
                }}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => addToWishlist(selectedProduct._id)}
                className="w-16 h-16 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
              >
                <Heart size={20} className="dark:text-white group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Accordions */}
            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/10">
              <div>
                <button onClick={() => setExpandedSection(expandedSection === 'description' ? '' : 'description')} className="w-full flex justify-between items-center py-2">
                  <span className="font-bold dark:text-white uppercase tracking-widest text-[12px]">Description & Fit</span>
                  {expandedSection === 'description' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {expandedSection === 'description' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="text-sm text-slate-500 leading-relaxed pt-4">
                        {selectedProduct.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-slate-100 dark:border-white/10 pt-6">
                <button onClick={() => setExpandedSection(expandedSection === 'shipping' ? '' : 'shipping')} className="w-full flex justify-between items-center py-2">
                  <span className="font-bold dark:text-white uppercase tracking-widest text-[12px]">Shipping</span>
                  {expandedSection === 'shipping' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {expandedSection === 'shipping' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#FF4C3B]">
                            <PackageIcon size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Package</p>
                            <p className="text-[12px] font-bold dark:text-white">Regular Package</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#FF4C3B]">
                            <Timer size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Delivery Time</p>
                            <p className="text-[12px] font-bold dark:text-white">3-4 Working Days</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
