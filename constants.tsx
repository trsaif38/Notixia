
import React from 'react';
import { Image, Video, Music, FileText } from 'lucide-react';
import { VaultFolder, VaultCategory } from './types';

export const CATEGORIES: { name: VaultCategory; icon: React.ReactNode; color: string }[] = [
  { name: 'Photos', icon: <Image size={32} />, color: 'bg-blue-500' },
  { name: 'Videos', icon: <Video size={32} />, color: 'bg-purple-500' },
  { name: 'Audio', icon: <Music size={32} />, color: 'bg-emerald-500' },
  { name: 'Documents', icon: <FileText size={32} />, color: 'bg-orange-500' },
];

export const INITIAL_FOLDERS: VaultFolder[] = [
  { id: 'initial-photo', name: 'My Gallery', category: 'Photos', files: [] },
  { id: 'initial-video', name: 'Movies', category: 'Videos', files: [] },
  { id: 'initial-audio', name: 'Voice Notes', category: 'Audio', files: [] },
  { id: 'initial-doc', name: 'Personal Docs', category: 'Documents', files: [] },
];
