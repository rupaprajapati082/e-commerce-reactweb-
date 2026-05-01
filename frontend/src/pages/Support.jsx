import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  Headphones, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Clock, 
  ChevronRight,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  Smartphone,
  Train,
  CheckCircle2
} from 'lucide-react';

const Support = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000" 
             className="w-full h-full object-cover brightness-[0.4]" 
             alt="Support Hero" 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        <div className="max-w-[1250px] mx-auto px-6 relative z-10 w-full">
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             className="max-w-2xl space-y-8"
           >
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                Support layer for <br /> <span className="text-[#3B82F6]">Multikart</span> Global Users
              </h1>
              <p className="text-xl text-slate-200 font-medium leading-relaxed">
                Decode systems, prevent issues, enable safe commerce. Support for real-time clarity and local access, used by pros who think independently.
              </p>
              <button className="px-10 py-5 bg-[#3B82F6] text-white font-black rounded-xl hover:bg-white hover:text-[#3B82F6] transition-all shadow-2xl flex items-center gap-3 group">
                Get Started <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
           </motion.div>
        </div>

        {/* Floating Support Badge */}
        <div className="absolute bottom-20 right-20 hidden lg:block animate-bounce">
           <div className="w-24 h-24 rounded-full bg-white p-2 shadow-2xl border border-slate-100 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#3B82F6] animate-spin-slow opacity-20" />
              <div className="text-center">
                 <Headphones className="text-[#3B82F6] mx-auto mb-1" size={24} />
                 <span className="text-[8px] font-black uppercase tracking-widest leading-none block">Instant<br/>Support</span>
              </div>
           </div>
        </div>
      </section>

      {/* GRID SECTION: Common Issues */}
      <section className="py-24 max-w-[1250px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { 
               id: '01', 
               title: 'Order Confusion?', 
               desc: 'Multikart assists you from placing secure orders to tracking. No complex flows, just clear steps.',
               img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400'
             },
             { 
               id: '02', 
               title: 'Stuck somewhere?', 
               desc: 'Our 24/7 chat and mail support provides real-time help for all kinds of urgent logistics queries.',
               img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400'
             },
             { 
               id: '03', 
               title: 'Price Verification?', 
               desc: 'Verify invoices, check tax details, and confirm localized pricing (₹) before finalizing any procurement.',
               img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400'
             },
             { 
               id: '04', 
               title: 'Payment Gateway Issues?', 
               desc: 'Get through payment failures without panic. We provide secure backup protocols for every transaction.',
               img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400'
             },
             { 
               id: '05', 
               title: 'Logistics Delay?', 
               desc: 'Real-time tracking and direct connection with delivery partners to keep your supply chain moving.',
               img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=400'
             },
             { 
               id: '06', 
               title: 'Inventory Audit?', 
               desc: 'Full visibility on stock levels, batch quality, and sourcing details for your business operations.',
               img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400'
             }
           ].map((card, i) => (
             <motion.div 
               key={i} 
               {...fadeInUp}
               className="bg-slate-50 rounded-3xl overflow-hidden group hover:bg-white hover:shadow-2xl transition-all border border-slate-100"
             >
                <div className="p-8 space-y-4">
                   <span className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-xs font-black">{card.id}</span>
                   <h3 className="text-xl font-black text-slate-900 group-hover:text-[#3B82F6] transition-colors">{card.title}</h3>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                </div>
                <div className="h-48 overflow-hidden">
                   <img src={card.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-[1250px] mx-auto px-6 text-center space-y-16">
            <motion.div {...fadeInUp} className="max-w-2xl mx-auto space-y-4">
               <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                 A Failsafe that Steps in <span className="text-[#3B82F6]">When Needed</span>. No Promotions, No Pings. Only Support, If and When Required.
               </h3>
            </motion.div>

            <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
               {/* Background line */}
               <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 hidden md:block -translate-y-1/2" />
               
               {[
                 { icon: Zap, label: 'Authorize Once', desc: 'Secure your token' },
                 { icon: Globe, label: 'Procure on Your Terms', desc: 'Global inventory access' },
                 { icon: Headphones, label: 'Support When Stuck', desc: '24/7 expert fallback' }
               ].map((step, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center group w-full max-w-[250px]">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-50 group-hover:border-[#3B82F6] flex items-center justify-center text-slate-300 group-hover:text-[#3B82F6] shadow-xl transition-all mb-6">
                       <step.icon size={28} />
                    </div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1">{step.label}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* DARK SYSTEM SECTION */}
      <section className="py-24 max-w-[1250px] mx-auto px-6">
         <div className="bg-[#111] rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden">
            <div className="absolute top-10 right-10 opacity-20"><ShieldCheck size={120} /></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-20">
               <div className="max-w-md space-y-6">
                  <span className="text-[#3B82F6] font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" /> Why Multikart?
                  </span>
                  <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                    A System Simply Built to Back You Up.
                  </h3>
               </div>

               <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { icon: Globe, title: 'Pro-First Philosophy', desc: 'Empowering you with tools, not just orders.' },
                    { icon: Zap, title: 'No Upsells, No Dashboards', desc: 'Clean, direct interaction for professionals.' },
                    { icon: Headphones, title: '24/7 Expert Support', desc: 'Real people on call, no automated bots.' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-4">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3B82F6]">
                          <item.icon size={24} />
                       </div>
                       <h4 className="font-black text-sm uppercase tracking-tight">{item.title}</h4>
                       <p className="text-xs text-white/50 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* BLUE CTA BANNER */}
      <section className="py-24 max-w-[1250px] mx-auto px-6">
         <div className="bg-[#3B82F6] rounded-[3rem] p-12 md:p-20 text-center text-white space-y-10 shadow-2xl shadow-[#3B82F6]/30">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
               Enhance the Experience of Your Logistics with the <br /> Least Effort Possible. <span className="underline decoration-white/30">Learn How</span> Multikart Fits In.
            </h2>
            <button className="px-12 py-5 bg-white text-[#3B82F6] font-black rounded-2xl hover:bg-black hover:text-white transition-all uppercase text-[11px] tracking-widest shadow-xl">
               Get Started
            </button>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
