
import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';
import { AppState } from '../../types';

interface DecoySetupViewProps {
  appState: AppState;
  onBack: () => void;
  onUpdateFakePassword: (pass: string) => void;
}

export const DecoySetupView: React.FC<DecoySetupViewProps> = ({ appState, onBack, onUpdateFakePassword }) => {
  const [fakePassword, setFakePassword] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSetFake = () => {
    if (fakePassword.length === appState.passwordLength) {
      if (fakePassword === appState.password) {
        setMessage({ text: 'আসল এবং ফেক পাসওয়ার্ড এক হতে পারবে না!', type: 'error' });
        return;
      }
      onUpdateFakePassword(fakePassword);
      setMessage({ text: 'ফেক পাসওয়ার্ড সফলভাবে সেট হয়েছে।', type: 'success' });
      setTimeout(onBack, 1500);
    } else {
      setMessage({ text: `${appState.passwordLength} ডিজিটের পাসওয়ার্ড দিন।`, type: 'error' });
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-900 text-white">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors active:scale-90">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">ফেক পাসওয়ার্ড সেটআপ</h1>
      </header>

      <div className="max-w-md mx-auto w-full space-y-8">
        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        <section className="bg-slate-800/50 border border-white/5 p-8 rounded-[2.5rem] space-y-6 text-center">
          <div className="bg-rose-600/10 w-16 h-16 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-2">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold">ফেক পাসওয়ার্ড (Decoy)</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed px-4">
              কেউ যদি জোর করে পাসওয়ার্ড দেখতে চায়, তবে তাকে এই পাসওয়ার্ডটি দিন। এতে একটি সম্পূর্ণ নতুন এবং খালি ভোল্ট ওপেন হবে।
            </p>
          </div>
          <input 
            type="password" 
            maxLength={appState.passwordLength}
            placeholder="****"
            className="w-full bg-slate-900 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 ring-rose-500 text-center font-bold tracking-[1em] text-2xl placeholder:opacity-10"
            value={fakePassword}
            onChange={(e) => setFakePassword(e.target.value.replace(/\D/g, ''))}
          />
          <button 
            onClick={handleSetFake}
            className="w-full py-4 bg-rose-600 rounded-2xl font-bold hover:bg-rose-500 transition-all active:scale-95"
          >
            সেট করুন
          </button>
        </section>
      </div>
    </div>
  );
};
