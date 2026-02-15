
import React from 'react';
import { ArrowLeft, Key, Lock, ShieldAlert, LifeBuoy, ChevronRight } from 'lucide-react';
import { AppState } from '../../types';

interface SettingsViewProps {
  appState: AppState;
  onBack: () => void;
  onNavigate: (view: 'change-password' | 'setup-decoy' | 'recovery-settings') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onNavigate }) => {
  const SettingButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    colorClass 
  }: { 
    icon: any, 
    label: string, 
    onClick: () => void, 
    colorClass: string 
  }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 bg-slate-800/40 hover:bg-slate-800/70 border border-white/5 rounded-2xl transition-all active:scale-[0.98] group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 ${colorClass} rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon size={20} />
        </div>
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
    </button>
  );

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-900 text-white overflow-y-auto">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors active:scale-90">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">ভোল্ট সেটিংস</h1>
      </header>

      <div className="max-w-md mx-auto w-full space-y-3">
        <SettingButton 
          icon={Lock} 
          label="পাসওয়ার্ড পরিবর্তন" 
          onClick={() => onNavigate('change-password')} 
          colorClass="bg-blue-600/10 text-blue-500"
        />
        
        <SettingButton 
          icon={ShieldAlert} 
          label="ফেক পাসওয়ার্ড সেটআপ" 
          onClick={() => onNavigate('setup-decoy')} 
          colorClass="bg-rose-600/10 text-rose-500"
        />

        <SettingButton 
          icon={LifeBuoy} 
          label="ফরগট পাসওয়ার্ড" 
          onClick={() => onNavigate('recovery-settings')} 
          colorClass="bg-orange-600/10 text-orange-500"
        />
      </div>

      <div className="mt-auto mb-8 p-4 bg-slate-800/30 rounded-2xl border border-white/5 flex items-start gap-3 max-w-md mx-auto">
        <Key size={16} className="text-slate-500 mt-1" />
        <p className="text-[10px] text-slate-500 leading-relaxed">
          নিরাপত্তা টিপস: আপনার মূল পাসওয়ার্ড এবং ফেক পাসওয়ার্ড আলাদা রাখুন। ফরগট পাসওয়ার্ড অপশনটি ব্যবহার করার জন্য আপনার সেট করা নিরাপত্তা প্রশ্নের উত্তর প্রয়োজন হবে।
        </p>
      </div>
    </div>
  );
};
