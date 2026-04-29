import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Support = () => {
 return (
 <div className="min-h-screen bg-[#FDFDFD]">
 <Navbar />
 
 {/* Breadcrumbs */}
 <div className="bg-[#222] py-16 px-6 md:px-20 border-b border-white/5">
 <h1 className="text-4xl md:text-5xl font-normal text-white capitalize mb-4">Support & Info</h1>
 <div className="flex items-center gap-2 text-[10px] text-slate-500 capitalize font-normal tracking-[0.2em]">
 <Link to="/" className="hover:text-[#FF4C3B] transition-colors">Home</Link>
 <span className="text-slate-700">/</span>
 <span className="text-white">Support</span>
 </div>
 </div>

 <div className="px-6 md:px-20 py-20">
 <div className="max-w-4xl mx-auto space-y-32">
 {/* About Section */}
 <section>
 <div className="flex flex-col md:flex-row gap-16 items-center">
 <div className="w-full md:w-1/2">
 <span className="text-[#FF4C3B] font-normal text-[11px] tracking-[0.3em] capitalize mb-4 block">Our Legacy</span>
 <h2 className="text-5xl font-normal text-[#222] mb-8 capitalize leading-none">Professional <br />Grade Equipment</h2>
 <div className="space-y-6 text-slate-500 text-[13px] leading-relaxed font-medium">
 <p>
 Welcome to Multikart Tool Store, your ultimate destination for high-performance industrial equipment and professional tools. Established in 2026, we've committed ourselves to delivering precision and power to experts across the globe.
 </p>
 <p>
 Our mission is to empower professionals and enthusiasts with tools that never fail. We believe in quality that lasts a lifetime, backed by engineering excellence and a passion for craftsmanship.
 </p>
 </div>
 </div>
 <div className="w-full md:w-1/2">
 <img 
 src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" 
 alt="Professional Tools" 
 className="w-full rounded-sm shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
 />
 </div>
 </div>
 </section>

 {/* Contact Section */}
 <section className="bg-black p-16 rounded-sm border border-white/5 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4C3B]/10 blur-[100px] rounded-full"></div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
 <div className="space-y-12">
 <div>
 <span className="text-[#FF4C3B] font-normal text-[11px] tracking-[0.3em] capitalize mb-4 block">Contact Center</span>
 <h2 className="text-4xl font-normal text-white capitalize ">Get In Touch</h2>
 </div>
 
 <div className="space-y-10">
 <div className="flex gap-6">
 <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center text-[#FF4C3B] shrink-0 border border-white/10">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 </div>
 <div>
 <h4 className="text-[11px] font-normal capitalize text-white mb-2">Headquarters</h4>
 <p className="text-[11px] text-slate-400 font-bold capitalize leading-loose">123 Industrial Way, Sector 7<br />New York, NY 10001</p>
 </div>
 </div>

 <div className="flex gap-6">
 <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center text-[#FF4C3B] shrink-0 border border-white/10">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
 </svg>
 </div>
 <div>
 <h4 className="text-[11px] font-normal capitalize text-white mb-2">Service Hotline</h4>
 <p className="text-[11px] text-slate-400 font-bold capitalize leading-loose">+1 (555) TOOL-HELP</p>
 </div>
 </div>

 <div className="flex gap-6">
 <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center text-[#FF4C3B] shrink-0 border border-white/10">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
 </svg>
 </div>
 <div>
 <h4 className="text-[11px] font-normal capitalize text-white mb-2">Support Email</h4>
 <p className="text-[11px] text-slate-400 font-bold capitalize leading-loose">pro-support@multikart.com</p>
 </div>
 </div>
 </div>
 </div>
 
 <form className="space-y-6">
 <div className="grid grid-cols-2 gap-6">
 <input type="text" placeholder="FIRST NAME" className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-sm text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all" />
 <input type="text" placeholder="LAST NAME" className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-sm text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all" />
 </div>
 <input type="email" placeholder="EMAIL ADDRESS" className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-sm text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all" />
 <textarea placeholder="DESCRIBE YOUR REQUEST" rows="6" className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-sm text-xs font-bold text-white focus:outline-none focus:border-[#FF4C3B] transition-all"></textarea>
 <button className="w-full bg-[#FF4C3B] text-white font-normal capitalize text-[10px] tracking-[0.3em] py-5 rounded-sm hover:bg-white hover:text-black transition-all shadow-2xl shadow-[#FF4C3B]/20">
 Submit Inquiry
 </button>
 </form>
 </div>
 </section>

 {/* FAQ Section */}
 <section className="py-10">
 <div className="text-center mb-24">
 <span className="text-[#FF4C3B] font-normal text-[11px] tracking-[0.3em] capitalize mb-4 block">Knowledge Base</span>
 <h2 className="text-4xl font-normal text-[#222] capitalize ">Professional FAQs</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
 {[
 { q: 'How do I track my industrial shipment?', a: 'High-value tool orders are shipped via secure logistics. You will receive a real-time tracking dashboard link via email once dispatched.' },
 { q: 'What is the warranty on power tools?', a: 'We offer a standard 3-year professional warranty on all motor-driven equipment and a lifetime replacement guarantee on hand tools.' },
 { q: 'Do you offer bulk enterprise pricing?', a: 'Yes, we provide tiered pricing for construction firms and automotive workshops. Contact our sales team for a custom quote.' },
 { q: 'Are your tools certified for industrial use?', a: 'Every tool in our catalog meets or exceeds ANSI and ISO industrial standards for safety and performance.' },
 ].map((faq, idx) => (
 <div key={idx} className="p-10 border border-slate-100 bg-white hover:shadow-2xl transition-all group">
 <h4 className="font-normal text-[13px] capitalize tracking-tight text-[#222] mb-5 group-hover:text-[#FF4C3B] transition-colors">{faq.q}</h4>
 <p className="text-[12px] text-slate-500 leading-relaxed font-medium">{faq.a}</p>
 </div>
 ))}
 </div>
 </section>
 </div>
 </div>

 <Footer />
 </div>
 );
};

export default Support;
