import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
 const [searchQuery, setSearchQuery] = useState('');
 const [user, setUser] = useState(null);
 const navigate = useNavigate();

 useEffect(() => {
 const storedUser = localStorage.getItem('user');
 if (storedUser) {
 setUser(JSON.parse(storedUser));
 }
 }, []);

 const handleLogout = () => {
 localStorage.removeItem('token');
 localStorage.removeItem('user');
 setUser(null);
 navigate('/login');
 };

 const handleSearch = (e) => {
 e.preventDefault();
 if (searchQuery.trim()) {
 navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
 }
 };

 return (
 <>
 {/* Top Bar */}
 <div className="bg-[#FF4C3B] text-white py-2.5 px-6 md:px-20 flex justify-between items-center text-[11px] font-medium tracking-wide">
 <div className="flex gap-6">
 <span>Welcome to Our store Ecolife</span>
 <span>Call Us: 123 456 7890</span>
 </div>
 <div className="flex gap-6 items-center">
 <button className="hover:text-black/70 transition-colors capitalize">Wishlist</button>
 <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/profile')}>
 <span className="capitalize">My Account</span>
 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
 </svg>
 </div>
 </div>
 </div>

 {/* Main Navbar */}
 <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-100">
 <div className="flex items-center justify-between px-6 md:px-20 py-5 gap-8">
 <div className="flex items-center gap-10">
 <Link to="/" className="text-3xl font-normal text-[#333] shrink-0 capitalize flex items-center gap-1">
 <span className="text-[#FF4C3B]">Multi</span>kart
 </Link>
 
 <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold capitalize text-[#333] shrink-0">
 <Link to="/" className="hover:text-[#FF4C3B] transition-colors relative group">
 Home
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
 </Link>
 <Link to="/products" className="hover:text-[#FF4C3B] transition-colors relative group">
 Products
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
 </Link>
 <Link to="/about" className="hover:text-[#FF4C3B] transition-colors relative group">
 Support
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
 </Link>
 <Link to="/cart" className="hover:text-[#FF4C3B] transition-colors relative group">
 Cart
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
 </Link>
 <Link to="/orders" className="hover:text-[#FF4C3B] transition-colors relative group">
 Orders
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
 </Link>
 <Link to="/wishlist" className="hover:text-[#FF4C3B] transition-colors relative group">
 Wishlist
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
 </Link>
 </div>
 </div>

 <div className="flex items-center gap-8">
 {/* Search Bar */}
 <form onSubmit={handleSearch} className="hidden md:flex relative group">
 <input 
 type="text" 
 placeholder="Search products..." 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-48 focus:w-64 px-4 py-2 rounded-sm border border-slate-200 outline-none text-xs transition-all focus:border-[#FF4C3B]"
 />
 <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </button>
 </form>

 <div className="flex items-center gap-6">
 <Link to="/cart" className="relative text-[#333] hover:text-[#FF4C3B] transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
 </svg>
 <span className="absolute -top-2 -right-2 bg-[#FF4C3B] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">0</span>
 </Link>
 
 {user ? (
 <div className="flex items-center gap-4">
 <span className="text-[11px] font-normal capitalize text-[#222]">Hello, <span className="text-[#FF4C3B]">{user.username}</span></span>
 <button onClick={handleLogout} className="text-[10px] font-normal capitalize text-slate-400 hover:text-[#FF4C3B] transition-colors underline underline-offset-4">Logout</button>
 </div>
 ) : (
 <Link to="/login" className="bg-[#FF4C3B] text-white px-6 py-2.5 rounded-sm text-[11px] font-bold capitalize hover:bg-black transition-all">
 Login
 </Link>
 )}
 </div>
 </div>
 </div>
 </nav>
 </>
 );
};

export default Navbar;
