import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  Settings, 
  ChevronRight,
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  LayoutDashboard,
  Camera, 
  Save, 
  Edit3, 
  X,
  Zap,
  CreditCard,
  Bell,
  Trash2,
  Plus
} from 'lucide-react';

const Profile = () => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ username: '', phone: '', address: '', avatar: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const u = res.data.user;
        setUser(u);
        setForm({ username: u.username || '', phone: u.phone || '', address: u.address || '', avatar: u.avatar || '' });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/login'); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/update`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-100 dark:border-white/5 border-t-[#FF4C3B] rounded-full animate-spin" />
    </div>
  );

  const initials = user?.username?.[0]?.toUpperCase() || '?';
  const avatarUrl = form.avatar || user?.avatar || '';

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] font-sans pb-20">
      <Navbar />

      <div className="max-w-[1250px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ── SIDEBAR NAV ── */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#F9FAFB] dark:bg-white/5 p-10 rounded-[3rem] border border-slate-100 dark:border-white/10 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4C3B]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="relative w-32 h-32 mx-auto mb-8 group">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-[2.5rem] object-cover border-4 border-white dark:border-[#111] shadow-2xl" />
                ) : (
                  <div className="w-full h-full rounded-[2.5rem] bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-4xl font-black">
                    {initials}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FF4C3B] rounded-2xl border-4 border-white dark:border-[#0A0A0A] flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={18} />
                </div>
                <button onClick={() => setEditing(true)} className="absolute inset-0 rounded-[2.5rem] bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm">
                  <Camera size={28} />
                </button>
              </div>

              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{user?.username}</h2>
              <p className="text-[10px] font-black text-[#FF4C3B] uppercase tracking-[0.3em] mb-8">{user?.role} Access Member</p>

              <div className="space-y-4">
                 <button onClick={handleLogout} className="w-full py-4 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center gap-3">
                   <LogOut size={16} /> Terminate Session
                 </button>
              </div>
            </motion.div>

            <motion.nav 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#F9FAFB] dark:bg-white/5 p-4 rounded-[3rem] border border-slate-100 dark:border-white/10"
            >
                {[
                  { icon: Package, label: 'Order History', path: '/orders', desc: 'Track your procurement' },
                  { icon: Heart, label: 'Secured Wishlist', path: '/wishlist', desc: 'Curated collection' },
                  { icon: CreditCard, label: 'Saved Payments', path: '#payments', desc: 'Manage methods' },
                  { icon: Bell, label: 'Notification Center', path: '#notifications', desc: 'System alerts' },
                ].map((item, idx) => (
                  <Link key={idx} to={item.path} className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-white dark:hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white dark:bg-[#111] rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-[#FF4C3B] transition-colors shadow-sm border border-slate-100 dark:border-white/10">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-[#FF4C3B] transition-colors" />
                 </Link>
               ))}

               {user?.role === 'admin' && (
                 <Link to="/admin" className="mt-4 flex items-center justify-between p-6 rounded-[2rem] bg-[#FF4C3B] text-white shadow-xl shadow-[#FF4C3B]/20 group transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                         <LayoutDashboard size={20} />
                       </div>
                       <div>
                         <p className="text-sm font-black">Management Portal</p>
                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Admin Access</p>
                       </div>
                    </div>
                    <Zap size={16} className="text-white" />
                 </Link>
               )}
            </motion.nav>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="lg:col-span-8 space-y-10">
             
             {/* SUCCESS NOTIFICATION */}
             <AnimatePresence>
               {success && (
                 <motion.div 
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-[2rem] flex items-center gap-4"
                 >
                   <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                     <CheckCircle2 size={20} />
                   </div>
                   <p className="text-sm font-black text-emerald-800 dark:text-emerald-400">Security credentials updated successfully.</p>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* PROFILE INFO CARD */}
             <motion.section 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[4rem] p-12 md:p-16"
             >
                <div className="flex justify-between items-center mb-12">
                   <div className="space-y-2">
                     <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Account Settings</h2>
                     <p className="text-slate-500 font-medium">Control your personal data and application preferences.</p>
                   </div>
                   {!editing && (
                     <button onClick={() => setEditing(true)} className="px-8 py-3 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF4C3B] hover:text-white transition-all shadow-sm">
                       Modify Details
                     </button>
                   )}
                </div>

                {!editing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                       { icon: User, label: 'Full Identity', value: user?.username },
                       { icon: Mail, label: 'Contact Email', value: user?.email },
                       { icon: Phone, label: 'Secure Phone', value: user?.phone || 'Not Registered' },
                       { icon: MapPin, label: 'Primary Location', value: user?.address || 'Not Registered' },
                     ].map((info, idx) => (
                       <div key={idx} className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/10 group hover:border-[#FF4C3B]/30 transition-all">
                          <div className="flex items-center gap-3 mb-4">
                            <info.icon size={14} className="text-[#FF4C3B]" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{info.label}</span>
                          </div>
                          <p className="text-lg font-black text-slate-900 dark:text-white truncate">{info.value}</p>
                       </div>
                     ))}
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-8">
                     <div className="flex items-center gap-8 bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-100 dark:border-white/10">
                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white dark:border-[#111] shrink-0">
                           {form.avatar ? <img src={form.avatar} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-300">{initials}</div>}
                        </div>
                        <div className="flex-1 space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avatar Resource URL</label>
                           <input 
                             type="url" 
                             value={form.avatar} 
                             onChange={e => setForm({...form, avatar: e.target.value})} 
                             placeholder="https://..." 
                             className="w-full px-6 py-4 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                           <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                           <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Address</label>
                           <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#FF4C3B]/20" />
                        </div>
                     </div>

                     <div className="flex gap-4 pt-6">
                        <button type="submit" disabled={saving} className="flex-1 bg-black text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-[#FF4C3B] transition-all flex items-center justify-center gap-3">
                          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />} 
                          {saving ? 'Processing...' : 'Deploy Changes'}
                        </button>
                        <button type="button" onClick={() => setEditing(false)} className="px-12 py-5 bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                          Abort
                        </button>
                     </div>
                  </form>
                )}
             </motion.section>

             {/* SAVED PAYMENTS SECTION */}
             <motion.section 
               id="payments"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[4rem] p-12 md:p-16"
             >
                <div className="flex justify-between items-center mb-10">
                   <div className="space-y-2">
                     <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Secured Payments</h2>
                     <p className="text-slate-500 font-medium text-sm">Encrypted payment instruments for rapid checkout.</p>
                   </div>
                   <button className="p-4 bg-black text-white rounded-2xl hover:bg-[#FF4C3B] transition-all">
                     <Plus size={20} />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#111] to-[#222] text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                         <div className="flex justify-between items-start">
                            <div className="w-12 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                               <Zap size={20} className="text-orange-400 fill-current" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Active Method</span>
                         </div>
                         <div>
                            <p className="text-lg font-black tracking-[0.2em] mb-2">•••• •••• •••• 4492</p>
                            <div className="flex justify-between items-center">
                               <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Expires 08/28</p>
                               <div className="flex gap-2">
                                  <Edit3 size={14} className="cursor-pointer hover:text-[#FF4C3B]" />
                                  <Trash2 size={14} className="cursor-pointer hover:text-red-500" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <button className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-[#FF4C3B] hover:border-[#FF4C3B] transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Plus size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Register New Card</span>
                   </button>
                </div>
             </motion.section>

             {/* LOYALTY CARD */}
             <motion.section 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-[#111] p-12 md:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl"
             >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF4C3B]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                   <div className="space-y-6">
                      <div className="inline-block px-6 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#FF4C3B] border border-white/10">Elite Membership</div>
                      <h2 className="text-4xl font-black tracking-tighter leading-tight">Professional <br /> Loyalty Reward</h2>
                      <p className="text-slate-400 font-medium max-w-md">You are currently at **Tier 1**. Place 3 more orders to unlock Tier 2 benefits including priority shipping and exclusive early access.</p>
                   </div>
                   <div className="w-48 h-48 rounded-full border-[10px] border-[#FF4C3B]/20 flex items-center justify-center relative">
                      <div className="text-center">
                         <p className="text-5xl font-black text-white">850</p>
                         <p className="text-[10px] font-black text-[#FF4C3B] uppercase tracking-widest mt-1">Credits</p>
                      </div>
                      <Zap size={32} className="absolute -top-4 right-0 text-[#FF4C3B] fill-current" />
                   </div>
                </div>
             </motion.section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
