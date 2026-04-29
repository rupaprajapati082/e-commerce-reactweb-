import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './style.css';

const Home = () => {
 const [products, setProducts] = useState([]);
 const [filteredProducts, setFilteredProducts] = useState([]);
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const navigate = useNavigate();

 useEffect(() => {
 const fetchProducts = async () => {
 try {
 setLoading(true);
 const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
 if (response.data && response.data.products) {
 const allProducts = response.data.products;
 setProducts(allProducts);
 setFilteredProducts(allProducts);
 
 // Dynamically extract categories from products
 const uniqueCats = [...new Set(allProducts.map(p => p.category))];
 const promoCats = uniqueCats.slice(0, 3).map(cat => {
 const sampleProd = allProducts.find(p => p.category === cat);
 return {
 title: `Latest ${cat} Collection`,
 desc: `Check out our newest arrivals in ${cat}.`,
 img: sampleProd?.images[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
 btn: 'Shop Now',
 category: cat
 };
 });
 setCategories(promoCats);
 }
 setError(null);
 } catch (err) {
 console.error('Error fetching products:', err);
 setError('Failed to load products. Please try again later.');
 } finally {
 setLoading(false);
 }
 };

 fetchProducts();
 }, []);

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
 <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900">
 <Navbar />

 {/* Hero Section */}
 <section className="relative h-[80vh] overflow-hidden group">
 <img 
 src="/auto_hero.png" 
 alt="Auto Parts" 
 className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[10s]" 
 />
 <div className="absolute inset-0 bg-black/60"></div>
 
 <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-24">
 <div className="animate-fadeIn space-y-4 max-w-3xl">
 <h3 className="text-[#FF4C3B] font-bold capitalize tracking-[0.4em] text-sm md:text-base">Welcome To Tools</h3>
 <h1 className="text-6xl md:text-9xl font-normal text-white capitalize leading-none mb-10">
 Auto Parts
 </h1>
 <button 
 onClick={() => navigate('/products')}
 className="px-10 py-4 bg-[#FF4C3B] text-white font-bold capitalize text-[12px] hover:bg-black transition-all shadow-xl shadow-[#FF4C3B]/20"
 >
 Shop Now
 </button>
 </div>
 </div>
 </section>

 {/* Feature Bar */}
 <section className="relative z-20 -mt-16 px-6 md:px-20 mb-24">
 <div className="bg-white shadow-2xl rounded-sm py-12 px-8 grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 border border-slate-50">
 {[
 { title: 'Free Shipping', desc: 'Free Shipping World Wide', icon: '🚚', color: '#FF4C3B' },
 { title: '24 X 7 Service', desc: 'Online Service For 24 X 7', icon: '⏰', color: '#FF4C3B' },
 { title: 'Festival Offer', desc: 'New Online Special Festival Offer', icon: '📢', color: '#FF4C3B' },
 { title: 'Online Payment', desc: 'Contrary To Popular Belief.', icon: '💳', color: '#FF4C3B' },
 ].map((f, i) => (
 <div key={i} className="flex items-center gap-6 px-8 py-6 md:py-0">
 <span className="text-4xl" style={{ color: f.color }}>{f.icon}</span>
 <div>
 <h4 className="font-normal text-[13px] capitalize tracking-wider text-[#333]">{f.title}</h4>
 <p className="text-[11px] text-slate-400 font-medium">{f.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* Welcome Section */}
 <section className="py-24 px-6 md:px-20 text-center space-y-8 bg-[#fdfdfd]">
 <div className="max-w-4xl mx-auto space-y-6">
 <div className="space-y-4">
 <h2 className="text-4xl md:text-5xl font-normal text-[#222] capitalize ">Welcome to Multikart Store</h2>
 <div className="w-24 h-1 bg-[#FF4C3B] mx-auto relative">
 <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-3 bg-white border-x-2 border-[#FF4C3B]"></div>
 </div>
 </div>
 <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
 Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
 </p>
 </div>
 </section>

 {/* Featured Categories */}
 <section className="py-24 px-6 md:px-20 bg-white">
 <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
 <div className="text-center md:text-left">
 <h2 className="text-3xl font-normal text-[#222] capitalize mb-2">Featured Categories</h2>
 <div className="w-20 h-1 bg-[#FF4C3B] mx-auto md:mx-0"></div>
 </div>
 <Link to="/products" className="text-[11px] font-bold capitalize text-[#FF4C3B] border-b-2 border-[#FF4C3B] hover:text-black hover:border-black transition-all">
 View All Categories
 </Link>
 </div>
 
 <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
 {categories.map((cat, idx) => (
 <div key={idx} onClick={() => navigate(`/products?category=${cat.category}`)} className="group cursor-pointer text-center">
 <div className="bg-slate-50 rounded-full p-8 mb-6 group-hover:bg-[#FF4C3B] transition-all duration-500 aspect-square flex items-center justify-center relative overflow-hidden">
 <img 
 src={cat.img} 
 alt={cat.category} 
 className="w-full h-full object-contain group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-all duration-500 z-10" 
 />
 </div>
 <h3 className="font-normal text-[12px] text-[#333] group-hover:text-[#FF4C3B] transition-colors capitalize ">{cat.category}</h3>
 </div>
 ))}
 </div>
 </section>

 {/* Popular Products */}
 <section className="py-24 px-6 md:px-20 bg-[#F9F9F9]">
 <div className="text-center mb-20 space-y-4">
 <h2 className="text-4xl font-normal text-[#222] capitalize ">Popular Products</h2>
 <div className="w-24 h-1 bg-[#FF4C3B] mx-auto relative">
 <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-3 bg-[#F9F9F9] border-x-2 border-[#FF4C3B]"></div>
 </div>
 </div>
 
 <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
 {loading ? (
 <div className="col-span-full flex justify-center py-20">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4C3B]"></div>
 </div>
 ) : (
 filteredProducts.slice(0, 10).map((product) => (
 <div key={product._id} className="group cursor-pointer bg-white border border-slate-100 hover:border-[#FF4C3B] transition-all duration-500 relative flex flex-col h-full overflow-hidden">
 <div onClick={() => navigate(`/product/${product._id}`)} className="relative aspect-square overflow-hidden bg-white">
 <img 
 src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/400x400?text=No+Image'} 
 alt={product.name} 
 className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" 
 />
 {product.discount > 0 && (
 <span className="absolute top-4 left-4 bg-[#FF4C3B] text-white text-[10px] font-normal px-3 py-1 rounded-sm capitalize ">-{product.discount}%</span>
 )}
 </div>
 <div className="p-6 space-y-3 flex-1 text-center">
 <p className="text-[10px] text-slate-400 font-bold capitalize tracking-[0.2em]">{product.category}</p>
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
 ))
 )}
 </div>
 </section>

 {/* Daily Best Sells / Banners */}
 <section className="py-10 px-6 md:px-20">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
 <div className="relative group overflow-hidden h-[350px] bg-black">
 <img src="https://images.unsplash.com/photo-1530124560676-5cd0065099f7?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Heavy Duty Tools" />
 <div className="absolute inset-0 p-12 flex flex-col justify-center">
 <span className="text-[#FF4C3B] font-normal text-[11px] tracking-[0.3em] capitalize mb-4">Limited Edition</span>
 <h3 className="text-4xl font-normal text-white mb-4 leading-tight capitalize ">Power Tools <br />Collection</h3>
 <p className="text-slate-300 text-xs font-bold capitalize mb-8">Save Up To 40% On Selected Brands</p>
 <button className="px-10 py-4 bg-white text-black text-[10px] font-normal capitalize w-fit hover:bg-[#FF4C3B] hover:text-white transition-all shadow-2xl">Shop Now</button>
 </div>
 </div>
 <div className="relative group overflow-hidden h-[350px] bg-black">
 <img src="https://images.unsplash.com/photo-1486006396193-47106858e6ec?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Auto Accessories" />
 <div className="absolute inset-0 p-12 flex flex-col justify-center">
 <span className="text-[#FF4C3B] font-normal text-[11px] tracking-[0.3em] capitalize mb-4">Pro Accessories</span>
 <h3 className="text-4xl font-normal text-white mb-4 leading-tight capitalize ">Automotive <br />Essentials</h3>
 <p className="text-slate-300 text-xs font-bold capitalize mb-8">Premium Parts For Every Model</p>
 <button className="px-10 py-4 bg-white text-black text-[10px] font-normal capitalize w-fit hover:bg-[#FF4C3B] hover:text-white transition-all shadow-2xl">Browse Parts</button>
 </div>
 </div>
 </div>
 </section>

 {/* Features Strip */}
 <section className="py-24 px-6 md:px-20 bg-white border-t border-slate-100">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
 {[
 { title: 'Global Logistics', desc: 'Fast and secure shipping for all industrial equipment worldwide.', icon: '📦' },
 { title: 'Technical Support', desc: 'Expert assistance available 24/7 for all your tool-related queries.', icon: '🛠️' },
 { title: 'Premium Quality', desc: 'Every product is certified to meet international industrial standards.', icon: '🏆' },
 { title: 'Secure Payment', desc: 'Multi-layer encrypted payment processing for your business security.', icon: '🛡️' },
 ].map((feature, idx) => (
 <div key={idx} className="space-y-6 group">
 <span className="text-5xl block group-hover:scale-110 transition-transform">{feature.icon}</span>
 <h4 className="font-normal text-[13px] text-[#222] capitalize group-hover:text-[#FF4C3B] transition-colors">{feature.title}</h4>
 <p className="text-[12px] text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
 </div>
 ))}
 </div>
 </section>

 <Footer />
 </div>
 );
};

export default Home;