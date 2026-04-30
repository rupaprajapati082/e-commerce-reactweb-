import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage } from '../utils/imageHelper';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings,
  Plus, Edit3, Trash2, Search, Bell, PenSquare, ChevronDown,
  HelpCircle, LogOut, TrendingUp, DollarSign, X, MoreVertical,
  Filter, Download, Calendar, Mail, Phone, MapPin, CheckCircle2,
  AlertCircle, ArrowUpRight, ArrowDownRight, Activity,
  ShoppingCart, Star, Zap, Rocket, Headphones, ShieldCheck
} from 'lucide-react';

// ── Shared UI Components ──

const SidebarItem = ({ icon: Icon, label, active, onClick, badge, hasSubmenu }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
      active ? 'bg-[#FF4C3B] text-white shadow-lg shadow-[#FF4C3B]/20 font-bold' : 'text-slate-900 hover:bg-slate-50 dark:hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span className="tracking-tight font-black">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ${active ? 'bg-white text-[#FF4C3B]' : 'bg-[#FF4C3B] text-white'}`}>{badge}</span>}
      {hasSubmenu && <ChevronDown size={14} className={active ? 'text-white' : 'text-slate-900'} />}
    </div>
  </button>
);

const StatCard = ({ label, value, trend, icon: Icon, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{label}</p>
    <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter">{value}</h3>
  </motion.div>
);

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', category: '', stock: '', description: '', 
    images: '', brand: '', sku: '', discount: '' 
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const prodRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
      setProducts(prodRes.data.products || []);

      if (activeTab === 'dashboard' || activeTab === 'orders' || activeTab === 'income' || activeTab === 'promote') {
        const orderRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(orderRes.data.orders || []);
      }

      if (activeTab === 'dashboard' || activeTab === 'customers') {
        const userRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/all/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(userRes.data.users || []);
      }

    } catch (err) {
      console.error('Fetch error:', err);
      // Detailed error reporting to help the user understand why it's blank
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message;
      
      if (status === 403) {
        alert(`Access Denied: You are not authorized as an Admin. (${msg})`);
      } else if (status === 400 || status === 401) {
        alert(`Session Expired: Please login again. (${msg})`);
        navigate('/login');
      } else {
        alert(`Data Fetch Error: ${msg}. Please check if the server is running on PORT 3005.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        discount: Number(newProduct.discount) || 0,
        images: newProduct.images ? [newProduct.images] : (editingProduct?.images || [])
      };

      if (editingProduct) {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/product/${editingProduct._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/product/add`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setShowAddModal(false);
      setEditingProduct(null);
      setNewProduct({ name: '', price: '', category: '', stock: '', description: '', images: '', brand: '', sku: '', discount: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/order-status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalbill || o.totalAmount || 0), 0);

  if (loading && products.length === 0) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-200 dark:border-white/5 border-t-[#FF4C3B] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0A0A0A] flex font-sans transition-colors duration-300">
      
      {/* ── Sidebar ── */}
      <aside className="w-72 shrink-0 bg-white dark:bg-[#111] border-r border-slate-200 dark:border-white/5 flex flex-col py-10 px-6 min-h-screen sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4C3B] to-orange-400 flex items-center justify-center shadow-lg shadow-[#FF4C3B]/30">
            <Package className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            Multi<span className="text-[#FF4C3B]">Kart</span>
          </h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
          <SidebarItem icon={LayoutDashboard} label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Package} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <SidebarItem icon={Users} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          <SidebarItem icon={ShoppingBag} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={DollarSign} label="Income" active={activeTab === 'income'} onClick={() => setActiveTab('income')} />
          <SidebarItem icon={TrendingUp} label="Promote" active={activeTab === 'promote'} onClick={() => setActiveTab('promote')} />
        </nav>

        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-white/5 space-y-2">
          <SidebarItem icon={HelpCircle} label="Help" active={activeTab === 'help'} onClick={() => setActiveTab('help')} badge={3} />
          <SidebarItem icon={LogOut} label="Logout" onClick={() => { localStorage.clear(); navigate('/login'); }} />
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-10 py-6 sticky top-0 z-50 flex justify-between items-center">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 w-full max-w-md group focus-within:ring-2 focus-within:ring-[#FF4C3B]/20 transition-all">
            <Search size={18} className="text-slate-900" />
            <input placeholder="Search analytics..." className="bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white w-full placeholder:text-slate-400" />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-900 hover:text-[#FF4C3B] transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4C3B] rounded-full border-2 border-white dark:border-[#0A0A0A]"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-white/5">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Admin</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">Rupa Prajapati</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white dark:border-[#111] shadow-xl" />
            </div>
          </div>
        </header>

        <main className="p-10 flex-1">
          
          <AnimatePresence mode="wait">
            {/* ── Dashboard Tab ── */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Dashboard Overview</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Real-time performance metrics</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 hover:bg-slate-50 transition-all">
                      <Calendar size={14} /> Last 30 Days
                    </button>
                    <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all">
                      <Download size={14} /> Export Data
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <StatCard label="Total Revenue" value={`Rp ${totalRevenue.toLocaleString()}`} trend={12} icon={DollarSign} color="text-green-500" />
                  <StatCard label="Total Orders" value={orders.length} trend={8} icon={ShoppingBag} color="text-blue-500" />
                  <StatCard label="Active Customers" value={customers.length} trend={4} icon={Users} color="text-[#FF4C3B]" />
                  <StatCard label="In-Stock Gear" value={products.length} trend={5} icon={Package} color="text-orange-500" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                  <div className="xl:col-span-2 bg-white dark:bg-[#111] rounded-[3.5rem] p-10 border border-slate-200 dark:border-white/5 shadow-2xl shadow-black/5">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="text-[#FF4C3B]" size={20} /> Sales Performance
                      </h3>
                    </div>
                    <div className="h-[300px] flex items-end justify-between gap-4">
                      {[60, 40, 80, 50, 90, 70, 100, 85, 95, 65, 75, 88].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05 }} className="w-full bg-slate-100 dark:bg-white/5 rounded-2xl relative overflow-hidden group-hover:bg-[#FF4C3B]/10 transition-all">
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#FF4C3B] to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" style={{ height: '40%' }} />
                          </motion.div>
                          <span className="text-[9px] font-black text-slate-900 group-hover:text-[#FF4C3B]">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#111] rounded-[3.5rem] p-10 border border-slate-200 dark:border-white/5 shadow-2xl shadow-black/5">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Recent Activity</h3>
                    <div className="space-y-8">
                      {orders.slice(0, 4).map((o, i) => (
                        <div key={i} className="flex gap-4 relative">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${o.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {o.status === 'delivered' ? <CheckCircle2 size={18} /> : <ShoppingCart size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">Order #{o._id.slice(-6).toUpperCase()}</p>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{o.status} • Rp {(o.totalbill || o.totalAmount)?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Products Tab ── */}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Inventory</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Manage your gear catalog</p>
                  </div>
                  <button onClick={() => { setEditingProduct(null); setShowAddModal(true); }} className="px-8 py-4 bg-[#FF4C3B] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-[#FF4C3B]/20">
                    <Plus size={18} /> New Product
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                  {products.map(p => (
                    <div key={p._id} className="group bg-white dark:bg-[#111] rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/5 hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                      <div className="aspect-square rounded-3xl bg-slate-50 dark:bg-white/5 p-8 mb-6 relative overflow-hidden flex items-center justify-center">
                        <img src={getProductImage(p)} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                          <button onClick={() => { setEditingProduct(p); setNewProduct({ name: p.name, price: p.price, category: p.category, stock: p.stock, description: p.description, brand: p.brand, sku: p.sku, discount: p.discount, images: p.images?.[0] || '' }); setShowAddModal(true); }} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-800 hover:bg-[#FF4C3B] hover:text-white transition-all scale-75 group-hover:scale-100"><Edit3 size={18} /></button>
                          <button onClick={() => deleteProduct(p._id)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all scale-75 group-hover:scale-100"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#FF4C3B] font-black uppercase tracking-[0.2em] mb-2">{p.category}</p>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{p.name}</h4>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-xl font-black text-slate-900 dark:text-white">Rp {p.price.toLocaleString()}</p>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{p.stock} units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Customers Tab ── */}
            {activeTab === 'customers' && (
              <motion.div key="customers" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Customers</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Manage user base & engagement</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#111] rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl shadow-black/5">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 dark:border-white/5">
                      <tr>
                        <th className="px-10 py-6">Customer</th>
                        <th className="px-10 py-6">Contact Info</th>
                        <th className="px-10 py-6">Address</th>
                        <th className="px-10 py-6">Role</th>
                        <th className="px-10 py-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {customers.map(user => (
                        <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF4C3B] to-orange-400 flex items-center justify-center font-black text-white uppercase shadow-lg shadow-[#FF4C3B]/20">{user.username?.charAt(0)}</div>
                              <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white">{user.username}</span>
                                <p className="text-[10px] font-black text-slate-900 uppercase opacity-60">Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                             <p className="text-xs font-black text-slate-900 dark:text-white">{user.email}</p>
                             <p className="text-[10px] font-black text-slate-900 uppercase opacity-60">{user.phone || 'No phone'}</p>
                          </td>
                          <td className="px-10 py-6 text-xs font-black text-slate-900 opacity-80 max-w-[200px] truncate">{user.address || 'No address provided'}</td>
                          <td className="px-10 py-6">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${user.role?.toLowerCase() === 'admin' ? 'bg-[#FF4C3B] text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-900'}`}>{user.role}</span>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <button onClick={() => deleteUser(user._id)} className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-900 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Orders</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Processing & Fulfillment</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#111] rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl shadow-black/5">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 dark:border-white/5">
                      <tr>
                        <th className="px-10 py-6">Order ID</th>
                        <th className="px-10 py-6">Customer</th>
                        <th className="px-10 py-6">Amount</th>
                        <th className="px-10 py-6">Status</th>
                        <th className="px-10 py-6">Date</th>
                        <th className="px-10 py-6 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {orders.map(o => (
                        <tr key={o._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                          <td className="px-10 py-6 font-mono text-[10px] text-[#FF4C3B] font-black">#{o._id.slice(-8).toUpperCase()}</td>
                          <td className="px-10 py-6 text-sm font-black text-slate-900 dark:text-white">{o.shippingDetails?.firstName} {o.shippingDetails?.lastName}</td>
                          <td className="px-10 py-6 text-sm font-black text-slate-900 dark:text-white">Rp {(o.totalbill || o.totalAmount)?.toLocaleString()}</td>
                          <td className="px-10 py-6">
                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${o.status === 'delivered' ? 'bg-green-100 text-green-600' : o.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>{o.status}</span>
                          </td>
                          <td className="px-10 py-6 text-[10px] font-black text-slate-900 uppercase opacity-60">{new Date(o.createdAt || Date.now()).toLocaleDateString()}</td>
                          <td className="px-10 py-6 text-right">
                            <select value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all text-slate-900">
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Income Tab ── */}
            {activeTab === 'income' && (
              <motion.div key="income" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Financial Insights</h2>
                  <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Revenue & Growth Analytics</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StatCard label="Total Income" value={`Rp ${totalRevenue.toLocaleString()}`} trend={15} icon={DollarSign} color="text-green-500" />
                  <StatCard label="Avg Order Value" value={`Rp ${(totalRevenue / (orders.length || 1)).toFixed(0)}`} trend={5} icon={Activity} color="text-indigo-500" />
                  <StatCard label="Projected Sales" value={`Rp ${(totalRevenue * 1.2).toFixed(0)}`} trend={20} icon={TrendingUp} color="text-purple-500" />
                </div>
                <div className="bg-white dark:bg-[#111] rounded-[3.5rem] p-10 border border-slate-200 dark:border-white/5">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Revenue Breakdown</h3>
                  <div className="space-y-6">
                    {['Product Sales', 'Shipping Fees', 'Affiliate'].map((cat, i) => (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between text-xs font-black text-slate-900 dark:text-white uppercase">
                          <span>{cat}</span>
                          <span>{85 - (i*20)}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden border border-slate-100">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${85 - (i*20)}%` }} className="h-full bg-[#FF4C3B]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Promote Tab ── */}
            {activeTab === 'promote' && (
              <motion.div key="promote" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Marketing Hub</h2>
                  <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Boost your store visibility</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-[#FF4C3B] to-orange-500 p-10 rounded-[3.5rem] text-white shadow-xl shadow-[#FF4C3B]/20">
                    <Rocket size={40} className="mb-6" />
                    <h3 className="text-2xl font-black mb-2">Flash Sale Campaign</h3>
                    <p className="text-white/80 text-sm mb-6 font-bold">Drive 2x more traffic by starting a limited-time flash sale on your top gear.</p>
                    <button className="px-8 py-3 bg-white text-[#FF4C3B] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Launch Campaign</button>
                  </div>
                  <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-10 rounded-[3.5rem] shadow-sm">
                    <Zap size={40} className="text-yellow-500 mb-6" />
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Discount Coupons</h3>
                    <p className="text-slate-900 dark:text-slate-400 text-sm mb-6 font-black opacity-80">Create unique promo codes for your loyal customers and influencers.</p>
                    <button className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Manage Coupons</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Help Tab ── */}
            {activeTab === 'help' && (
              <motion.div key="help" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Support Center</h2>
                  <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">How can we assist you today?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: Headphones, title: 'Live Chat', desc: 'Average response time: 2 mins' },
                    { icon: Mail, title: 'Email Support', desc: '24/7 dedicated support team' },
                    { icon: ShieldCheck, title: 'Privacy & Policy', desc: 'Update your terms and conditions' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] hover:border-[#FF4C3B] transition-all cursor-pointer group shadow-sm">
                      <item.icon size={32} className="text-[#FF4C3B] mb-4" />
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{item.title}</h4>
                      <p className="text-xs text-slate-900 dark:text-slate-400 font-black opacity-60">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 dark:bg-white/5 p-10 rounded-[3.5rem] border border-slate-200">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">FAQ Quick Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['How to add products?', 'Managing bulk orders', 'Refund processing', 'Customizing your store'].map(q => (
                      <div key={q} className="p-5 bg-white dark:bg-[#111] rounded-2xl text-xs font-black text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:shadow-lg transition-all cursor-pointer flex justify-between items-center">
                        {q} <ChevronDown size={14} className="-rotate-90 text-slate-900" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* ── Add Product Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} className="relative w-full max-w-2xl bg-white dark:bg-[#111] rounded-[3rem] p-12 shadow-2xl border border-slate-200 dark:border-white/5">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{editingProduct ? 'Edit' : 'Add'} <span className="text-[#FF4C3B]">Product</span></h2>
                <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-900 hover:text-red-500 transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Name</label>
                  <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Brand</label>
                  <input required type="text" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Price (Rp)</label>
                  <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Category</label>
                  <select 
                    required 
                    value={newProduct.category} 
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all appearance-none"
                  >
                    <option value="" className="text-slate-400">Select Category</option>
                    <option value="Dress">Dress</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Top">Top</option>
                    <option value="Cosmetic">Cosmetic</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Stock</label>
                  <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Discount (%)</label>
                  <input required type="number" value={newProduct.discount} onChange={e => setNewProduct({...newProduct, discount: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">SKU</label>
                  <input required type="text" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Image URL</label>
                  <input required type="text" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Description</label>
                  <textarea rows={4} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="col-span-2 pt-6">
                  <button type="submit" className="w-full bg-[#FF4C3B] text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FF4C3B]/20 hover:bg-black transition-all">{editingProduct ? 'Save Changes' : 'Publish Product'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
