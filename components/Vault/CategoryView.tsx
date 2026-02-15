
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Folder, ChevronRight, FolderPlus, Play, FileText, Music, PlayCircle } from 'lucide-react';
import { VaultFolder, VaultCategory, VaultFile } from '../../types';
import { CATEGORIES } from '../../constants';

interface CategoryViewProps {
  category: VaultCategory;
  folders: VaultFolder[];
  onBack: () => void;
  onOpenFolder: (id: string) => void;
  onCreateFolder: (name: string) => void;
}

const FileThumbnail = ({ file }: { file: VaultFile }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (file.type.startsWith('video/') && videoRef.current) {
      videoRef.current.currentTime = 0.5;
    }
  }, [file.data, file.type]);

  if (file.type.startsWith('image/')) {
    return (
      <img 
        src={file.data} 
        className="w-full h-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-110" 
        alt="" 
      />
    );
  }

  if (file.type.startsWith('video/')) {
    return (
      <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
        <video 
          ref={videoRef}
          src={file.data} 
          className={`w-full h-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`} 
          muted 
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          onSeeked={() => setLoaded(true)}
        />
        {!loaded && <Play size={32} className="text-white/10 animate-pulse" />}
      </div>
    );
  }

  // Fallback for Audio/Docs - minimal aesthetic placeholder
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
      {file.type.startsWith('audio/') ? (
        <Music size={48} className="text-slate-600 opacity-50" />
      ) : (
        <FileText size={48} className="text-slate-600 opacity-50" />
      )}
    </div>
  );
};

export const CategoryView: React.FC<CategoryViewProps> = ({ 
  category, folders, onBack, onOpenFolder, onCreateFolder 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const catInfo = CATEGORIES.find(c => c.name === category);

  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setShowCreateModal(false);
    }
  };

  const getFolderThumbnail = (folder: VaultFolder) => {
    if (folder.files.length === 0) return null;
    const activeFiles = folder.files.filter(f => !f.isDeleted);
    if (activeFiles.length === 0) return null;
    return [...activeFiles].sort((a, b) => b.createdAt - a.createdAt)[0];
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-900 scroll-smooth">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors active:scale-90 text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className={`${catInfo?.color} p-2.5 rounded-2xl text-white shadow-lg animate-in slide-in-from-left duration-300`}>
            {catInfo?.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{category} Boxes</h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">গোপন {category} ফোল্ডারসমূহ</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto w-full pb-32">
        {folders.map((folder, index) => {
          const lastFile = getFolderThumbnail(folder);
          return (
            <button 
              key={folder.id}
              onClick={() => onOpenFolder(folder.id)}
              className="relative group flex flex-col items-center justify-center aspect-square rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:border-blue-500/50 hover:bg-white/[0.08] transition-all duration-500 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {lastFile ? (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <FileThumbnail file={lastFile} />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-30">
                  <div className="p-4 bg-white/10 rounded-3xl">
                     {category === 'Photos' ? <Folder size={32} /> : 
                      category === 'Videos' ? <Play size={32} /> :
                      category === 'Audio' ? <Music size={32} /> : <FileText size={32} />}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white">{folder.name}</p>
                </div>
              )}

              {/* Minimal Hover Label - Only Name */}
              {lastFile && (
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-md">
                   <p className="text-xs font-bold text-white truncate text-center">{folder.name}</p>
                </div>
              )}
              
              {/* Glass Reflection Effect on Hover */}
              <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none group-hover:top-[-50%] group-hover:left-[-50%] transition-all duration-1000" />
            </button>
          );
        })}

        {folders.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-white/5 backdrop-blur-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-800/50 rounded-full mb-4">
              <FolderPlus size={64} className="text-slate-500 animate-pulse" />
            </div>
            <p className="font-bold text-slate-400 text-lg">কোন ফোল্ডার নেই</p>
            <p className="text-xs text-slate-500 mt-2 tracking-wide">নিচের প্লাস বাটনে ক্লিক করে প্রথম বক্সটি তৈরি করুন</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-5 rounded-full shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-110 hover:-rotate-6 transition-all transform active:scale-90 z-20 border border-white/20 group"
      >
        <Plus size={32} className="group-hover:scale-125 transition-transform duration-300" />
      </button>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-slate-800 w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in duration-200">
            <div className="text-center">
               <div className="bg-blue-600/20 w-16 h-16 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-4 rotate-3">
                 <FolderPlus size={32} />
               </div>
               <h3 className="text-2xl font-black tracking-tight text-white">নতুন {category} বক্স</h3>
               <p className="text-slate-400 text-sm mt-1">আপনার সিক্রেট বক্সের একটি সুন্দর নাম দিন</p>
            </div>
            
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="বক্সের নাম..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-[1.5rem] p-6 outline-none focus:ring-2 ring-blue-500 text-white text-xl text-center font-bold placeholder:opacity-30 transition-all"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="flex-1 p-5 bg-white/5 rounded-2xl font-bold hover:bg-white/10 transition-colors border border-white/5 text-slate-300"
              >
                বাতিল
              </button>
              <button 
                onClick={handleCreate} 
                className="flex-1 p-5 bg-blue-600 rounded-2xl font-black text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 transform active:scale-95"
              >
                তৈরি করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
