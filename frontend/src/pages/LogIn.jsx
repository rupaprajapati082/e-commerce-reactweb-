import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
 const [formData, setformData] = useState({
 email: "",
 password: "",
 });

 const [error, setError] = useState("");
 const [validation, setValidation] = useState("");
 const navigate = useNavigate();

 const handleChange = (e) => {
 setformData({ ...formData, [e.target.name]: e.target.value });
 };

 const submitForm = async () => {
 try {
 let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, formData);
 if (response.status === 200) {
 let data = response.data;
 localStorage.setItem("token", data.token);
 localStorage.setItem("user", JSON.stringify(data.user));
 navigate("/profile");
 }
 }
 catch (error) {
 console.log(error.response);
 setError(error.response?.data?.message);
 setValidation(error.response?.data?.error);
 }
 };

 return (
 <div className="relative min-h-screen w-full flex items-center justify-center bg-[#F9F9F9] overflow-hidden font-sans">
 {/* Background Decor */}
 <div className="absolute inset-0 z-0 pointer-events-none">
 <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#FF4C3B]/5 rounded-full blur-[120px]" />
 <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#FF4C3B]/5 rounded-full blur-[120px]" />
 </div>

 {/* Login Card */}
 <div className="relative z-10 w-full max-w-md p-12 mx-4 bg-white border border-slate-100 shadow-2xl rounded-sm">
 <div className="text-center mb-12">
 <Link to="/" className="text-4xl font-normal text-[#222] mb-8 block capitalize">
 <span className="text-[#FF4C3B]">Multi</span>kart
 </Link>
 <h1 className="text-2xl font-normal capitalize text-[#222]">Welcome Back</h1>
 <div className="w-12 h-1 bg-[#FF4C3B] mx-auto mt-4"></div>
 <p className="text-[11px] font-bold capitalize text-slate-400 mt-6">Sign in to your professional account</p>
 </div>

 <form className="space-y-8" onSubmit={(e) => {
 e.preventDefault();
 submitForm();
 }}>
 {error && <p className='text-red-500 bg-red-50 p-4 text-[10px] font-normal rounded-sm border border-red-100 capitalize tracking-[0.2em] text-center'> {error}</p>}
 
 {Array.isArray(validation) && validation.length > 0 && (
 <div className="space-y-2">
 {validation.map((val, index) => (
 <p key={index} className='text-red-500 bg-red-50 p-3 text-[10px] font-normal rounded-sm border border-red-100 capitalize tracking-[0.2em] text-center'>{val.msg}</p>
 ))}
 </div>
 )}

 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize text-slate-500 ml-1">Email Address</label>
 <input
 type="email"
 placeholder="YOUR EMAIL"
 name="email"
 value={formData.email}
 onChange={handleChange}
 className="w-full px-6 py-4 bg-[#F9F9F9] border border-slate-200 rounded-sm focus:outline-none focus:border-[#FF4C3B] focus:bg-white transition-all text-xs font-bold capitalize tracking-wider"
 required
 />
 </div>

 <div className="space-y-3">
 <div className="flex justify-between items-center">
 <label className="text-[11px] font-normal capitalize text-slate-500 ml-1">Password</label>
 <a href="#" className="text-[10px] font-normal capitalize text-[#FF4C3B] hover:text-black transition-colors">Forgot?</a>
 </div>
 <input
 type="password"
 placeholder="YOUR PASSWORD"
 name="password"
 value={formData.password}
 onChange={handleChange}
 className="w-full px-6 py-4 bg-[#F9F9F9] border border-slate-200 rounded-sm focus:outline-none focus:border-[#FF4C3B] focus:bg-white transition-all text-xs font-bold"
 required
 />
 </div>

 <button className="w-full py-4 bg-[#222] text-white text-[11px] font-normal capitalize tracking-[0.3em] rounded-sm hover:bg-[#FF4C3B] transition-all shadow-xl shadow-black/10">
 Sign In Now
 </button>
 </form>

 <div className="mt-12 pt-8 border-t border-slate-100 text-center">
 <p className="text-[10px] font-normal capitalize text-slate-400">
 Don't have an account? <Link to="/joinus" className="text-[#FF4C3B] hover:text-black transition-colors ml-2 underline underline-offset-4">Create Account</Link>
 </p>
 </div>
 </div>
 </div>
 );
}
