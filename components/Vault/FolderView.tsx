
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2, Download, CheckCircle, Circle, Play, FileIcon, Volume2, CheckSquare, Square, PlayCircle } from 'lucide-react';
import { VaultFolder, VaultFile } from '../../types';
import { VideoPlayer } from './VideoPlayer';

interface FolderViewProps {
  folder: VaultFolder;
  onBack: () => void;
  onAddFiles: (files: VaultFile[]) => void;
  onUpdateFiles: (files: VaultFile[]) => void;
}

const VideoThumbnail = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      // Attempt to capture a frame at 0.5 seconds
      videoRef.current.currentTime = 0.5;
    }
  }, [src]);

  return (
    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      <video 
        ref={videoRef}
        src={src} 
        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-70' : 'opacity-0'}`} 
        muted 
        playsInline
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
        onSeeked={() => setLoaded(true)}
      />
      {!loaded && <Play size={24} className="text-white/20 animate-pulse" />}
      <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
        <PlayCircle size={32} className="text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-300 drop-shadow-lg" />
      </div>
    </div>
  );
};

export const FolderView: React.FC<FolderViewProps> = ({ folder, onBack, onAddFiles, onUpdateFiles }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingFile, setViewingFile] = useState<VaultFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getAcceptedType = () => {
    switch(folder.category) {
      case 'Photos': return 'image/*';
      case 'Videos': return 'video/*';
      case 'Audio': return 'audio/*';
      case 'Documents': return '.pdf,.doc,.docx,.txt';
      default: return '*';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newVaultFiles: VaultFile[] = await Promise.all(
      files.map(file => new Promise<VaultFile>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target?.result as string,
            createdAt: Date.now(),
            isDeleted: false,
          });
        };
        reader.readAsDataURL(file);
      }))
    );
    onAddFiles(newVaultFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleLongPressStart = (id: string) => {
    longPressTimer.current = setTimeout(() => {
      toggleSelect(id);
    }, 600);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleItemClick = (file: VaultFile) => {
    if (selectedIds.size > 0) {
      toggleSelect(file.id);
    } else {
      setViewingFile(file);
    }
  };

  const selectAll = () => {
    const currentFiles = folder.files.filter(f => !f.isDeleted);
    if (selectedIds.size === currentFiles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentFiles.map(f => f.id)));
    }
  };

  const deleteSelected = () => {
    const updated = folder.files.map(f => selectedIds.has(f.id) ? { ...f, isDeleted: true } : f);
    onUpdateFiles(updated);
    setSelectedIds(new Set());
  };

  const downloadFile = (file: VaultFile) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const restoreAndDownloadSelected = () => {
    folder.files.forEach(file => {
      if (selectedIds.has(file.id)) {
        downloadFile(file);
      }
    });

    const updated = folder.files.map(f => selectedIds.has(f.id) ? { ...f, isDeleted: false } : f);
    onUpdateFiles(updated);
    setSelectedIds(new Set());
  };

  const currentFiles = folder.files.filter(f => !f.isDeleted);
  const trashFiles = folder.files.filter(f => f.isDeleted);
  
  const [showTrash, setShowTrash] = useState(false);
  const displayFiles = showTrash ? trashFiles : currentFiles;

  const isAllSelected = selectedIds.size > 0 && selectedIds.size === displayFiles.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-white relative">
      <header className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold">{folder.name}</h2>
            <p className="text-xs text-slate-400">{displayFiles.length} files • {folder.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 ? (
            <button 
              onClick={selectAll} 
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all border border-slate-700"
            >
              {isAllSelected ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </button>
          ) : (
            <button 
              onClick={() => setShowTrash(!showTrash)} 
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all border ${showTrash ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            >
              {showTrash ? 'Bin View' : 'Vault View'}
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        {displayFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <div className="bg-slate-800 p-8 rounded-[3rem] mb-4">
              <FileIcon size={64} />
            </div>
            <p className="text-xl font-bold">No Files Found</p>
            <p className="text-sm">Long press to select items or click + to add</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-32">
            {displayFiles.map(file => (
              <div 
                key={file.id} 
                className={`relative rounded-2xl overflow-hidden aspect-square bg-slate-800 group cursor-pointer border-2 transition-all duration-300 ${selectedIds.has(file.id) ? 'border-blue-500 scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-transparent hover:border-slate-700'}`}
                onMouseDown={() => handleLongPressStart(file.id)}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={() => handleLongPressStart(file.id)}
                onTouchEnd={handleLongPressEnd}
                onClick={() => handleItemClick(file)}
              >
                {folder.category === 'Photos' ? (
                  <img src={file.data} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={file.name} />
                ) : folder.category === 'Videos' ? (
                  <VideoThumbnail src={file.data} />
                ) : folder.category === 'Audio' ? (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-900/30">
                    <Volume2 size={40} className="text-emerald-500 opacity-70" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-700">
                    <FileIcon size={40} className="text-white opacity-70" />
                  </div>
                )}
                
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
                  <p className="text-[10px] truncate font-bold text-white/90">{file.name}</p>
                </div>

                <div 
                  className={`absolute top-3 right-3 p-1.5 rounded-full transition-all duration-300 ${selectedIds.has(file.id) ? 'bg-blue-600 scale-110 shadow-lg' : 'bg-black/50 text-white/50 opacity-0 group-hover:opacity-100'}`}
                  onClick={(e) => { e.stopPropagation(); toggleSelect(file.id); }}
                >
                  {selectedIds.has(file.id) ? <CheckCircle size={16} /> : <Circle size={16} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-[2rem] p-2 flex items-center gap-4 shadow-2xl z-40 animate-in slide-in-from-bottom-10 duration-300">
          <div className="px-6 py-2">
            <span className="text-sm font-bold text-blue-400">{selectedIds.size} Selected</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-700" />
          <div className="flex items-center gap-2 pr-2">
            <button 
              onClick={restoreAndDownloadSelected}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all active:scale-95"
            >
              <Download size={20} />
              <span>Restore & Download</span>
            </button>
            <button 
              onClick={deleteSelected}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-2xl font-bold transition-all active:scale-95 border border-red-600/30"
            >
              <Trash2 size={20} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {selectedIds.size === 0 && !showTrash && (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="fixed bottom-10 right-10 bg-blue-600 text-white p-5 rounded-full shadow-2xl hover:bg-blue-500 hover:scale-110 transition-all z-20 active:rotate-90 active:scale-90"
        >
          <Plus size={32} />
        </button>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept={getAcceptedType()} 
        multiple 
        onChange={handleFileUpload}
      />

      {viewingFile && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col animate-in fade-in duration-300">
          <header className="p-4 flex items-center justify-between absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-lg z-10 border-b border-white/5">
            <button onClick={() => setViewingFile(null)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="text-center flex-1 mx-4">
              <h3 className="font-bold text-white truncate text-sm">{viewingFile.name}</h3>
              <p className="text-[10px] text-gray-400">{(viewingFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button onClick={() => downloadFile(viewingFile)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
              <Download size={24} />
            </button>
          </header>

          <div className="flex-1 flex items-center justify-center p-4">
            {folder.category === 'Photos' ? (
              <img src={viewingFile.data} className="max-w-full max-h-full object-contain shadow-2xl" alt="" />
            ) : folder.category === 'Videos' ? (
              <VideoPlayer 
                file={viewingFile} 
                playlist={displayFiles} 
                onClose={() => setViewingFile(null)} 
              />
            ) : (
              <div className="flex flex-col items-center gap-8 bg-slate-900/50 p-12 rounded-[3rem] border border-white/5 backdrop-blur-sm">
                <div className="p-10 bg-blue-600/10 rounded-full">
                   <FileIcon size={80} className="text-blue-500" />
                </div>
                <div className="text-center">
                  <p className="text-white text-2xl font-bold mb-2">{viewingFile.name}</p>
                  <p className="text-gray-400 text-sm">Supported through system viewer</p>
                </div>
                <button 
                  onClick={() => downloadFile(viewingFile)}
                  className="px-10 py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center gap-3"
                >
                  <Download size={20} />
                  Download to View
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
