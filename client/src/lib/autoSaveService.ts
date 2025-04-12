import { gameSaveApi } from './api';
import { useRapperGame } from './stores/useRapperGame';
import { getLocalStorage, setLocalStorage } from './utils';

// Default auto-save settings
const DEFAULT_AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const DEFAULT_USER_ID = 1; // Use a default user ID for auto-save
const AUTO_SAVE_SLOT = 0; // Use slot 0 for auto-saves
const AUTO_SAVE_ENABLED_KEY = 'rapperGame_autoSaveEnabled';
const LAST_AUTO_SAVE_KEY = 'rapperGame_lastAutoSave';

let autoSaveTimer: NodeJS.Timeout | null = null;
let isAutoSaving = false;

/**
 * Initialize the auto-save service
 */
export function initAutoSave(intervalMs = DEFAULT_AUTO_SAVE_INTERVAL) {
  // Check if auto-save is enabled in local storage
  const autoSaveEnabled = getLocalStorage(AUTO_SAVE_ENABLED_KEY, true);
  
  if (autoSaveEnabled) {
    startAutoSave(intervalMs);
  }
}

/**
 * Start the auto-save timer
 */
export function startAutoSave(intervalMs = DEFAULT_AUTO_SAVE_INTERVAL) {
  // Clear any existing timer
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
  }
  
  // Set auto-save as enabled in local storage
  setLocalStorage(AUTO_SAVE_ENABLED_KEY, true);
  
  // Start a new timer
  autoSaveTimer = setInterval(performAutoSave, intervalMs);
  console.log(`Auto-save enabled with interval of ${intervalMs / 1000} seconds`);
}

/**
 * Stop the auto-save timer
 */
export function stopAutoSave() {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
    autoSaveTimer = null;
  }
  
  // Set auto-save as disabled in local storage
  setLocalStorage(AUTO_SAVE_ENABLED_KEY, false);
  console.log('Auto-save disabled');
}

/**
 * Check if auto-save is currently enabled
 */
export function isAutoSaveEnabled(): boolean {
  return getLocalStorage(AUTO_SAVE_ENABLED_KEY, true);
}

/**
 * Toggle auto-save on/off
 */
export function toggleAutoSave(): boolean {
  const currentState = isAutoSaveEnabled();
  if (currentState) {
    stopAutoSave();
  } else {
    startAutoSave();
  }
  return !currentState;
}

/**
 * Perform the actual auto-save operation
 */
export async function performAutoSave() {
  // Prevent multiple auto-saves from running simultaneously
  if (isAutoSaving) {
    console.log('Auto-save already in progress, skipping');
    return;
  }
  
  try {
    isAutoSaving = true;
    
    // Get the current game state
    const gameState = useRapperGame.getState();
    
    // Don't auto-save if we're on the main menu
    if (gameState.screen === 'main_menu' || gameState.screen === 'character_creation') {
      console.log('Skipping auto-save on main menu or character creation screen');
      return;
    }
    
    console.log('Performing auto-save...');
    
    // Call the API
    const result = await gameSaveApi.autoSave(DEFAULT_USER_ID, gameState, AUTO_SAVE_SLOT);
    
    // Update last auto-save timestamp
    const now = new Date().toISOString();
    setLocalStorage(LAST_AUTO_SAVE_KEY, now);
    
    console.log('Auto-save completed successfully', result);
  } catch (error) {
    console.error('Auto-save failed:', error);
    
    // If API fails, fall back to local storage
    try {
      const gameState = useRapperGame.getState();
      const savedGame = {
        id: `auto-save-${Date.now()}`,
        name: `Auto-save - Week ${gameState.currentWeek}`,
        date: Date.now(),
        gameState
      };
      
      // Store in local storage as a fallback
      const existingSaves = getLocalStorage('rapperGameSaves', []);
      const autoSaveIndex = existingSaves.findIndex((save: any) => 
        save.name && save.name.startsWith('Auto-save')
      );
      
      if (autoSaveIndex !== -1) {
        existingSaves[autoSaveIndex] = savedGame;
      } else {
        existingSaves.push(savedGame);
      }
      
      setLocalStorage('rapperGameSaves', existingSaves);
      setLocalStorage(LAST_AUTO_SAVE_KEY, new Date().toISOString());
      
      console.log('Auto-save completed using local storage fallback');
    } catch (fallbackError) {
      console.error('Local storage fallback auto-save failed:', fallbackError);
    }
  } finally {
    isAutoSaving = false;
  }
}

/**
 * Get the timestamp of the last auto-save
 */
export function getLastAutoSaveTime(): string | null {
  return getLocalStorage(LAST_AUTO_SAVE_KEY, null);
}

/**
 * Format the last auto-save time for display
 */
export function getFormattedLastAutoSaveTime(): string {
  const lastSave = getLastAutoSaveTime();
  
  if (!lastSave) {
    return 'Never';
  }
  
  try {
    const date = new Date(lastSave);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diffMs < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Format date
    return date.toLocaleString();
  } catch (e) {
    return 'Unknown';
  }
}