import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
        if (response.data && response.data.products) {
          setProducts(response.data.products);
          applyFilters(response.data.products, category);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters(products, category);
  }, [category, products, location.search]);

  const applyFilters = (allProducts, cat) => {
    let filtered = [...allProducts];
    
    // Filter by category
    if (cat !== 'All') {
      filtered = filtered.filter(p => p.category === cat);
    }

    // Filter by search query from URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');
    if (query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.brand?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      {/* Breadcrumbs / Header */}
      <div className="bg-[#f9f9f9] py-10 px-6 md:px-20 border-b border-slate-100">
        <h1 className="text-3xl font-bold text-[#222]">
          {category === 'All' ? 'Shop All Products' : category}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 uppercase font-bold tracking-widest">
          <span className="cursor-pointer hover:text-[#89C74A]" onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span className="text-slate-600">Shop</span>
          {category !== 'All' && (
            <>
              <span>/</span>
              <span className="text-slate-600">{category}</span>
            </>
          )}
        </div>
      </div>

      <div className="px-6 md:px-20 py-16 flex flex-col md:row gap-12">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-10">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#222] mb-6 border-b border-slate-100 pb-2">Categories</h3>
            <div className="space-y-3">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex justify-between items-center w-full text-sm transition-all group ${category === cat ? 'text-[#89C74A] font-bold' : 'text-slate-500 hover:text-[#89C74A]'}`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-full group-hover:bg-[#89C74A]/10 transition-colors">
                    {cat === 'All' ? products.length : products.filter(p => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#222] mb-6 border-b border-slate-100 pb-2">Price Filter</h3>
            <div className="space-y-4">
              <input type="range" className="w-full accent-[#89C74A]" />
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>
          </div>

          <div className="bg-[#89C74A]/5 p-6 rounded-sm border border-[#89C74A]/10">
            <h4 className="font-bold text-[#222] mb-2">Seasonal Sale!</h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">Get up to 50% off on all organic skincare products.</p>
            <button className="text-[10px] font-bold uppercase tracking-widest text-[#89C74A] border-b border-[#89C74A] hover:text-[#222] hover:border-[#222] transition-all">View Sale</button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <p className="text-xs text-slate-500 font-medium">Showing {filteredProducts.length} results</p>
            <div className="flex gap-4">
              <select className="text-xs font-bold uppercase tracking-widest bg-transparent outline-none cursor-pointer">
                <option>Default Sorting</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89C74A]"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-[#222] mb-2">No products found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {setCategory('All'); navigate('/products')}} 
                className="mt-6 px-8 py-3 bg-[#89C74A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#7ab33f] transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product._id} onClick={() => navigate(`/product/${product._id}`)} className="group cursor-pointer bg-white border border-slate-100 p-4 hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden mb-4 bg-[#f9f9f9]">
                    <img 
                      src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/400x400?text=No+Image'} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter">-{product.discount}%</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#89C74A] font-bold uppercase tracking-widest">{product.brand || 'Ecolife'}</p>
                    <h3 className="font-bold text-xs text-[#222] truncate hover:text-[#89C74A] transition-colors">{product.name}</h3>
                    <div className="flex gap-0.5 text-yellow-400 text-[8px]">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-bold text-sm text-[#222]">
                        ${product.discount > 0 ? (product.price - (product.price * product.discount / 100)).toFixed(2) : product.price.toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-slate-400 line-through text-[10px]">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListing;
