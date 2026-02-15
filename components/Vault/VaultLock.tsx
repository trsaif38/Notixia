
import React, { useState, useEffect } from 'react';
import { Shield, ChevronLeft, Delete, Check, HelpCircle } from 'lucide-react';
import { AppState } from '../../types';

interface VaultLockProps {
  appState: AppState;
  onSuccess: (password: string, isFake: boolean, question?: string, answer?: string) => void;
  onClose: () => void;
  onUpdateLength: (len: 4 | 6) => void;
}

const QUESTIONS = [
  "আপনার প্রিয় রং কি?",
  "আপনার প্রথম স্কুলের নাম কি?",
  "আপনার প্রিয় খাবারের নাম কি?",
  "আপনার শৈশবের ডাকনাম কি?",
  "আপনার প্রিয় খেলোয়াড়ের নাম কি?"
];

type LockMode = 'verify' | 'setup-init' | 'setup-confirm' | 'recovery' | 'setup-question';

export const VaultLock: React.FC<VaultLockProps> = ({ appState, onSuccess, onClose, onUpdateLength }) => {
  const [mode, setMode] = useState<LockMode>(appState.isPasswordSet ? 'verify' : 'setup-init');
  const [input, setInput] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(QUESTIONS[0]);
  const [answer, setAnswer] = useState('');

  const targetLength = appState.passwordLength;

  const handleKeyPress = (num: string) => {
    if (input.length < targetLength) {
      const newInput = input + num;
      setInput(newInput);
      setError('');

      if (newInput.length === targetLength) {
        processInput(newInput);
      }
    }
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
    setError('');
  };

  const processInput = (val: string) => {
    if (mode === 'verify') {
      if (val === appState.password) {
        onSuccess(val, false);
      } else if (appState.fakePassword && val === appState.fakePassword) {
        onSuccess(val, true);
      } else {
        setError('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
        setInput('');
      }
    } else if (mode === 'setup-init') {
      setTempPassword(val);
      setMode('setup-confirm');
      setInput('');
    } else if (mode === 'setup-confirm') {
      if (val === tempPassword) {
        setMode('setup-question');
        setInput('');
      } else {
        setError('পাসওয়ার্ড মেলেনি! আবার শুরু করুন।');
        setMode('setup-init');
        setInput('');
      }
    }
  };

  const submitQuestion = () => {
    if (answer.trim()) {
      onSuccess(tempPassword, false, selectedQuestion, answer);
    } else {
      setError('দয়া করে উত্তর দিন।');
    }
  };

  const handleRecovery = () => {
    if (answer.toLowerCase() === appState.securityAnswer?.toLowerCase()) {
      onSuccess(appState.password!, false);
    } else {
      setError('ভুল উত্তর! আবার চেষ্টা করুন।');
    }
  };

  if (mode === 'setup-question') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 text-white">
        <div className="bg-blue-600/20 p-4 rounded-full mb-6">
          <HelpCircle size={48} className="text-blue-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">নিরাপত্তা প্রশ্ন</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">পাসওয়ার্ড ভুলে গেলে এটি ব্যবহার করে রিস্টোর করতে পারবেন।</p>
        
        <div className="w-full space-y-4">
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:ring-2 ring-blue-500"
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
          >
            {QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="আপনার উত্তর এখানে লিখুন"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:ring-2 ring-blue-500"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            onClick={submitQuestion}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-500 transition-colors"
          >
            সম্পন্ন করুন
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'recovery') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 text-white">
        <button onClick={() => setMode('verify')} className="absolute top-6 left-6 p-2 hover:bg-slate-800 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <div className="bg-orange-600/20 p-4 rounded-full mb-6">
          <HelpCircle size={48} className="text-orange-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">পাসওয়ার্ড পুনরুদ্ধার</h2>
        <p className="text-slate-400 text-center mb-6 text-sm">{appState.securityQuestion}</p>
        <div className="w-full space-y-4">
          <input 
            type="text" 
            placeholder="আপনার উত্তর"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:ring-2 ring-blue-500"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            onClick={handleRecovery}
            className="w-full bg-orange-600 text-white p-4 rounded-xl font-bold"
          >
            ভেরিফাই করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white p-6 relative">
      <header className="flex justify-between items-center mb-8">
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <div className="flex bg-slate-800 rounded-full p-1">
          <button 
            disabled={appState.isPasswordSet}
            onClick={() => onUpdateLength(4)}
            className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${targetLength === 4 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            4 Digits
          </button>
          <button 
            disabled={appState.isPasswordSet}
            onClick={() => onUpdateLength(6)}
            className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${targetLength === 6 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            6 Digits
          </button>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="bg-blue-600/20 p-4 rounded-[2rem] rotate-6">
          <Shield size={48} className="text-blue-500 -rotate-6" />
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {mode === 'verify' ? 'পাসওয়ার্ড দিন' : mode === 'setup-init' ? 'নতুন পাসওয়ার্ড সেট করুন' : 'পাসওয়ার্ডটি কনফার্ম করুন'}
          </h2>
          {error ? <p className="text-red-500 text-sm mt-2 font-medium">{error}</p> : <p className="text-slate-400 text-sm mt-2">আপনার সুরক্ষিত ভোল্টে প্রবেশ করুন</p>}
        </div>

        <div className="flex gap-4">
          {Array.from({ length: targetLength }).map((_, i) => (
            <div 
              key={i} 
              className={`w-12 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${input.length > i ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800 border-slate-700'}`}
            >
              {input.length > i && <div className="w-3 h-3 bg-white rounded-full animate-in zoom-in" />}
            </div>
          ))}
        </div>

        {mode === 'verify' && (
          <button onClick={() => setMode('recovery')} className="text-blue-500 text-sm font-medium hover:underline">
            পাসওয়ার্ড ভুলে গেছেন?
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 pb-8 max-w-sm mx-auto w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num}
            onClick={() => handleKeyPress(num.toString())}
            className="h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 text-2xl font-bold active:scale-90 transition-all"
          >
            {num}
          </button>
        ))}
        <div />
        <button 
          onClick={() => handleKeyPress('0')}
          className="h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 text-2xl font-bold active:scale-90 transition-all"
        >
          0
        </button>
        <button 
          onClick={handleBackspace}
          className="h-16 rounded-2xl bg-slate-800/50 hover:bg-red-900/30 flex items-center justify-center active:scale-90 transition-all"
        >
          <Delete size={28} />
        </button>
      </div>
    </div>
  );
};
