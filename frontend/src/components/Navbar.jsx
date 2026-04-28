import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="flex items-center justify-between px-6 md:px-20 py-4 gap-8">
          <Link to="/" className="text-3xl font-bold tracking-tight text-[#222] shrink-0">
            Eco<span className="text-[#89C74A]">life</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6 text-[12px] font-bold uppercase text-[#333] shrink-0">
            <Link to="/" className="hover:text-[#89C74A] transition-colors">Home</Link>
            <Link to="/products" className="hover:text-[#89C74A] transition-colors">Products</Link>
            <Link to="/about" className="hover:text-[#89C74A] transition-colors">Support</Link>
            <Link to="/cart" className="hover:text-[#89C74A] transition-colors">Carts</Link>
            <Link to="/wishlist" className="hover:text-[#89C74A] transition-colors">Wishlist</Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative group">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2.5 pl-11 rounded-full border border-slate-200 bg-slate-50 outline-none text-sm focus:bg-white focus:border-[#89C74A] focus:ring-2 focus:ring-[#89C74A]/10 transition-all"
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#89C74A] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-[#333] hover:text-[#89C74A] transition-colors">
                Login
              </Link>
              <Link to="/joinus" className="px-5 py-2.5 bg-[#89C74A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#7ab33f] transition-all shadow-md shadow-[#89C74A]/20">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
