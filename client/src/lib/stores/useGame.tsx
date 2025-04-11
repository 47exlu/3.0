import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "paused" | "ended";
export type GameDifficulty = "easy" | "normal" | "hard";
export type GameMode = "career" | "freestyle" | "challenge" | "tutorial";

interface GameState {
  // Core game state
  phase: GamePhase;
  mode: GameMode;
  difficulty: GameDifficulty;
  sessionStartTime: number | null;
  sessionPlayTime: number;
  lastSaveTimestamp: number | null;
  
  // Performance metrics
  fps: number;
  frameTimes: number[];
  
  // Game settings
  autosaveEnabled: boolean;
  autosaveInterval: number; // In minutes
  
  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  end: () => void;
  
  // Game mode and settings
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: GameDifficulty) => void;
  
  // Performance tracking
  trackFrameTime: (frameTime: number) => void;
  
  // Autosave settings
  setAutosaveEnabled: (enabled: boolean) => void;
  setAutosaveInterval: (minutes: number) => void;
  
  // Session tracking
  updateSessionPlayTime: () => void;
  resetSessionTime: () => void;
  setLastSaveTimestamp: (timestamp: number) => void;
}

// Function to calculate average FPS from an array of frame times (in ms)
const calculateFPS = (frameTimes: number[]): number => {
  if (frameTimes.length === 0) return 0;
  const averageFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
  return averageFrameTime > 0 ? Math.round(1000 / averageFrameTime) : 0;
};

export const useGame = create<GameState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        phase: "ready",
        mode: "career",
        difficulty: "normal",
        sessionStartTime: null,
        sessionPlayTime: 0,
        lastSaveTimestamp: null,
        
        // Performance metrics
        fps: 60,
        frameTimes: [],
        
        // Game settings
        autosaveEnabled: true,
        autosaveInterval: 5, // Save every 5 minutes by default
        
        // Game state transitions
        start: () => {
          const state = get();
          if (state.phase === "ready") {
            const now = Date.now();
            set({
              phase: "playing",
              sessionStartTime: now
            });
            console.log(`Game started at ${new Date(now).toISOString()}`);
          }
        },
        
        pause: () => {
          const state = get();
          if (state.phase === "playing") {
            // Update play time before pausing
            state.updateSessionPlayTime();
            set({ phase: "paused" });
            console.log("Game paused");
          }
        },
        
        resume: () => {
          const state = get();
          if (state.phase === "paused") {
            // Update session start time to account for the pause
            set({
              phase: "playing",
              sessionStartTime: Date.now()
            });
            console.log("Game resumed");
          }
        },
        
        restart: () => {
          // Reset the game state
          set({
            phase: "ready",
            sessionStartTime: null,
            sessionPlayTime: 0
          });
          console.log("Game restarted");
        },
        
        end: () => {
          const state = get();
          if (state.phase === "playing" || state.phase === "paused") {
            // Update final play time
            state.updateSessionPlayTime();
            set({ phase: "ended" });
            console.log(`Game ended with ${state.sessionPlayTime}ms play time`);
          }
        },
        
        // Game settings
        setMode: (mode) => {
          set({ mode });
          console.log(`Game mode set to ${mode}`);
        },
        
        setDifficulty: (difficulty) => {
          set({ difficulty });
          console.log(`Difficulty set to ${difficulty}`);
        },
        
        // Performance tracking
        trackFrameTime: (frameTime) => {
          const frameTimes = [...get().frameTimes.slice(-59), frameTime]; // Keep last 60 frames
          const fps = calculateFPS(frameTimes);
          set({ frameTimes, fps });
        },
        
        // Autosave settings
        setAutosaveEnabled: (enabled) => {
          set({ autosaveEnabled: enabled });
        },
        
        setAutosaveInterval: (minutes) => {
          if (minutes > 0) {
            set({ autosaveInterval: minutes });
          }
        },
        
        // Session tracking
        updateSessionPlayTime: () => {
          const { sessionStartTime, sessionPlayTime } = get();
          if (sessionStartTime) {
            const now = Date.now();
            const additionalTime = now - sessionStartTime;
            set({
              sessionPlayTime: sessionPlayTime + additionalTime,
              sessionStartTime: now
            });
          }
        },
        
        resetSessionTime: () => {
          set({
            sessionStartTime: Date.now(),
            sessionPlayTime: 0
          });
        },
        
        setLastSaveTimestamp: (timestamp) => {
          set({ lastSaveTimestamp: timestamp });
        }
      }),
      {
        name: "rapper-sim-game-state",
        partialize: (state) => ({
          difficulty: state.difficulty,
          mode: state.mode,
          autosaveEnabled: state.autosaveEnabled,
          autosaveInterval: state.autosaveInterval
        }),
      }
    )
  )
);
