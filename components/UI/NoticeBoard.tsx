
import React from 'react';
import { Info, ShieldCheck, HardDrive, ArrowUpLeft } from 'lucide-react';

interface NoticeBoardProps {
  onClose: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border border-white/20 mt-20">
        <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-6 rotate-3 shadow-xl shadow-blue-500/30">
          <Info size={32} />
        </div>
        
        <h2 className="text-2xl font-bold mb-4 leading-tight">স্বাগতম Notixia অ্যাপে!</h2>
        
        <div className="space-y-4 text-slate-600 mb-8">
          <div className="flex gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 relative overflow-hidden group">
             <div className="text-blue-600 shrink-0 mt-1"><ShieldCheck size={20} /></div>
             <p className="text-sm leading-relaxed">
                প্রাইভেট ভোল্ট ওপেন করতে চাইলে উপরে বাম পাশের <strong className="text-blue-600">লোগোটিতে</strong> এক সেকেন্ড ক্লিক করে ধরে রাখুন। (উপরে নির্দেশ করা হয়েছে)
             </p>
             <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:rotate-12 transition-transform">
                <ArrowUpLeft size={64} />
             </div>
          </div>

          <div className="flex gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
             <div className="text-emerald-600 shrink-0 mt-1"><HardDrive size={20} /></div>
             <p className="text-sm leading-relaxed text-emerald-900">
                আপনার আপলোড করা সকল ফাইল ফোনের নিজস্ব স্টোরেজে জমা থাকবে। ফোনের মেমোরি খালি থাকা পর্যন্ত আনলিমিটেড ফাইল ইমপোর্ট করা যাবে।
             </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold hover:bg-slate-800 transition-all transform active:scale-95 shadow-lg shadow-black/20"
        >
          ঠিক আছে, বুঝতে পেরেছি!
        </button>
      </div>
    </div>
  );
};
