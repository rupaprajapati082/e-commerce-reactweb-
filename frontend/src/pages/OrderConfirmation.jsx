import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderConfirmation = () => {
 const location = useLocation();
 const orderId = location.state?.orderId;

 return (
 <div className="min-h-screen bg-[#FDFDFD]">
 <Navbar />
 
 <div className="py-24 px-6 text-center">
 <div className="max-w-2xl mx-auto">
 <div className="w-24 h-24 bg-[#FF4C3B]/10 text-[#FF4C3B] rounded-full flex items-center justify-center mx-auto mb-10 text-5xl">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 
 <h1 className="text-4xl font-bold text-[#222] mb-4 capitalize tracking-tight">Order Confirmed!</h1>
 <p className="text-slate-500 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
 Thank you for your purchase. Your order has been received and is being processed by our team. You will receive an email confirmation shortly.
 </p>
 
 {orderId && (
 <div className="bg-[#f9f9f9] border border-slate-100 p-8 rounded-sm mb-12 inline-block w-full max-w-md">
 <p className="text-[10px] font-bold capitalize text-slate-400 mb-2">Order Reference Number</p>
 <p className="text-xl font-mono text-[#222] font-bold ">#{orderId.toUpperCase()}</p>
 </div>
 )}
 
 <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
 <Link 
 to="/profile" 
 className="px-12 py-4 bg-[#222] text-white text-[11px] font-bold capitalize rounded-full hover:bg-[#FF4C3B] transition-all shadow-lg shadow-black/10"
 >
 Track Your Order
 </Link>
 <Link 
 to="/products" 
 className="px-12 py-4 border-2 border-slate-200 text-[#222] text-[11px] font-bold capitalize rounded-full hover:border-[#FF4C3B] hover:text-[#FF4C3B] transition-all"
 >
 Back to Shop
 </Link>
 </div>
 
 <div className="mt-20 pt-10 border-t border-slate-100 max-w-lg mx-auto">
 <h3 className="text-sm font-bold text-[#222] capitalize mb-4">Need Help?</h3>
 <p className="text-xs text-slate-400 leading-relaxed">
 If you have any questions regarding your order, please contact our customer support at 
 <span className="text-[#FF4C3B] font-bold ml-1">support@ecolife.com</span>
 </p>
 </div>
 </div>
 </div>
 
 <Footer />
 </div>
 );
};

export default OrderConfirmation;
