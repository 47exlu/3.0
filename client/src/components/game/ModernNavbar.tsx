import React, { useState } from 'react';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { format } from 'date-fns';
import { 
  Home, 
  Music, 
  Users, 
  Mic2, 
  DollarSign, 
  TrendingUp, 
  Instagram, 
  Twitter, 
  Youtube, 
  Settings,
  Album,
  BarChart2,
  Award,
  ShoppingBag,
  Radio,
  MessageCircle,
  Zap,
  Activity,
  Star,
  Menu,
  X,
  HelpCircle,
  Briefcase,
  FileText,
  PieChart,
  BarChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const sheetVariants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }
};

// Helper to determine if a screen is a tab or needs special routing
function getActualScreenId(id: string): string {
  const specialRoutes: Record<string, string> = {
    'main': 'career_dashboard',
    'music': 'music_production',
    'marketing': 'social_media',
    'business': 'business_overview',
    'system': 'settings'
  };
  
  return specialRoutes[id] || id;
}

export function ModernNavbar() {
  const { screen, setScreen } = useRapperGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const currentScreen = screen;
  const isMainMenu = screen === 'main_menu';
  
  const handleScreenChange = (newScreen: string) => {
    setScreen(newScreen as any);
    setMobileMenuOpen(false);
  };
  
  // Main navigation screens organized by category
  const categories = [
    { id: 'main', name: 'Main' },
    { id: 'music', name: 'Music' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'business', name: 'Business' }
  ];

  // All available screens with their icons and categories
  const screens = [
    // Main category
    { id: 'main', name: 'Main', category: 'main', icon: <Home className="w-5 h-5" /> },
    { id: 'career_dashboard', name: 'Dashboard', category: 'main', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'record_deal', name: 'Record Deal', category: 'main', icon: <FileText className="w-5 h-5" /> },
    { id: 'team_management', name: 'Team', category: 'main', icon: <Users className="w-5 h-5" /> },
    { id: 'awards', name: 'Awards', category: 'main', icon: <Award className="w-5 h-5" /> },
    { id: 'job_board', name: 'Jobs', category: 'main', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'company_management', name: 'Company', category: 'main', icon: <PieChart className="w-5 h-5" /> },
    
    // Music category
    { id: 'music', name: 'Music', category: 'music', icon: <Music className="w-5 h-5" /> },
    { id: 'music_production', name: 'Studio', category: 'music', icon: <Mic2 className="w-5 h-5" /> },
    { id: 'albums', name: 'Albums', category: 'music', icon: <Album className="w-5 h-5" /> },
    { id: 'released_songs', name: 'Releases', category: 'music', icon: <Star className="w-5 h-5" /> },
    { id: 'performances', name: 'Perform', category: 'music', icon: <Radio className="w-5 h-5" /> },
    { id: 'skills', name: 'Skills', category: 'music', icon: <Zap className="w-5 h-5" /> },
    
    // Marketing category
    { id: 'marketing', name: 'Marketing', category: 'marketing', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'social_media', name: 'Social', category: 'marketing', icon: <Zap className="w-5 h-5" /> },
    { id: 'instagram', name: 'Instagram', category: 'marketing', icon: <Instagram className="w-5 h-5" /> },
    { id: 'twitter', name: 'Twitter', category: 'marketing', icon: <Twitter className="w-5 h-5" /> },
    { id: 'youtube', name: 'YouTube', category: 'marketing', icon: <Youtube className="w-5 h-5" /> },
    { id: 'merchandise', name: 'Merch', category: 'marketing', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'interviews', name: 'Interviews', category: 'marketing', icon: <MessageCircle className="w-5 h-5" /> },
    
    // Business category
    { id: 'business', name: 'Business', category: 'business', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'business_overview', name: 'Finance', category: 'business', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'streaming', name: 'Streaming', category: 'business', icon: <Activity className="w-5 h-5" /> },
    { id: 'charts', name: 'Charts', category: 'business', icon: <BarChart className="w-5 h-5" /> },
    { id: 'investments', name: 'Invest', category: 'business', icon: <TrendingUp className="w-5 h-5" /> },
    
    // Settings - not in a category, managed separately
    { id: 'settings', name: 'Settings', category: 'settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'help', name: 'Help', category: 'settings', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'debug', name: 'Debug', category: 'settings', icon: <Activity className="w-5 h-5" /> }
  ];
  
  // Skip rendering navbar on main menu
  if (isMainMenu) return null;
  
  return (
    <div className="w-full z-50">
      {/* Bottom tab bar for main navigation */}
      <div 
        className="bottom-nav w-full flex justify-around items-center py-1 px-2 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-gray-900/95 border-t border-purple-800/30 z-[9999] backdrop-blur-md"
        style={{ 
          display: 'flex',
          height: '64px', 
          paddingBottom: '8px',
          boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.4)'
        }}
      >
        {['main', 'music', 'marketing', 'business'].map((categoryId, idx) => {
          // Get first item from each category for quick access
          const firstScreen = screens.find(s => s.category === categoryId);
          if (!firstScreen) return null;
          
          const isActive = currentScreen && getActualScreenId(firstScreen.id) === currentScreen;
          
          return (
            <button
              key={categoryId}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-2 px-0 rounded-md transition-all max-w-[20%] relative",
                isActive 
                  ? "scale-110" 
                  : "text-gray-500 hover:text-gray-300"
              )}
              onClick={() => handleScreenChange(getActualScreenId(firstScreen.id))}
            >
              {isActive && (
                <>
                  <div className="absolute -top-1 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                  <div className="absolute -z-10 inset-0 bg-gray-800/40 rounded-full blur-xl opacity-80 scale-75"></div>
                </>
              )}
              <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                {firstScreen.icon}
              </div>
              <span className={`text-[10px] mt-1 font-medium transition-all truncate w-full ${
                isActive 
                  ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
                  : ''
              }`}>
                {firstScreen.name}
              </span>
            </button>
          );
        })}
        
        {/* Settings Tab */}
        <button
          key="settings"
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-2 px-0 rounded-md transition-all max-w-[20%] relative",
            currentScreen === 'settings' 
              ? "scale-110" 
              : "text-gray-500 hover:text-gray-300"
          )}
          onClick={() => handleScreenChange('settings')}
        >
          {currentScreen === 'settings' && (
            <>
              <div className="absolute -top-1 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
              <div className="absolute -z-10 inset-0 bg-gray-800/40 rounded-full blur-xl opacity-80 scale-75"></div>
            </>
          )}
          <div className={`transition-transform ${currentScreen === 'settings' ? 'scale-110' : ''}`}>
            <Settings className="w-5 h-5" />
          </div>
          <span className={`text-[10px] mt-1 font-medium transition-all truncate w-full ${
            currentScreen === 'settings' 
              ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
              : ''
          }`}>
            Settings
          </span>
        </button>
        
        {/* More Menu Button */}
        <button
          className="flex flex-1 flex-col items-center justify-center py-2 px-0 text-gray-500 hover:text-gray-300 max-w-[20%] transition-transform hover:scale-110"
          onClick={() => setMobileMenuOpen(true)}
        >
          <div className="p-1.5 rounded-full bg-gray-800/70 hover:bg-gray-700/70 transition-colors">
            <Menu size={18} />
          </div>
          <span className="text-[10px] mt-1">More</span>
        </button>
      </div>
      
      {/* Mobile full menu - improved with animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col justify-end" 
            onClick={() => setMobileMenuOpen(false)}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
          >
            <motion.div 
              className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-700/50 rounded-t-xl pb-20 pt-2 max-h-[80vh] overflow-y-auto shadow-2xl" 
              onClick={e => e.stopPropagation()}
              variants={sheetVariants}
            >
              {/* Pull indicator */}
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1.5 bg-gradient-to-r from-purple-500/60 to-pink-500/60 rounded-full"></div>
              </div>
              
              {/* Close button */}
              <div className="absolute top-2 right-2">
                <button 
                  className="p-2 rounded-full bg-black/40 text-gray-400 hover:bg-gray-800/80 backdrop-blur-sm border border-gray-800/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* All menu items by category */}
              {categories.map((category) => {
                const categoryScreens = screens.filter(s => s.category === category.id);
                if (categoryScreens.length === 0) return null;
                
                return (
                  <div key={category.id} className="mb-6">
                    <div className="px-4 mb-2">
                      <span className="text-xs uppercase font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {category.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 px-3">
                      {categoryScreens.map((screen) => {
                        const isActive = currentScreen === getActualScreenId(screen.id);
                        
                        return (
                          <button
                            key={screen.id}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-lg text-center transition-all shadow-md",
                              isActive 
                                ? "bg-gradient-to-br from-purple-900 to-purple-800 text-white border border-purple-500/50" 
                                : "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600/50 hover:scale-105"
                            )}
                            onClick={() => handleScreenChange(getActualScreenId(screen.id))}
                          >
                            <div className={`mb-1.5 ${isActive ? 'text-purple-300' : 'text-gray-400'}`}>
                              {screen.icon}
                            </div>
                            <span className="text-xs font-medium">
                              {screen.name}
                            </span>
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 absolute -bottom-0.5"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}