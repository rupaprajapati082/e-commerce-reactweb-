import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { 
  Sun, 
  Moon, 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  LogOut, 
  Menu, 
  X,
  Phone,
  Package,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const categoriesList = [
    'Dress', 'Electronic', 'Fashion', 'Top', 'Cosmetic'
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchCartCount();
    
    // Listen for custom event to update cart count globally
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      // Use dynamic import or standard fetch to avoid circular dependency issues if any
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const totalItems = data.cart?.items?.length || 0;
        setCartCount(totalItems);
      }
    } catch (err) {
      console.error('Failed to fetch cart count:', err);
    }
  };

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
      <div className="bg-[#FF4C3B] text-white py-2 px-6 md:px-20 flex justify-between items-center text-[11px] font-medium tracking-wide">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-2">
            <Package size={12} />
            Welcome to Our store Multikart
          </span>
          <span className="hidden md:flex items-center gap-2">
            <Phone size={12} />
            Call Us: 123 456 7890
          </span>
        </div>
        <div className="flex gap-6 items-center">
          <button 
            onClick={toggleTheme}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <Link to="/wishlist" className="hover:text-black/70 transition-colors capitalize flex items-center gap-1">
            <Heart size={12} />
            Wishlist
          </Link>
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/profile')}>
            <User size={12} />
            <span className="capitalize">My Account</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between px-6 md:px-20 py-4 gap-8">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-2xl font-bold text-[#333] dark:text-white shrink-0 capitalize flex items-center gap-1">
              <span className="text-[#FF4C3B]">Multi</span>kart
            </Link>
            
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-semibold capitalize text-[#333] dark:text-slate-300 shrink-0">
              <Link to="/" className="hover:text-[#FF4C3B] transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
              </Link>

              {/* Categories Dropdown */}
              <div className="relative group cursor-pointer py-4">
                <div className="flex items-center gap-1 hover:text-[#FF4C3B] transition-colors">
                  Categories <ChevronDown size={14} />
                  <span className="absolute bottom-3 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
                </div>
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-[#111] border border-slate-100 dark:border-white/5 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 flex flex-col py-3 z-50">
                  {categoriesList.map(cat => (
                    <Link 
                      key={cat} 
                      to={`/products?search=${encodeURIComponent(cat)}`} 
                      className="px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#FF4C3B] transition-colors flex items-center justify-between group/item"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/products" className="hover:text-[#FF4C3B] transition-colors relative group">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
              </Link>
              
              <Link to="/support" className="hover:text-[#FF4C3B] transition-colors relative group">
                Support
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4C3B] group-hover:w-full transition-all"></span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex relative group">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 focus:w-64 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border-transparent focus:border-[#FF4C3B] outline-none text-xs transition-all dark:text-white"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={14} />
              </button>
            </form>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative text-[#333] dark:text-white hover:text-[#FF4C3B] transition-colors">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-[#FF4C3B] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0A0A0A]">
                  {cartCount}
                </span>
              </Link>
              
              {user ? (
                <div className="flex items-center gap-4 border-l border-slate-200 dark:border-white/10 pl-4">
                  <div className="hidden sm:block">
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Welcome back</p>
                    <p className="text-[12px] font-bold dark:text-white">{user.username}</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 hover:text-red-500 transition-all">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-[#FF4C3B] text-white px-6 py-2 rounded-full text-[11px] font-bold capitalize hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all">
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden dark:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#0A0A0A] overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                <Link to="/" className="text-lg font-medium dark:text-white hover:text-[#FF4C3B]" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link to="/products" className="text-lg font-medium dark:text-white hover:text-[#FF4C3B]" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                
                {/* Mobile Categories */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 mb-1">Categories</span>
                  <div className="pl-4 border-l-2 border-slate-100 dark:border-white/10 flex flex-col gap-4">
                    {categoriesList.map(cat => (
                      <Link 
                        key={cat} 
                        to={`/products?search=${encodeURIComponent(cat)}`} 
                        className="text-sm font-medium dark:text-slate-300 hover:text-[#FF4C3B]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/support" className="text-lg font-medium dark:text-white hover:text-[#FF4C3B]" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
                <Link to="/cart" className="text-lg font-medium dark:text-white hover:text-[#FF4C3B]" onClick={() => setIsMobileMenuOpen(false)}>Cart</Link>
                <Link to="/profile" className="text-lg font-medium dark:text-white hover:text-[#FF4C3B]" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
                <form onSubmit={handleSearch} className="relative mt-4">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 outline-none dark:text-white"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
