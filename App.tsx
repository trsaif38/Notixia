
import React, { useState, useEffect, useCallback } from 'react';
import { Notebook } from './components/Notebook';
import { VaultDashboard } from './components/Vault/VaultDashboard';
import { CategoryView } from './components/Vault/CategoryView';
import { FolderView } from './components/Vault/FolderView';
import { NoticeBoard } from './components/UI/NoticeBoard';
import { VaultLock } from './components/Vault/VaultLock';
import { SettingsView } from './components/Vault/SettingsView';
import { ChangePasswordView } from './components/Vault/ChangePasswordView';
import { DecoySetupView } from './components/Vault/DecoySetupView';
import { RecoveryView } from './components/Vault/RecoveryView';
import { AppState, VaultCategory, VaultFolder, Note } from './types';
import { INITIAL_FOLDERS } from './constants';
import { loadState, saveState } from './db';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'settings' | 'category' | 'folder' | 'change-password' | 'setup-decoy' | 'recovery-settings'>('dashboard');
  const [skipVerify, setSkipVerify] = useState(false);
  const [appState, setAppState] = useState<AppState>({
    isVaultOpen: false,
    folders: INITIAL_FOLDERS,
    fakeFolders: INITIAL_FOLDERS.map(f => ({ ...f, id: f.id + '_fake' })),
    notes: [
      { id: '1', title: 'স্বাগতম', content: 'আপনার মনের কথা এখানে লিখে রাখুন।', createdAt: Date.now(), color: 'bg-indigo-500' },
      { id: '2', title: 'গোপন তথ্য', content: 'লোগোতে চেপে ধরে ভোল্টটি দেখুন।', createdAt: Date.now(), color: 'bg-stone-400' }
    ],
    showOnboarding: true,
    isPasswordSet: false,
    passwordLength: 4,
    isFakeSession: false
  });

  const [activeCategory, setActiveCategory] = useState<VaultCategory | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const saved = await loadState();
        if (saved) {
          setAppState(prev => ({ ...saved, isFakeSession: false }));
        }
      } catch (error) {
        console.error("Critical error loading database state:", error);
      } finally {
        // Always set loaded to true so the app renders even if DB fails
        setIsLoaded(true);
      }
    };
    fetchState();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const { isFakeSession, ...stateToSave } = appState;
      saveState(stateToSave as AppState).catch(err => console.error("Failed to save state:", err));
    }
  }, [appState, isLoaded]);

  const toggleVault = useCallback((open: boolean) => {
    setAppState(prev => ({ ...prev, isVaultOpen: open, isFakeSession: false }));
    if (!open) {
      setActiveFolderId(null);
      setActiveCategory(null);
      setIsVerified(false);
      setActiveView('dashboard');
      setSkipVerify(false);
    }
  }, []);

  const handlePasswordSuccess = useCallback((password: string, isFake: boolean, question?: string, answer?: string) => {
    if (!appState.isPasswordSet) {
      setAppState(prev => ({
        ...prev,
        isPasswordSet: true,
        password,
        securityQuestion: question,
        securityAnswer: answer,
        isFakeSession: false
      }));
    } else {
      setAppState(prev => ({ ...prev, isFakeSession: isFake }));
    }
    setIsVerified(true);
  }, [appState.isPasswordSet]);

  const completeOnboarding = useCallback(() => {
    setAppState(prev => ({ ...prev, showOnboarding: false }));
  }, []);

  const getFolders = () => appState.isFakeSession ? appState.fakeFolders : appState.folders;

  const createFolder = useCallback((name: string, category: VaultCategory) => {
    const newFolder: VaultFolder = {
      id: crypto.randomUUID(),
      name,
      category,
      files: [],
    };
    const folderKey = appState.isFakeSession ? 'fakeFolders' : 'folders';
    setAppState(prev => ({
      ...prev,
      [folderKey]: [...(prev[folderKey] as VaultFolder[]), newFolder]
    }));
  }, [appState.isFakeSession]);

  const updateFiles = useCallback((folderId: string, updatedFiles: any[]) => {
    const folderKey = appState.isFakeSession ? 'fakeFolders' : 'folders';
    setAppState(prev => ({
      ...prev,
      [folderKey]: (prev[folderKey] as VaultFolder[]).map(f => 
        f.id === folderId ? { ...f, files: updatedFiles } : f
      )
    }));
  }, [appState.isFakeSession]);

  const addFilesToFolder = useCallback((folderId: string, newFiles: any[]) => {
    const folderKey = appState.isFakeSession ? 'fakeFolders' : 'folders';
    setAppState(prev => ({
      ...prev,
      [folderKey]: (prev[folderKey] as VaultFolder[]).map(f => 
        f.id === folderId ? { ...f, files: [...f.files, ...newFiles] } : f
      )
    }));
  }, [appState.isFakeSession]);

  const addNote = useCallback((title: string, content: string) => {
    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-stone-500', 'bg-blue-500'];
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: Date.now(),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setAppState(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setAppState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
  }, []);

  const activeFolder = getFolders().find(f => f.id === activeFolderId);

  if (!isLoaded) {
    return (
      <div className="h-screen w-full bg-indigo-600 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center animate-pulse">
          <span className="text-white font-black text-5xl italic tracking-tighter mb-6">Notixia</span>
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-stone-100 flex flex-col items-center justify-center overflow-hidden relative">
      {!appState.isVaultOpen ? (
        <Notebook 
          notes={appState.notes}
          onAddNote={addNote}
          onDeleteNote={deleteNote}
          onLongPress={() => toggleVault(true)} 
          isHighlighted={appState.showOnboarding}
        />
      ) : (
        <div className="w-full h-full bg-slate-900 shadow-2xl overflow-hidden relative text-white flex flex-col transition-all duration-500">
          {!isVerified ? (
            <VaultLock 
              appState={appState}
              onSuccess={handlePasswordSuccess}
              onClose={() => toggleVault(false)}
              onUpdateLength={(len) => setAppState(prev => ({...prev, passwordLength: len}))}
            />
          ) : (
            <>
              {activeView === 'settings' ? (
                <SettingsView 
                  appState={appState}
                  onBack={() => setActiveView('dashboard')}
                  onNavigate={(view) => {
                    setActiveView(view);
                    if (view !== 'change-password') setSkipVerify(false);
                  }}
                />
              ) : activeView === 'change-password' ? (
                <ChangePasswordView 
                  appState={appState} 
                  onBack={() => { setActiveView('settings'); setSkipVerify(false); }} 
                  onUpdatePassword={(pass) => setAppState(prev => ({ ...prev, password: pass }))}
                  onNavigate={(view) => setActiveView(view)}
                  skipVerify={skipVerify}
                />
              ) : activeView === 'setup-decoy' ? (
                <DecoySetupView 
                  appState={appState} 
                  onBack={() => setActiveView('settings')} 
                  onUpdateFakePassword={(pass) => setAppState(prev => ({ ...prev, fakePassword: pass }))}
                />
              ) : activeView === 'recovery-settings' ? (
                <RecoveryView 
                  appState={appState} 
                  onBack={() => setActiveView('settings')} 
                  onSuccess={() => {
                    setSkipVerify(true);
                    setActiveView('change-password');
                  }}
                />
              ) : activeFolderId ? (
                activeFolder && (
                  <FolderView 
                    folder={activeFolder} 
                    onBack={() => setActiveFolderId(null)} 
                    onAddFiles={(files) => addFilesToFolder(activeFolder.id, files)}
                    onUpdateFiles={(files) => updateFiles(activeFolder.id, files)}
                  />
                )
              ) : activeCategory ? (
                <CategoryView 
                  category={activeCategory}
                  folders={getFolders().filter(f => f.category === activeCategory)}
                  onBack={() => setActiveCategory(null)}
                  onOpenFolder={(id) => setActiveFolderId(id)}
                  onCreateFolder={(name) => createFolder(name, activeCategory)}
                />
              ) : (
                <VaultDashboard 
                  onBack={() => toggleVault(false)}
                  onSelectCategory={(cat) => setActiveCategory(cat)}
                  onOpenSettings={() => setActiveView('settings')}
                />
              )}
            </>
          )}
        </div>
      )}

      {appState.showOnboarding && !appState.isVaultOpen && (
        <NoticeBoard onClose={completeOnboarding} />
      )}
    </div>
  );
};

export default App;
