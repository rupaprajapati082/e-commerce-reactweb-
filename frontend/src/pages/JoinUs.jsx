import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const JoinUs = () => {
 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 const [exist, setExist] = useState("");
 const navigate = useNavigate();

 const submitForm = async () => {
 const userdata = {username: username, email: email, password: password}
 let errors = [];

 if (username.length < 5) {
 errors.push({ msg: "Username must be 5 characters long" });
 }
 if (password.length < 6) {
 errors.push({ msg: "Password must be 6 characters long" });
 }

 if (errors.length > 0) {
 return setError(errors);
 }
 
 try {
 let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, userdata);
 if(response.status === 200){
 const data = response.data;
 localStorage.setItem("token", data.token);
 localStorage.setItem("user", JSON.stringify(data.user));
 navigate("/profile");
 }
 } catch (error) {
 let Err = error.response?.data?.error
 setError(Err);
 let Err2 = error.response?.data?.message
 setExist(Err2);
 } 
 };

 return (
 <div className="relative min-h-screen w-full flex items-center justify-center bg-[#F9F9F9] overflow-hidden font-sans">
 {/* Background Decor */}
 <div className="absolute inset-0 z-0 pointer-events-none">
 <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-[#FF4C3B]/5 rounded-full blur-[120px]" />
 <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[#FF4C3B]/5 rounded-full blur-[120px]" />
 </div>

 {/* Register Card */}
 <div className="relative z-10 w-full max-w-md p-12 mx-4 bg-white border border-slate-100 shadow-2xl rounded-sm">
 <div className="text-center mb-12">
 <Link to="/" className="text-4xl font-normal text-[#222] mb-8 block capitalize">
 <span className="text-[#FF4C3B]">Multi</span>kart
 </Link>
 <h1 className="text-2xl font-normal capitalize text-[#222]">Create Account</h1>
 <div className="w-12 h-1 bg-[#FF4C3B] mx-auto mt-4"></div>
 <p className="text-[11px] font-bold capitalize text-slate-400 mt-6">Join our professional tool community</p>
 </div>

 <form className="space-y-6" onSubmit={(e) =>{
 e.preventDefault();
 submitForm();
 }}>
 
 {Array.isArray(error) && error.length > 0 && (
 <div className="space-y-2">
 {error.map((val,index)=>{
 return <p key={index} className="bg-red-50 border border-red-100 p-3 text-[10px] font-normal capitalize tracking-[0.2em] text-red-500 text-center rounded-sm">{val.msg}</p>
 })}
 </div>
 )}
 
 {exist && (
 <p className="bg-red-50 border border-red-100 p-3 text-[10px] font-normal capitalize tracking-[0.2em] text-red-500 text-center rounded-sm">{exist}</p>
 )}

 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize text-slate-500 ml-1">Username</label>
 <input
 type="text"
 name="username"
 value={username}
 onChange={(e)=>setUsername(e.target.value)}
 placeholder="YOUR USERNAME"
 className="w-full px-6 py-4 bg-[#F9F9F9] border border-slate-200 rounded-sm focus:outline-none focus:border-[#FF4C3B] focus:bg-white transition-all text-xs font-bold capitalize tracking-wider"
 required
 />
 </div>

 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize text-slate-500 ml-1">Email Address</label>
 <input
 type="email"
 name="email"
 value={email}
 onChange={(e)=>setEmail(e.target.value)}
 placeholder="YOUR EMAIL"
 className="w-full px-6 py-4 bg-[#F9F9F9] border border-slate-200 rounded-sm focus:outline-none focus:border-[#FF4C3B] focus:bg-white transition-all text-xs font-bold capitalize tracking-wider"
 required
 />
 </div>

 <div className="space-y-3">
 <label className="text-[11px] font-normal capitalize text-slate-500 ml-1">Password</label>
 <input
 type="password"
 name="password"
 value={password}
 onChange={(e)=>setPassword(e.target.value)}
 placeholder="YOUR PASSWORD"
 className="w-full px-6 py-4 bg-[#F9F9F9] border border-slate-200 rounded-sm focus:outline-none focus:border-[#FF4C3B] focus:bg-white transition-all text-xs font-bold"
 required
 />
 </div>

 <div className="flex items-start gap-3 py-2">
 <input type="checkbox" required className="mt-1 accent-[#FF4C3B] w-4 h-4" />
 <p className="text-[10px] font-normal capitalize text-slate-400 leading-relaxed">
 I agree to the <span className="text-[#FF4C3B] cursor-pointer hover:text-black">Terms</span> and <span className="text-[#FF4C3B] cursor-pointer hover:text-black">Privacy Policy</span>.
 </p>
 </div>

 <button className="w-full py-4 bg-[#222] text-white text-[11px] font-normal capitalize tracking-[0.3em] rounded-sm hover:bg-[#FF4C3B] transition-all shadow-xl shadow-black/10">
 Join Now
 </button>
 </form>

 <div className="mt-12 pt-8 border-t border-slate-100 text-center">
 <p className="text-[10px] font-normal capitalize text-slate-400">
 Already have an account? <Link to="/login" className="text-[#FF4C3B] hover:text-black transition-colors ml-2 underline underline-offset-4">Sign In Now</Link>
 </p>
 </div>
 </div>
 </div>
 );
};

export default JoinUs;
