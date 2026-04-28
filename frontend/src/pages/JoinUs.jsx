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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#FDFDFD] overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#89C74A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#89C74A]/5 rounded-full blur-3xl" />
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md p-10 mx-4 bg-white border border-slate-100 shadow-xl">
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-bold tracking-tight text-[#222] mb-6 block">
            Eco<span className="text-[#89C74A]">life</span>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-widest text-[#222]">Create Account</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Join the ecolife organic community</p>
        </div>

        <form className="space-y-5" onSubmit={(e) =>{
            e.preventDefault();
            submitForm();
        }}>
           
          {Array.isArray(error) && error.length > 0 && (
            <div className="space-y-2">
              {error.map((val,index)=>{
                return <p key={index} className="bg-red-50 border border-red-100 p-3 text-[10px] font-bold uppercase tracking-widest text-red-500 text-center rounded-sm">{val.msg}</p>
              })}
            </div>
          )}
           
          {exist && (
            <p className="bg-red-50 border border-red-100 p-3 text-[10px] font-bold uppercase tracking-widest text-red-500 text-center rounded-sm">{exist}</p>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder="Minimum 5 characters"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-[#89C74A] focus:bg-white transition-all text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-[#89C74A] focus:bg-white transition-all text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-[#89C74A] focus:bg-white transition-all text-sm"
              required
            />
          </div>

          <div className="flex items-start gap-3 py-2">
            <input type="checkbox" required className="mt-1 accent-[#89C74A] w-4 h-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-relaxed">
              I agree to the <span className="text-[#89C74A] cursor-pointer hover:text-[#222]">Terms & Conditions</span> and <span className="text-[#89C74A] cursor-pointer hover:text-[#222]">Privacy Policy</span>.
            </p>
          </div>

          <button className="w-full py-4 bg-[#222] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#89C74A] transition-all shadow-lg shadow-black/10">
            Join Now
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Already have an account? <Link to="/login" className="text-[#89C74A] hover:text-[#222] transition-colors ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
