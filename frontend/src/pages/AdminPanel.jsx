import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const prodRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
        setProducts(prodRes.data.products);
        
        // Assuming there's an endpoint for all orders for admin
        const orderRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(orderRes.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateStock = async (productId, newStock) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_BASE_URL}/product/${productId}`, 
        { stock: parseInt(newStock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh products
      const prodRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
      setProducts(prodRes.data.products);
    } catch (err) {
      console.error(err);
      alert('Failed to update stock');
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-slate-300 flex font-sans">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/5 p-8 flex flex-col gap-10">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white shrink-0">
          Eco<span className="text-[#89C74A]">life</span> <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded ml-2">Admin</span>
        </Link>
        
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`flex items-center gap-4 px-4 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-[#89C74A] text-white' : 'hover:bg-white/5 text-slate-500 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`flex items-center gap-4 px-4 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-[#89C74A] text-white' : 'hover:bg-white/5 text-slate-500 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Orders
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#89C74A] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Store
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89C74A]"></div>
          </div>
        ) : activeTab === 'products' ? (
          <div className="space-y-10 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Product Inventory</h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Manage your stock levels and product pricing</p>
              </div>
              <button className="bg-[#89C74A] text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#7ab33f] transition-all shadow-lg shadow-[#89C74A]/20">
                Add New Product
              </button>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <th className="p-6">Product Information</th>
                    <th className="p-6">SKU</th>
                    <th className="p-6 text-center">Price</th>
                    <th className="p-6 text-center">Stock Level</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 rounded p-1">
                            <img src={p.images[0]} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{p.name}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#89C74A]">{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-xs font-mono text-slate-500">{p.sku || 'N/A'}</td>
                      <td className="p-6 text-center font-bold text-white">${p.price.toFixed(2)}</td>
                      <td className="p-6 text-center">
                        <input 
                          type="number" 
                          defaultValue={p.stock} 
                          onBlur={(e) => updateStock(p._id, e.target.value)}
                          className={`w-20 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-center text-xs font-bold focus:outline-none focus:border-[#89C74A] transition-all ${p.stock < 10 ? 'text-red-500' : 'text-[#89C74A]'}`}
                        />
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-4 text-[10px] font-bold uppercase tracking-widest">
                          <button className="text-slate-500 hover:text-white transition-colors">Edit</button>
                          <button className="text-red-500/60 hover:text-red-500 transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Recent Orders</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Monitor and fulfill customer orders</p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <th className="p-6">Order ID</th>
                    <th className="p-6">Customer</th>
                    <th className="p-6 text-center">Items</th>
                    <th className="p-6 text-center">Total Amount</th>
                    <th className="p-6 text-center">Status</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 text-xs font-mono text-slate-500 font-bold uppercase tracking-tighter">#{o._id.slice(-8)}</td>
                      <td className="p-6">
                        <div className="text-sm font-bold text-white">{o.shippingDetails?.firstName} {o.shippingDetails?.lastName}</div>
                        <div className="text-[10px] text-slate-500">{o.shippingDetails?.city}</div>
                      </td>
                      <td className="p-6 text-center text-xs font-bold text-slate-400">{o.items.length}</td>
                      <td className="p-6 text-center font-bold text-[#89C74A]">${o.totalbill.toFixed(2)}</td>
                      <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          o.status === 'delivered' ? 'bg-[#89C74A]/10 text-[#89C74A]' : 
                          o.status === 'cancel' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {o.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white hover:text-[#89C74A] hover:border-[#89C74A] transition-all">Update Status</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
