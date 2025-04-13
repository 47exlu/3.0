import { create } from 'zustand';

type LoadingVariant = 
  'default' | 
  'record' | 
  'vinyl' | 
  'microphone' | 
  'studio' | 
  'awards' |
  'streaming' |
  'billboard' |
  'contract' |
  'concert' |
  'random';

interface LoadingState {
  isLoading: boolean;
  message: string;
  variant: LoadingVariant;
  showLoading: (message?: string, variant?: LoadingVariant) => void;
  hideLoading: () => void;
}

// Helper function to get a random loading variant
const getRandomVariant = (): LoadingVariant => {
  const variants: LoadingVariant[] = [
    'default',
    'record',
    'vinyl',
    'microphone',
    'studio',
    'awards',
    'streaming',
    'billboard',
    'contract',
    'concert'
  ];
  
  return variants[Math.floor(Math.random() * variants.length)];
};

export const useLoadingScreen = create<LoadingState>((set) => ({
  isLoading: false,
  message: '',
  variant: 'random',
  
  showLoading: (message = '', variant = 'random') => {
    // If random variant is selected, choose a specific variant
    const actualVariant = variant === 'random' ? getRandomVariant() : variant;
    set({ isLoading: true, message, variant: actualVariant });
  },
    
  hideLoading: () => set({ isLoading: false }),
}));