
import React, { useState, useRef } from 'react';
import { Book, PenTool, Search, Plus, Menu, ArrowUpLeft, X, Trash2 } from 'lucide-react';
import { Note } from '../types';

interface NotebookProps {
  notes: Note[];
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onLongPress: () => void;
  isHighlighted: boolean;
}

export const Notebook: React.FC<NotebookProps> = ({ notes, onAddNote, onDeleteNote, onLongPress, isHighlighted }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = () => {
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      onLongPress();
      setIsPressing(false);
    }, 1000);
  };

  const endPress = () => {
    setIsPressing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleSaveNote = () => {
    if (newTitle.trim() || newContent.trim()) {
      onAddNote(newTitle || 'শিরোনামহীন নোট', newContent);
      setNewTitle('');
      setNewContent('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#fafaf9] flex flex-col items-center relative overflow-hidden">
      {/* Premium Header - Modern Minimalist */}
      <header className="w-full px-6 py-5 flex items-center justify-between z-[60] absolute top-0 left-0 bg-white/70 backdrop-blur-xl border-b border-stone-200/60">
        <div className="relative">
          <div 
            className={`flex items-center cursor-pointer transition-all duration-500 rounded-2xl px-2 py-1 z-20 relative ${isPressing ? 'scale-90' : 'hover:scale-105'}`}
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={endPress}
            onTouchStart={startPress}
            onTouchEnd={endPress}
          >
            <span className="font-black text-indigo-950 text-3xl tracking-tighter uppercase italic drop-shadow-sm">Notixia</span>

            {/* Ripple Effect for Highlight */}
            {isHighlighted && (
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-indigo-500 rounded-2xl animate-ping opacity-20" />
                <div className="absolute -inset-3 bg-indigo-400/10 rounded-[2rem] animate-pulse border border-indigo-500/30" />
              </div>
            )}
          </div>

          {/* Floating Pointer for Onboarding */}
          {isHighlighted && (
            <div className="absolute top-16 left-4 flex flex-col items-center animate-bounce z-50 pointer-events-none">
              <ArrowUpLeft size={32} className="text-indigo-600 drop-shadow-xl" />
              <div className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap mt-1 border border-white/20">
                এখানে ১ সেকেন্ড চেপে ধরুন
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 text-stone-400 items-center">
          <button className="p-2.5 hover:bg-white hover:text-indigo-600 rounded-xl transition-all cursor-pointer shadow-sm border border-stone-100 bg-stone-50/50">
            <Search size={20} />
          </button>
          <button className="p-2.5 hover:bg-white hover:text-indigo-600 rounded-xl transition-all cursor-pointer shadow-sm border border-stone-100 bg-stone-50/50">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Main Content: 2-Column Grid with Smaller Note Boxes */}
      <main className="mt-24 w-full max-w-[600px] px-4 h-[calc(100vh-120px)] overflow-y-auto scroll-smooth">
        <div className="grid grid-cols-2 gap-4 pb-24">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className={`bg-white p-4 rounded-[2rem] shadow-[0_8px_20px_-10px_rgba(0,0,0,0.05)] border border-stone-200/50 flex flex-col justify-between aspect-square group relative transition-all hover:shadow-[0_15px_30px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1`}
            >
              {/* Note color accent line - subtle */}
              <div className={`absolute top-6 left-0 w-1 h-8 rounded-r-full ${note.color.replace('bg-', 'bg-opacity-80 bg-')}`} />
              
              <div className="pl-2">
                <h3 className="font-bold text-stone-800 text-sm leading-tight mb-2 line-clamp-2 tracking-tight">{note.title}</h3>
                <p className="text-stone-500 text-xs handwritten leading-relaxed line-clamp-3">{note.content}</p>
              </div>
              
              <div className="flex justify-between items-center mt-2 pl-2">
                <span className="text-[9px] text-stone-300 font-bold uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()}</span>
                <button 
                  onClick={() => onDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="col-span-full py-24 text-center flex flex-col items-center">
              <div className="p-8 bg-stone-100 rounded-[2.5rem] mb-4 text-stone-300">
                <Book size={48} strokeWidth={1.5} />
              </div>
              <p className="font-bold text-xl text-stone-800 tracking-tight">নোটবুকটি খালি</p>
              <p className="text-stone-400 mt-2 max-w-[200px] mx-auto text-xs leading-relaxed">আপনার মনের কথাগুলো লিখে রাখতে নিচের কলম বাটনে চাপ দিন।</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button - Re-positioned for smaller layout */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-5 rounded-[1.5rem] shadow-[0_15px_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:scale-110 hover:rotate-3 active:scale-95 transition-all z-10 border border-indigo-400/30 group"
      >
        <PenTool size={28} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] border border-stone-200/50 animate-in zoom-in duration-400">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h3 className="text-xl font-black text-stone-800 tracking-tight">নতুন নোট</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2.5 hover:bg-white hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-stone-200">
                <X size={20} className="text-stone-400" />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <input 
                type="text" 
                placeholder="শিরোনাম..."
                className="w-full text-xl font-black outline-none border-b-2 border-stone-100 pb-3 focus:border-indigo-500 transition-all placeholder:text-stone-200"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea 
                placeholder="এখানে আপনার মনের কথা লিখুন..."
                className="w-full h-48 handwritten text-xl outline-none resize-none leading-relaxed text-stone-600 placeholder:text-stone-200"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <button 
                onClick={handleSaveNote}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-200 active:scale-[0.98]"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soft Background Accents */}
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-100/30 rounded-full blur-[80px] -z-10" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-stone-100/40 rounded-full blur-[80px] -z-10" />
    </div>
  );
};
