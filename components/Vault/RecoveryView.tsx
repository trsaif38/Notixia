
import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, AlertCircle } from 'lucide-react';
import { AppState } from '../../types';

interface RecoveryViewProps {
  appState: AppState;
  onBack: () => void;
  onSuccess: () => void;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({ appState, onBack, onSuccess }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (answer.toLowerCase().trim() === appState.securityAnswer?.toLowerCase().trim()) {
      onSuccess();
    } else {
      setError('ভুল উত্তর! আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-900 text-white">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors active:scale-90">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">পাসওয়ার্ড পুনরুদ্ধার</h1>
      </header>

      <div className="max-w-md mx-auto w-full space-y-8">
        <section className="bg-slate-800/50 border border-white/5 p-8 rounded-[2.5rem] space-y-6 text-center">
          <div className="bg-orange-600/10 w-16 h-16 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-2">
            <HelpCircle size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold">নিরাপত্তা প্রশ্ন</h2>
            <p className="text-sm text-slate-300 mt-2 p-3 bg-slate-900/50 rounded-xl border border-white/5">
              {appState.securityQuestion}
            </p>
          </div>
          
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="আপনার উত্তর এখানে লিখুন"
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 ring-orange-500 text-center font-bold text-lg"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError('');
              }}
            />
            {error && <p className="text-red-500 text-xs font-bold flex items-center justify-center gap-1"><AlertCircle size={12} /> {error}</p>}
          </div>

          <button 
            onClick={handleVerify}
            className="w-full py-4 bg-orange-600 rounded-2xl font-bold hover:bg-orange-500 transition-all active:scale-95"
          >
            যাচাই করুন
          </button>
        </section>
      </div>
    </div>
  );
};
