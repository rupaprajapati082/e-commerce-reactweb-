import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductListing = () => {
 const [products, setProducts] = useState([]);
 const [filteredProducts, setFilteredProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [category, setCategory] = useState('All');
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

 const categories = ['All', ...new Set(products.map(p => p.category))];

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
 <div onClick={() => navigate(`/product/${product._id}`)} className="relative aspect-square overflow-hidden bg-white">
 <img 
 src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/400x400?text=No+Image'} 
 alt={product.name} 
 className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700" 
 />
 {product.discount > 0 && (
 <span className="absolute top-4 left-4 bg-[#FF4C3B] text-white text-[10px] font-normal px-3 py-1 rounded-sm capitalize shadow-lg shadow-[#FF4C3B]/20">-{product.discount}%</span>
 )}
 </div>
 <div className="p-6 space-y-3 flex-1 text-center">
 <p className="text-[10px] text-[#FF4C3B] font-normal capitalize tracking-[0.2em]">{product.brand || 'Pro Series'}</p>
 <h3 onClick={() => navigate(`/product/${product._id}`)} className="font-normal text-[13px] text-[#222] truncate hover:text-[#FF4C3B] transition-colors cursor-pointer capitalize">{product.name}</h3>
 
 <div className="flex items-center justify-center gap-3 pt-2">
 <span className="font-normal text-base text-[#FF4C3B]">
 ${product.discount > 0 ? (product.price - (product.price * product.discount / 100)).toFixed(2) : product.price.toFixed(2)}
 </span>
 {product.discount > 0 && (
 <span className="text-slate-400 line-through text-[11px] font-bold">
 ${product.price.toFixed(2)}
 </span>
 )}
 </div>
 </div>
 
 {/* Add to Cart Button */}
 <button 
 onClick={() => addToCart(product._id)}
 className="w-full py-4 bg-black text-white text-[11px] font-normal capitalize tracking-[0.3em] hover:bg-[#FF4C3B] transition-all transform translate-y-full group-hover:translate-y-0 duration-500"
 >
 Add to Cart
 </button>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>

 <Footer />
 </div>
 );
};

export default ProductListing;
