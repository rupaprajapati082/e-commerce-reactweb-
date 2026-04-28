import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Support = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-[#f9f9f9] py-10 px-6 md:px-20 border-b border-slate-100">
        <h1 className="text-3xl font-bold text-[#222]">Support & Info</h1>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 uppercase font-bold tracking-widest">
          <Link to="/" className="hover:text-[#89C74A]">Home</Link>
          <span>/</span>
          <span className="text-slate-600">Support</span>
        </div>
      </div>

      <div className="px-6 md:px-20 py-16">
        <div className="max-w-4xl mx-auto space-y-24">
          {/* About Section */}
          <section>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <span className="text-[#89C74A] font-bold text-[10px] tracking-widest uppercase mb-2 block">Our Story</span>
                <h2 className="text-3xl font-bold text-[#222] mb-6 uppercase tracking-tight">Pure, Organic, <br />Natural Beauty</h2>
                <div className="space-y-4 text-slate-500 text-sm leading-relaxed">
                  <p>
                    Welcome to Ecolife, your premier destination for high-quality organic fashion and skincare. Founded in 2026, we strive to bring you the best look anytime, anywhere, while respecting our planet.
                  </p>
                  <p>
                    Our mission is to provide stylish, comfortable, and affordable products for everyone. We believe that beauty should be accessible without compromising on quality or environmental ethics.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800" 
                  alt="About Ecolife" 
                  className="w-full rounded-sm shadow-xl"
                />
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-[#f9f9f9] p-12 rounded-sm border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div>
                  <span className="text-[#89C74A] font-bold text-[10px] tracking-widest uppercase mb-2 block">Contact Us</span>
                  <h2 className="text-3xl font-bold text-[#222] uppercase tracking-tight">Get In Touch</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#89C74A]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#222]">Our Store</h4>
                      <p className="text-xs text-slate-500 mt-1">123 Ecolife Ave, New York, NY 10001</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#89C74A]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#222]">Phone Number</h4>
                      <p className="text-xs text-slate-500 mt-1">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#89C74A]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#222]">Email Address</h4>
                      <p className="text-xs text-slate-500 mt-1">support@ecolife.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#89C74A] bg-white transition-all" />
                  <input type="text" placeholder="Last Name" className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#89C74A] bg-white transition-all" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#89C74A] bg-white transition-all" />
                <textarea placeholder="Your Message" rows="5" className="w-full px-6 py-4 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#89C74A] bg-white transition-all"></textarea>
                <button className="w-full bg-[#222] text-white font-bold uppercase text-[11px] tracking-widest py-4 rounded-full hover:bg-[#89C74A] transition-all shadow-lg shadow-black/10">
                  Send Message
                </button>
              </form>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-10">
            <div className="text-center mb-16">
              <span className="text-[#89C74A] font-bold text-[10px] tracking-widest uppercase mb-2 block">Help Center</span>
              <h2 className="text-3xl font-bold text-[#222] uppercase tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { q: 'How do I track my order?', a: 'Once your order is shipped, you will receive an email with a tracking number and a link to track your package.' },
                { q: 'What is your return policy?', a: 'We offer a 30-day return policy for all unused and unopened items in their original packaging.' },
                { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.' },
                { q: 'Are your products organic?', a: 'All our products are made with 100% natural and organic ingredients, ethically sourced and cruelty-free.' },
              ].map((faq, idx) => (
                <div key={idx} className="p-8 border border-slate-100 bg-white hover:shadow-lg transition-all">
                  <h4 className="font-bold text-[#222] mb-3">{faq.q}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
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
