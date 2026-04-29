import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
 return (
 <footer className="bg-[#222] pt-24 pb-12 px-6 md:px-20 text-white">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
 <div className="md:col-span-1 space-y-8">
 <Link to="/" className="text-4xl font-normal capitalize">
 <span className="text-[#FF4C3B]">Multi</span>kart
 </Link>
 <p className="text-slate-400 text-[13px] leading-relaxed font-medium">
 Experience the ultimate tool and auto parts shopping destination. We provide professional-grade equipment for experts and enthusiasts alike.
 </p>
 <div className="flex gap-4">
 <a href="#" className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center text-white hover:bg-[#FF4C3B] transition-all">
 <i className="fab fa-facebook-f text-sm"></i>
 </a>
 <a href="#" className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center text-white hover:bg-[#FF4C3B] transition-all">
 <i className="fab fa-twitter text-sm"></i>
 </a>
 <a href="#" className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center text-white hover:bg-[#FF4C3B] transition-all">
 <i className="fab fa-instagram text-sm"></i>
 </a>
 </div>
 </div>
 
 <div>
 <h4 className="font-normal text-[13px] capitalize mb-10 text-white">Quick Links</h4>
 <ul className="space-y-4 text-slate-400 text-[12px] font-bold capitalize tracking-wider">
 <li><Link to="/products" className="hover:text-[#FF4C3B] transition-colors">All Products</Link></li>
 <li><Link to="/featured" className="hover:text-[#FF4C3B] transition-colors">Featured</Link></li>
 <li><Link to="/categories" className="hover:text-[#FF4C3B] transition-colors">Categories</Link></li>
 <li><Link to="/deals" className="hover:text-[#FF4C3B] transition-colors">Hot Deals</Link></li>
 </ul>
 </div>

 <div>
 <h4 className="font-normal text-[13px] capitalize mb-10 text-white">Help Center</h4>
 <ul className="space-y-4 text-slate-400 text-[12px] font-bold capitalize tracking-wider">
 <li><Link to="/about" className="hover:text-[#FF4C3B] transition-colors">About Us</Link></li>
 <li><Link to="/contact" className="hover:text-[#FF4C3B] transition-colors">Contact Us</Link></li>
 <li><Link to="/wishlist" className="hover:text-[#FF4C3B] transition-colors">Wishlist</Link></li>
 <li><Link to="/profile" className="hover:text-[#FF4C3B] transition-colors">My Account</Link></li>
 </ul>
 </div>
 
 <div className="space-y-8">
 <h4 className="font-normal text-[13px] capitalize mb-10 text-white">Newsletter</h4>
 <p className="text-[12px] text-slate-400 font-medium">Join our community and get the latest updates on tool arrivals and exclusive offers.</p>
 <div className="flex flex-col gap-4">
 <input 
 type="email" 
 placeholder="Your email address..." 
 className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-sm text-xs focus:outline-none focus:border-[#FF4C3B] text-white"
 />
 <button className="w-full py-4 bg-[#FF4C3B] text-white font-normal capitalize text-[10px] tracking-[0.2em] rounded-sm hover:bg-white hover:text-black transition-all">
 Subscribe Now
 </button>
 </div>
 </div>
 </div>
 
 <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center gap-8 text-slate-500 text-[10px] font-bold capitalize ">
 <p>© 2026 Multikart Tool Store. All Rights Reserved.</p>
 <div className="flex gap-10">
 <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
 <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
 </div>
 </div>
 </footer>
 );
};

export default Footer;
