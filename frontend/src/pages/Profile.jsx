import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  User, Package, Heart, LogOut, Settings, ChevronRight,
  Mail, Phone, MapPin, CheckCircle2, Shield, LayoutDashboard,
  Camera, Save, Edit3, X
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
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto px-6 md:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 dark:bg-white/5 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 text-center">

              {/* Avatar with camera button */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-[2.5rem] object-cover border-4 border-white dark:border-[#111] shadow-xl" />
                ) : (
                  <div className="w-full h-full rounded-[2.5rem] bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-4xl font-black">
                    {initials}
                  </div>
                )}
                {/* Shield badge */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FF4C3B] rounded-2xl border-4 border-white dark:border-[#0A0A0A] flex items-center justify-center text-white">
                  <Shield size={18} />
                </div>
                {/* Camera overlay to open edit */}
                <button onClick={() => setEditing(true)}
                  className="absolute inset-0 rounded-[2.5rem] bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={28} />
                </button>
              </div>

              <h2 className="text-2xl font-black dark:text-white mb-1">{user?.username}</h2>
              <p className="text-xs font-black text-[#FF4C3B] uppercase tracking-widest mb-2">{user?.role} Account</p>
              <p className="text-xs text-slate-400 mb-8">{user?.email}</p>

              <div className="space-y-3">
                {!editing ? (
                  <button onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-[#FF4C3B] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">
                    <Edit3 size={16} /> Edit Profile
                  </button>
                ) : (
                  <button onClick={() => setEditing(false)}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-300 transition-all">
                    <X size={16} /> Cancel
                  </button>
                )}
                <button onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all dark:text-white">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.div>

            {/* Nav */}
            <motion.nav initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-slate-50 dark:bg-white/5 p-4 rounded-[3rem] border border-slate-100 dark:border-white/5">
              {[
                { icon: Package,     label: 'Order History',    path: '/order-history' },
                { icon: Heart,       label: 'Wishlist Items',   path: '/wishlist' },
                { icon: Settings,    label: 'Account Settings', path: '#' },
              ].map((item, idx) => (
                <Link key={idx} to={item.path}
                  className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-white dark:hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-black rounded-xl text-slate-400 group-hover:text-[#FF4C3B] transition-colors">
                      <item.icon size={20} />
                    </div>
                    <span className="text-sm font-bold dark:text-slate-200">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </Link>
              ))}

              {user?.role === 'admin' && (
                <Link to="/admin"
                  className="flex items-center justify-between p-6 rounded-[2rem] bg-[#FF4C3B]/5 hover:bg-[#FF4C3B]/10 transition-all group border border-[#FF4C3B]/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#FF4C3B] rounded-xl text-white shadow-lg shadow-[#FF4C3B]/30">
                      <LayoutDashboard size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-black text-[#FF4C3B] block">Admin Dashboard</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Manage store</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#FF4C3B]" />
                </Link>
              )}
            </motion.nav>
          </aside>

          {/* ── Main Content ── */}
          <main className="lg:col-span-8 space-y-8">

            {/* Success banner */}
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl px-6 py-4">
                <CheckCircle2 size={20} className="text-green-500" />
                <p className="font-bold text-green-700 dark:text-green-400 text-sm">Profile updated successfully!</p>
              </motion.div>
            )}

            {/* Personal Information */}
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-slate-50 dark:bg-white/5 p-10 md:p-12 rounded-[3rem] border border-slate-100 dark:border-white/5">

              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF4C3B] flex items-center justify-center text-white"><User size={24} /></div>
                  <div>
                    <h2 className="text-2xl font-black dark:text-white">Personal Information</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Manage your profile data and preferences</p>
                  </div>
                </div>
                {!editing && (
                  <button onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#FF4C3B] hover:text-white transition-all dark:text-white">
                    <Edit3 size={14} /> Edit
                  </button>
                )}
              </div>

              {!editing ? (
                /* ── View Mode ── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: User,   label: 'Full Name',       value: user?.username },
                    { icon: Mail,   label: 'Email Address',   value: user?.email },
                    { icon: Phone,  label: 'Phone Number',    value: user?.phone    || 'Not Provided' },
                    { icon: MapPin, label: 'Default Address', value: user?.address  || 'Not Provided' },
                  ].map((info, idx) => (
                    <div key={idx} className="bg-white dark:bg-black/20 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3 mb-3">
                        <info.icon size={14} className="text-[#FF4C3B]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{info.label}</span>
                      </div>
                      <p className="font-bold dark:text-white text-sm">{info.value}</p>
                    </div>
                  ))}

                  {/* Avatar URL preview */}
                  <div className="bg-white dark:bg-black/20 p-6 rounded-3xl border border-slate-100 dark:border-white/5 md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <Camera size={14} className="text-[#FF4C3B]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Image URL</span>
                    </div>
                    <p className="font-bold dark:text-white text-sm truncate">{user?.avatar || 'Not Set'}</p>
                  </div>
                </div>
              ) : (
                /* ── Edit Mode ── */
                <form onSubmit={handleSave} className="space-y-6">

                  {/* Avatar preview */}
                  <div className="flex items-center gap-6 bg-white dark:bg-black/20 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-200">
                      {form.avatar ? (
                        <img src={form.avatar} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-400">{initials}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Profile Image URL</label>
                      <input
                        type="url"
                        value={form.avatar}
                        onChange={e => setForm({ ...form, avatar: e.target.value })}
                        placeholder="https://your-image-url.com/photo.jpg"
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-[#FF4C3B] transition-all"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Paste any public image URL to update your avatar</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: User,   label: 'Full Name',       key: 'username', type: 'text',  placeholder: 'Your full name' },
                      { icon: Phone,  label: 'Phone Number',    key: 'phone',    type: 'tel',   placeholder: '+91 98765 43210' },
                      { icon: MapPin, label: 'Default Address', key: 'address',  type: 'text',  placeholder: 'Your city, state' },
                    ].map(({ icon: Icon, label, key, type, placeholder }) => (
                      <div key={key} className={key === 'address' ? 'md:col-span-2' : ''}>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                          <Icon size={12} className="text-[#FF4C3B]" /> {label}
                        </label>
                        <input
                          type={type}
                          value={form[key]}
                          onChange={e => setForm({ ...form, [key]: e.target.value })}
                          placeholder={placeholder}
                          className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-[#FF4C3B] transition-all"
                        />
                      </div>
                    ))}

                    {/* Email (read only) */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                        <Mail size={12} className="text-[#FF4C3B]" /> Email Address
                      </label>
                      <input type="email" value={user?.email} readOnly
                        className="w-full px-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-400 outline-none cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={saving}
                      className="flex items-center gap-3 px-10 py-4 bg-[#FF4C3B] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#FF4C3B]/20 disabled:opacity-60 disabled:cursor-not-allowed">
                      {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setEditing(false)}
                      className="flex items-center gap-3 px-10 py-4 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.section>

            {/* Loyalty Card */}
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-black dark:bg-[#111] p-10 md:p-12 rounded-[3rem] text-white shadow-2xl overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xs font-black text-[#FF4C3B] uppercase tracking-[0.3em] mb-4">Pro Loyalty Program</h3>
                <h2 className="text-3xl font-black mb-6">You're a Valued <br /> Partner</h2>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF4C3B]" /> Priority Support</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF4C3B]" /> Early Access</div>
                </div>
              </div>
              <Shield size={200} className="absolute -bottom-20 -right-20 text-white/5 transform rotate-12" />
            </motion.section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
