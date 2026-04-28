import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/wishlist/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data.wishlist?.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/wishlist/toggle`, 
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89C74A]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-[#f9f9f9] py-10 px-6 md:px-20 border-b border-slate-100">
        <h1 className="text-3xl font-bold text-[#222]">My Wishlist</h1>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 uppercase font-bold tracking-widest">
          <Link to="/" className="hover:text-[#89C74A]">Home</Link>
          <span>/</span>
          <span className="text-slate-600">Wishlist</span>
        </div>
      </div>

      <div className="px-6 md:px-20 py-16">
        {wishlist.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20 bg-white border border-dashed border-slate-200 rounded-sm">
            <div className="text-6xl mb-6">❤️</div>
            <h2 className="text-2xl font-bold text-[#222] mb-4">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-8">Save items you love to your wishlist and they'll appear here.</p>
            <Link to="/products" className="inline-block px-10 py-4 bg-[#89C74A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#7ab33f] transition-all shadow-md shadow-[#89C74A]/20">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {wishlist.map(product => (
              <div key={product._id} className="group bg-white border border-slate-100 p-4 hover:shadow-xl transition-all duration-300 relative">
                <button 
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="relative aspect-square overflow-hidden mb-4 bg-[#f9f9f9]" onClick={() => navigate(`/product/${product._id}`)}>
                  <img 
                    src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/400x400?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 cursor-pointer" 
                  />
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-[#89C74A] font-bold uppercase tracking-widest">{product.brand || 'Ecolife'}</p>
                  <h3 className="font-bold text-xs text-[#222] truncate hover:text-[#89C74A] transition-colors">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-sm text-[#222]">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="text-[9px] font-bold uppercase tracking-widest text-[#89C74A] hover:text-[#222] transition-colors"
                    >
                      View Options
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
