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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#FDFDFD] overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#89C74A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#89C74A]/5 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-10 mx-4 bg-white border border-slate-100 shadow-xl">
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-bold tracking-tight text-[#222] mb-6 block">
            Eco<span className="text-[#89C74A]">life</span>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-widest text-[#222]">Welcome Back</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Sign in to your ecolife account</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}>
          {error && <p className='text-red-500 bg-red-50 p-4 text-xs font-bold rounded-sm border border-red-100 uppercase tracking-widest text-center'> {error}</p>}
          
          {Array.isArray(validation) && validation.length > 0 && (
            <div className="space-y-2">
              {validation.map((val, index) => (
                <p key={index} className='text-red-500 bg-red-50 p-2 text-[10px] font-bold rounded-sm border border-red-100 uppercase tracking-widest text-center'>{val.msg}</p>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-[#89C74A] focus:bg-white transition-all text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#89C74A] hover:text-[#222] transition-colors">Forgot?</a>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-[#89C74A] focus:bg-white transition-all text-sm"
              required
            />
          </div>

          <button className="w-full py-4 bg-[#222] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#89C74A] transition-all shadow-lg shadow-black/10">
            Sign In
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Don't have an account? <Link to="/joinus" className="text-[#89C74A] hover:text-[#222] transition-colors ml-1">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
