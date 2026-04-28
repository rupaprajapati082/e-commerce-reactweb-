import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, 
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89C74A]"></div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      <div className="py-40 text-center">
        <h2 className="text-2xl font-bold text-[#222]">Product not found.</h2>
        <Link to="/products" className="mt-4 inline-block text-[#89C74A] font-bold underline">Back to Shop</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-[#f9f9f9] py-6 px-6 md:px-20 border-b border-slate-100">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
          <Link to="/" className="hover:text-[#89C74A]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#89C74A]">Shop</Link>
          <span>/</span>
          <span className="text-slate-600">{product.category}</span>
          <span>/</span>
          <span className="text-slate-600">{product.name}</span>
        </div>
      </div>

      <div className="px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden bg-[#f9f9f9] border border-slate-100 group">
              <img 
                src={product.images && product.images[activeImage] ? product.images[activeImage] : 'https://via.placeholder.com/600x600?text=No+Image'} 
                alt={product.name} 
                className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 border-2 transition-all ${activeImage === idx ? 'border-[#89C74A]' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-contain p-2" alt={`${product.name} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[11px] text-[#89C74A] font-bold uppercase tracking-widest">{product.brand || 'Ecolife'}</p>
              <h1 className="text-4xl font-bold text-[#222] leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">(1 Customer Review)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-red-500">
                ${product.discount > 0 ? (product.price - (product.price * product.discount / 100)).toFixed(2) : product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through">${product.price.toFixed(2)}</span>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm">-{product.discount}%</span>
                </>
              )}
            </div>

            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              {product.description || 'Experience the perfect blend of nature and science with our signature product. Formulated with organic ingredients to nourish and enhance your natural beauty.'}
            </p>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-slate-200 rounded-full h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="w-12 h-full flex items-center justify-center hover:text-[#89C74A] transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="w-12 h-full flex items-center justify-center hover:text-[#89C74A] transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={addToCart}
                  className="flex-1 h-12 bg-[#222] text-white font-bold uppercase text-[11px] tracking-widest rounded-full hover:bg-[#89C74A] transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Add to Cart
                </button>
                <button className="w-12 h-12 border border-slate-200 rounded-full flex items-center justify-center hover:bg-pink-50 hover:text-pink-500 hover:border-pink-200 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Availability: <span className={product.stock > 0 ? 'text-[#89C74A]' : 'text-red-500'}>
                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                  </span>
                </p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  SKU: <span className="text-[#222]">{product.sku || 'N/A'}</span>
                </p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Categories: <span className="text-[#222]">{product.category}</span>
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Share:</span>
                  <div className="flex gap-3 text-slate-400">
                    <a href="#" className="hover:text-[#89C74A] transition-colors"><i className="fab fa-facebook-f text-xs"></i></a>
                    <a href="#" className="hover:text-[#89C74A] transition-colors"><i className="fab fa-twitter text-xs"></i></a>
                    <a href="#" className="hover:text-[#89C74A] transition-colors"><i className="fab fa-pinterest text-xs"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-24">
          <div className="flex border-b border-slate-100 gap-12">
            <button className="text-[11px] font-bold uppercase tracking-widest text-[#222] border-b-2 border-[#89C74A] pb-4">Description</button>
            <button className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#222] pb-4 transition-colors">Additional Info</button>
            <button className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#222] pb-4 transition-colors">Reviews (1)</button>
          </div>
          <div className="py-10 text-sm text-slate-500 leading-relaxed space-y-4 max-w-4xl">
            <p>{product.description || 'Experience the perfect blend of nature and science with our signature product. Formulated with organic ingredients to nourish and enhance your natural beauty.'}</p>
            <p>Our products are dermatologically tested, cruelty-free, and made with the highest quality standards. We believe in transparency and pure ingredients that deliver real results.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
