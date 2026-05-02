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
  Heart, CreditCard, BellRing, ChevronRight, Truck, Clock
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
  // ── States ──
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Edit States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', category: '', stock: '', description: '', 
    images: '', brand: '', sku: '', discount: '', sizes: [] 
  });
  
  const [officialCategories, setOfficialCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '' });

  // Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();

  // ── Logic ──

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

  const filteredOrders = orders.filter(o => {
    const custName = `${o.shippingDetails?.firstName || ''} ${o.shippingDetails?.lastName || ''}`.toLowerCase();
    const matchesSearch = o._id.toLowerCase().includes(orderSearch.toLowerCase()) || custName.includes(orderSearch.toLowerCase());
    const matchesPayment = paymentFilter === 'All' || (o.paymentStatus === 'completed' && paymentFilter === 'Paid') || (o.paymentStatus !== 'completed' && paymentFilter === 'Pending');
    const matchesStatus = statusFilter === 'All' || o.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesPayment && matchesStatus;
  });

  const generateChartPath = (isProfit) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map((_, i) => {
      const monthOrders = orders.filter(o => new Date(o.createdAt).getMonth() === i);
      const revenue = monthOrders.reduce((acc, o) => acc + (o.totalbill || o.totalAmount || 0), 0);
      return isProfit ? revenue * 0.35 : revenue; 
    });
    const max = Math.max(...data, 10000);
    return data.map((val, i) => `${(i / 11) * 1000},${250 - (val / max) * 200}`).join(' L ');
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
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this taxonomy?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setNewCategory({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || ''
    });
    setShowCategoryModal(true);
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
          <SidebarItem icon={ShoppingBag} label="Catalog" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <SidebarItem icon={Package} label="Order Management" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={Users} label="Global Users" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          
          <div className="my-8 h-[1px] bg-slate-100 dark:bg-white/5 mx-2" />
          
          <SidebarItem icon={TrendingUp} label="Income" active={activeTab === 'income'} onClick={() => setActiveTab('income')} />
          <SidebarItem icon={Truck} label="Logistics" active={activeTab === 'shipments'} onClick={() => setActiveTab('shipments')} />
          <SidebarItem icon={Plus} label="Quick Category" active={activeTab === 'admin_categories'} onClick={() => setActiveTab('admin_categories')} />
        </nav>

        <div className="mt-auto pt-8">
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="w-full group flex items-center gap-4 px-6 py-4 rounded-[2rem] bg-slate-50 dark:bg-white/5 hover:bg-black transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center text-slate-400 group-hover:text-red-500">
              <LogOut size={18} />
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-white uppercase tracking-widest">Log Out</span>
          </button>
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
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-white/5">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Admin</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">Rupali Prajapati</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white shadow-xl" />
            </div>
          </div>
        </header>

        <main className="p-10 flex-1">
          
          <AnimatePresence mode="wait">
            {/* ── Dashboard (Home) ── */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
                {/* Personalized Command Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                      Strategic <span className="text-[#FF4C3B]">Hub</span>
                    </h2>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em]">System Online • Greetings, Rupali</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mt-1">12:30 PM</p>
                  </div>
                </div>

                {/* Performance Summary Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-black rounded-[3rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4C3B] opacity-10 blur-[100px] -mr-32 -mt-32" />
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                          <TrendingUp size={24} className="text-[#FF4C3B]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Performance Overview</span>
                      </div>
                      <h3 className="text-4xl font-black tracking-tighter leading-tight">Your ecosystem is performing <br/><span className="text-[#FF4C3B]">35% better</span> than last month.</h3>
                      <div className="flex gap-10 pt-4">
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Revenue</p>
                          <p className="text-2xl font-black mt-1">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Orders</p>
                          <p className="text-2xl font-black mt-1">{orders.filter(o => o.status !== 'delivered').length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-[#111] border border-slate-100 dark:border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Quick Actions</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic Shortcuts</p>
                    </div>
                    <div className="space-y-3 mt-8">
                      <button onClick={() => setShowAddModal(true)} className="w-full py-4 bg-[#FF4C3B] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">New Inventory</button>
                      <button onClick={() => setShowCategoryModal(true)} className="w-full py-4 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">New Category</button>
                    </div>
                  </div>
                </div>

                {/* Core Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Volume', value: orders.length.toLocaleString(), color: 'bg-blue-50 text-blue-600', icon: Package },
                      { label: 'Unpaid Flow', value: orders.filter(o => o.paymentStatus !== 'completed').length.toLocaleString(), color: 'bg-amber-50 text-amber-600', icon: Clock },
                      { label: 'Logistics', value: orders.filter(o => o.status === 'shipped').length.toLocaleString(), color: 'bg-indigo-50 text-indigo-600', icon: Truck },
                      { label: 'Success Rate', value: '98.2%', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
                    ].map((s, i) => (
                      <div key={i} className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all group">
                         <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <s.icon size={24} strokeWidth={2} />
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                         <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter">{s.value}</h4>
                      </div>
                    ))}
                 </div>

                 {/* Financial Visualization */}
                 <div className="bg-white dark:bg-[#111] p-12 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-sm space-y-10">
                    <div className="flex justify-between items-center">
                       <div>
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Unified Financial Stream</h3>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Revenue & Profit Projection</p>
                       </div>
                       <div className="flex gap-6">
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <div className="w-3 h-3 rounded-full bg-teal-500" /> Revenue
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <div className="w-3 h-3 rounded-full bg-[#FF4C3B]" /> Net Profit
                          </div>
                       </div>
                    </div>
                    
                    <div className="h-[300px] w-full relative pt-10">
                       <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible">
                          {[0, 1, 2, 3].map(i => (
                            <line key={i} x1="0" y1={i * 100} x2="1000" y2={i * 100} stroke="currentColor" className="text-slate-100 dark:text-white/5" strokeWidth="1" />
                          ))}
                          <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} d={`M ${generateChartPath(false)}`} fill="none" stroke="#14b8a6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                          <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} d={`M ${generateChartPath(true)}`} fill="none" stroke="#FF4C3B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                       <div className="flex justify-between mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
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

            {/* ── Specialized Orders Section ── */}
            {activeTab === 'orders' && (
              <motion.div key="orders_redesign" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Total Orders</h2>
                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all">Export</button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Order', value: orders.length.toLocaleString(), color: 'bg-[#d0e2ff]', icon: Package, iconColor: 'text-[#002d9c]' },
                      { label: 'Pending Payment', value: orders.filter(o => o.paymentStatus !== 'completed').length.toLocaleString(), color: 'bg-[#fff3bf]', icon: Clock, iconColor: 'text-[#855d00]' },
                      { label: 'Processing', value: orders.filter(o => o.status === 'processing').length.toLocaleString(), color: 'bg-[#c3fae8]', icon: Activity, iconColor: 'text-[#087f5b]' },
                      { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length.toLocaleString(), color: 'bg-[#ffe8cc]', icon: Truck, iconColor: 'text-[#d9480f]' },
                      { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length.toLocaleString(), color: 'bg-[#ffdeeb]', icon: CheckCircle2, iconColor: 'text-[#a61e4d]' },
                      { label: 'Cancel', value: orders.filter(o => o.status === 'cancelled').length.toLocaleString(), color: 'bg-[#ffd8a8]', icon: X, iconColor: 'text-[#d9480f]' },
                      { label: 'Returned', value: orders.filter(o => o.status === 'returned').length.toLocaleString(), color: 'bg-[#d3f9d8]', icon: ShoppingCart, iconColor: 'text-[#2b8a3e]' },
                      { label: 'Failed', value: orders.filter(o => o.status === 'failed').length.toLocaleString(), color: 'bg-[#d0ebff]', icon: AlertCircle, iconColor: 'text-[#1864ab]' },
                    ].map((s, i) => (
                      <div key={i} className={`${s.color} p-6 rounded-xl flex items-center gap-6 border border-white/10 shadow-sm transition-all`}>
                         <div className="w-14 h-14 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                            <s.icon className={s.iconColor} size={24} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-900/60 uppercase tracking-widest">{s.label}</p>
                            <h4 className="text-2xl font-bold text-slate-900 mt-1">{s.value}</h4>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
                    <div className="flex justify-between items-center">
                       <h3 className="text-xl font-black text-slate-900 dark:text-white">Profit margin</h3>
                       <div className="flex gap-4">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <div className="w-3 h-3 rounded-full bg-teal-500" /> Earnings
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <div className="w-3 h-3 rounded-full bg-orange-400" /> Total Profits
                          </div>
                       </div>
                    </div>
                    
                    <div className="h-[300px] w-full relative pt-10">
                       <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible">
                          {[0, 1, 2, 3].map(i => (
                            <line key={i} x1="0" y1={i * 100} x2="1000" y2={i * 100} stroke="currentColor" className="text-slate-100 dark:text-white/5" strokeWidth="1" />
                          ))}
                          <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d={`M ${generateChartPath(false)}`} fill="none" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d={`M ${generateChartPath(true)}`} fill="none" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                       <div className="flex justify-between mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
                       </div>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-[#111] rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                       <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-slate-200 w-full max-w-sm">
                          <Search size={16} className="text-slate-400" />
                          <input 
                            placeholder="Search ID or Customer..." 
                            value={orderSearch}
                            onChange={(e) => setOrderSearch(e.target.value)}
                            className="bg-transparent outline-none text-xs font-black w-full" 
                          />
                       </div>
                       <div className="flex gap-3">
                          <select 
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                          >
                            <option value="All">All Payments</option>
                            <option value="completed">Paid</option>
                            <option value="pending">Pending</option>
                          </select>
                          <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                          >
                            <option value="All">All Statuses</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                       </div>
                    </div>
                    <table className="w-full text-left">
                       <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">
                         <tr>
                            <th className="px-6 py-6"><input type="checkbox" className="rounded" /></th>
                            <th className="px-10 py-6">ID</th>
                            <th className="px-10 py-6">Customer</th>
                            <th className="px-10 py-6">Items</th>
                            <th className="px-10 py-6">Amount</th>
                            <th className="px-10 py-6">Payment status</th>
                            <th className="px-10 py-6">Received status</th>
                            <th className="px-10 py-6">Date</th>
                            <th className="px-10 py-6 text-right">Action</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {filteredOrders.map(o => (
                            <tr key={o._id} className="hover:bg-slate-50 transition-all">
                               <td className="px-6 py-6"><input type="checkbox" className="rounded" /></td>
                               <td className="px-10 py-6 font-mono text-[10px] text-slate-500 font-black">#{o._id.slice(-8).toUpperCase()}</td>
                               <td className="px-10 py-6 text-sm font-black">{o.shippingDetails?.firstName} {o.shippingDetails?.lastName}</td>
                               <td className="px-10 py-6 text-xs font-black text-slate-400">{o.items.length} pcs</td>
                               <td className="px-10 py-6 text-sm font-black text-slate-900">₹{(o.totalbill || o.totalAmount)?.toLocaleString()}</td>
                               <td className="px-10 py-6">
                                  <span className={`text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest border ${
                                    o.paymentStatus === 'completed' 
                                      ? 'bg-[#e6fcf5] text-[#0ca678] border-[#c3fae8]' 
                                      : 'bg-[#fff9db] text-[#f08c00] border-[#fff3bf]'
                                  }`}>
                                     {o.paymentStatus === 'completed' ? 'paid' : 'pending'}
                                  </span>
                               </td>
                               <td className="px-10 py-6">
                                  <span className={`text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest border ${
                                    o.status === 'delivered' 
                                      ? 'bg-[#ebfbee] text-[#2b8a3e] border-[#d3f9d8]' 
                                      : o.status === 'processing'
                                      ? 'bg-[#fff4e6] text-[#e67700] border-[#ffe8cc]'
                                      : 'bg-slate-50 text-slate-400 border-slate-100'
                                  }`}>
                                     {o.status}
                                  </span>
                               </td>
                               <td className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase">{new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                               <td className="px-10 py-6 text-right">
                                  <button className="p-3 text-slate-400 hover:text-[#FF4C3B] transition-colors">
                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                  </button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </motion.div>
            )}

            {/* ── Catalog Management ── */}
            {(activeTab === 'products' || activeTab === 'customers') && (
              <div className="space-y-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{activeTab === 'products' ? 'Inventory' : 'Clientele'}</h2>
                      <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mt-2">{activeTab === 'products' ? 'Product Catalog Management' : 'User Database & Access Control'}</p>
                    </div>
                    {activeTab === 'products' && (
                      <button onClick={() => { setEditingProduct(null); setShowAddModal(true); }} className="px-8 py-4 bg-[#FF4C3B] text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-[#FF4C3B]/20 hover:bg-black transition-all flex items-center gap-3">
                        <Plus size={18} /> Add New Gear
                      </button>
                    )}
                  </div>

                  <div className="bg-white dark:bg-[#111] rounded-[3.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl shadow-black/5">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200">
                         <tr>
                            {activeTab === 'products' ? (
                               <>
                                 <th className="px-10 py-6">Gear</th>
                                 <th className="px-10 py-6">Pricing</th>
                                 <th className="px-10 py-6">Stock</th>
                                 <th className="px-10 py-6 text-right">Action</th>
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

            {/* ── Infrastructure (Payments) ── */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="flex justify-between items-end">
                   <div className="space-y-2">
                     <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Infrastructure</h2>
                     <p className="text-[#FF4C3B] font-black text-[11px] uppercase tracking-[0.4em]">Manage Payment Gateway Status</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {[
                     { method: 'Card Protocol', active: true, usage: '85%', icon: CreditCard },
                     { method: 'COD System', active: true, usage: '15%', icon: Truck },
                     { method: 'UPI Gateway', active: false, usage: '0%', icon: Zap },
                     { method: 'Crypto Ledger', active: false, usage: '0%', icon: Rocket }
                   ].map((m, i) => (
                     <div key={i} className={`p-12 rounded-[4rem] border-2 ${m.active ? 'bg-white border-[#FF4C3B]/20 shadow-2xl' : 'bg-slate-50 opacity-60'}`}>
                        <div className="flex justify-between items-start mb-10">
                           <div className={`p-5 rounded-3xl ${m.active ? 'bg-[#FF4C3B] text-white shadow-xl' : 'bg-slate-200 text-slate-400'}`}><m.icon size={32} /></div>
                           <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border ${m.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100'}`}>{m.active ? 'Operational' : 'Offline'}</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 mb-2">{m.method}</h4>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mt-10"><div className={`h-full ${m.active ? 'bg-[#FF4C3B]' : 'bg-slate-300'}`} style={{ width: m.usage }} /></div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {/* ── Quick Category Management ── */}
            {activeTab === 'admin_categories' && (
              <motion.div key="admin_categories" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                 <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Category <span className="text-[#FF4C3B]">Library</span></h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Manage Global Taxonomy Collections</p>
                    </div>
                    <button onClick={() => { setEditingCategory(null); setNewCategory({ name: '', description: '', image: '' }); setShowCategoryModal(true); }} className="px-10 py-5 bg-[#FF4C3B] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#FF4C3B]/20 hover:bg-black transition-all flex items-center gap-3 group">
                      <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Add New Taxonomy
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {officialCategories.map(cat => (
                      <motion.div 
                        key={cat._id}
                        whileHover={{ y: -10 }}
                        className="bg-white dark:bg-[#111] rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all relative group"
                      >
                         {/* Full-Bleed Image Header */}
                         <div className="h-64 overflow-hidden relative">
                            <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            
                            {/* Action Overlays */}
                            <div className="absolute top-6 right-6 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                               <button onClick={() => handleEditCategory(cat)} className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 hover:text-[#FF4C3B] shadow-lg transition-colors">
                                  <Edit3 size={18} />
                               </button>
                               <button onClick={() => deleteCategory(cat._id)} className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 hover:text-red-500 shadow-lg transition-colors">
                                  <Trash2 size={18} />
                               </button>
                            </div>
                         </div>

                         {/* Content Section (Hotel Style) */}
                         <div className="p-8 space-y-4">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{cat.name}</h3>
                            
                            {/* Static Rating (For Aesthetic) */}
                            <div className="flex items-center gap-1.5">
                               {[1, 2, 3].map(s => <Star key={s} size={14} className="fill-black text-black dark:fill-white dark:text-white" />)}
                            </div>
                            
                            <p className="text-slate-400 font-bold text-sm line-clamp-2">{cat.description || 'Global collection of premium tools and accessories for professional workflows.'}</p>
                            
                            <div className="pt-4 border-t border-slate-50 dark:border-white/5 flex justify-end items-center">
                               <ChevronRight size={18} className="text-slate-300" />
                            </div>
                         </div>
                      </motion.div>
                    ))}
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Images (URLs, comma separated)</label>
                  <input type="text" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20 transition-all" />
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
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{editingCategory ? 'Edit' : 'Add'} <span className="text-[#FF4C3B]">Category</span></h2>
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
                <button type="submit" className="w-full bg-[#FF4C3B] text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FF4C3B]/20 hover:bg-black transition-all">
                  {editingCategory ? 'Update Taxonomy' : 'Create Category'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
