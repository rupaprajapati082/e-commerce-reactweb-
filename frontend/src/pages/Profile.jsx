import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const [data, setData] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const FetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate('/login');
        
        const userRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(userRes.data?.user);

        const orderRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/order/get`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(orderRes.data.order || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    FetchData();
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89C74A]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      <div className="bg-[#f9f9f9] py-10 px-6 md:px-20 border-b border-slate-100">
        <h1 className="text-3xl font-bold text-[#222]">My Account</h1>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 uppercase font-bold tracking-widest">
          <Link to="/" className="hover:text-[#89C74A]">Home</Link>
          <span>/</span>
          <span className="text-slate-600">Profile</span>
        </div>
      </div>

      <div className="px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white border border-slate-100 p-8 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-50 shadow-inner">
                <span className="text-3xl font-bold text-[#89C74A]">
                  {data?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#222]">@{data.username}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{data.email}</p>
              
              <button 
                onClick={handleSignOut}
                className="mt-8 w-full py-3 border-2 border-slate-100 text-[#222] text-[10px] font-bold uppercase tracking-widest rounded-full hover:border-red-500 hover:text-red-500 transition-all"
              >
                Sign Out
              </button>
            </div>

            <div className="bg-white border border-slate-100 p-6 space-y-2">
              <button className="w-full text-left px-4 py-3 bg-[#89C74A]/10 text-[#89C74A] text-xs font-bold uppercase tracking-widest rounded-sm border-l-4 border-[#89C74A]">
                Order History
              </button>
              <button className="w-full text-left px-4 py-3 text-slate-400 hover:text-[#222] text-xs font-bold uppercase tracking-widest transition-colors">
                Account Details
              </button>
              <button className="w-full text-left px-4 py-3 text-slate-400 hover:text-[#222] text-xs font-bold uppercase tracking-widest transition-colors">
                Addresses
              </button>
              <Link to="/wishlist" className="block w-full text-left px-4 py-3 text-slate-400 hover:text-[#222] text-xs font-bold uppercase tracking-widest transition-colors">
                Wishlist
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h2 className="text-lg font-bold text-[#222] uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Recent Orders</h2>
              
              {orders.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 p-12 text-center rounded-sm">
                  <p className="text-slate-500 text-sm mb-6 font-medium">No orders found.</p>
                  <Link to="/products" className="inline-block px-10 py-3 bg-[#89C74A] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#7ab33f] transition-all">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <th className="pb-4 font-bold">Order ID</th>
                        <th className="pb-4 font-bold">Date</th>
                        <th className="pb-4 font-bold text-center">Status</th>
                        <th className="pb-4 font-bold text-center">Items</th>
                        <th className="pb-4 font-bold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map((order) => (
                        <tr key={order._id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-6 text-xs font-mono font-bold text-[#222]">#{order._id.slice(-8).toUpperCase()}</td>
                          <td className="py-6 text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-6 text-center">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                              order.status === 'delivered' ? 'bg-[#89C74A]/10 text-[#89C74A]' : 
                              order.status === 'cancel' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
                            }`}>
                              {order.status || 'Processing'}
                            </span>
                          </td>
                          <td className="py-6 text-center text-xs text-slate-500 font-medium">{order.items.length}</td>
                          <td className="py-6 text-right text-sm font-bold text-[#222]">${order.totalbill.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
              <div className="bg-[#f9f9f9] p-8 rounded-sm">
                <h3 className="text-sm font-bold text-[#222] uppercase tracking-widest mb-4">Billing Address</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {data.username}<br />
                  Add your billing address in account details to see it here.
                </p>
                <button className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#89C74A] border-b border-[#89C74A] hover:text-[#222] hover:border-[#222] transition-all">Edit Address</button>
              </div>
              <div className="bg-[#f9f9f9] p-8 rounded-sm">
                <h3 className="text-sm font-bold text-[#222] uppercase tracking-widest mb-4">Shipping Address</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {data.username}<br />
                  Add your shipping address in account details to see it here.
                </p>
                <button className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#89C74A] border-b border-[#89C74A] hover:text-[#222] hover:border-[#222] transition-all">Edit Address</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
