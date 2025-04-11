import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { MainMenu } from './components/game/MainMenu';
import { ArtistCustomization } from './components/game/ArtistCustomization';
import { CareerDashboard } from './components/game/CareerDashboard';
import { MusicProduction } from './components/game/MusicProduction';
import { UnreleasedSongs } from './components/game/UnreleasedSongs';
import { MusicVideos } from './components/game/MusicVideos';
import { SocialMediaView } from './components/game/SocialMediaView';
import { SocialMediaHub } from './components/game/SocialMediaHub';
import { StreamingPlatforms } from './components/game/StreamingPlatforms';
import { Collaborations } from './components/game/Collaborations';
import { SaveLoadGame } from './components/game/SaveLoadGame';
import { PremiumStore } from './components/game/PremiumStore';
import { BeefSystem } from './components/game/BeefSystem';
import { SkillsTraining } from './components/game/SkillsTraining';
import { TouringConcerts } from './components/game/TouringConcerts';
import { HypeAndControversyTester } from './components/game/HypeAndControversyTester';
import { MusicCharts } from './components/game/MusicCharts';
import { StreamingImpactDashboard } from './components/game/StreamingImpactDashboard';
import AlbumManagement from './components/game/AlbumManagement';
import SongPromotion from './components/game/SongPromotion';
import MerchandiseManagement from './components/game/MerchandiseManagement';
import { PlayerWikipedia } from './components/game/PlayerWikipedia';
import MerchandiseSalesCharts from './components/game/MerchandiseSalesCharts';
import FanbaseNameManager from './components/game/FanbaseNameManager';
import MediaEventsManager from './components/game/MediaEventsManager';
import BillboardCharts from './components/game/BillboardCharts';
import SoundDemo from './components/game/SoundDemo';

import { GameLayout } from './components/game/GameLayout';
import { useRapperGame } from './lib/stores/useRapperGame';
import { useLoadingScreen } from './lib/stores/useLoadingScreen';
import { useSettings } from './lib/stores/useSettings';
import { useAudio } from './lib/stores/useAudio';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { LoadingTransition } from './components/ui/loading-transition';
import { TurntableLoading } from './components/ui/rapper-loading';
import { Route, Switch } from 'wouter';
import SubscribePage from './pages/subscribe';
import SubscriptionSuccessPage from './pages/subscription-success';
import NotFoundPage from './pages/not-found';
import SpotifyPage from './pages/spotify';
import { CustomToastProvider } from './hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import '@fontsource/inter';
import './index.css';

// Screen-specific loading messages
const SCREEN_LOADING_MESSAGES: Record<string, string[]> = {
  main_menu: [
    "Setting the stage...",
    "Loading your rap career...",
    "Preparing beats...",
    "Starting the rhythm...",
    "Building your empire...",
  ],
  character_creation: [
    "Creating your persona...",
    "Crafting your image...",
    "Building your brand...",
    "Designing your style...",
    "Preparing your debut...",
  ],
  career_dashboard: [
    "Tracking your success...",
    "Calculating streams...",
    "Managing your career...",
    "Charting your progress...",
    "Analyzing performance metrics...",
  ],
  music_production: [
    "Setting up the studio...",
    "Preparing samples...",
    "Loading audio workstation...",
    "Calibrating microphones...",
    "Finding the perfect beat...",
  ],
  unreleased_songs: [
    "Finding your unreleased hits...",
    "Organizing your vault...",
    "Preparing your next hit...",
    "Retrieving works in progress...",
    "Dusting off forgotten gems...",
  ],
  music_videos: [
    "Setting up the cameras...",
    "Preparing video equipment...",
    "Loading video production suite...",
    "Scouting locations...",
    "Coordinating directors...",
  ],
  social_media: [
    "Connecting to the network...",
    "Checking your notifications...",
    "Loading your social presence...",
    "Analyzing trending topics...",
    "Building your online brand...",
  ],
  streaming_platforms: [
    "Connecting to streaming services...",
    "Tracking your plays...",
    "Calculating your royalties...",
    "Analyzing platform trends...",
    "Measuring audience engagement...",
  ],
  collaborations: [
    "Calling other artists...",
    "Checking your network...",
    "Setting up collaborations...",
    "Connecting with producers...",
    "Finding the perfect feature...",
  ],
  save_load: [
    "Accessing cloud storage...",
    "Loading saved games...",
    "Preparing your career history...",
    "Retrieving career snapshots...",
    "Syncing game data...",
  ],
  premium_store: [
    "Loading premium items...",
    "Connecting to store...",
    "Preparing exclusive content...",
    "Setting up the VIP section...",
    "Curating limited editions...",
  ],
  music_charts: [
    "Calculating top hits...",
    "Analyzing streaming data...",
    "Ranking this week's top songs...",
    "Compiling industry charts...",
    "Tracking chart movements...",
  ],
  streaming_impact_dashboard: [
    "Analyzing streaming platforms...",
    "Calculating platform influence...",
    "Generating impact metrics...",
    "Compiling streaming analytics...",
    "Charting listener demographics...",
  ],
  song_promotion: [
    "Preparing marketing campaigns...",
    "Connecting with promotion partners...",
    "Setting up promotional strategies...",
    "Analyzing target audiences...",
    "Planning social media rollout...",
  ],
  merchandise: [
    "Stocking your merch store...",
    "Setting up product displays...",
    "Preparing inventory management...",
    "Creating merchandise offerings...",
    "Designing limited editions...",
  ],
  merchandise_management: [
    "Loading merchandise inventory...",
    "Preparing product catalog...",
    "Setting up management tools...",
    "Organizing merchandise items...",
    "Calculating stock levels...",
  ],
  merchandise_sales_charts: [
    "Calculating merchandise revenue...",
    "Analyzing sales performance...",
    "Generating sales charts...",
    "Preparing merchandise analytics...",
    "Tracking top-selling items...",
  ],
  fanbase_naming: [
    "Connecting with your fans...",
    "Crafting your fanbase identity...",
    "Building fan community...",
    "Strengthening fan loyalty...",
    "Establishing fan culture...",
  ],
  media_events: [
    "Setting up media appearances...",
    "Checking press opportunities...",
    "Reviewing interview requests...",
    "Preparing festival lineup slots...",
    "Organizing your press schedule...",
  ],
  billboard_charts: [
    "Compiling industry rankings...",
    "Analyzing chart positions...",
    "Tracking top hits and albums...",
    "Ranking artist popularity...",
    "Measuring music industry impact...",
  ],
  player_wikipedia: [
    "Loading career history...",
    "Compiling your musical journey...",
    "Gathering career statistics...",
    "Analyzing your accomplishments...",
    "Creating your music biography...",
  ],
};

