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
import { Settings, Volume, VolumeX, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const { backgroundMusic, isMuted, toggleMute, resumeAudio } = useAudio();
  const { loadingAnimationsEnabled, toggleLoadingAnimations } = useSettings();
  const { screen, currentWeek, currentYear } = useRapperGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Calculate the simulated date based on the current week and year
  const calculateGameDate = () => {
    // Start with January 1st of 2025 (base year) + (currentYear - 1) for subsequent years
    const gameYear = 2025 + (currentYear - 1);
    const startDate = new Date(gameYear, 0, 1);
    // Add days based on current week (each week is 7 days)
    const currentDate = addDays(startDate, (currentWeek - 1) * 7);
    return currentDate;
  };
  
  const gameDate = calculateGameDate();
  
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
      } else {
        // Page is now hidden (user switched tabs)
        // Pause background music to save resources
        const { backgroundMusic, isMuted } = useAudio.getState();
        if (backgroundMusic && !isMuted && backgroundMusic.playing()) {
          console.log('Page hidden, pausing audio');
          backgroundMusic.pause();
        }
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
  
  // Add class to body for device detection
  useEffect(() => {
    // Add device classes to help with CSS targeting
    const updateDeviceClass = () => {
      // Clear existing device classes
      document.body.classList.remove('tablet-device', 'desktop-device', 'mobile-device');
      
      // Add appropriate device class
      if (window.innerWidth >= 768 && window.innerWidth <= 1023) {
        document.body.classList.add('tablet-device');
      } else if (window.innerWidth >= 1024) {
        document.body.classList.add('desktop-device');
      } else {
        document.body.classList.add('mobile-device');
      }
      
      // Also add a global class to mark those elements that need fix
      const extraNavElements = document.querySelectorAll('.flex.justify-around.fixed.bottom-0:not(.bottom-nav)');
      extraNavElements.forEach(el => {
        el.classList.add('universal-fix-bottom');
      });
    };
    
    // Run on mount
    updateDeviceClass();
    
    // Listen for resize events
    window.addEventListener('resize', updateDeviceClass);
    return () => window.removeEventListener('resize', updateDeviceClass);
  }, []);

  return (
    <motion.div 
      className="w-full min-h-screen flex flex-col bg-gray-900 text-white"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
      style={{ overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}
    >
      {/* Modern Navigation Bar */}
      <AnimatePresence mode="wait">
        {showNavbar && <ModernNavbar key="navbar" />}
      </AnimatePresence>
      
      {/* Date Tracker Display - More compact version */}
      {showNavbar && (
        <motion.div 
          className="fixed top-1 md:top-2 left-1/2 transform -translate-x-1/2 z-[100] flex items-center bg-gray-800/80 backdrop-blur-sm py-1 px-3 rounded-full border border-gray-700 shadow-lg"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Calendar className="w-3 h-3 mr-1 text-blue-400" />
          <span className="text-xs font-medium whitespace-nowrap">
            {format(gameDate, 'dd/MM/yyyy')} • W{currentWeek}
          </span>
        </motion.div>
      )}
      
      {/* Energy Display - moved to the top left */}
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
        className="w-full min-h-[90vh] flex-1 bg-gradient-to-b from-gray-900 to-gray-800 relative z-10 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ overflowY: 'auto', maxHeight: '100vh' }}
      >
        <motion.div 
          className={`w-full ${screen === 'main_menu' ? 'pb-0' : 'pb-24 sm:pb-20 md:pb-24'}`}
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
