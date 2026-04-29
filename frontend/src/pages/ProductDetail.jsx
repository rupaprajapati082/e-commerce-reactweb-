import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductDetail = () => {
 const { id } = useParams();
 const [product, setProduct] = useState(null);
 const [loading, setLoading] = useState(true);
 const [quantity, setQuantity] = useState(1);
 const [activeImage, setActiveImage] = useState(0);
 const navigate = useNavigate();

 useEffect(() => {
 const fetchProduct = async () => {
 try {
 setLoading(true);
 const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/${id}`);
 setProduct(response.data.product);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };
 fetchProduct();
 }, [id]);

 const addToCart = async () => {
 try {
 const token = localStorage.getItem('token');
 if (!token) return navigate('/login');
 
 await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, 
 { productId: product._id, quantity },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 alert('Added to cart!');
 } catch (err) {
 console.error(err);
 alert(err.response?.data?.message || 'Failed to add to cart');
 }
 };

 if (loading) return (
 <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4C3B]"></div>
 </div>
 );
 
 if (!product) return (
 <div className="min-h-screen bg-[#FDFDFD]">
 <Navbar />
 <div className="py-40 text-center">
 <h2 className="text-3xl font-normal text-[#222] capitalize ">Product not found.</h2>
 <Link to="/products" className="mt-8 inline-block text-[#FF4C3B] font-normal capitalize text-[11px] border-b-2 border-[#FF4C3B]">Back to Shop</Link>
 </div>
 <Footer />
 </div>
 );

 return (
 <div className="min-h-screen bg-[#FDFDFD]">
 <Navbar />
 
 {/* Breadcrumbs */}
 <div className="bg-[#222] py-10 px-6 md:px-20 border-b border-white/5">
 <div className="flex items-center gap-2 text-[10px] text-slate-500 capitalize font-normal tracking-[0.2em]">
 <Link to="/" className="hover:text-[#FF4C3B] transition-colors">Home</Link>
 <span className="text-slate-700">/</span>
 <Link to="/products" className="hover:text-[#FF4C3B] transition-colors">Catalog</Link>
 <span className="text-slate-700">/</span>
 <span className="text-slate-400">{product.category}</span>
 <span className="text-slate-700">/</span>
 <span className="text-white">{product.name}</span>
 </div>
 </div>

 <div className="px-6 md:px-20 py-24">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
 {/* Image Gallery */}
 <div className="space-y-8">
 <div className="aspect-square overflow-hidden bg-white border border-slate-100 group rounded-sm shadow-sm">
 <img 
 src={product.images && product.images[activeImage] ? product.images[activeImage] : 'https://via.placeholder.com/600x600?text=No+Image'} 
 alt={product.name} 
 className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700" 
 />
 </div>
 {product.images && product.images.length > 1 && (
 <div className="flex gap-4 overflow-x-auto pb-4">
 {product.images.map((img, idx) => (
 <button 
 key={idx} 
 onClick={() => setActiveImage(idx)}
 className={`w-24 h-24 shrink-0 border-2 transition-all rounded-sm bg-white ${activeImage === idx ? 'border-[#FF4C3B]' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
 >
 <img src={img} className="w-full h-full object-contain p-3" alt={`${product.name} view ${idx + 1}`} />
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Product Info */}
 <div className="space-y-12">
 <div className="space-y-6">
 <p className="text-[12px] text-[#FF4C3B] font-normal capitalize tracking-[0.4em]">{product.brand || 'Pro Series Industrial'}</p>
 <h1 className="text-5xl md:text-6xl font-normal text-[#222] leading-none capitalize ">{product.name}</h1>
 <div className="flex items-center gap-8">
 <div className="flex gap-1 text-[#FF4C3B]">
 {[...Array(5)].map((_, i) => (
 <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
 </svg>
 ))}
 </div>
 <span className="text-[10px] text-slate-400 font-normal capitalize tracking-[0.2em] border-l border-slate-200 pl-8">Industrial Certified</span>
 </div>
 </div>

 <div className="flex items-center gap-8">
 <span className="text-5xl font-normal text-[#222]">
 ${product.discount > 0 ? (product.price - (product.price * product.discount / 100)).toFixed(2) : product.price.toFixed(2)}
 </span>
 {product.discount > 0 && (
 <div className="flex items-center gap-4">
 <span className="text-2xl text-slate-300 line-through font-bold">${product.price.toFixed(2)}</span>
 <span className="bg-black text-white text-[11px] font-normal px-4 py-1.5 rounded-sm capitalize ">Save {product.discount}%</span>
 </div>
 )}
 </div>

 <p className="text-slate-500 text-[15px] leading-relaxed font-medium max-w-xl">
 {product.description || 'Engineered for high-intensity professional use, this tool delivers unmatched precision and durability. Built with aerospace-grade materials to withstand the toughest conditions.'}
 </p>

 <div className="space-y-10 pt-12 border-t-2 border-slate-100">
 <div className="flex flex-col sm:flex-row items-center gap-6">
 <div className="flex items-center border-2 border-slate-200 rounded-sm h-16 w-full sm:w-auto">
 <button 
 onClick={() => setQuantity(Math.max(1, quantity - 1))} 
 className="w-16 h-full flex items-center justify-center hover:bg-[#FF4C3B] hover:text-white transition-all font-normal text-xl"
 >
 -
 </button>
 <span className="w-12 text-center font-normal text-lg">{quantity}</span>
 <button 
 onClick={() => setQuantity(quantity + 1)} 
 className="w-16 h-full flex items-center justify-center hover:bg-[#FF4C3B] hover:text-white transition-all font-normal text-xl"
 >
 +
 </button>
 </div>
 <button 
 onClick={addToCart}
 className="flex-1 h-16 bg-[#FF4C3B] text-white font-normal capitalize text-[12px] tracking-[0.3em] rounded-sm hover:bg-black transition-all shadow-2xl shadow-[#FF4C3B]/20 flex items-center justify-center gap-4 w-full"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
 </svg>
 Add to Cart
 </button>
 </div>

 <div className="space-y-4 pt-10 border-t border-slate-100">
 <p className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-400">
 Availability: <span className={product.stock > 0 ? 'text-[#FF4C3B]' : 'text-red-500'}>
 {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
 </span>
 </p>
 <p className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-400">
 Product SKU: <span className="text-[#222] font-normal">{product.sku || 'PRO-TOOL-N/A'}</span>
 </p>
 <p className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-400">
 Catalog: <span className="text-[#222] font-normal">{product.category}</span>
 </p>
 <div className="flex items-center gap-6 pt-4">
 <span className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-400">Share Gear:</span>
 <div className="flex gap-5 text-slate-400">
 <a href="#" className="hover:text-[#FF4C3B] transition-colors"><i className="fab fa-facebook-f text-sm"></i></a>
 <a href="#" className="hover:text-[#FF4C3B] transition-colors"><i className="fab fa-twitter text-sm"></i></a>
 <a href="#" className="hover:text-[#FF4C3B] transition-colors"><i className="fab fa-pinterest text-sm"></i></a>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Product Tabs */}
 <div className="mt-32">
 <div className="flex border-b-2 border-slate-100 gap-16">
 <button className="text-[12px] font-normal capitalize tracking-[0.2em] text-[#222] border-b-4 border-[#FF4C3B] pb-6">Technical Specifications</button>
 <button className="text-[12px] font-normal capitalize tracking-[0.2em] text-slate-300 hover:text-[#222] pb-6 transition-colors">Product Safety</button>
 <button className="text-[12px] font-normal capitalize tracking-[0.2em] text-slate-300 hover:text-[#222] pb-6 transition-colors">Expert Reviews (1)</button>
 </div>
 <div className="py-12 text-[14px] text-slate-500 leading-relaxed space-y-6 max-w-4xl font-medium">
 <p>{product.description || 'Experience industrial-grade performance engineered for precision. This equipment is manufactured to the highest global standards, ensuring safety and reliability in professional workshops.'}</p>
 <p>Our tools undergo rigorous stress testing and quality control. We provide lifetime technical support and a comprehensive professional warranty on all heavy-duty components.</p>
 </div>
 </div>
 </div>

 <Footer />
 </div>
 );
};

export default ProductDetail;
