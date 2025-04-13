import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MicrophoneIcon, MusicIcon } from "@/assets/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/lib/stores/useSettings";
import { Headphones, Radio, Award, Disc, Speaker, Music2, Film, TrendingUp, FileText, DollarSign } from "lucide-react";

// Array of music industry-themed loading quotes
const LOADING_QUOTES = [
  "Dropping beats...",
  "Mixing the track...",
  "Calling the producer...",
  "Preparing the studio...",
  "Setting up the mic...",
  "Waiting for inspiration...",
  "Finding the rhythm...",
  "Checking sound levels...",
  "Loading sample packs...",
  "Writing lyrics...",
  "Adjusting autotune...",
  "Mastering the track...",
  "Signing contracts...",
  "Counting royalties...",
  "Calling features...",
  "Scheduling studio time...",
  "Finding the perfect beat...",
  "Setting up the booth...",
  "Tuning instruments...",
  "Building the hype...",
  "Contacting the label...",
  "Analyzing streaming data...",
  "Planning your tour...",
  "Checking chart positions...",
  "Making music history...",
  "Networking with industry execs...",
  "Sending demo tapes...",
  "Curating your next playlist...",
  "Creating your album art...",
  "Reading fan comments...",
  "Counting your streams...",
  "Organizing your merch...",
  "Finalizing your release strategy...",
  "Securing radio play...",
  "Contacting your publicist...",
];

interface LoadingScreenProps {
  isLoading: boolean;
  variant?: "default" | "record" | "vinyl" | "microphone" | "studio" | "awards" | "streaming" | "billboard" | "contract" | "concert" | "random";
  message?: string;
  className?: string;
  fullScreen?: boolean;
  onLoadComplete?: () => void;
  minDuration?: number; // Minimum duration to show the loading screen in ms
}

