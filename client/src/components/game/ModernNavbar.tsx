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
    { id: 'business', name: 'Business' },
    { id: 'system', name: 'System' }
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
    
    // System category
    { id: 'system', name: 'System', category: 'system', icon: <Settings className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', category: 'system', icon: <Settings className="w-5 h-5" /> },
    { id: 'help', name: 'Help', category: 'system', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'debug', name: 'Debug', category: 'system', icon: <Activity className="w-5 h-5" /> }
  ];
  
  // Skip rendering navbar on main menu
  if (isMainMenu) return null;
  
  return (
    <div className="w-full z-50">
      {/* Bottom tab bar for main navigation */}
      <div 
        className="bottom-nav flex justify-around items-center py-1 px-2 fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t border-purple-800/30 z-[9999]"
        style={{ 
          display: 'flex',
          height: '60px', 
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        {['main', 'music', 'marketing', 'business', 'system'].map((categoryId, idx) => {
          // Get first item from each category for quick access
          const firstScreen = screens.find(s => s.category === categoryId);
          if (!firstScreen) return null;
          
          const isActive = currentScreen && getActualScreenId(firstScreen.id) === currentScreen;
          
          return (
            <button
              key={categoryId}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-md transition-colors",
                isActive ? "text-purple-400" : "text-gray-500 hover:text-gray-300"
              )}
              onClick={() => handleScreenChange(getActualScreenId(firstScreen.id))}
            >
              {isActive && (
                <div className="absolute -top-1 w-1/6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              )}
              {firstScreen.icon}
              <span className="text-[10px] mt-1">{firstScreen.name}</span>
            </button>
          );
        })}
        
        {/* Settings Tab */}
        <button
          key="settings"
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-md transition-colors",
            currentScreen === 'settings' ? "text-purple-400" : "text-gray-500 hover:text-gray-300"
          )}
          onClick={() => handleScreenChange('settings')}
        >
          {currentScreen === 'settings' && (
            <div className="absolute -top-1 w-1/6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          )}
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-1">Settings</span>
        </button>
        
        {/* More Menu Button */}
        <button
          className="flex flex-col items-center justify-center py-2 px-1 text-gray-500 hover:text-gray-300"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={20} />
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
              className="bg-gray-900 border-t border-gray-700 rounded-t-xl pb-20 pt-2 max-h-[80vh] overflow-y-auto" 
              onClick={e => e.stopPropagation()}
              variants={sheetVariants}
            >
              {/* Pull indicator */}
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-gray-700 rounded-full"></div>
              </div>
              
              {/* Close button */}
              <div className="absolute top-2 right-2">
                <button 
                  className="p-2 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700"
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
                  <div key={category.id} className="mb-4">
                    <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">{category.name}</div>
                    <div className="grid grid-cols-3 gap-2 px-2">
                      {categoryScreens.map((screen) => {
                        const isActive = currentScreen === getActualScreenId(screen.id);
                        
                        return (
                          <button
                            key={screen.id}
                            className={cn(
                              "flex flex-col items-center justify-center space-y-1 p-3 rounded-md text-center transition-all",
                              isActive 
                                ? "bg-gradient-to-r from-purple-800 to-purple-700 text-white border border-purple-600" 
                                : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700"
                            )}
                            onClick={() => handleScreenChange(getActualScreenId(screen.id))}
                          >
                            {screen.icon}
                            <span className="text-xs font-medium">{screen.name}</span>
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