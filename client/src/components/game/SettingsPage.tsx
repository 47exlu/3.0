import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAudio } from '@/lib/stores/useAudio';
import { useSettings } from '@/lib/stores/useSettings';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { Settings, Volume, Smartphone, Laptop, Tablet, Maximize, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

export function SettingsPage() {
  const { isMuted, toggleMute, playSuccess } = useAudio();
  const { loadingAnimationsEnabled, toggleLoadingAnimations, highQualityGraphics, toggleHighQualityGraphics } = useSettings();
  const { setScreen } = useRapperGame();
  
  // Handle sound toggle using the settings store (which will then sync with audio store)
  const { soundEnabled, toggleSound } = useSettings();
  
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
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
      <motion.div 
        className="flex items-center justify-between mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center" variants={itemVariants}>
          <Settings className="h-8 w-8 mr-3 text-gradient" />
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-gray-400">Customize your game experience</p>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button 
            variant="outline" 
            className="bg-transparent border-gray-600 hover:bg-gray-800"
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
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
            >
              <div className="flex flex-col items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700">
                <Smartphone className="h-10 w-10 mb-2 text-blue-400" />
                <h3 className="font-medium text-gray-200">Mobile</h3>
                <p className="text-xs text-gray-400 text-center mt-1">Optimized for handheld devices</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700">
                <Tablet className="h-10 w-10 mb-2 text-purple-400" />
                <h3 className="font-medium text-gray-200">Tablet</h3>
                <p className="text-xs text-gray-400 text-center mt-1">Enhanced for mid-size screens</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700">
                <Laptop className="h-10 w-10 mb-2 text-green-400" />
                <h3 className="font-medium text-gray-200">Desktop</h3>
                <p className="text-xs text-gray-400 text-center mt-1">Full experience on large screens</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-800/40 border-gray-700 hover:bg-gray-700/60 text-gray-200"
                  onClick={() => setScreen('save_load')}
                >
                  Save & Load Game
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-800/40 border-gray-700 hover:bg-gray-700/60 text-gray-200"
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
                  Reset Settings
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}