export function LoadingScreen({
  isLoading,
  variant = "random",
  message,
  className,
  fullScreen = true,
  onLoadComplete,
  minDuration = 1000,
}: LoadingScreenProps) {
  const [shouldShow, setShouldShow] = useState(isLoading);
  const [randomQuote, setRandomQuote] = useState("");
  const [actualVariant, setActualVariant] = useState(variant);
  const { loadingAnimationsEnabled } = useSettings();
  
  // If animations are disabled, use a shorter minDuration
  const effectiveMinDuration = loadingAnimationsEnabled ? minDuration : 300;
  
  // Set a random quote when loading starts
  useEffect(() => {
    if (isLoading) {
      setRandomQuote(LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)]);
      
      // If variant is random, pick a random one
      if (variant === "random") {
        const variants = ["default", "record", "vinyl", "microphone", "studio", "awards", "streaming", "billboard", "contract", "concert"];
        setActualVariant(variants[Math.floor(Math.random() * variants.length)] as any);
      } else {
        setActualVariant(variant);
      }
    }
  }, [isLoading, variant]);
  
  // Handle minimum duration
  useEffect(() => {
    if (isLoading) {
      setShouldShow(true);
      
      // If loading becomes false before min duration, wait before hiding
      if (!isLoading && effectiveMinDuration > 0) {
        const timer = setTimeout(() => {
          setShouldShow(false);
          onLoadComplete?.();
        }, effectiveMinDuration);
        
        return () => clearTimeout(timer);
      }
    } else {
      // If not loading and past min duration, hide immediately
      setShouldShow(false);
      onLoadComplete?.();
    }
  }, [isLoading, effectiveMinDuration, onLoadComplete]);
  
  // Define different loading animations based on variant
  const renderLoadingAnimation = () => {
    switch (actualVariant) {
      case "record":
        return (
          <div className="relative">
            <motion.div 
              className="w-32 h-32 bg-black rounded-full flex items-center justify-center border-4 border-gray-800 shadow-lg shadow-purple-900/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full"></div>
            </motion.div>
          </div>
        );
        
      case "vinyl":
        return (
          <div className="relative">
            <motion.div 
              className="w-32 h-32 bg-gradient-to-r from-violet-500 to-purple-800 rounded-full flex items-center justify-center shadow-xl shadow-purple-900/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute inset-0 border-t border-white rounded-full" 
                    style={{ transform: `rotate(${i * 18}deg)` }} 
                  />
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="absolute -right-10 top-1/2 w-24 h-2 bg-gray-600 rounded-full origin-left"
              animate={{ rotate: [10, -10, 10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute right-0 w-3 h-6 bg-gray-400 rounded-sm transform translate-x-1 -translate-y-2" />
            </motion.div>
          </div>
        );
        
      case "microphone":
        return (
          <div className="relative">
            <motion.div 
              className="w-20 h-40 bg-gradient-to-b from-gray-200 to-gray-400 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/20"
              initial={{ y: 0 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full mt-[-16px] flex items-center justify-center">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                  <motion.div
                    className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-indigo-500 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </div>
              <div className="absolute bottom-2 w-8 h-8 bg-gray-300 rounded-full" />
            </motion.div>
            <motion.div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <MicrophoneIcon size={48} className="text-gray-300" />
            </motion.div>
          </div>
        );
        
      case "studio":
        // Recording studio themed loader
        return (
          <div className="relative flex flex-col items-center">
            <div className="relative w-36 h-24 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-600">
              {/* Mixing console */}
              <div className="absolute inset-x-0 top-0 h-6 bg-gray-700 border-b border-gray-600 flex justify-evenly items-center px-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="w-2 h-3 bg-gray-900 rounded-sm"
                    animate={{ height: [3, 4, 2, 3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              
              {/* Faders */}
              <div className="absolute inset-x-0 top-8 h-14 flex justify-evenly items-end px-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="relative">
                    <div className="w-1 h-10 bg-gray-600 rounded-full" />
                    <motion.div 
                      className="absolute bottom-0 w-2 h-2 bg-red-500 rounded-sm left-1/2 transform -translate-x-1/2"
                      animate={{ y: [0, -6, -3, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </div>
                ))}
              </div>
              
              {/* VU meters */}
              <div className="absolute left-0 right-0 bottom-1 flex justify-center">
                <div className="flex space-x-8">
                  <motion.div 
                    className="w-6 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-sm"
                    animate={{ width: ["12px", "24px", "15px", "10px", "20px"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-6 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-sm"
                    animate={{ width: ["16px", "10px", "24px", "8px", "18px"] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
            
            {/* Headphones */}
            <motion.div
              className="mt-4 text-blue-400"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <Headphones size={32} className="text-blue-400" />
            </motion.div>
          </div>
        );
        
      case "awards":
        // Music awards themed loader
        return (
          <div className="relative">
            <div className="flex flex-col items-center">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30"
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Award
                  size={32}
                  className="text-yellow-100"
                />
              </motion.div>
              
              <div className="mt-2 relative">
                <motion.div
                  className="absolute h-2 w-2 bg-yellow-400 rounded-full"
                  style={{ left: "-10px", top: "0px" }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="absolute h-2 w-2 bg-yellow-400 rounded-full"
                  style={{ right: "-12px", top: "5px" }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute h-3 w-3 bg-yellow-400 rounded-full"
                  style={{ left: "7px", top: "-12px" }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
                />
              </div>
            </div>
          </div>
        );
        
      case "streaming":
        // Music streaming service themed loader
        return (
          <div className="relative">
            <div className="w-36 h-36 rounded-lg flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 border border-gray-700 shadow-xl">
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-3 h-full">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-gray-600 opacity-25" />
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Music2 size={24} className="text-white" />
                </motion.div>
                
                {/* WiFi-like signal waves */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-green-400 opacity-0"
                  animate={{ scale: [0.5, 1.5], opacity: [0.8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
                
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-green-400 opacity-0"
                  animate={{ scale: [0.5, 1.5], opacity: [0.8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />
              </div>
              
              <div className="mt-4 flex space-x-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-2 bg-green-500 rounded-sm"
                    animate={{ height: ["8px", "16px", "10px", "24px", "8px"] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
        
      case "billboard":
        // Billboard charts themed loader
        return (
          <div className="relative">
            <div className="w-36 h-36 p-2 rounded-lg flex flex-col justify-between bg-gradient-to-br from-gray-900 to-blue-900 border border-blue-700/30 shadow-xl">
              <div className="text-xs font-bold text-white bg-red-600 w-full text-center rounded py-0.5 mb-1">
                TOP CHARTS
              </div>
              
              <div className="flex-1 flex flex-col justify-around">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-4 text-xs font-semibold text-gray-300">{i + 1}</div>
                    <motion.div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-300"
                      style={{ width: `${80 - (i * 15)}%` }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TrendingUp size={24} className="text-blue-400" />
                </motion.div>
              </div>
            </div>
          </div>
        );
        
      case "contract":
        // Record deal/contract themed loader
        return (
          <div className="relative">
            <motion.div 
              className="w-32 h-40 bg-white rounded-md flex items-center justify-center shadow-xl rotate-3"
              animate={{ rotate: [3, -3, 3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-3">
                <div className="border-b border-gray-300 mb-2" />
                <div className="border-b border-gray-300 mb-2" />
                <div className="border-b border-gray-300 mb-2" />
                <div className="border-b border-gray-300 mb-2" />
                <div className="border-b border-gray-300 mb-2" />
                <div className="border-b border-gray-300 mb-2" />
                <div className="border-b border-gray-300 mb-2" />
                
                <div className="absolute bottom-0 right-0">
                  <motion.div
                    className="w-12 h-5 rounded-sm bg-gradient-to-r from-purple-600 to-indigo-600"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                
                <div className="absolute top-1/4 left-1/4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <DollarSign size={20} className="text-green-600" />
                  </motion.div>
                </div>
              </div>
              
              <motion.div
                className="absolute top-2 left-2"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FileText size={16} className="text-indigo-600" />
              </motion.div>
            </motion.div>
          </div>
        );
        
      case "concert":
        // Live concert/tour themed loader
        return (
          <div className="relative">
            <div className="flex items-end justify-center space-x-4">
              <motion.div
                className="relative w-8 h-32 flex flex-col items-center"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                <div className="w-8 h-24 bg-gradient-to-t from-gray-800 to-gray-900 rounded-t-lg border border-gray-700" />
                <div className="mt-1">
                  <Speaker size={16} className="text-gray-500" />
                </div>
                
                <motion.div
                  className="absolute top-3 w-6 h-6 rounded-full"
                  animate={{ 
                    boxShadow: ["0 0 10px 3px rgba(255,0,128,0.3)", "0 0 20px 6px rgba(255,0,128,0.5)", "0 0 10px 3px rgba(255,0,128,0.3)"] 
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </motion.div>
              
              <motion.div
                className="relative w-12 h-40 flex flex-col items-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-12 h-32 bg-gradient-to-t from-gray-800 to-gray-900 rounded-t-lg border border-gray-700" />
                <div className="mt-1">
                  <Speaker size={24} className="text-gray-400" />
                </div>
                
                <motion.div
                  className="absolute top-3 w-8 h-8 rounded-full"
                  animate={{ 
                    boxShadow: ["0 0 10px 3px rgba(138,75,255,0.3)", "0 0 20px 6px rgba(138,75,255,0.5)", "0 0 10px 3px rgba(138,75,255,0.3)"] 
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
              </motion.div>
              
              <motion.div
                className="relative w-8 h-32 flex flex-col items-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                <div className="w-8 h-24 bg-gradient-to-t from-gray-800 to-gray-900 rounded-t-lg border border-gray-700" />
                <div className="mt-1">
                  <Speaker size={16} className="text-gray-500" />
                </div>
                
                <motion.div
                  className="absolute top-3 w-6 h-6 rounded-full"
                  animate={{ 
                    boxShadow: ["0 0 10px 3px rgba(0,195,255,0.3)", "0 0 20px 6px rgba(0,195,255,0.5)", "0 0 10px 3px rgba(0,195,255,0.3)"] 
                  }}
                  transition={{ duration: 1.3, repeat: Infinity, delay: 0.6 }}
                />
              </motion.div>
            </div>
          </div>
        );
        
      case "default":
      default:
        return (
          <div className="relative">
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-3 h-12 bg-indigo-600 rounded-full"
                animate={{ height: [12, 24, 12] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-3 h-12 bg-purple-600 rounded-full"
                animate={{ height: [12, 32, 12] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
              />
              <motion.div
                className="w-3 h-12 bg-pink-600 rounded-full"
                animate={{ height: [12, 48, 12] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-3 h-12 bg-red-600 rounded-full"
                animate={{ height: [12, 36, 12] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="w-3 h-12 bg-orange-600 rounded-full"
                animate={{ height: [12, 24, 12] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <motion.div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <MusicIcon size={24} className="text-white" />
            </motion.div>
          </div>
        );
    }
  };
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex flex-col items-center justify-center bg-black text-white",
            fullScreen ? "fixed inset-0 z-50" : "w-full h-full min-h-[200px] rounded-lg",
            className
          )}
        >
          <div className="flex flex-col items-center gap-8">
            {loadingAnimationsEnabled ? (
              // Show full animation when enabled
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  {renderLoadingAnimation()}
                </div>
                
                {/* Animation variant display name - used for debugging/testing */}
                {process.env.NODE_ENV === "development" && (
                  <div className="text-xs text-gray-500 mb-2">
                    {actualVariant}
                  </div>
                )}
              </div>
            ) : (
              // Show simple loading spinner when disabled
              <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            )}
            
            <div className="flex flex-col items-center gap-2">
              {loadingAnimationsEnabled ? (
                // Animated text when animations enabled
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold"
                >
                  {message || randomQuote}
                </motion.h3>
              ) : (
                // Simple text when animations disabled
                <h3 className="text-xl font-bold">Loading...</h3>
              )}
              
              {loadingAnimationsEnabled ? (
                // Animated progress bar when animations enabled
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full w-48"
                />
              ) : (
                // Simple progress bar when animations disabled
                <div className="h-1 bg-white/50 rounded-full w-48" />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}