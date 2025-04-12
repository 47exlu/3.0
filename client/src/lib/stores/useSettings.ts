import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAudio } from './useAudio';

interface SettingsState {
  loadingAnimationsEnabled: boolean;
  toggleLoadingAnimations: () => void;
  highQualityGraphics: boolean;
  toggleHighQualityGraphics: () => void;
  autoSaveEnabled: boolean;
  toggleAutoSave: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      loadingAnimationsEnabled: true,
      highQualityGraphics: true,
      autoSaveEnabled: true,
      soundEnabled: true,
      
      toggleLoadingAnimations: () => set((state) => ({ 
        loadingAnimationsEnabled: !state.loadingAnimationsEnabled 
      })),
      
      toggleHighQualityGraphics: () => set((state) => ({ 
        highQualityGraphics: !state.highQualityGraphics 
      })),
      
      toggleAutoSave: () => set((state) => ({ 
        autoSaveEnabled: !state.autoSaveEnabled 
      })),
      
      toggleSound: () => {
        const newSoundEnabled = !get().soundEnabled;
        set({ soundEnabled: newSoundEnabled });
        
        // Also toggle the audio system's mute state to match
        const audioStore = useAudio.getState();
        if (audioStore.isMuted === newSoundEnabled) {
          audioStore.toggleMute();
        }
      },
    }),
    {
      name: 'game-settings',
    }
  )
);