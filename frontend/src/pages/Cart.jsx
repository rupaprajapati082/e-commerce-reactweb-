import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
 const [cart, setCart] = useState(null);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

 const fetchCart = async () => {
 try {
 const token = localStorage.getItem('token');
 if (!token) return navigate('/login');
 const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cart/all`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setCart(response.data.cart);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchCart();
 }, []);

 const removeItem = async (productId) => {
 try {
 const token = localStorage.getItem('token');
 await axios.delete(`${import.meta.env.VITE_BASE_URL}/cart/product/${productId}`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 fetchCart();
 } catch (err) {
 console.error(err);
 }
 };

 const updateQuantity = async (productId, newQty) => {
 if (newQty < 1) return;
 try {
 const token = localStorage.getItem('token');
 await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, 
 { productId, quantity: newQty, overwrite: true },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 fetchCart();
 } catch (err) {
 console.error(err);
 }
 };

 if (loading) return (
 <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
 <div className="animate-spin rounded-sm h-12 w-12 border-b-2 border-[#FF4C3B]"></div>
 </div>
 );

 const subtotal = cart?.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0) || 0;

 return (
 <div className="min-h-screen bg-[#FDFDFD]">
 <Navbar />
 
 {/* Breadcrumbs */}
 <div className="bg-[#f9f9f9] py-10 px-6 md:px-20 border-b border-slate-100">
 <h1 className="text-3xl font-normal text-[#222]">Shopping Cart</h1>
 <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 capitalize font-normal ">
 <Link to="/" className="hover:text-[#FF4C3B]">Home</Link>
 <span>/</span>
 <span className="text-slate-600">Cart</span>
 </div>
 </div>

 <div className="px-6 md:px-20 py-16">
 {!cart || cart.items.length === 0 ? (
 <div className="max-w-2xl mx-auto text-center py-20 bg-white border border-dashed border-slate-200 rounded-sm">
 <div className="text-6xl mb-6">🛒</div>
 <h2 className="text-2xl font-normal text-[#222] mb-4">Your cart is empty</h2>
 <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
 <Link to="/products" className="inline-block px-10 py-4 bg-[#FF4C3B] text-white text-[11px] font-normal capitalize rounded-sm hover:bg-[#7ab33f] transition-all shadow-md shadow-[#FF4C3B]/20">
 Start Shopping
 </Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
 {/* Cart Items */}
 <div className="lg:col-span-2 space-y-6">
 <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b border-slate-100 text-[10px] font-normal capitalize text-slate-400">
 <div className="col-span-3">Product</div>
 <div className="text-center">Price</div>
 <div className="text-center">Quantity</div>
 <div className="text-right">Total</div>
 </div>
 
 {cart.items.map(item => (
 <div key={item.productId._id} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center py-6 border-b border-slate-50 group">
 <div className="col-span-1 md:col-span-3 flex items-center gap-6">
 <button 
 onClick={() => removeItem(item.productId._id)}
 className="text-slate-300 hover:text-red-500 transition-colors"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 <div className="w-20 h-20 bg-[#f9f9f9] border border-slate-100 p-2 shrink-0">
 <img src={item.productId.images[0]} alt={item.productId.name} className="w-full h-full object-contain" />
 </div>
 <div>
 <h3 className="font-normal text-sm text-[#222] group-hover:text-[#FF4C3B] transition-colors">
 <Link to={`/product/${item.productId._id}`}>{item.productId.name}</Link>
 </h3>
 <p className="text-[10px] text-[#FF4C3B] font-normal capitalize mt-1">{item.productId.brand || 'Ecolife'}</p>
 </div>
 </div>
 
 <div className="text-center">
 <span className="text-sm font-normal text-[#222]">${item.productId.price.toFixed(2)}</span>
 </div>
 
 <div className="flex justify-center">
 <div className="flex items-center border border-slate-200 rounded-sm h-10 px-2">
 <button 
 onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
 className="w-8 h-full flex items-center justify-center hover:text-[#FF4C3B] font-normal"
 >
 -
 </button>
 <span className="w-8 text-center text-xs font-normal">{item.quantity}</span>
 <button 
 onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
 className="w-8 h-full flex items-center justify-center hover:text-[#FF4C3B] font-normal"
 >
 +
 </button>
 </div>
 </div>
 
 <div className="text-right">
 <span className="text-sm font-normal text-[#FF4C3B]">${(item.productId.price * item.quantity).toFixed(2)}</span>
 </div>
 </div>
 ))}

 <div className="pt-6 flex flex-col md:flex-row justify-between gap-6">
 <div className="flex gap-4">
 <input 
 type="text" 
 placeholder="Coupon Code" 
 className="px-6 py-3 border border-slate-200 rounded-sm text-xs focus:outline-none focus:border-[#FF4C3B] bg-slate-50 w-full md:w-48"
 />
 <button className="px-8 py-3 bg-[#222] text-white text-[10px] font-normal capitalize rounded-sm hover:bg-[#FF4C3B] transition-all">
 Apply
 </button>
 </div>
 <button 
 onClick={() => navigate('/products')}
 className="px-8 py-3 border-2 border-slate-200 text-[#222] text-[10px] font-normal capitalize rounded-sm hover:border-[#FF4C3B] hover:text-[#FF4C3B] transition-all"
 >
 Continue Shopping
 </button>
 </div>
 </div>
 
 {/* Cart Summary */}
 <div className="lg:col-span-1">
 <div className="bg-white border border-slate-100 p-8 sticky top-32">
 <h2 className="text-lg font-normal text-[#222] capitalize mb-8 border-b border-slate-100 pb-4">Order Summary</h2>
 
 <div className="space-y-4 mb-8">
 <div className="flex justify-between text-sm">
 <span className="text-slate-500 font-medium">Subtotal</span>
 <span className="text-[#222] font-normal">${subtotal.toFixed(2)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-slate-500 font-medium">Shipping</span>
 <span className="text-[#FF4C3B] font-normal capitalize text-[10px]">Calculated at checkout</span>
 </div>
 <div className="pt-4 border-t border-slate-100 flex justify-between">
 <span className="text-lg font-normal text-[#222]">Total</span>
 <span className="text-xl font-normal text-[#FF4C3B]">${subtotal.toFixed(2)}</span>
 </div>
 </div>

 <Link 
 to="/checkout" 
 className="block w-full bg-[#222] text-white text-center py-4 rounded-sm font-normal capitalize text-[11px] hover:bg-[#FF4C3B] transition-all shadow-lg shadow-black/10"
 >
 Proceed to Checkout
 </Link>
 
 <div className="mt-8 pt-8 border-t border-slate-100">
 <p className="text-[10px] font-normal capitalize text-slate-400 mb-4 text-center">Secure Checkout Guaranteed</p>
 <div className="flex justify-center gap-4 opacity-50 grayscale">
 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
 </div>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>

 <Footer />
 </div>
 );
};

export default Cart;
