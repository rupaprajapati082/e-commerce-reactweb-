import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './style.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
        if (response.data && response.data.products) {
          const allProducts = response.data.products;
          setProducts(allProducts);
          setFilteredProducts(allProducts);
          
          // Dynamically extract categories from products
          const uniqueCats = [...new Set(allProducts.map(p => p.category))];
          const promoCats = uniqueCats.slice(0, 3).map(cat => {
            const sampleProd = allProducts.find(p => p.category === cat);
            return {
              title: `Latest ${cat} Collection`,
              desc: `Check out our newest arrivals in ${cat}.`,
              img: sampleProd?.images[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
              btn: 'Shop Now',
              category: cat
            };
          });
          setCategories(promoCats);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-10">
        <div className="relative h-[60vh] md:h-[70vh] bg-[#E9F5E1] rounded-[2rem] overflow-hidden flex items-center px-8 md:px-20">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block px-3 py-1 bg-[#FFC107] text-[#222] font-bold text-[10px] uppercase tracking-wider rounded-md mb-6">
              Opening Sale Discount 50%
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#222] mb-6 leading-tight">
              SuperMarket For <br />
              <span className="text-[#89C74A]">Fresh Grocery</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-lg mb-10 max-w-md leading-relaxed">
              Introduced a new model for online grocery shopping and convenient home delivery.
            </p>
            <button className="px-8 py-3.5 bg-[#222] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#89C74A] transition-all rounded-lg flex items-center gap-2 group">
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          
          <div className="absolute right-0 bottom-0 h-full w-full md:w-1/2 pointer-events-none hidden md:block">
            <img 
              src="https://freshcart.codescandy.com/assets/images/slider/slider-image-1.jpg" 
              alt="Fresh Groceries" 
              className="w-full h-full object-contain object-right-bottom"
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl font-bold text-[#222] mb-2">Featured Categories</h2>
            <p className="text-sm text-slate-500 font-medium">Shop by category and find what you need quickly</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#89C74A] hover:text-white transition-all">←</button>
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#89C74A] hover:text-white transition-all">→</button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} onClick={() => navigate(`/products?category=${cat.category}`)} className="group cursor-pointer text-center">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-4 hover:border-[#89C74A] hover:shadow-xl hover:shadow-[#89C74A]/10 transition-all duration-300 aspect-square flex items-center justify-center">
                <img 
                  src={cat.img} 
                  alt={cat.category} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <h3 className="font-bold text-xs text-[#222] group-hover:text-[#89C74A] transition-colors uppercase tracking-widest">{cat.category}</h3>
            </div>
          ))}
          {/* Fallback if no categories yet */}
          {categories.length === 0 && (
            ['Dairy, Bread & Eggs', 'Snacks & Munchies', 'Fruits & Vegetables', 'Cold Drinks & Juices', 'Breakfast & Instant Food', 'Bakery & Biscuits'].map((c, i) => (
              <div key={i} className="group cursor-pointer text-center">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-4 aspect-square flex items-center justify-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">{c}</h3>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl font-bold text-[#222] mb-2">Popular Products</h2>
            <p className="text-sm text-slate-500 font-medium">Top selling items in our store</p>
          </div>
          <Link to="/products" className="text-xs font-bold uppercase tracking-widest text-[#89C74A] border-b border-[#89C74A] hover:text-[#222] hover:border-[#222] transition-all">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89C74A]"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-20 text-red-500">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500">No products found.</div>
          ) : (
            filteredProducts.slice(0, 10).map((product) => (
              <div key={product._id} onClick={() => navigate(`/product/${product._id}`)} className="group cursor-pointer bg-white border border-slate-100 p-4 rounded-xl hover:shadow-xl hover:border-[#89C74A]/20 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden mb-4 bg-white">
                  <img 
                    src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/400x400?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-0 left-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-lg uppercase tracking-tighter">Sale</span>
                  )}
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[#89C74A] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.category}</p>
                  <h3 className="font-bold text-xs text-[#222] truncate group-hover:text-[#89C74A] transition-colors">{product.name}</h3>
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
            ))
          )}
        </div>
      </section>

      {/* Daily Best Sells / Banners */}
      <section className="py-10 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group overflow-hidden h-[300px] rounded-3xl">
            <img src="https://freshcart.codescandy.com/assets/images/banner/grocery-banner.png" className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 p-10 flex flex-col justify-center">
              <h3 className="text-2xl font-extrabold text-[#222] mb-2 leading-tight">Fruits & <br />Vegetables</h3>
              <p className="text-slate-500 text-sm mb-6">Get Upto 30% Off</p>
              <button className="px-6 py-2.5 bg-[#222] text-white text-[10px] font-bold uppercase tracking-widest w-fit rounded-lg hover:bg-[#89C74A] transition-all">Shop Now</button>
            </div>
          </div>
          <div className="relative group overflow-hidden h-[300px] rounded-3xl">
            <img src="https://freshcart.codescandy.com/assets/images/banner/grocery-banner-2.png" className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 p-10 flex flex-col justify-center">
              <h3 className="text-2xl font-extrabold text-[#222] mb-2 leading-tight">Freshly Baked <br />Buns</h3>
              <p className="text-slate-500 text-sm mb-6">Get Upto 25% Off</p>
              <button className="px-6 py-2.5 bg-[#222] text-white text-[10px] font-bold uppercase tracking-widest w-fit rounded-lg hover:bg-[#89C74A] transition-all">Shop Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-20 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { title: '10 minute delivery', desc: 'Get your order delivered to your doorstep at the earliest from FreshCart pickup stores near you.', icon: '🕒' },
            { title: 'Best Prices & Offers', desc: 'Cheaper prices than your local supermarket, great cashback offers to top it off. Get best pricess & offers.', icon: '🏷️' },
            { title: 'Wide Assortment', desc: 'Choose from 5000+ products across food, personal care, household, bakery, veg and fruit and other categories.', icon: '�' },
            { title: 'Easy Returns', desc: 'Not satisfied with a product? Return it at the doorstep & get a refund within hours. No questions asked policy.', icon: '�' },
          ].map((feature, idx) => (
            <div key={idx} className="space-y-4">
              <span className="text-4xl block">{feature.icon}</span>
              <h4 className="font-bold text-lg text-[#222]">{feature.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;