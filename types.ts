
export type VaultCategory = 'Photos' | 'Videos' | 'Audio' | 'Documents';

export interface VaultFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // Base64 or Blob URL
  createdAt: number;
  isDeleted: boolean;
}

export interface VaultFolder {
  id: string;
  name: string;
  category: VaultCategory;
  files: VaultFile[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  color: string;
}

export interface AppState {
  isVaultOpen: boolean;
  folders: VaultFolder[];
  fakeFolders: VaultFolder[];
  notes: Note[];
  showOnboarding: boolean;
  isPasswordSet: boolean;
  password?: string;
  fakePassword?: string;
  passwordLength: 4 | 6;
  securityQuestion?: string;
  securityAnswer?: string;
  isFakeSession?: boolean; // Runtime only state
}
