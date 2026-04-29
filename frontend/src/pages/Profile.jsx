import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
 const [data, setData] = useState("");
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

 useEffect(() => {
 const FetchData = async () => {
 try {
 const token = localStorage.getItem("token");
 if (!token) return navigate('/login');
 
 const userRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setData(userRes.data?.user);

 const orderRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/order/get`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setOrders(orderRes.data.order || []);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 }
 FetchData();
 }, []);

 const handleSignOut = () => {
 localStorage.clear();
 navigate('/login');
 };

 if (loading) return (
 <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4C3B]"></div>
 </div>
 );

 return (
 <div className="min-h-screen bg-[#FDFDFD]">
 <Navbar />
 
 <div className="bg-[#222] py-16 px-6 md:px-20 border-b border-white/5">
 <h1 className="text-4xl md:text-5xl font-normal text-white capitalize mb-4">My Account</h1>
 <div className="flex items-center gap-2 text-[10px] text-slate-500 capitalize font-normal tracking-[0.2em]">
 <Link to="/" className="hover:text-[#FF4C3B] transition-colors">Home</Link>
 <span className="text-slate-700">/</span>
 <span className="text-white">Profile</span>
 </div>
 </div>

 <div className="px-6 md:px-20 py-20">
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
 {/* Sidebar */}
 <div className="lg:col-span-1 space-y-8">
 <div className="bg-white border border-slate-100 p-10 text-center shadow-sm">
 <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-100 shadow-inner">
 <span className="text-4xl font-normal text-[#FF4C3B]">
 {data?.username?.charAt(0).toUpperCase()}
 </span>
 </div>
 <h2 className="text-2xl font-normal text-[#222] capitalize ">@{data.username}</h2>
 <p className="text-[10px] text-slate-400 font-bold capitalize tracking-[0.2em] mt-3">{data.email}</p>
 
 <button 
 onClick={handleSignOut}
 className="mt-10 w-full py-4 bg-white border-2 border-slate-100 text-[#222] text-[10px] font-normal capitalize tracking-[0.2em] rounded-sm hover:border-[#FF4C3B] hover:text-[#FF4C3B] transition-all"
 >
 Sign Out
 </button>
 </div>

 <div className="bg-white border border-slate-100 p-6 space-y-3">
 <button className="w-full text-left px-5 py-4 bg-[#FF4C3B] text-white text-[11px] font-normal capitalize tracking-[0.2em] rounded-sm shadow-lg shadow-[#FF4C3B]/20">
 Order History
 </button>
 <button className="w-full text-left px-5 py-4 text-slate-400 hover:text-black text-[11px] font-normal capitalize tracking-[0.2em] transition-colors border border-transparent hover:border-slate-100">
 Account Details
 </button>
 <button className="w-full text-left px-5 py-4 text-slate-400 hover:text-black text-[11px] font-normal capitalize tracking-[0.2em] transition-colors border border-transparent hover:border-slate-100">
 Addresses
 </button>
 { (data.role === 'admin' || data.role === 'manager') && (
 <Link 
 to="/admin" 
 className="block w-full text-left px-5 py-4 bg-black text-white text-[11px] font-normal capitalize tracking-[0.2em] rounded-sm hover:bg-[#FF4C3B] transition-all"
 >
 Admin Dashboard
 </Link>
 )}
 <Link to="/wishlist" className="block w-full text-left px-5 py-4 text-slate-400 hover:text-black text-[11px] font-normal capitalize tracking-[0.2em] transition-colors border border-transparent hover:border-slate-100">
 Wishlist
 </Link>
 </div>
 </div>

 {/* Main Content */}
 <div className="lg:col-span-3 space-y-12">
 <div>
 <div className="flex justify-between items-end mb-10 border-b-2 border-slate-100 pb-5">
 <h2 className="text-2xl font-normal text-[#222] capitalize ">Recent Orders</h2>
 </div>
 
 {orders.length === 0 ? (
 <div className="bg-white border-2 border-dashed border-slate-100 p-20 text-center rounded-sm">
 <p className="text-slate-400 text-[13px] mb-8 font-bold capitalize ">No transaction history found.</p>
 <Link to="/products" className="inline-block px-12 py-4 bg-black text-white text-[11px] font-normal capitalize tracking-[0.2em] rounded-sm hover:bg-[#FF4C3B] transition-all shadow-xl shadow-black/10">
 Start Shopping
 </Link>
 </div>
 ) : (
 <div className="overflow-x-auto bg-white border border-slate-100 p-8 shadow-sm">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b-2 border-slate-100 text-[10px] font-normal capitalize tracking-[0.2em] text-slate-400">
 <th className="pb-6">Order ID</th>
 <th className="pb-6">Date</th>
 <th className="pb-6 text-center">Status</th>
 <th className="pb-6 text-center">Items</th>
 <th className="pb-6 text-right">Total</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {orders.map((order) => (
 <tr key={order._id} className="group hover:bg-slate-50 transition-colors">
 <td className="py-8 text-[11px] font-mono font-normal text-[#222]">#{order._id.slice(-8).toUpperCase()}</td>
 <td className="py-8 text-[11px] font-bold text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
 <td className="py-8 text-center">
 <span className={`px-4 py-1.5 rounded-sm text-[9px] font-normal capitalize tracking-[0.1em] ${
 order.status === 'delivered' ? 'bg-[#FF4C3B]/10 text-[#FF4C3B]' : 
 order.status === 'cancel' ? 'bg-black text-white' : 'bg-slate-100 text-slate-600'
 }`}>
 {order.status || 'Processing'}
 </span>
 </td>
 <td className="py-8 text-center text-[11px] font-normal text-[#222]">{order.items.length}</td>
 <td className="py-8 text-right text-sm font-normal text-[#FF4C3B]">${order.totalbill.toFixed(2)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t-2 border-slate-100">
 <div className="bg-[#F9F9F9] p-10 rounded-sm border border-slate-100">
 <h3 className="text-[13px] font-normal text-[#222] capitalize tracking-[0.2em] mb-6 flex items-center gap-3">
 <span className="w-2 h-2 bg-[#FF4C3B]"></span>
 Billing Address
 </h3>
 <p className="text-[12px] text-slate-500 leading-relaxed font-bold capitalize tracking-wider">
 {data.username}<br />
 <span className="text-slate-300">Address details not set.</span>
 </p>
 <button className="mt-8 text-[10px] font-normal capitalize tracking-[0.2em] text-[#FF4C3B] border-b-2 border-[#FF4C3B] hover:text-black hover:border-black transition-all">Update Billing</button>
 </div>
 <div className="bg-[#F9F9F9] p-10 rounded-sm border border-slate-100">
 <h3 className="text-[13px] font-normal text-[#222] capitalize tracking-[0.2em] mb-6 flex items-center gap-3">
 <span className="w-2 h-2 bg-[#FF4C3B]"></span>
 Shipping Address
 </h3>
 <p className="text-[12px] text-slate-500 leading-relaxed font-bold capitalize tracking-wider">
 {data.username}<br />
 <span className="text-slate-300">Address details not set.</span>
 </p>
 <button className="mt-8 text-[10px] font-normal capitalize tracking-[0.2em] text-[#FF4C3B] border-b-2 border-[#FF4C3B] hover:text-black hover:border-black transition-all">Update Shipping</button>
 </div>
 </div>
 </div>
 </div>
 </div>

 <Footer />
 </div>
 );
}
