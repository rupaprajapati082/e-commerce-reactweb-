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
  ShoppingCart, Star, Zap, Rocket, Headphones, ShieldCheck,
  Heart, CreditCard, BellRing, ChevronRight, Truck
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

const ActionRow = ({ icon: Icon, title, subtitle, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 bg-white dark:bg-[#111] border border-slate-100 dark:border-white/5 rounded-3xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
  >
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 dark:border-white/10 text-slate-400 group-hover:text-[#FF4C3B] transition-colors">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <div className="text-left">
        <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{title}</h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{subtitle}</p>
      </div>
    </div>
    <ChevronRight className="text-slate-200 group-hover:text-[#FF4C3B] transition-colors" size={20} />
  </button>
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
    images: '', brand: '', sku: '', discount: '', sizes: [] 
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

      if (activeTab === 'dashboard' || activeTab === 'orders' || activeTab === 'income' || activeTab === 'shipments') {
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

      // Fetch official categories
      const catRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/category/all`);
      setOfficialCategories(catRes.data.categories || []);

    } catch (err) {
      console.error('Fetch error:', err);
      const status = err.response?.status;
      if (status === 403) alert('Access Denied: Admin role required.');
      else if (status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const imageArray = typeof newProduct.images === 'string' 
        ? newProduct.images.split(/[,\n]/).map(url => url.trim()).filter(url => url.length > 0)
        : (editingProduct?.images || []);

      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        discount: Number(newProduct.discount) || 0,
        images: imageArray
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
      setNewProduct({ name: '', price: '', category: '', stock: '', description: '', images: '', brand: '', sku: '', discount: '', sizes: [] });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
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

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gear?')) return;
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

  const handleEdit = (p) => {
    setEditingProduct(p);
    setNewProduct({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock,
      description: p.description || '',
      brand: p.brand || '',
      sku: p.sku || '',
      discount: p.discount || 0,
      images: p.images?.join(', ') || '',
      sizes: p.sizes || []
    });
    setShowAddModal(true);
  };

  const [officialCategories, setOfficialCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '' });

  const handleCategoryEdit = (cat) => {
    setEditingCategory(cat);
    setNewCategory({ name: cat.name, description: cat.description || '', image: cat.image });
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingCategory) {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/category/${editingCategory._id}`, newCategory, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/category/add`, newCategory, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setNewCategory({ name: '', description: '', image: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete');
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
          <SidebarItem icon={Truck} label="Order Inventory" active={activeTab === 'shipments'} onClick={() => setActiveTab('shipments')} />
          <SidebarItem icon={Heart} label="Secured Wishlist" active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} />
          <SidebarItem icon={CreditCard} label="Saved Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <SidebarItem icon={BellRing} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} badge={4} />
          
          <div className="my-6 border-t border-slate-100 dark:border-white/5 opacity-50" />
          
          <SidebarItem icon={Package} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <SidebarItem icon={Filter} label="Categories" active={activeTab === 'admin_categories'} onClick={() => setActiveTab('admin_categories')} />
          <SidebarItem icon={Users} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          <SidebarItem icon={ShoppingBag} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        </nav>

        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-white/5 space-y-2">
          <SidebarItem icon={HelpCircle} label="Help" active={activeTab === 'help'} onClick={() => setActiveTab('help')} />
          <SidebarItem icon={LogOut} label="Logout" onClick={() => { localStorage.clear(); navigate('/login'); }} />
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-10 py-6 sticky top-0 z-50 flex justify-between items-center">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 w-full max-w-md">
            <Search size={18} className="text-slate-900" />
            <input placeholder="Search records..." className="bg-transparent outline-none text-sm font-black text-slate-900 dark:text-white w-full placeholder:text-slate-400" />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-900 hover:text-[#FF4C3B] transition-colors" onClick={() => setActiveTab('notifications')}>
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4C3B] rounded-full"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-white/5">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Admin</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">Rupa Prajapati</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white shadow-xl" />
            </div>
          </div>
        </header>

        <main className="p-10 flex-1">
          
          <AnimatePresence mode="wait">
            {/* ── Dashboard (Home) ── */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">System Terminal</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Central Operation Center</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} trend={12} icon={DollarSign} color="text-green-500" />
                  <StatCard label="Active Orders" value={orders.length} trend={8} icon={Truck} color="text-blue-500" />
                  <StatCard label="Global Fans" value={customers.length} trend={4} icon={Heart} color="text-[#FF4C3B]" />
                  <StatCard label="Live Stock" value={products.length} trend={5} icon={Package} color="text-orange-500" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                      <Settings className="text-[#FF4C3B]" size={20} /> Management Modules
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <ActionRow icon={Package} title="Order Inventory" subtitle="TRACK YOUR SHIPMENTS" onClick={() => setActiveTab('shipments')} />
                      <ActionRow icon={Heart} title="Secured Wishlist" subtitle="CURATED COLLECTION" onClick={() => setActiveTab('wishlist')} />
                      <ActionRow icon={CreditCard} title="Saved Payments" subtitle="MANAGE METHODS" onClick={() => setActiveTab('payments')} />
                      <ActionRow icon={BellRing} title="Notification Center" subtitle="SYSTEM ALERTS" onClick={() => setActiveTab('notifications')} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#111] rounded-[3.5rem] p-10 border border-slate-200 dark:border-white/5 shadow-2xl shadow-black/5">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">System Traffic</h3>
                    <div className="h-[250px] flex items-end justify-between gap-3">
                      {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#FF4C3B]/10 rounded-xl relative overflow-hidden group">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-[#FF4C3B] group-hover:bg-black transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Order Inventory (Shipments) ── */}
            {activeTab === 'shipments' && (
              <motion.div key="shipments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                 <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Shipment Logistics</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Order Inventory & Fulfillment</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {orders.map(o => (
                    <div key={o._id} className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex justify-between items-center group hover:border-[#FF4C3B] transition-all">
                       <div className="flex gap-6 items-center">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#FF4C3B]">
                             <Truck size={28} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-[#FF4C3B] uppercase tracking-widest">#{o._id.slice(-8).toUpperCase()}</p>
                             <h4 className="text-lg font-black text-slate-900 dark:text-white">{o.shippingDetails?.city}</h4>
                             <p className="text-xs font-black text-slate-400 mt-1">{o.shippingDetails?.firstName} {o.shippingDetails?.lastName}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${o.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>{o.status}</span>
                          <p className="text-[10px] font-black text-slate-400 uppercase mt-4 tracking-tighter">{new Date(o.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Secured Wishlist ── */}
            {activeTab === 'wishlist' && (
              <motion.div key="wishlist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                 <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Global Desires</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Secured Wishlist Analytics</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                   {products.slice(0, 6).map((p, i) => (
                     <div key={i} className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-white/5 p-4">
                           <img src={getProductImage(p)} className="w-full h-full object-contain" />
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900 dark:text-white text-sm">{p.name}</h4>
                           <p className="text-[10px] font-black text-[#FF4C3B] uppercase mt-1 tracking-widest">{Math.floor(Math.random() * 500)} Global Saves</p>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {/* ── Saved Payments ── */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                 <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Transaction Methods</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Manage Payment Infrastructure</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                     { method: 'Card Protocol', active: true, usage: '85%' },
                     { method: 'COD System', active: true, usage: '15%' },
                     { method: 'UPI Gateway', active: false, usage: '0%' },
                     { method: 'Crypto Ledger', active: false, usage: '0%' }
                   ].map((m, i) => (
                     <div key={i} className={`p-10 rounded-[3.5rem] border ${m.active ? 'bg-white dark:bg-[#111] border-[#FF4C3B]' : 'bg-slate-50 dark:bg-white/5 border-slate-200 opacity-50'}`}>
                        <div className="flex justify-between items-start mb-6">
                           <CreditCard size={32} className={m.active ? 'text-[#FF4C3B]' : 'text-slate-300'} />
                           <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${m.active ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>{m.active ? 'Operational' : 'Offline'}</span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{m.method}</h4>
                        <div className="flex items-end gap-4 mt-8">
                           <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#FF4C3B]" style={{ width: m.usage }} />
                           </div>
                           <span className="text-[10px] font-black text-slate-900 uppercase">{m.usage} Load</span>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {/* ── Notification Center ── */}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                 <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">System Pulse</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Notification Center & Alerts</p>
                  </div>
                </div>
                <div className="space-y-4">
                   {[
                     { type: 'order', msg: 'New Order Received from Rupa Prajapati', time: '2 mins ago' },
                     { type: 'stock', msg: 'Inventory Low: Product "Smart Watch" under 10 units', time: '1 hour ago' },
                     { type: 'system', msg: 'Database Backup Completed Successfully', time: '4 hours ago' },
                     { type: 'user', msg: 'New User Registered: subham_kmart', time: 'Yesterday' }
                   ].map((n, i) => (
                     <div key={i} className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-6 group hover:border-[#FF4C3B] transition-all">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#FF4C3B]">
                           <BellRing size={20} />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-black text-slate-900 dark:text-white">{n.msg}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{n.time}</p>
                        </div>
                        <button className="text-slate-300 hover:text-red-500 transition-colors"><X size={18} /></button>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {/* ── Categories Management ── */}
            {activeTab === 'admin_categories' && (
              <motion.div key="admin_categories" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                 <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Segment Architecture</h2>
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Manage Store Categories</p>
                  </div>
                  <button onClick={() => setShowCategoryModal(true)} className="px-8 py-4 bg-[#FF4C3B] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                    <Plus size={18} /> New Category
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {officialCategories.map(cat => (
                    <div key={cat._id} className="bg-white dark:bg-[#111] p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 group hover:border-[#FF4C3B] transition-all">
                       <div className="aspect-square rounded-3xl bg-slate-50 dark:bg-white/5 overflow-hidden mb-6">
                          <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                       </div>
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="font-black text-slate-900 dark:text-white capitalize">{cat.name}</h4>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: Active</p>
                          </div>
                          <div className="flex gap-1">
                             <button onClick={() => handleCategoryEdit(cat)} className="p-2 text-slate-300 hover:text-[#FF4C3B] transition-colors">
                                <Edit3 size={16} />
                             </button>
                             <button onClick={() => deleteCategory(cat._id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Other Tabs (Standard Table Views) ── */}
            {(activeTab === 'products' || activeTab === 'customers' || activeTab === 'orders') && (
               <div className="space-y-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{activeTab}</h2>
                      <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">Manage your core entities</p>
                    </div>
                    {activeTab === 'products' && (
                      <button onClick={() => setShowAddModal(true)} className="px-8 py-4 bg-[#FF4C3B] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                        <Plus size={18} /> New Entry
                      </button>
                    )}
                  </div>

                  <div className="bg-white dark:bg-[#111] rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                       {/* Table implementation same as before... shortened for clarity but functional */}
                       <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200">
                         <tr>
                            {activeTab === 'products' ? (
                              <>
                                <th className="px-10 py-6">Gear</th>
                                <th className="px-10 py-6">Pricing</th>
                                <th className="px-10 py-6">Stock</th>
                                <th className="px-10 py-6 text-right">Action</th>
                              </>
                            ) : activeTab === 'orders' ? (
                              <>
                                <th className="px-10 py-6">Order ID</th>
                                <th className="px-10 py-6">Customer</th>
                                <th className="px-10 py-6">Amount</th>
                                <th className="px-10 py-6">Payment</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Update</th>
                              </>
                            ) : (
                              <>
                                <th className="px-10 py-6">Customer</th>
                                <th className="px-10 py-6">Contact</th>
                                <th className="px-10 py-6">Role</th>
                                <th className="px-10 py-6 text-right">Action</th>
                              </>
                            )}
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {activeTab === 'products' ? products.map(p => (
                            <tr key={p._id} className="hover:bg-slate-50 transition-all">
                               <td className="px-10 py-6 flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-slate-50 p-2"><img src={getProductImage(p)} className="w-full h-full object-contain" /></div>
                                  <span className="text-sm font-black text-slate-900">{p.name}</span>
                               </td>
                               <td className="px-10 py-6 font-black">₹{p.price.toLocaleString()}</td>
                               <td className="px-10 py-6 font-black">{p.stock} units</td>
                               <td className="px-10 py-6 text-right flex justify-end gap-2">
                                  <button onClick={() => handleEdit(p)} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl hover:text-[#FF4C3B] transition-colors">
                                     <Edit3 size={18} />
                                  </button>
                                  <button onClick={() => deleteProduct(p._id)} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl hover:text-red-500 transition-colors">
                                     <Trash2 size={18} />
                                  </button>
                               </td>
                            </tr>
                          )) : activeTab === 'orders' ? orders.map(o => (
                            <tr key={o._id} className="hover:bg-slate-50 transition-all">
                               <td className="px-10 py-6 font-mono text-[10px] text-[#FF4C3B] font-black">#{o._id.slice(-8).toUpperCase()}</td>
                               <td className="px-10 py-6 text-sm font-black">{o.shippingDetails?.firstName}</td>
                               <td className="px-10 py-6 text-sm font-black">₹{(o.totalbill || o.totalAmount)?.toLocaleString()}</td>
                               <td className="px-10 py-6">
                                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${o.paymentStatus === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-100 text-yellow-600'}`}>{o.paymentStatus || 'pending'}</span>
                               </td>
                               <td className="px-10 py-6"><span className="text-[10px] font-black uppercase">{o.status}</span></td>
                               <td className="px-10 py-6 text-right">
                                  <select value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)} className="bg-slate-50 border-none outline-none text-[10px] font-black uppercase">
                                     <option value="pending">Pending</option>
                                     <option value="processing">Processing</option>
                                     <option value="shipped">Shipped</option>
                                     <option value="delivered">Delivered</option>
                                  </select>
                               </td>
                            </tr>
                          )) : customers.map(u => (
                            <tr key={u._id} className="hover:bg-slate-50 transition-all">
                               <td className="px-10 py-6 font-black">{u.username}</td>
                               <td className="px-10 py-6 text-xs">{u.email}</td>
                               <td className="px-10 py-6 font-black uppercase text-[10px]">{u.role}</td>
                               <td className="px-10 py-6 text-right"><button className="p-3 bg-slate-50 rounded-xl hover:text-red-500"><Trash2 size={18} /></button></td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Price (₹)</label>
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
                    {officialCategories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
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
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Image URLs (comma separated)</label>
                  <textarea rows={2} required value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="col-span-2 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Select Available Sizes</label>
                  <div className="flex flex-wrap gap-3">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <button 
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newProduct.sizes.includes(size) ? 'bg-black text-white' : 'bg-slate-50 text-slate-500'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Description</label>
                  <textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
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
      {/* ── Category Modal ── */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCategoryModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} className="relative w-full max-w-lg bg-white dark:bg-[#111] rounded-[3rem] p-12 shadow-2xl border border-slate-200 dark:border-white/5">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Add <span className="text-[#FF4C3B]">Category</span></h2>
                <button onClick={() => setShowCategoryModal(false)} className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-900 hover:text-red-500 transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleCategorySubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Category Name</label>
                  <input required type="text" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Image URL</label>
                  <input type="text" value={newCategory.image} onChange={e => setNewCategory({...newCategory, image: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Description</label>
                  <textarea rows={3} value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
                </div>
                <button type="submit" className="w-full bg-[#FF4C3B] text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FF4C3B]/20 hover:bg-black transition-all">Create Category</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
