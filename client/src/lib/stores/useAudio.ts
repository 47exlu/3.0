import { create } from 'zustand';
import { Howl, Howler } from 'howler';
import { persist } from 'zustand/middleware';

interface AudioState {
  isMuted: boolean;
  backgroundMusic: Howl | null;
  hitSound: Howl | null;
  successSound: Howl | null;
  setBackgroundMusic: (music: Howl) => void;
  setHitSound: (sound: Howl) => void;
  setSuccessSound: (sound: Howl) => void;
  toggleMute: () => void;
  playSound: (src: string) => void;
  playSuccess: () => void;
  playHit: () => void;
  resumeAudio: () => void; // New function to resume audio after app regains focus
}

export const useAudio = create<AudioState>()(
  persist(
    (set, get) => ({
      isMuted: false,
      backgroundMusic: null,
      hitSound: null,
      successSound: null,
      
      setBackgroundMusic: (music: Howl) => {
        const prevMusic = get().backgroundMusic;
        
        // Stop previous music if exists
        if (prevMusic) {
          prevMusic.stop();
        }
        
        // Configure new music
        music.loop(true);
        music.volume(0.4);
        // HTML5 Audio can only be set in constructor options, not via method
        
        // Play if not muted
        if (!get().isMuted) {
          music.play();
        }
        
        set({ backgroundMusic: music });
      },
      
      setHitSound: (sound: Howl) => {
        // HTML5 Audio needs to be set in constructor
        set({ hitSound: sound });
      },
      
      setSuccessSound: (sound: Howl) => {
        // HTML5 Audio needs to be set in constructor
        set({ successSound: sound });
      },
      
      toggleMute: () => {
        const newMuted = !get().isMuted;
        const { backgroundMusic } = get();
        
        if (backgroundMusic) {
          if (newMuted) {
            backgroundMusic.pause();
          } else {
            try {
              backgroundMusic.play();
            } catch (err) {
              console.error("Error toggling audio:", err);
            }
          }
        }
        
        set({ isMuted: newMuted });
      },
      
      playSound: (src: string) => {
        if (!get().isMuted) {
          const sound = new Howl({
            src: [src],
            volume: 0.5,
            html5: true // Enable HTML5 Audio to prevent issues on mobile/background
          });
          
          try {
            sound.play();
          } catch (err) {
            console.error("Error playing sound:", err);
          }
        }
      },
      
      // Play success sound (or fallback to a default sound)
      playSuccess: () => {
        if (get().isMuted) return;
        
        const { successSound } = get();
        
        if (successSound) {
          try {
            successSound.play();
          } catch (err) {
            console.error("Error playing success sound:", err);
          }
        } else {
          // Create and play a default success sound
          const defaultSuccessSound = new Howl({
            src: ['/sounds/success.mp3'],
            volume: 0.5,
            html5: true // Enable HTML5 Audio to prevent issues on mobile/background
          });
          
          try {
            defaultSuccessSound.play();
          } catch (err) {
            console.error("Error playing default success sound:", err);
            // Fallback to generic playSound
            get().playSound('/sounds/success.mp3');
          }
        }
      },
      
      // Play hit sound (or fallback to a default sound)
      playHit: () => {
        if (get().isMuted) return;
        
        const { hitSound } = get();
        
        if (hitSound) {
          try {
            hitSound.play();
          } catch (err) {
            console.error("Error playing hit sound:", err);
          }
        } else {
          // Create and play a default hit sound
          const defaultHitSound = new Howl({
            src: ['/sounds/hit.mp3'],
            volume: 0.5,
            html5: true // Enable HTML5 Audio to prevent issues on mobile/background
          });
          
          try {
            defaultHitSound.play();
          } catch (err) {
            console.error("Error playing default hit sound:", err);
            // Fallback to generic playSound
            get().playSound('/sounds/hit.mp3');
          }
        }
      },
      
      // Resume audio after the app regains focus
      resumeAudio: () => {
        if (get().isMuted) return;
        
        const { backgroundMusic } = get();
        if (backgroundMusic && !backgroundMusic.playing()) {
          try {
            backgroundMusic.play();
            console.log("Resumed background music playback");
          } catch (err) {
            console.error("Error resuming background music:", err);
          }
        }
      }
    }),
    {
      name: "rapper-sim-audio-settings", // localStorage key
      partialize: (state) => ({ isMuted: state.isMuted }), // Only persist the isMuted state
    }
  )
);