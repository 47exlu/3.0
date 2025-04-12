// API utilities for the Rapper Career Simulator

/**
 * Base API request function
 */
export async function apiRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: any
) {
  const url = endpoint.startsWith('/') ? `/api${endpoint}` : `/api/${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    throw error;
  }
}

/**
 * Game save API functions
 */
export const gameSaveApi = {
  /**
   * Auto-save the current game state
   */
  autoSave: async (userId: number, gameState: any, saveSlot: number = 0) => {
    return apiRequest('game-saves/auto-save', 'POST', {
      userId,
      saveData: gameState,
      saveSlot
    });
  },
  
  /**
   * Get all saves for a user
   */
  getUserSaves: async (userId: number) => {
    return apiRequest(`game-saves/user/${userId}`);
  },
  
  /**
   * Get a specific save by ID
   */
  getSaveById: async (saveId: number) => {
    return apiRequest(`game-saves/${saveId}`);
  },
  
  /**
   * Get a save by user ID and slot
   */
  getSaveBySlot: async (userId: number, saveSlot: number) => {
    return apiRequest(`game-saves/user/${userId}/slot/${saveSlot}`);
  },
  
  /**
   * Create a new game save
   */
  createSave: async (userId: number, gameState: any, saveSlot: number, name?: string) => {
    return apiRequest('game-saves', 'POST', {
      userId,
      saveData: gameState,
      saveSlot,
      active: true,
      lastSaved: new Date().toISOString()
    });
  },
  
  /**
   * Update an existing save
   */
  updateSave: async (saveId: number, updates: any) => {
    return apiRequest(`game-saves/${saveId}`, 'PATCH', updates);
  },
  
  /**
   * Delete a save
   */
  deleteSave: async (saveId: number) => {
    return apiRequest(`game-saves/${saveId}`, 'DELETE');
  }
};

/**
 * User API functions
 */
export const userApi = {
  /**
   * Get a test user (for development)
   */
  getTestUser: async () => {
    return apiRequest('test-user', 'POST');
  }
};