import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Howl, Howler } from 'howler';

export interface AudioState {
  backgroundMusic: Howl | null;
  hitSound: Howl | null;
  successSound: Howl | null;
  transitionSound: Howl | null;
  clickSound: Howl | null;
  purchaseSound: Howl | null;
  cashSound: Howl | null;
  errorSound: Howl | null;
  isMuted: boolean;
  volume: number;
  soundEffectsVolume: number;
  musicVolume: number;
  soundsLoaded: boolean;
  
  setBackgroundMusic: (music: Howl) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setSoundEffectsVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  playHit: () => void;
  playSuccess: () => void;
  playTransition: () => void;
  playClick: () => void;
  playPurchase: () => void; // Play when purchase is successful
  playCash: () => void; // Play when currency is obtained
  playError: () => void; // Play when an error occurs
  reloadSounds: () => void; // Reload sound effects in case they fail to load
  setSoundsLoaded: (loaded: boolean) => void;
}

// Define sound configuration structure
type SoundSprite = Record<string, [number, number]> | null;

interface SoundConfig {
  src: string;
  volume: number;
  sprite: SoundSprite;
}

// Centralized sound configuration
const SOUNDS: Record<string, SoundConfig> = {
  hit: {
    src: '/sounds/hit.mp3',
    volume: 0.3,
    sprite: null
  },
  success: {
    src: '/sounds/success.mp3',
    volume: 0.4,
    sprite: null
  },
  transition: {
    src: '/sounds/transition.mp3',
    volume: 0.3,
    sprite: null
  },
  click: {
    src: '/sounds/click.mp3',
    volume: 0.2,
    sprite: null
  },
  purchase: {
    src: '/sounds/success.mp3',
    volume: 0.5,
    sprite: null
  },
  cash: {
    src: '/sounds/cash.mp3',
    volume: 0.4,
    sprite: {
      coins: [0, 1500]
    }
  },
  error: {
    src: '/sounds/error.mp3',
    volume: 0.3,
    sprite: null
  }
};

// Factory function to create sound objects
const createSound = (config: SoundConfig): Howl => {
  const sound = new Howl({
    src: [config.src],
    volume: config.volume,
    preload: true,
    sprite: config.sprite || undefined,
    onload: () => {
      console.log(`Sound loaded: ${config.src}`);
    },
    onloaderror: (id, error) => {
      console.error(`Error loading sound ${config.src}:`, error);
    },
    onplayerror: (id, error) => {
      console.error(`Error playing sound ${config.src}:`, error);
      
      // Auto-recover from playback errors
      Howler.unload();
      // Force unlock audio context if that's the issue
      try {
        // @ts-ignore - Howler has an internal _unlockAudio method
        Howler._unlockAudio && Howler._unlockAudio();
      } catch (e) {
        console.error("Could not unlock audio:", e);
      }
    }
  });
  
  return sound;
};