// Get a random loading message for the current screen
const getScreenLoadingMessage = (screen: string): string => {
  const messages = SCREEN_LOADING_MESSAGES[screen] || ["Loading..."];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Get a loading variant based on the screen
const getScreenLoadingVariant = (screen: string): "default" | "record" | "vinyl" | "microphone" | "random" => {
  if (screen === 'music_production') return 'microphone';
  if (screen === 'streaming_platforms') return 'vinyl';
  if (screen === 'career_dashboard') return 'record';
  if (screen === 'music_videos') return 'microphone';
  if (screen === 'social_media') return 'default';
  if (screen === 'billboard_charts') return 'record';
  return 'random';
};

function App() {
  const { screen, previousScreen } = useRapperGame();
  const { showLoading, hideLoading } = useLoadingScreen();
  const { loadingAnimationsEnabled } = useSettings();
  const audioStore = useAudio();
  const [appReady, setAppReady] = useState(false);
  
  // Setup audio initialization
  useEffect(() => {
    // Set up background music with Howler
    const bgMusic = new Howl({
      src: ['/sounds/background.mp3'],
      loop: true,
      volume: 0.3,
      autoplay: false
    });
    
    // Set up sound effects
    const hitSound = new Howl({
      src: ['/sounds/hit.mp3'],
      volume: 0.5
    });
    
    const successSound = new Howl({
      src: ['/sounds/success.mp3'],
      volume: 0.5
    });
    
    const clickSound = new Howl({
      src: ['/sounds/click.mp3'],
      volume: 0.5
    });
    
    const transitionSound = new Howl({
      src: ['/sounds/transition.mp3'],
      volume: 0.4
    });
    
    const purchaseSound = new Howl({
      src: ['/sounds/purchase.mp3'],
      volume: 0.5
    });
    
    const cashSound = new Howl({
      src: ['/sounds/cash.mp3'],
      volume: 0.5
    });
    
    const errorSound = new Howl({
      src: ['/sounds/error.mp3'],
      volume: 0.5
    });
    
    // Load sound effects into state
    if (audioStore.setBackgroundMusic) {
      audioStore.setBackgroundMusic(bgMusic);
      
      // Set other sound effects
      audioStore.hitSound = hitSound;
      audioStore.successSound = successSound;
      audioStore.clickSound = clickSound;
      audioStore.transitionSound = transitionSound;
      audioStore.purchaseSound = purchaseSound;
      audioStore.cashSound = cashSound;
      audioStore.errorSound = errorSound;
    }
    
    // Mark app as ready after a short delay
    setTimeout(() => {
      setAppReady(true);
      console.log('App ready - Sound effects loaded');
    }, 500);
  }, []);
  
  // Play transition sound (wrapped in useCallback to avoid dependency issues)
  const playScreenTransition = useCallback(() => {
    if (audioStore && audioStore.playTransition) {
      audioStore.playTransition();
    }
  }, [audioStore]);
  
  // Show loading screen when screen changes
  useEffect(() => {
    // Only run this effect if app is ready and a screen change occurs
    if (!appReady) return;
    
    if (previousScreen !== screen && previousScreen !== null) {
      // Only show loading transitions between actual screens (not on initial load)
      showLoading(
        getScreenLoadingMessage(screen),
        getScreenLoadingVariant(screen)
      );
      
      // Play transition sound
      playScreenTransition();
      
      // Use shorter loading time when animations are disabled
      const loadingTime = loadingAnimationsEnabled ? 1200 : 300;
      
      // Hide loading after the appropriate time
      const timer = setTimeout(() => {
        hideLoading();
      }, loadingTime);
      
      return () => clearTimeout(timer);
    }
  }, [screen, previousScreen, showLoading, hideLoading, loadingAnimationsEnabled, appReady, playScreenTransition]);
  
  // Initial loading component with rapper-themed animation
  const InitialLoading = () => {
    const { loadingAnimationsEnabled } = useSettings();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("Initializing game...");
    
    // Simulate loading progress
    useEffect(() => {
      const loadingTexts = [
        "Initializing game...",
        "Loading assets...",
        "Setting up audio...",
        "Preparing game components...",
        "Almost ready..."
      ];
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setLoadingProgress(progress);
        
        // Update loading text at certain points
        if (progress === 20) setLoadingText(loadingTexts[1]);
        if (progress === 40) setLoadingText(loadingTexts[2]);
        if (progress === 60) setLoadingText(loadingTexts[3]);
        if (progress === 80) setLoadingText(loadingTexts[4]);
        
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-purple-950 to-gray-900 text-white p-6 relative overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/5 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8">
            {loadingAnimationsEnabled ? (
              <TurntableLoading size="lg" />
            ) : (
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            )}
          </div>
          
          <motion.h2 
            className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-pink-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Rap Empire Simulator
          </motion.h2>
          
          <motion.p 
            className="text-gray-300 mb-8 text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {loadingText}
          </motion.p>
          
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <motion.p 
            className="mt-2 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {loadingProgress}% Complete
          </motion.p>
        </div>
      </div>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CustomToastProvider>
        <Suspense fallback={<InitialLoading />}>
          {appReady ? (
            <AnimatePresence mode="wait">
              <Switch>
                {/* Subscription routes */}
                <Route path="/subscribe">
                  <motion.div 
                    className="subscription-page z-50 absolute top-0 left-0 w-full h-full overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SubscribePage />
                  </motion.div>
                </Route>
                <Route path="/subscription-success">
                  <motion.div 
                    className="subscription-page z-50 absolute top-0 left-0 w-full h-full overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SubscriptionSuccessPage />
                  </motion.div>
                </Route>
                
                {/* Spotify UI */}
                <Route path="/spotify">
                  <motion.div 
                    className="spotify-page z-50 absolute top-0 left-0 w-full h-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SpotifyPage />
                  </motion.div>
                </Route>
                
                {/* Game routes */}
                <Route path="/">
                  <LoadingTransition>
                    <GameLayout>
                      {screen === 'main_menu' && <MainMenu />}
                      {screen === 'character_creation' && <ArtistCustomization />}
                      {screen === 'career_dashboard' && <CareerDashboard />}
                      {screen === 'music_production' && <MusicProduction />}
                      {screen === 'unreleased_songs' && <UnreleasedSongs />}
                      {screen === 'music_videos' && <MusicVideos />}
                      {screen === 'social_media' && <SocialMediaHub />}
                      {screen === 'streaming_platforms' && <StreamingPlatforms />}
                      {screen === 'collaborations' && <Collaborations />}
                      {screen === 'save_load' && <SaveLoadGame />}
                      {screen === 'premium_store' && <PremiumStore />}
                      {screen === 'beefs' && <BeefSystem />}
                      {screen === 'skills' && <SkillsTraining />}
                      {screen === 'touring' && <TouringConcerts />}
                      {screen === 'hype_tester' && <HypeAndControversyTester />}
                      {screen === 'music_charts' && <MusicCharts />}
                      {screen === 'streaming_impact_dashboard' && <StreamingImpactDashboard />}
                      {screen === 'album_management' && <AlbumManagement />}
                      {screen === 'song_promotion' && <SongPromotion />}
                      {screen === 'merchandise' && <MerchandiseManagement />}
                      {screen === 'merchandise_management' && <MerchandiseManagement />}
                      {screen === 'merchandise_sales_charts' && <MerchandiseSalesCharts />}
                      {screen === 'fanbase_naming' && <FanbaseNameManager />}
                      {screen === 'media_events' && <MediaEventsManager />}
                      {screen === 'billboard_charts' && <BillboardCharts />}
                      {screen === 'player_wikipedia' && <PlayerWikipedia />}
                      {screen === 'sound_demo' && <SoundDemo />}
                    </GameLayout>
                  </LoadingTransition>
                </Route>
                
                {/* Not found */}
                <Route>
                  <NotFoundPage />
                </Route>
              </Switch>
            </AnimatePresence>
          ) : (
            <InitialLoading />
          )}
        </Suspense>
      </CustomToastProvider>
    </QueryClientProvider>
  );
}

export default App;
