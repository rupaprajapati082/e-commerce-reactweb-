import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 px-6 md:px-20 border-t border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <Link to="/" className="text-3xl font-bold tracking-tight text-[#222]">
            Eco<span className="text-[#89C74A]">life</span>
          </Link>
          <p className="mt-6 text-slate-500 text-sm leading-relaxed">
            The best look anytime, anywhere. We provide the highest quality organic and natural products for your beauty and health.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#89C74A] hover:text-white transition-all">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#89C74A] hover:text-white transition-all">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#89C74A] hover:text-white transition-all">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6 text-[#222]">Quick Links</h4>
          <ul className="space-y-3 text-slate-500 text-sm">
            <li><Link to="/products" className="hover:text-[#89C74A] transition-colors">All Products</Link></li>
            <li><Link to="/featured" className="hover:text-[#89C74A] transition-colors">Featured</Link></li>
            <li><Link to="/categories" className="hover:text-[#89C74A] transition-colors">Categories</Link></li>
            <li><Link to="/deals" className="hover:text-[#89C74A] transition-colors">Hot Deals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-[#222]">Customer Service</h4>
          <ul className="space-y-3 text-slate-500 text-sm">
            <li><Link to="/about" className="hover:text-[#89C74A] transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#89C74A] transition-colors">Contact Us</Link></li>
            <li><Link to="/wishlist" className="hover:text-[#89C74A] transition-colors">Wishlist</Link></li>
            <li><Link to="/profile" className="hover:text-[#89C74A] transition-colors">My Account</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6 text-[#222]">Subscribe</h4>
          <p className="text-sm text-slate-500 mb-4">Subscribe to our newsletter and get 10% off your first purchase.</p>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Your email address..." 
              className="w-full px-4 py-3 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-[#89C74A] bg-slate-50"
            />
            <button className="w-full py-3 bg-[#89C74A] text-white font-bold uppercase text-[11px] tracking-widest rounded-full hover:bg-[#7ab33f] transition-all shadow-md shadow-[#89C74A]/20">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-[11px] font-medium uppercase tracking-widest">
        <p>© 2026 Ecolife Store. All Rights Reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-[#89C74A]">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#89C74A]">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
