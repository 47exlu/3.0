import React, { useEffect, useState } from 'react';
import { useAudio } from '../../lib/stores/useAudio';
import { useSettings } from '../../lib/stores/useSettings';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import EnergyDisplay from './EnergyDisplay';
import { ModernNavbar } from './ModernNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Volume, VolumeX } from 'lucide-react';

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const { backgroundMusic, isMuted, toggleMute, resumeAudio } = useAudio();
  const { loadingAnimationsEnabled, toggleLoadingAnimations } = useSettings();
  const { screen } = useRapperGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Animation variants
  const pageTransition = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  // Set up key bindings for muting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // M key toggles mute
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute]);
  
  // Setup visibility change detection to handle background/foreground transitions
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page is now visible (user returned to tab)
        console.log('Page became visible, resuming audio if needed');
        resumeAudio();
      }
    };
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resumeAudio]);
  
  // Play background music only when the component mounts and when muted status changes
  useEffect(() => {
    // Only attempt to control the audio when backgroundMusic is available
    if (backgroundMusic) {
      // Handle music playback based on mute status
      if (isMuted) {
        backgroundMusic.pause();
      } else {
        // Make sure background music is playing if not muted
        if (!backgroundMusic.playing()) {
          try {
            backgroundMusic.play();
          } catch (error) {
            console.error("Error playing background music:", error);
          }
        }
      }
    }
    
    // Don't pause the background music on component unmount to preserve audio across transitions
    // to maintain sound settings between different sections
  }, [isMuted, backgroundMusic]);
  
  // Game initialization effect
  useEffect(() => {
    // Any game initialization could go here in the future
    console.log('Game layout mounted');
    
    return () => {
      console.log('Game layout unmounted');
    };
  }, []);

  // Don't show navbar on main menu or character creation
  const showNavbar = screen !== 'main_menu' && screen !== 'character_creation';

  return (
    <motion.div 
      className="w-full h-full flex flex-col bg-gray-900 text-white overflow-hidden"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
    >
      {/* Modern Navigation Bar */}
      <AnimatePresence mode="wait">
        {showNavbar && <ModernNavbar key="navbar" />}
      </AnimatePresence>
      
      {/* Energy Display - moved to the top right near settings */}
      <AnimatePresence>
        {screen === 'career_dashboard' && (
          <motion.div 
            className="fixed top-3 left-4 z-40 flex items-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <EnergyDisplay className="w-36" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Controls panel removed as requested in favor of the Settings tab in navigation */}
      
      {/* Main content - enhanced for better responsive viewing with improved mobile support */}
      <motion.main 
        className="w-full h-full overflow-auto flex-1 bg-gradient-to-b from-gray-900 to-gray-800 pb-safe mobile-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div 
          className={`h-full ${screen === 'main_menu' ? 'pb-0' : 'pb-10 sm:pb-8 md:pb-0'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {children}
        </motion.div>
      </motion.main>
    </motion.div>
  );
}
