import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
 const [products, setProducts] = useState([]);
 const [orders, setOrders] = useState([]);
 const [activeTab, setActiveTab] = useState('products');
 const [loading, setLoading] = useState(true);
 const [showAddModal, setShowAddModal] = useState(false);
 const [showEditModal, setShowEditModal] = useState(false);
 const [editingProduct, setEditingProduct] = useState(null);

 useEffect(() => {
 fetchProducts();
 }, []);

 const fetchProducts = async () => {
 try {
 setLoading(true);
 const token = localStorage.getItem('token');
 const prodRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/product/all`);
 setProducts(prodRes.data.products);
 
 const orderRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/orders`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setOrders(orderRes.data.orders || []);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const handleCreateProduct = async (e) => {
 e.preventDefault();
 const formData = new FormData(e.target);
 
 try {
 const token = localStorage.getItem('token');
 await axios.post(`${import.meta.env.VITE_BASE_URL}/product/add`, formData, {
 headers: { 
 'Content-Type': 'multipart/form-data',
 'Authorization': `Bearer ${token}`
 }
 });
 setShowAddModal(false);
 fetchProducts();
 alert('Product created successfully!');
 } catch (err) {
 console.error(err);
 alert(err.response?.data?.message || 'Failed to create product');
 }
 };

 const handleUpdateProduct = async (e) => {
 e.preventDefault();
 const formData = new FormData(e.target);
 
 try {
 const token = localStorage.getItem('token');
 await axios.put(`${import.meta.env.VITE_BASE_URL}/product/${editingProduct._id}`, formData, {
 headers: { 
 'Content-Type': 'multipart/form-data',
 'Authorization': `Bearer ${token}`
 }
 });
 setShowEditModal(false);
 setEditingProduct(null);
 fetchProducts();
 alert('Product updated successfully!');
 } catch (err) {
 console.error(err);
 alert(err.response?.data?.message || 'Failed to update product');
 }
 };

 const handleDeleteProduct = async (productId) => {
 if (!window.confirm('Are you sure you want to delete this product?')) return;
 
 try {
 const token = localStorage.getItem('token');
 await axios.delete(`${import.meta.env.VITE_BASE_URL}/product/${productId}`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 fetchProducts();
 alert('Product deleted successfully!');
 } catch (err) {
 console.error(err);
 alert('Failed to delete product');
 }
 };

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

 const updateOrderStatus = async (orderId, newStatus) => {
 try {
 const token = localStorage.getItem('token');
 await axios.put(`${import.meta.env.VITE_BASE_URL}/order/status/${orderId}`, 
 { status: newStatus },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 
 // Refresh orders
 const orderRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/orders`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setOrders(orderRes.data.orders || []);
 alert(`Order status updated to ${newStatus}`);
 } catch (err) {
 console.error(err);
 alert('Failed to update order status');
 }
 };

 return (
 <div className="min-h-screen bg-[#0A0A0A] text-slate-300 flex font-sans">
 {/* Sidebar */}
 <div className="w-72 border-r border-white/5 p-8 flex flex-col gap-12 bg-[#000]">
 <Link to="/" className="text-3xl font-normal text-white shrink-0 capitalize">
 <span className="text-[#FF4C3B]">Multi</span>kart <span className="text-[10px] capitalize tracking-[0.3em] bg-[#FF4C3B] px-3 py-1 rounded-sm ml-2 text-white">Pro</span>
 </Link>
 
 <nav className="flex flex-col gap-3">
 <button 
 onClick={() => setActiveTab('products')} 
 className={`flex items-center gap-4 px-6 py-4 rounded-sm text-[11px] font-normal capitalize tracking-[0.2em] transition-all ${activeTab === 'products' ? 'bg-[#FF4C3B] text-white shadow-lg shadow-[#FF4C3B]/20' : 'hover:bg-white/5 text-slate-500 hover:text-white'}`}
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
 </svg>
 Inventory
 </button>
 <button 
 onClick={() => setActiveTab('orders')} 
 className={`flex items-center gap-4 px-6 py-4 rounded-sm text-[11px] font-normal capitalize tracking-[0.2em] transition-all ${activeTab === 'orders' ? 'bg-[#FF4C3B] text-white shadow-lg shadow-[#FF4C3B]/20' : 'hover:bg-white/5 text-slate-500 hover:text-white'}`}
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
 </svg>
 Shipments
 </button>
 </nav>

 <div className="mt-auto pt-8 border-t border-white/5">
 <Link to="/" className="text-[10px] font-normal capitalize tracking-[0.3em] text-slate-500 hover:text-[#FF4C3B] flex items-center gap-3 transition-all">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
 </svg>
 View Live Store
 </Link>
 </div>
 </div>

 {/* Main Content */}
 <div className="flex-1 p-16 overflow-y-auto">
 {loading ? (
 <div className="h-full flex items-center justify-center">
 <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-[#FF4C3B]"></div>
 </div>
 ) : activeTab === 'products' ? (
 <div className="space-y-12 animate-fadeIn">
 <div className="flex justify-between items-end border-b border-white/5 pb-10">
 <div>
 <h1 className="text-5xl font-normal text-white capitalize ">Control Panel</h1>
 <p className="text-[11px] text-slate-500 font-normal capitalize tracking-[0.3em] mt-4">Manage professional grade inventory and pricing</p>
 </div>
 <button 
 onClick={() => setShowAddModal(true)}
 className="bg-[#FF4C3B] text-white px-10 py-4 rounded-sm text-[11px] font-normal capitalize tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-[#FF4C3B]/20"
 >
 Insert New Product
 </button>
 </div>

 {/* Add Product Modal */}
 {showAddModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
 <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-sm p-12 max-h-[90vh] overflow-y-auto shadow-2xl">
 <div className="flex justify-between items-center mb-12">
 <h2 className="text-3xl font-normal text-white capitalize ">Product Registration</h2>
 <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 <form onSubmit={handleCreateProduct} className="space-y-8">
 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Product Designation</label>
 <input type="text" name="name" required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] focus:bg-white/10 transition-all capitalize" />
 </div>
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Serial SKU</label>
 <input type="text" name="sku" required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] focus:bg-white/10 transition-all" />
 </div>
 </div>

 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Technical Overview</label>
 <textarea name="description" rows="4" required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] focus:bg-white/10 transition-all resize-none leading-relaxed"></textarea>
 </div>

 <div className="grid grid-cols-3 gap-8">
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">MSRP ($)</label>
 <input type="number" step="0.01" name="price" required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] focus:bg-white/10 transition-all" />
 </div>
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Rebate (%)</label>
 <input type="number" name="discount" defaultValue="0" className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] focus:bg-white/10 transition-all" />
 </div>
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Stock Unit</label>
 <input type="number" name="stock" required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] focus:bg-white/10 transition-all" />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Brand Identity</label>
 <input type="text" name="brand" required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] focus:bg-white/10 transition-all capitalize" />
 </div>
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Sector Category</label>
 <select name="category" required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-[10px] font-normal capitalize text-white focus:outline-none focus:border-[#FF4C3B] transition-all appearance-none cursor-pointer">
 <option value="Phone">Smart Devices</option>
 <option value="Laptop">Computing</option>
 <option value="TV">Visual Media</option>
 <option value="Electrical Items">Power Tools</option>
 <option value="Automotive">Automotive</option>
 <option value="Other">Miscellaneous</option>
 </select>
 </div>
 </div>

 <div className="flex items-center gap-4 py-4 bg-white/5 px-6 rounded-sm">
 <input type="checkbox" name="isNewProduct" id="isNewProduct" defaultChecked className="accent-[#FF4C3B] w-5 h-5" />
 <label htmlFor="isNewProduct" className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-400 cursor-pointer">Deploy as New Arrival</label>
 </div>

 <div className="space-y-4">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Visual Assets</label>
 <input type="file" name="images" multiple accept="image/*" required className="w-full text-[10px] text-slate-500 font-normal capitalize file:mr-6 file:py-3 file:px-8 file:rounded-sm file:border-0 file:text-[10px] file:font-normal file:capitalize file: file:bg-[#FF4C3B] file:text-white hover:file:bg-white hover:file:text-black transition-all cursor-pointer" />
 </div>

 <div className="pt-8 flex gap-6">
 <button type="submit" className="flex-1 bg-[#FF4C3B] text-white py-5 rounded-sm text-[11px] font-normal capitalize tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-[#FF4C3B]/20">
 Commit Product
 </button>
 <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-white/5 text-white py-5 rounded-sm text-[11px] font-normal capitalize tracking-[0.3em] hover:bg-white/10 transition-all border border-white/10">
 Abort
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 <div className="bg-black border border-white/5 rounded-sm overflow-hidden shadow-2xl">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-white/5 text-slate-500 text-[10px] font-normal capitalize tracking-[0.3em]">
 <th className="p-8">Industrial Asset</th>
 <th className="p-8">Serial SKU</th>
 <th className="p-8 text-center">Unit Price</th>
 <th className="p-8 text-center">Inventory Level</th>
 <th className="p-8 text-right">Operations</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {products.map(p => (
 <tr key={p._id} className="hover:bg-white/[0.03] transition-colors group">
 <td className="p-8">
 <div className="flex items-center gap-6">
 <div className="w-16 h-16 bg-white rounded-sm p-2 shadow-inner overflow-hidden flex items-center justify-center">
 <img src={p.images[0]} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
 </div>
 <div>
 <div className="text-sm font-normal text-white capitalize tracking-tight">{p.name}</div>
 <div className="text-[10px] font-normal capitalize tracking-[0.2em] text-[#FF4C3B] mt-1">{p.category}</div>
 </div>
 </div>
 </td>
 <td className="p-8 text-[11px] font-normal text-slate-500 ">{p.sku || 'SERIAL-N/A'}</td>
 <td className="p-8 text-center font-normal text-white text-base">${p.price.toFixed(2)}</td>
 <td className="p-8 text-center">
 <input 
 type="number" 
 defaultValue={p.stock} 
 onBlur={(e) => updateStock(p._id, e.target.value)}
 className={`w-24 bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-center text-xs font-normal focus:outline-none focus:border-[#FF4C3B] transition-all ${p.stock < 10 ? 'text-red-500 bg-red-500/5 border-red-500/20' : 'text-[#FF4C3B]'}`}
 />
 </td>
 <td className="p-8 text-right">
 <div className="flex justify-end gap-6 text-[10px] font-normal capitalize tracking-[0.3em]">
 <button 
 onClick={() => {
 setEditingProduct(p);
 setShowEditModal(true);
 }}
 className="text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
 >
 Update
 </button>
 <button 
 onClick={() => handleDeleteProduct(p._id)}
 className="text-red-500/40 hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-1"
 >
 Purge
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Edit Product Modal */}
 {showEditModal && editingProduct && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
 <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-sm p-12 max-h-[90vh] overflow-y-auto shadow-2xl">
 <div className="flex justify-between items-center mb-12">
 <h2 className="text-3xl font-normal text-white capitalize ">Modify Asset: {editingProduct.name}</h2>
 <button onClick={() => {setShowEditModal(false); setEditingProduct(null);}} className="text-slate-500 hover:text-white transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 <form onSubmit={handleUpdateProduct} className="space-y-8">
 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Asset Name</label>
 <input type="text" name="name" defaultValue={editingProduct.name} required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all capitalize" />
 </div>
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Serial SKU</label>
 <input type="text" name="sku" defaultValue={editingProduct.sku} required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all" />
 </div>
 </div>

 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Technical Specs</label>
 <textarea name="description" rows="4" defaultValue={editingProduct.description} required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all resize-none leading-relaxed"></textarea>
 </div>

 <div className="grid grid-cols-3 gap-8">
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">MSRP ($)</label>
 <input type="number" step="0.01" name="price" defaultValue={editingProduct.price} required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all" />
 </div>
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Rebate (%)</label>
 <input type="number" name="discount" defaultValue={editingProduct.discount} className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all" />
 </div>
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Stock Level</label>
 <input type="number" name="stock" defaultValue={editingProduct.stock} required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all" />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Brand Identity</label>
 <input type="text" name="brand" defaultValue={editingProduct.brand} required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all capitalize" />
 </div>
 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Sector</label>
 <select name="category" defaultValue={editingProduct.category} required className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-[10px] font-normal capitalize text-white focus:outline-none focus:border-[#FF4C3B] transition-all appearance-none cursor-pointer">
 <option value="Phone">Smart Devices</option>
 <option value="Laptop">Computing</option>
 <option value="TV">Visual Media</option>
 <option value="Electrical Items">Power Tools</option>
 <option value="Automotive">Automotive</option>
 <option value="Other">Miscellaneous</option>
 </select>
 </div>
 </div>

 <div className="flex items-center gap-4 py-4 bg-white/5 px-6 rounded-sm">
 <input type="checkbox" name="isNewProduct" id="isNewProductEdit" defaultChecked={editingProduct.isNewProduct} className="accent-[#FF4C3B] w-5 h-5" />
 <label htmlFor="isNewProductEdit" className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-400 cursor-pointer">Mark as Featured New</label>
 </div>

 <div className="space-y-4">
 <label className="text-[11px] font-normal capitalize tracking-[0.2em] text-slate-500 ml-1">Visual Remapping (Optional)</label>
 <input type="file" name="images" multiple accept="image/*" className="w-full text-[10px] text-slate-500 font-normal capitalize file:mr-6 file:py-3 file:px-8 file:rounded-sm file:border-0 file:text-[10px] file:font-normal file:capitalize file: file:bg-white/10 file:text-white hover:file:bg-[#FF4C3B] transition-all cursor-pointer" />
 <p className="text-[10px] text-slate-600 italic font-bold capitalize ">Null selection preserves existing assets</p>
 </div>

 <div className="pt-8 flex gap-6">
 <button type="submit" className="flex-1 bg-[#FF4C3B] text-white py-5 rounded-sm text-[11px] font-normal capitalize tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-[#FF4C3B]/20">
 Finalize Update
 </button>
 <button type="button" onClick={() => {setShowEditModal(false); setEditingProduct(null);}} className="flex-1 bg-white/5 text-white py-5 rounded-sm text-[11px] font-normal capitalize tracking-[0.3em] hover:bg-white/10 transition-all border border-white/10">
 Discard
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 ) : (
 <div className="space-y-12 animate-fadeIn">
 <div className="border-b border-white/5 pb-10">
 <h1 className="text-5xl font-normal text-white capitalize ">Order Logistics</h1>
 <p className="text-[11px] text-slate-500 font-normal capitalize tracking-[0.3em] mt-4">Fulfill professional grade equipment orders</p>
 </div>

 <div className="bg-black border border-white/5 rounded-sm overflow-hidden shadow-2xl">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-white/5 text-slate-500 text-[10px] font-normal capitalize tracking-[0.3em]">
 <th className="p-8">Transaction ID</th>
 <th className="p-8">Recipient</th>
 <th className="p-8 text-center">Unit Volume</th>
 <th className="p-8 text-center">Total Yield</th>
 <th className="p-8 text-center">Lifecycle</th>
 <th className="p-8 text-right">Logistics</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {orders.map(o => (
 <tr key={o._id} className="hover:bg-white/[0.03] transition-colors">
 <td className="p-8 text-[11px] font-normal text-slate-500 ">#{o._id.slice(-8).toUpperCase()}</td>
 <td className="p-8">
 <div className="text-sm font-normal text-white capitalize tracking-tight">{o.shippingDetails?.firstName} {o.shippingDetails?.lastName}</div>
 <div className="text-[10px] font-normal capitalize text-slate-600 mt-1">{o.shippingDetails?.city}</div>
 </td>
 <td className="p-8 text-center text-xs font-normal text-slate-400">{o.items.length} Units</td>
 <td className="p-8 text-center font-normal text-[#FF4C3B] text-base">${o.totalbill.toFixed(2)}</td>
 <td className="p-8 text-center">
 <span className={`px-4 py-1.5 rounded-sm text-[9px] font-normal capitalize tracking-[0.2em] ${
 o.status === 'delivered' ? 'bg-[#FF4C3B]/10 text-[#FF4C3B]' : 
 o.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
 o.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
 }`}>
 {o.status || 'pending'}
 </span>
 </td>
 <td className="p-8 text-right">
 <select 
 value={o.status || 'pending'}
 onChange={(e) => updateOrderStatus(o._id, e.target.value)}
 className="bg-[#111] border border-white/10 text-white text-[10px] font-normal capitalize tracking-[0.2em] px-4 py-2 rounded-sm focus:outline-none focus:border-[#FF4C3B] transition-colors"
 >
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
 </div>
 )}
 </div>
 </div>
 );
};

export default AdminPanel;
