
import React from 'react';
import { ArrowLeft, HardDrive, ShieldCheck, Settings } from 'lucide-react';
import { VaultCategory } from '../../types';
import { CATEGORIES } from '../../constants';

interface VaultDashboardProps {
  onBack: () => void;
  onSelectCategory: (category: VaultCategory) => void;
  onOpenSettings: () => void;
}

export const VaultDashboard: React.FC<VaultDashboardProps> = ({ 
  onBack, onSelectCategory, onOpenSettings 
}) => {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-900">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-slate-800 hover:bg-slate-750 rounded-full transition-colors text-slate-300">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Notixia Vault</h1>
            <p className="text-slate-400">আপনার ফাইলগুলো ক্যাটাগরি অনুযায়ী সাজানো</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenSettings} className="p-3 bg-slate-800 hover:bg-slate-750 rounded-full transition-colors text-slate-300">
            <Settings size={24} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-start pt-4">
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.name} 
              onClick={() => onSelectCategory(cat.name)}
              className="group relative flex flex-col items-center justify-center gap-6 aspect-square rounded-[2.5rem] bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition-all duration-300 shadow-xl overflow-hidden"
            >
              <div className={`p-6 rounded-3xl ${cat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <div className="text-center">
                <span className="font-bold text-xl block mb-1">{cat.name}</span>
                <span className="text-xs text-slate-500 uppercase tracking-widest">Open Box</span>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>
      
      {/* Storage Reassurance Section */}
      <div className="mt-auto mb-8 max-w-2xl mx-auto w-full">
        <div className="bg-slate-800/50 border border-white/5 rounded-[2rem] p-6 flex items-center gap-5">
          <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-500">
            <HardDrive size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white flex items-center gap-2">
              লোকাল ডিভাইস স্টোরেজ
              <ShieldCheck size={16} className="text-emerald-500" />
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              আপনার আপলোড করা সকল ফাইল আপনার ফোনের ইন্টারনাল স্টোরেজে সুরক্ষিত আছে। ফোনের স্টোরেজ খালি থাকা পর্যন্ত আপনি যত খুশি ফাইল ইমপোর্ট করতে পারবেন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
