import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAudio } from '@/lib/stores/useAudio';
import { useSettings } from '@/lib/stores/useSettings';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { Settings, Volume, Smartphone, Laptop, Tablet, Maximize, LayoutGrid, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  initAutoSave, 
  startAutoSave, 
  stopAutoSave, 
  isAutoSaveEnabled,
  toggleAutoSave as toggleAutoSaveService,
  getFormattedLastAutoSaveTime
} from '@/lib/autoSaveService';

export function SettingsPage() {
  const { isMuted, toggleMute, playSuccess } = useAudio();
  const { 
    loadingAnimationsEnabled, 
    toggleLoadingAnimations, 
    highQualityGraphics, 
    toggleHighQualityGraphics,
    autoSaveEnabled, 
    toggleAutoSave
  } = useSettings();
  const { setScreen } = useRapperGame();
  
  // Handle sound toggle using the settings store (which will then sync with audio store)
  const { soundEnabled, toggleSound } = useSettings();
  
  // State for displaying the last auto-save time
  const [lastSaveTime, setLastSaveTime] = React.useState<string>("Never");
  
  // Initialize auto-save on component mount and update the last save time
  React.useEffect(() => {
    // Initialize auto-save on mount based on settings
    if (autoSaveEnabled) {
      startAutoSave();
    } else {
      stopAutoSave();
    }
    
    // Update the displayed last save time
    setLastSaveTime(getFormattedLastAutoSaveTime());
    
    // Set up an interval to refresh the last save time
    const interval = setInterval(() => {
      setLastSaveTime(getFormattedLastAutoSaveTime());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [autoSaveEnabled]);
  
  const handleSoundToggle = () => {
    // Play success sound before potentially muting
    if (!isMuted && soundEnabled) {
      playSuccess();
    }
    
    // Use the settings store to toggle sound (which syncs with audio store)
    toggleSound();
  };
  
  // Handle back button
  const handleBack = () => {
    setScreen('career_dashboard');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  return (
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto mobile-scroll pb-safe">
      <motion.div 
        className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center" variants={itemVariants}>
          <div className="relative mr-3">
            <Settings className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" />
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full -z-10 opacity-70"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold fluid-text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Settings</h1>
            <p className="text-sm text-gray-400 fluid-text-xs">Customize your game experience</p>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-gray-900 to-black border border-gray-700/50 hover:border-purple-500/30 hover:shadow-purple-500/10 hover:shadow-md rounded-button touch-target transition-all"
            onClick={handleBack}
          >
            Back to Game
          </Button>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Audio Settings */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Card className="bg-soft-gradient border-soft shadow-soft rounded-soft hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Volume className="h-5 w-5 mr-2 text-gradient" />
                <span className="text-gradient">Audio Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div 
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <div className="space-y-0.5">
                  <Label htmlFor="sound-toggle" className="text-base">Game Sound</Label>
                  <p className="text-sm text-gray-400">Toggle all game sounds and music</p>
                </div>
                <Switch 
                  id="sound-toggle" 
                  checked={soundEnabled}
                  onCheckedChange={handleSoundToggle}
                  className="data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600"
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Auto-Save Settings */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Card className="bg-soft-gradient border-soft shadow-soft rounded-soft hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Save className="h-5 w-5 mr-2 text-gradient" />
                <span className="text-gradient">Auto-Save Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div 
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save-toggle" className="text-base">Auto-Save Game</Label>
                  <p className="text-sm text-gray-400">Automatically save your progress</p>
                </div>
                <Switch 
                  id="auto-save-toggle" 
                  checked={autoSaveEnabled}
                  onCheckedChange={() => {
                    // Update the settings store
                    toggleAutoSave();
                    
                    // Also update the auto-save service
                    if (!autoSaveEnabled) {
                      startAutoSave();
                      if (soundEnabled) playSuccess();
                    } else {
                      stopAutoSave();
                    }
                  }}
                  className="data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600"
                />
              </motion.div>
              
              {autoSaveEnabled && (
                <motion.div
                  className="mt-2 p-3 bg-card-gradient rounded-soft border-soft text-sm"
                  variants={itemVariants}
                >
                  <p className="text-gray-300">Last auto-save: <span className="text-gradient font-medium">{lastSaveTime}</span></p>
                  <p className="text-gray-400 text-xs mt-1">Auto-saves happen when advancing the week or changing major game features.</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Visual Settings */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Card className="bg-soft-gradient border-soft shadow-soft rounded-soft hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <LayoutGrid className="h-5 w-5 mr-2 text-gradient" />
                <span className="text-gradient">Visual Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div 
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <div className="space-y-0.5">
                  <Label htmlFor="loading-animations" className="text-base">Loading Animations</Label>
                  <p className="text-sm text-gray-400">Enable detailed loading screen animations</p>
                </div>
                <Switch 
                  id="loading-animations" 
                  checked={loadingAnimationsEnabled}
                  onCheckedChange={toggleLoadingAnimations}
                  className="data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600"
                />
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <div className="space-y-0.5">
                  <Label htmlFor="graphics-quality" className="text-base">Graphics Quality</Label>
                  <p className="text-sm text-gray-400">Set the visual quality of game elements</p>
                </div>
                <Switch 
                  id="graphics-quality" 
                  checked={highQualityGraphics}
                  onCheckedChange={toggleHighQualityGraphics}
                  className="data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600"
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Responsive Design Settings */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <Card className="bg-soft-gradient border-soft shadow-soft rounded-soft hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Maximize className="h-5 w-5 mr-2 text-gradient" />
              <span className="text-gradient">Display Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div variants={itemVariants} className="text-sm text-gray-300 mb-6">
              <p>Your game automatically adapts to all screen sizes:</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
            >
              <div className="flex flex-col items-center p-5 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800/50 shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative mb-3">
                  <Smartphone className="h-10 w-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400" />
                  <div className="absolute -inset-1 bg-blue-500/20 blur-xl rounded-full -z-10 opacity-70"></div>
                </div>
                <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 fluid-text-sm">Mobile</h3>
                <p className="text-xs text-gray-400 text-center mt-1 fluid-text-xs">Optimized for handheld devices</p>
              </div>
              
              <div className="flex flex-col items-center p-5 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800/50 shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative mb-3">
                  <Tablet className="h-10 w-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" />
                  <div className="absolute -inset-1 bg-purple-500/20 blur-xl rounded-full -z-10 opacity-70"></div>
                </div>
                <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 fluid-text-sm">Tablet</h3>
                <p className="text-xs text-gray-400 text-center mt-1 fluid-text-xs">Enhanced for mid-size screens</p>
              </div>
              
              <div className="flex flex-col items-center p-5 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800/50 shadow-lg hover:shadow-amber-500/10 hover:border-amber-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative mb-3">
                  <Laptop className="h-10 w-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400" />
                  <div className="absolute -inset-1 bg-amber-500/20 blur-xl rounded-full -z-10 opacity-70"></div>
                </div>
                <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 fluid-text-sm">Desktop</h3>
                <p className="text-xs text-gray-400 text-center mt-1 fluid-text-xs">Full experience on large screens</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-sm text-gray-400 text-center">
              <p>The game's responsive design automatically adjusts the layout for the best experience on any device.</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Game Data and Support */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="bg-soft-gradient border-soft shadow-soft rounded-soft hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gradient" />
              <span className="text-gradient">Game Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full bg-gradient-to-r from-blue-900/50 to-blue-900/20 border border-blue-500/30 hover:border-blue-400/50 rounded-lg p-6 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => setScreen('save_load')}
                >
                  <div className="flex flex-col items-center justify-center">
                    <Save className="h-6 w-6 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500" />
                    <span className="text-white font-medium">Save & Load Game</span>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full bg-gradient-to-r from-pink-900/50 to-pink-900/20 border border-pink-500/30 hover:border-pink-400/50 rounded-lg p-6 shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset your settings to default?')) {
                      // Reset all settings to default
                      if (!loadingAnimationsEnabled) toggleLoadingAnimations();
                      if (!highQualityGraphics) toggleHighQualityGraphics();
                      if (!soundEnabled) toggleSound();
                      
                      // Play success sound after reset if sound is enabled
                      setTimeout(() => {
                        if (soundEnabled) playSuccess();
                      }, 300);
                    }
                  }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <Settings className="h-6 w-6 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500" />
                    <span className="text-white font-medium">Reset Settings</span>
                  </div>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}