// Create the store
export const useAudio = create<AudioState>()(
  persist(
    (set, get) => ({
      // Initialize sounds
      backgroundMusic: null,
      hitSound: createSound(SOUNDS.hit),
      successSound: createSound(SOUNDS.success),
      transitionSound: createSound(SOUNDS.transition),
      clickSound: createSound(SOUNDS.click),
      purchaseSound: createSound(SOUNDS.purchase),
      cashSound: createSound(SOUNDS.cash),
      errorSound: createSound(SOUNDS.error),
      isMuted: false, // Start with sound enabled
      volume: 0.5, // Default volume
      soundEffectsVolume: 0.7, // Default SFX volume
      musicVolume: 0.4, // Default music volume
      soundsLoaded: false,
      
      setBackgroundMusic: (music) => {
        const { musicVolume, isMuted } = get();
        
        // Set the volume on the new music instance
        if (music) {
          music.volume(isMuted ? 0 : musicVolume);
        }
        
        set({ backgroundMusic: music });
      },
      
      toggleMute: () => {
        const { isMuted, backgroundMusic, volume } = get();
        const newMutedState = !isMuted;
        
        // Update global Howler muted state
        Howler.mute(newMutedState);
        
        // Handle background music specifically
        if (backgroundMusic) {
          if (newMutedState) {
            backgroundMusic.pause();
          } else {
            backgroundMusic.volume(get().musicVolume);
            backgroundMusic.play();
          }
        }
        
        // Update the muted state
        set({ isMuted: newMutedState });
        
        // Log the change
        console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
      },
      
      setVolume: (volume) => {
        // Set global volume
        Howler.volume(volume);
        set({ volume });
      },
      
      setSoundEffectsVolume: (volume) => {
        const { hitSound, successSound, transitionSound, clickSound, 
                purchaseSound, cashSound, errorSound, isMuted } = get();
        
        // Only set volume if not muted
        if (!isMuted) {
          // Update all sound effect volumes
          [hitSound, successSound, transitionSound, clickSound, 
           purchaseSound, cashSound, errorSound].forEach(sound => {
            if (sound) sound.volume(volume);
          });
        }
        
        // Store the new volume setting
        set({ soundEffectsVolume: volume });
      },
      
      setMusicVolume: (volume) => {
        const { backgroundMusic, isMuted } = get();
        
        // Only apply if not muted
        if (backgroundMusic && !isMuted) {
          backgroundMusic.volume(volume);
        }
        
        // Store the new volume setting
        set({ musicVolume: volume });
      },
      
      playHit: () => {
        const { hitSound, isMuted } = get();
        if (hitSound && !isMuted) {
          hitSound.play();
        }
      },
      
      playSuccess: () => {
        const { successSound, isMuted } = get();
        if (successSound && !isMuted) {
          successSound.play();
        }
      },
      
      playTransition: () => {
        const { transitionSound, isMuted } = get();
        if (transitionSound && !isMuted) {
          transitionSound.play();
        }
      },
      
      playClick: () => {
        const { clickSound, isMuted } = get();
        if (clickSound && !isMuted) {
          clickSound.play();
        }
      },
      
      playPurchase: () => {
        const { purchaseSound, isMuted } = get();
        if (purchaseSound && !isMuted) {
          purchaseSound.play();
        }
      },
      
      playCash: () => {
        const { cashSound, isMuted } = get();
        if (cashSound && !isMuted) {
          // Try to play the sprite sound
          try {
            cashSound.play('coins');
          } catch (e) {
            // If that fails, just play the default sound
            cashSound.play();
            console.error("Failed to play coin sprite:", e);
          }
        }
      },
      
      playError: () => {
        const { errorSound, isMuted } = get();
        if (errorSound && !isMuted) {
          errorSound.play();
        }
      },
      
      reloadSounds: () => {
        // Stop and unload all sounds
        Howler.unload();
        
        // Recreate all sound objects
        set({
          hitSound: createSound(SOUNDS.hit),
          successSound: createSound(SOUNDS.success),
          transitionSound: createSound(SOUNDS.transition),
          clickSound: createSound(SOUNDS.click),
          purchaseSound: createSound(SOUNDS.purchase),
          cashSound: createSound(SOUNDS.cash),
          errorSound: createSound(SOUNDS.error),
          soundsLoaded: true
        });
        
        // Apply the current volume settings
        const { soundEffectsVolume, isMuted } = get();
        if (!isMuted) {
          get().setSoundEffectsVolume(soundEffectsVolume);
        }
        
        console.log("All sounds reloaded");
      },
      
      setSoundsLoaded: (loaded) => set({ soundsLoaded: loaded })
    }),
    {
      name: "rapper-sim-audio-settings", // localStorage key
      partialize: (state) => ({ 
        isMuted: state.isMuted,
        volume: state.volume,
        soundEffectsVolume: state.soundEffectsVolume,
        musicVolume: state.musicVolume
      }), // Persist audio settings
    }
  )
);
