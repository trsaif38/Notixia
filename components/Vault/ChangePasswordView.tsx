
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Lock, ShieldCheck } from 'lucide-react';
import { AppState } from '../../types';

interface ChangePasswordViewProps {
  appState: AppState;
  onBack: () => void;
  onUpdatePassword: (pass: string) => void;
  onNavigate: (view: 'recovery-settings') => void;
  skipVerify?: boolean;
}

export const ChangePasswordView: React.FC<ChangePasswordViewProps> = ({ 
  appState, 
  onBack, 
  onUpdatePassword, 
  onNavigate,
  skipVerify = false 
}) => {
  const [step, setStep] = useState<'verify' | 'new'>(skipVerify ? 'new' : 'verify');
  const [currentInput, setCurrentInput] = useState('');
  const [newInput, setNewInput] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (skipVerify) setStep('new');
  }, [skipVerify]);

  const handleVerify = () => {
    if (currentInput === appState.password) {
      setStep('new');
      setMessage(null);
    } else {
      setMessage({ text: 'বর্তমান পাসওয়ার্ড সঠিক নয়!', type: 'error' });
    }
  };

  const handleUpdate = () => {
    if (newInput.length === appState.passwordLength) {
      if (newInput === appState.fakePassword) {
        setMessage({ text: 'আসল এবং ফেক পাসওয়ার্ড এক হতে পারবে না!', type: 'error' });
        return;
      }
      onUpdatePassword(newInput);
      setMessage({ text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।', type: 'success' });
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
        <h1 className="text-2xl font-bold tracking-tight">পাসওয়ার্ড পরিবর্তন</h1>
      </header>

      <div className="max-w-md mx-auto w-full space-y-8">
        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        {step === 'verify' ? (
          <section className="bg-slate-800/50 border border-white/5 p-8 rounded-[2.5rem] space-y-6 text-center">
            <div className="bg-blue-600/10 w-16 h-16 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-2">
              <Lock size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold">বর্তমান পাসওয়ার্ড দিন</h2>
              <p className="text-xs text-slate-400 mt-1">পাসওয়ার্ড পরিবর্তনের জন্য এটি প্রয়োজন</p>
            </div>
            <input 
              type="password" 
              maxLength={appState.passwordLength}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 ring-blue-500 text-center font-bold tracking-[1em] text-2xl"
              value={currentInput}
              onChange={(e) => {
                setCurrentInput(e.target.value.replace(/\D/g, ''));
                if (message) setMessage(null);
              }}
            />
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleVerify}
                className="w-full py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 transition-all active:scale-95"
              >
                যাচাই করুন
              </button>
              <button 
                onClick={() => onNavigate('recovery-settings')}
                className="text-blue-400 text-sm font-bold hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
          </section>
        ) : (
          <section className="bg-slate-800/50 border border-white/5 p-8 rounded-[2.5rem] space-y-6 text-center animate-in slide-in-from-right duration-300">
            <div className="bg-emerald-600/10 w-16 h-16 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-2">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold">নতুন পাসওয়ার্ড দিন</h2>
              <p className="text-xs text-slate-400 mt-1">আপনার নতুন সুরক্ষিত পাসওয়ার্ডটি লিখুন</p>
            </div>
            <input 
              type="password" 
              maxLength={appState.passwordLength}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 ring-emerald-500 text-center font-bold tracking-[1em] text-2xl"
              value={newInput}
              onChange={(e) => {
                setNewInput(e.target.value.replace(/\D/g, ''));
                if (message) setMessage(null);
              }}
            />
            <button 
              onClick={handleUpdate}
              className="w-full py-4 bg-emerald-600 rounded-2xl font-bold hover:bg-emerald-500 transition-all active:scale-95"
            >
              পরিবর্তন করুন
            </button>
          </section>
        )}
      </div>
    </div>
  );
};
