import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingScreen } from './loading-screen';
import { useLoadingScreen } from '@/lib/stores/useLoadingScreen';
import { useAudio } from '@/lib/stores/useAudio';

interface LoadingTransitionProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that displays loading screens during transitions
 * It listens to the global loading state and shows/hides the loading screen accordingly
 * Adds smooth transitions between screens with animated fade effects
 */
export function LoadingTransition({ children }: LoadingTransitionProps) {
  const { isLoading, message, variant, hideLoading } = useLoadingScreen();
  const audioStore = useAudio();
  const [content, setContent] = useState<React.ReactNode>(children);
  const [lastChildren, setLastChildren] = useState<React.ReactNode>(children);
  
  // Play transition sound (wrapped in useCallback to avoid dependency issues)
  const playTransitionSound = useCallback(() => {
    if (audioStore && audioStore.playTransition) {
      audioStore.playTransition();
    }
  }, [audioStore]);
  
  // When loading starts, play transition sound
  useEffect(() => {
    if (isLoading) {
      playTransitionSound();
    }
  }, [isLoading, playTransitionSound]);
  
  // When children change while loading, wait for loading to complete before updating content
  useEffect(() => {
    if (children !== lastChildren) {
      setLastChildren(children);
      
      if (!isLoading) {
        setContent(children);
      }
    }
  }, [children, isLoading, lastChildren]);
  
  // When loading completes, update content
  useEffect(() => {
    if (!isLoading) {
      setContent(lastChildren);
    }
  }, [isLoading, lastChildren]);
  
  // Variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };
  
  return (
    <>
      {/* Main content with animated transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isLoading ? 'loading' : 'content'}
          className="w-full h-full"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          {content}
        </motion.div>
      </AnimatePresence>
      
      {/* Loading overlay */}
      <LoadingScreen 
        isLoading={isLoading}
        message={message}
        variant={variant}
        onLoadComplete={hideLoading}
      />
    </>
  );
}

/**
 * A hook to trigger loading transitions between screens
 * @param timeout The minimum duration to show the loading screen
 * @returns A function to trigger a loading transition
 */
export function useLoadingTransition(timeout: number = 1500) {
  const { showLoading } = useLoadingScreen();
  const audioStore = useAudio();
  
  const triggerTransition = useCallback((
    onComplete: () => void, 
    message?: string, 
    variant?: 'default' | 'record' | 'vinyl' | 'microphone' | 'random'
  ) => {
    // Play transition sound when loading starts
    if (audioStore && audioStore.playTransition) {
      audioStore.playTransition();
    }
    
    // Show loading screen
    showLoading(message, variant);
    
    // Hide loading after minimum duration
    setTimeout(() => {
      onComplete();
    }, timeout);
  }, [audioStore, showLoading, timeout]);
  
  return triggerTransition;
}