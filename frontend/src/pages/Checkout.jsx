import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
 const [formData, setFormData] = useState({
 firstName: '', lastName: '', address: '', city: '', zip: '', phone: '', email: ''
 });
 const [cart, setCart] = useState(null);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

 useEffect(() => {
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
 fetchCart();
 }, []);

 const handlePlaceOrder = async (e) => {
 e.preventDefault();
 try {
 const token = localStorage.getItem('token');
 const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/order/add`, 
 { shippingDetails: formData },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 if (response.status === 200) {
 navigate('/order-confirmation', { state: { orderId: response.data.order._id } });
 }
 } catch (err) {
 console.error(err);
 alert('Failed to place order. Please try again.');
 }
 };

 if (loading) return (
 <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4C3B]"></div>
 </div>
 );

 const subtotal = cart?.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0) || 0;

 return (
 <div className="min-h-screen bg-[#FDFDFD]">
 <Navbar />
 
 {/* Breadcrumbs */}
 <div className="bg-[#f9f9f9] py-10 px-6 md:px-20 border-b border-slate-100">
 <h1 className="text-3xl font-bold text-[#222]">Checkout</h1>
 <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 capitalize font-bold ">
 <Link to="/" className="hover:text-[#FF4C3B]">Home</Link>
 <span>/</span>
 <Link to="/cart" className="hover:text-[#FF4C3B]">Cart</Link>
 <span>/</span>
 <span className="text-slate-600">Checkout</span>
 </div>
 </div>

 <div className="px-6 md:px-20 py-16">
 <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
 {/* Billing Details */}
 <div className="lg:col-span-7 space-y-10">
 <div>
 <h2 className="text-lg font-bold text-[#222] capitalize mb-8 border-b border-slate-100 pb-4">Billing Details</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-bold capitalize text-slate-400 ml-1">First Name *</label>
 <input 
 required 
 type="text"
 className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#FF4C3B] bg-slate-50 transition-all"
 onChange={e => setFormData({...formData, firstName: e.target.value})} 
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold capitalize text-slate-400 ml-1">Last Name *</label>
 <input 
 required 
 type="text"
 className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#FF4C3B] bg-slate-50 transition-all"
 onChange={e => setFormData({...formData, lastName: e.target.value})} 
 />
 </div>
 </div>
 
 <div className="mt-6 space-y-2">
 <label className="text-[10px] font-bold capitalize text-slate-400 ml-1">Street Address *</label>
 <input 
 required 
 type="text"
 placeholder="House number and street name"
 className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#FF4C3B] bg-slate-50 transition-all"
 onChange={e => setFormData({...formData, address: e.target.value})} 
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
 <div className="space-y-2">
 <label className="text-[10px] font-bold capitalize text-slate-400 ml-1">Town / City *</label>
 <input 
 required 
 type="text"
 className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#FF4C3B] bg-slate-50 transition-all"
 onChange={e => setFormData({...formData, city: e.target.value})} 
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold capitalize text-slate-400 ml-1">Postcode / ZIP *</label>
 <input 
 required 
 type="text"
 className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#FF4C3B] bg-slate-50 transition-all"
 onChange={e => setFormData({...formData, zip: e.target.value})} 
 />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
 <div className="space-y-2">
 <label className="text-[10px] font-bold capitalize text-slate-400 ml-1">Phone *</label>
 <input 
 required 
 type="tel"
 className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#FF4C3B] bg-slate-50 transition-all"
 onChange={e => setFormData({...formData, phone: e.target.value})} 
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold capitalize text-slate-400 ml-1">Email Address *</label>
 <input 
 required 
 type="email"
 className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#FF4C3B] bg-slate-50 transition-all"
 onChange={e => setFormData({...formData, email: e.target.value})} 
 />
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <h2 className="text-lg font-bold text-[#222] capitalize mb-4">Additional Information</h2>
 <div className="space-y-2">
 <label className="text-[10px] font-bold capitalize text-slate-400 ml-1">Order Notes (Optional)</label>
 <textarea 
 placeholder="Notes about your order, e.g. special notes for delivery."
 rows="4"
 className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#FF4C3B] bg-slate-50 transition-all"
 ></textarea>
 </div>
 </div>
 </div>

 {/* Order Summary */}
 <div className="lg:col-span-5">
 <div className="bg-white border border-slate-100 p-8 sticky top-32">
 <h2 className="text-lg font-bold text-[#222] capitalize mb-8 border-b border-slate-100 pb-4">Your Order</h2>
 
 <div className="space-y-4 mb-8">
 <div className="flex justify-between text-[10px] font-bold capitalize text-slate-400 pb-2 border-b border-slate-50">
 <span>Product</span>
 <span>Subtotal</span>
 </div>
 {cart?.items.map(item => (
 <div key={item.productId._id} className="flex justify-between text-sm py-2">
 <span className="text-slate-600">
 {item.productId.name} <strong className="text-[#222]">× {item.quantity}</strong>
 </span>
 <span className="text-[#222] font-bold">${(item.productId.price * item.quantity).toFixed(2)}</span>
 </div>
 ))}
 
 <div className="pt-4 border-t border-slate-100 space-y-4">
 <div className="flex justify-between text-sm">
 <span className="text-slate-500 font-medium">Subtotal</span>
 <span className="text-[#222] font-bold">${subtotal.toFixed(2)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-slate-500 font-medium">Shipping</span>
 <span className="text-[#FF4C3B] font-bold capitalize text-[10px]">Free Shipping</span>
 </div>
 <div className="pt-4 border-t border-slate-100 flex justify-between">
 <span className="text-lg font-bold text-[#222]">Total</span>
 <span className="text-xl font-bold text-[#FF4C3B]">${subtotal.toFixed(2)}</span>
 </div>
 </div>
 </div>

 <div className="bg-[#f9f9f9] p-6 rounded-sm mb-8">
 <div className="flex items-center gap-3 mb-4">
 <input type="radio" checked readOnly className="accent-[#FF4C3B]" />
 <span className="text-sm font-bold text-[#222]">Cash on Delivery</span>
 </div>
 <p className="text-xs text-slate-500 leading-relaxed">
 Pay with cash upon delivery. We currently only support COD for all orders to ensure a smooth and safe shopping experience.
 </p>
 </div>

 <button 
 type="submit" 
 className="block w-full bg-[#FF4C3B] text-white text-center py-4 rounded-full font-bold capitalize text-[11px] hover:bg-[#7ab33f] transition-all shadow-lg shadow-[#FF4C3B]/20"
 >
 Place Order
 </button>
 </div>
 </div>
 </form>
 </div>

 <Footer />
 </div>
 );
};

export default Checkout;
