import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { MetricsCard } from '@/components/ui/metrics-card';
import { ProgressBar } from '@/components/ui/progressbar';
import { ImageUploader } from '@/components/ui/image-uploader';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { Badge } from '@/components/ui/badge';
import { 
  BarChartIcon, 
  CalendarIcon, 
  DollarIcon, 
  MicrophoneIcon, 
  MusicIcon, 
  SpotifyIcon, 
  TwitterIcon, 
  UsersIcon,
  ShoppingCartIcon
} from '@/assets/icons';
import { Tv, Radio, Calendar, ArrowLeft, CheckCircle, Clock, DollarSign, Star, Briefcase, ChevronRight } from 'lucide-react';
import { ImageIcon, TrendingUp } from 'lucide-react';
import { RandomEvents } from './RandomEvents';
import MarketTrends from './MarketTrends';
import { CAREER_LEVELS } from '@/lib/gameData';
import { WeeklyStats } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

// Define Job interface for our jobs system
interface Job {
  id: string;
  title: string;
  description: string;
  payout: number;
  duration: number; // in hours
  energyCost: number;
  requiredSkill?: string;
  minSkillLevel?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status?: 'available' | 'in_progress' | 'completed';
  startedWeek?: number;
}

export function CareerDashboard() {
  const { 
    character, 
    currentWeek, 
    stats, 
    songs, 
    socialMedia, 
    streamingPlatforms, 
    advanceWeek, 
    setScreen,
    activeRandomEvents,
    weeklyStats,
    updateProfileImage,
    updateCharacter
  } = useRapperGame();
  
  // State for chart data view
  const [chartMetric, setChartMetric] = useState<'streams' | 'followers' | 'wealth'>('streams');
  
  // State for weekly summary dialog
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  
  // State for jobs functionality
  const [showJobsScreen, setShowJobsScreen] = useState(false);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Open Mic Night',
      description: 'Perform at a local open mic night to gain experience and a small amount of money.',
      payout: 50,
      duration: 2,
      energyCost: 10,
      difficulty: 'easy',
      status: 'available'
    },
    {
      id: '2',
      title: 'Studio Assistant',
      description: 'Help out at a local recording studio. Learn the ropes while earning some cash.',
      payout: 150,
      duration: 4,
      energyCost: 15,
      difficulty: 'easy',
      status: 'available'
    },
    {
      id: '3',
      title: 'Lyric Writer',
      description: 'Write lyrics for upcoming artists. Use your creativity to earn money.',
      payout: 300,
      duration: 5,
      energyCost: 25,
      requiredSkill: 'creativity',
      minSkillLevel: 25,
      difficulty: 'medium',
      status: 'available'
    },
    {
      id: '4',
      title: 'Radio Host',
      description: 'Host a segment on local radio. Great networking opportunity and decent pay.',
      payout: 500,
      duration: 8,
      energyCost: 30,
      requiredSkill: 'networking',
      minSkillLevel: 30,
      difficulty: 'medium',
      status: 'available'
    },
    {
      id: '5',
      title: 'Venue Promoter',
      description: 'Promote events at local venues. High payout for those with good marketing skills.',
      payout: 800,
      duration: 10,
      energyCost: 40,
      requiredSkill: 'marketing',
      minSkillLevel: 40,
      difficulty: 'hard',
      status: 'available'
    }
  ]);
  const [summaryData, setSummaryData] = useState<{
    previousWeek: number;
    newStreams: number;
    newFollowers: number;
    revenue: number;
    viralSongs: string[];
    floppedSongs: string[];
    comebackSongs: string[];
  } | null>(null);

  // Prevent crashes with null character
  useEffect(() => {
    if (!character) {
      setScreen('main_menu');
    }
  }, [character, setScreen]);
  
  // Function to handle next week with summary
  const handleNextWeek = () => {
    // Capture previous stats for comparison with null safety checks
    const previousWeek = currentWeek || 0;
    const previousStreams = streamingPlatforms?.reduce((sum, platform) => sum + (platform.totalStreams || 0), 0) || 0;
    const previousFollowers = socialMedia?.reduce((sum, platform) => sum + (platform.followers || 0), 0) || 0;
    const previousWealth = stats?.wealth || 0;
    
    // Open confirmation dialog before advancing week
    setShowWeeklySummary(true);
    
    // Set summary data with placeholders (will be updated after advancement)
    setSummaryData({
      previousWeek,
      newStreams: 0,
      newFollowers: 0,
      revenue: 0,
      viralSongs: [],
      floppedSongs: [],
      comebackSongs: []
    });
  };
  
  // Handle the actual advancement when user confirms
  const confirmAdvanceWeek = () => {
    // Capture previous stats for comparison with null safety checks
    const previousWeek = currentWeek || 0;
    const previousStreams = streamingPlatforms?.reduce((sum, platform) => sum + (platform.totalStreams || 0), 0) || 0;
    const previousFollowers = socialMedia?.reduce((sum, platform) => sum + (platform.followers || 0), 0) || 0;
    const previousWealth = stats?.wealth || 0;
    
    // Advance the week using the store function
    advanceWeek();
    
    // Wait for state update
    setTimeout(() => {
      // Get updated state after advancing the week
      const currentState = useRapperGame.getState();
      
      // Calculate changes with null safety checks and ensure they're never negative
      const currentTotalStreams = currentState.streamingPlatforms?.reduce(
        (sum, platform) => sum + (platform.totalStreams || 0), 0) || 0;
      const newStreams = Math.max(0, currentTotalStreams - previousStreams);
      
      const currentTotalFollowers = currentState.socialMedia?.reduce(
        (sum, platform) => sum + (platform.followers || 0), 0) || 0;
      const newFollowers = Math.max(0, currentTotalFollowers - previousFollowers);
      
      const newWealth = Math.max(0, currentState.stats.wealth - previousWealth);
      
      // Find viral, flopped, and comeback songs this week
      const viralSongs = currentState.songs
        .filter(song => song.performanceType === 'viral' && song.performanceStatusWeek === currentState.currentWeek)
        .map(song => song.title);
        
      const floppedSongs = currentState.songs
        .filter(song => song.performanceType === 'flop' && song.performanceStatusWeek === currentState.currentWeek)
        .map(song => song.title);
        
      const comebackSongs = currentState.songs
        .filter(song => song.performanceType === 'comeback' && song.performanceStatusWeek === currentState.currentWeek)
        .map(song => song.title);
      
      // Update summary data with actual values
      setSummaryData({
        previousWeek,
        newStreams,
        newFollowers,
        revenue: newWealth,
        viralSongs,
        floppedSongs,
        comebackSongs
      });
    }, 100); // Small delay to ensure state is updated
  };

  if (!character) return null;

  // Calculate total stats across platforms with enhanced null safety checks
  const totalFollowers = socialMedia?.reduce((sum, platform) => 
    sum + (platform && typeof platform.followers === 'number' ? platform.followers : 0), 0) || 0;
  
  const totalMonthlyListeners = streamingPlatforms?.reduce((sum, platform) => 
    sum + (platform && typeof platform.listeners === 'number' ? platform.listeners : 0), 0) || 0;
  
  // Calculate total streams from both individual songs AND from platform totals (whichever is higher)
  const songsTotalStreams = songs?.reduce((sum, song) => 
    sum + (song && typeof song.streams === 'number' ? song.streams : 0), 0) || 0;
    
  const platformTotalStreams = streamingPlatforms?.reduce((sum, platform) => 
    sum + (platform && typeof platform.totalStreams === 'number' ? platform.totalStreams : 0), 0) || 0;
    
  // Use the higher of the two totals to ensure accurate display
  const totalStreams = Math.max(songsTotalStreams, platformTotalStreams);
  
  const totalRevenue = streamingPlatforms?.reduce((sum, platform) => 
    sum + (platform && typeof platform.revenue === 'number' ? platform.revenue : 0), 0) || 0;
  
  // Find current career level info with defensive coding
  const careerLevel = stats?.careerLevel || 1;
  const currentLevelInfo = CAREER_LEVELS.find(level => level.level === careerLevel) || CAREER_LEVELS[0];
  const nextLevelInfo = CAREER_LEVELS.find(level => level.level === careerLevel + 1);
  
  // Calculate progress to next level
  let levelProgress = 0;
  let nextLevelStreams = 0;
  
  if (nextLevelInfo) {
    const currentLevelStreams = currentLevelInfo.totalStreamsRequired;
    nextLevelStreams = nextLevelInfo.totalStreamsRequired;
    const streamsNeeded = nextLevelStreams - currentLevelStreams;
    const streamsObtained = Math.max(0, totalStreams - currentLevelStreams);
    
    // Calculate progress percentage, handling potential NaN
    const progressPercentage = streamsNeeded > 0 ? (streamsObtained / streamsNeeded) * 100 : 0;
    
    // Make sure we have a valid progress value
    levelProgress = isNaN(progressPercentage) ? 0 : Math.min(100, Math.max(0, progressPercentage));
  }

  // Format large numbers
  const formatNumber = (num: number): string => {
    // Check if the number is NaN or undefined and return a default value
    if (num === undefined || isNaN(num)) {
      return "0";
    }
    
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1) + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format money
  const formatMoney = (amount: number): string => {
    // Extra check to ensure we never display NaN
    if (amount === undefined || isNaN(amount)) {
      return '$0';
    }
    return '$' + formatNumber(amount);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black text-white p-4 overflow-y-auto">
      {/* Header with career info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-800 border border-gray-700">
            {character.image ? (
              <img src={character.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                <MicrophoneIcon size={32} className="text-gray-300" />
              </div>
            )}
            <div className="mt-2">
              <ImageUploader
                currentImage={character.image}
                onImageSelected={(imageData) => updateProfileImage(imageData)}
                size="sm"
                label="Change Image"
                aspectRatio="square"
                previewClassName="hidden"
                buttonText="Change Profile Picture"
                dialogTitle="Upload Artist Image"
                className="w-full text-xs py-1 px-2"
              />
            </div>
          </div>
          
          {/* Artist Info */}
          <div>
            <h1 className="text-3xl font-bold text-amber-400">{character.artistName}</h1>
            <div className="flex items-center text-gray-400 text-sm">
              <CalendarIcon size={16} className="mr-1" />
              <span>Week {currentWeek || 0} • {character.artistName}</span>
            </div>
            <div className="mt-1">
              <span className="text-green-400 font-semibold">{currentLevelInfo.name}</span>
              <span className="text-gray-400 text-sm"> (Level {stats?.careerLevel || 1})</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap mt-4 md:mt-0 gap-2">
          <Button 
            onClick={() => setScreen('save_load')} 
            variant="outline" 
            className="bg-transparent border-gray-600 hover:bg-gray-800"
            size="sm"
          >
            Save Game
          </Button>
          
          <Button
            onClick={() => setScreen('premium_store')}
            variant="outline"
            className="bg-transparent border-yellow-600 hover:bg-yellow-900/30 text-yellow-400"
            size="sm"
          >
            Premium Store
          </Button>
          
          <Button
            onClick={() => setScreen('hype_tester')}
            variant="outline"
            className="bg-transparent border-purple-600 hover:bg-purple-900/30 text-purple-400"
            size="sm"
          >
            Hype Tester
          </Button>
          
          <Button
            onClick={() => setScreen('fanbase_naming')}
            variant="outline"
            className="bg-transparent border-pink-600 hover:bg-pink-900/30 text-pink-400"
            size="sm"
          >
            Fanbase Naming
          </Button>
          
          <Button
            onClick={() => setScreen('billboard_charts')}
            variant="outline"
            className="bg-transparent border-amber-600 hover:bg-amber-900/30 text-amber-400"
            size="sm"
          >
            Billboard Charts
          </Button>
          
          <Button
            onClick={handleNextWeek}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={activeRandomEvents.length > 0}
            size="sm"
          >
            Next Week
          </Button>
        </div>
      </div>
      
      {/* Random Events */}
      {activeRandomEvents.length > 0 && (
        <div className="mb-6">
          <RandomEvents />
        </div>
      )}
      
      {/* Career stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricsCard
          title="Monthly Listeners"
          value={formatNumber(totalMonthlyListeners)}
          icon={<SpotifyIcon size={20} />}
          trend={{ value: 12, direction: 'up' }}
        />
        
        <MetricsCard
          title="Total Followers"
          value={formatNumber(totalFollowers)}
          icon={<TwitterIcon size={20} />}
          trend={{ value: 8, direction: 'up' }}
        />
        
        <MetricsCard
          title="Wealth"
          value={formatMoney(stats?.wealth || 0)}
          icon={<DollarIcon size={20} />}
          trend={{ value: 5, direction: 'up' }}
        />
      </div>
      
      {/* Career progress */}
      <Card className="mb-6 bg-black/30 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center">
            <BarChartIcon size={18} className="mr-2 text-amber-400" />
            Career Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nextLevelInfo ? (
            <>
              <ProgressBar 
                value={levelProgress} 
                max={100} 
                size="lg" 
                color="success" 
                className="mb-2"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {formatNumber(totalStreams)} / {formatNumber(nextLevelInfo.totalStreamsRequired)} streams
                </span>
                <span className="text-gray-400">
                  Next Level: {nextLevelInfo.name}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-2 text-amber-400">
              Maximum Level Reached! You are a legend!
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Career Data Section - Analytics and Market Trends */}
      {weeklyStats && weeklyStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Analytics Chart */}
          <Card className="bg-black/30 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex justify-between items-center">
                <div className="flex items-center">
                  <BarChartIcon size={18} className="mr-2 text-amber-400" />
                  Career Analytics
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={chartMetric === 'streams' ? 'default' : 'outline'} 
                    onClick={() => setChartMetric('streams')}
                    className={chartMetric === 'streams' ? 'bg-green-600 hover:bg-green-700' : 'bg-transparent border-gray-600 hover:bg-gray-800'}
                  >
                    Streams
                  </Button>
                  <Button 
                    size="sm" 
                    variant={chartMetric === 'followers' ? 'default' : 'outline'} 
                    onClick={() => setChartMetric('followers')}
                    className={chartMetric === 'followers' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-transparent border-gray-600 hover:bg-gray-800'}
                  >
                    Followers
                  </Button>
                  <Button 
                    size="sm" 
                    variant={chartMetric === 'wealth' ? 'default' : 'outline'} 
                    onClick={() => setChartMetric('wealth')}
                    className={chartMetric === 'wealth' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-transparent border-gray-600 hover:bg-gray-800'}
                  >
                    Wealth
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weeklyStats}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="week" 
                      label={{ value: 'Week', position: 'insideBottomRight', offset: -10 }}
                      stroke="#999"
                    />
                    <YAxis 
                      stroke="#999"
                      tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip
                      formatter={(value: number) => {
                        if (chartMetric === 'wealth') {
                          // Extra check for NaN values in chart tooltips
                          if (value === undefined || isNaN(value)) {
                            return ['$0', 'Wealth'];
                          }
                          return [formatMoney(value), 'Wealth'];
                        }
                        return [formatNumber(value), chartMetric === 'streams' ? 'Streams' : 'Followers'];
                      }}
                      labelFormatter={(label) => `Week ${label}`}
                      contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={chartMetric === 'streams' ? 'totalStreams' : chartMetric === 'followers' ? 'totalFollowers' : 'wealth'} 
                      stroke={chartMetric === 'streams' ? '#10b981' : chartMetric === 'followers' ? '#3b82f6' : '#f59e0b'} 
                      fill={chartMetric === 'streams' ? 'rgba(16, 185, 129, 0.2)' : chartMetric === 'followers' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'} 
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-center text-gray-400 mt-2">
                {chartMetric === 'streams' 
                  ? 'Total streams over time - See your music growth week-by-week' 
                  : chartMetric === 'followers' 
                    ? 'Social media follower growth - Your expanding audience' 
                    : 'Cash flow progression - Track your earnings'}
              </div>
            </CardContent>
          </Card>
          
          {/* Market Trends Panel */}
          <Card className="bg-black/30 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <TrendingUp size={18} className="mr-2 text-pink-400" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarketTrends />
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          className="bg-gradient-to-br from-purple-900/70 to-indigo-900/70 border-indigo-800/60 cursor-pointer hover:from-purple-800/70/80 hover:to-indigo-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-800/20"
          onClick={() => setScreen('music_production')}
        >
          <CardContent className="flex items-center p-6">
            <MusicIcon size={36} className="mr-4 text-indigo-300" />
            <div>
              <h3 className="font-bold text-lg">Music Studio</h3>
              <p className="text-sm text-gray-300">Record new tracks</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-blue-900/70 to-cyan-900/70 border-cyan-800/60 cursor-pointer hover:from-blue-800/70/80 hover:to-cyan-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-800/20"
          onClick={() => setScreen('social_media')}
        >
          <CardContent className="flex items-center p-6">
            <TwitterIcon size={36} className="mr-4 text-cyan-300" />
            <div>
              <h3 className="font-bold text-lg">Social Media</h3>
              <p className="text-sm text-gray-300">Grow your following</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-emerald-900/70 to-green-900/70 border-green-800/60 cursor-pointer hover:from-emerald-800/70/80 hover:to-green-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-green-800/20"
          onClick={() => setScreen('streaming_platforms')}
        >
          <CardContent className="flex items-center p-6">
            <SpotifyIcon size={36} className="mr-4 text-green-300" />
            <div>
              <h3 className="font-bold text-lg">Streaming Platforms</h3>
              <p className="text-sm text-gray-300">Track your streams</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-blue-900/70 to-indigo-900/70 border-indigo-800/60 cursor-pointer hover:from-blue-800/70/80 hover:to-indigo-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-800/20"
          onClick={() => setScreen('streaming_impact_dashboard')}
        >
          <CardContent className="flex items-center p-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-9 w-9 mr-4 text-blue-300"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
              <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
            </svg>
            <div>
              <h3 className="font-bold text-lg">Platform Impact</h3>
              <p className="text-sm text-gray-300">Analyze streaming analytics</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          className="bg-gradient-to-br from-orange-900/70 to-red-900/70 border-red-800/60 cursor-pointer hover:from-orange-800/70/80 hover:to-red-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-red-800/20"
          onClick={() => setScreen('unreleased_songs')}
        >
          <CardContent className="flex items-center p-6">
            <MusicIcon size={36} className="mr-4 text-orange-300" />
            <div>
              <h3 className="font-bold text-lg">Unreleased Songs</h3>
              <p className="text-sm text-gray-300">Prepare and release tracks</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-pink-900/70 to-rose-900/70 border-rose-800/60 cursor-pointer hover:from-pink-800/70/80 hover:to-rose-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-rose-800/20"
          onClick={() => setScreen('music_videos')}
        >
          <CardContent className="flex items-center p-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-9 w-9 mr-4 text-rose-300"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <div>
              <h3 className="font-bold text-lg">Music Videos</h3>
              <p className="text-sm text-gray-300">Create viral visual content</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-amber-900/70 to-yellow-900/70 border-yellow-800/60 cursor-pointer hover:from-amber-800/70/80 hover:to-yellow-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-yellow-800/20"
          onClick={() => setScreen('collaborations')}
        >
          <CardContent className="flex items-center p-6">
            <UsersIcon size={36} className="mr-4 text-yellow-300" />
            <div>
              <h3 className="font-bold text-lg">Collaborations</h3>
              <p className="text-sm text-gray-300">Work with other artists</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Album Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          className="bg-gradient-to-br from-purple-900/70 to-indigo-900/70 border-indigo-800 cursor-pointer hover:from-purple-800/70 hover:to-indigo-800/70 transition-colors col-span-full"
          onClick={() => setScreen('album_management')}
        >
          <CardContent className="flex items-center p-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-9 w-9 mr-4 text-purple-300"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 3c.53 0 1.039.211 1.414.586S14 4.47 14 5v14c0 .53-.211 1.039-.586 1.414S12.53 21 12 21s-1.039-.211-1.414-.586S10 19.53 10 19V5c0-.53.211-1.039.586-1.414S11.47 3 12 3z"/>
              <path d="M5 8c.53 0 1.039.211 1.414.586S7 9.47 7 10v9c0 .53-.211 1.039-.586 1.414S5.53 21 5 21s-1.039-.211-1.414-.586S3 19.53 3 19v-9c0-.53.211-1.039.586-1.414S4.47 8 5 8zM19 8c.53 0 1.039.211 1.414.586S21 9.47 21 10v9c0 .53-.211 1.039-.586 1.414S19.53 21 19 21s-1.039-.211-1.414-.586S17 19.53 17 19v-9c0-.53.211-1.039.586-1.414S18.47 8 19 8z"/>
            </svg>
            <div>
              <h3 className="font-bold text-lg">Album Management</h3>
              <p className="text-sm text-gray-300">Create, release and manage albums</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activities & Features */}
      <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
        <Calendar className="mr-2 h-5 w-5" />
        Activities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Jobs Card */}
        <Card 
          className="bg-gradient-to-br from-indigo-900/70 to-blue-900/70 border-blue-800/60 cursor-pointer hover:from-indigo-800/80 hover:to-blue-800/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-900/20"
          onClick={() => setShowJobsScreen(true)}
        >
          <CardContent className="flex items-center p-6">
            <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-800/60">
              <Briefcase className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Jobs</h3>
              <p className="text-blue-200/80 text-sm">Work for money</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-green-900/70 to-teal-900/70 border-teal-800/60 cursor-pointer hover:from-green-800/80 hover:to-teal-800/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-green-900/20"
          onClick={() => setScreen('song_promotion')}
        >
          <CardContent className="flex items-center p-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-9 w-9 mr-4 text-green-300"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M15.5 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            </svg>
            <div>
              <h3 className="font-bold text-lg">Song Promotion</h3>
              <p className="text-sm text-gray-300">Promote your music</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-red-900/70 to-purple-900/70 border-purple-800/60 cursor-pointer hover:from-red-800/80 hover:to-purple-800/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-purple-900/20"
          onClick={() => setScreen('beefs')}
        >
          <CardContent className="flex items-center p-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-9 w-9 mr-4 text-red-300"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m8 15 2-2M16 9l-2 2M9 10l5 5M15 9l-5 5"/>
            </svg>
            <div>
              <h3 className="font-bold text-lg">Beef System</h3>
              <p className="text-sm text-gray-300">Start or respond to diss tracks</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-indigo-900/70 to-blue-900/70 border-blue-800/60 cursor-pointer hover:from-indigo-800/80 hover:to-blue-800/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-900/20"
          onClick={() => setScreen('skills')}
        >
          <CardContent className="flex items-center p-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-9 w-9 mr-4 text-blue-300"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <div>
              <h3 className="font-bold text-lg">Skills Training</h3>
              <p className="text-sm text-gray-300">Improve your abilities</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-emerald-900/70 to-teal-900/70 border-teal-800/60 cursor-pointer hover:from-emerald-800/70/80 hover:to-teal-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-teal-800/20"
          onClick={() => setScreen('touring')}
        >
          <CardContent className="flex items-center p-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-9 w-9 mr-4 text-teal-300"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M4 10a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v0ZM2 17a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2v-2Z"/>
            </svg>
            <div>
              <h3 className="font-bold text-lg">Touring & Concerts</h3>
              <p className="text-sm text-gray-300">Perform live and earn money</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-pink-900/70 to-fuchsia-900/70 border-fuchsia-800/60 cursor-pointer hover:from-pink-800/70/80 hover:to-fuchsia-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-fuchsia-800/20"
          onClick={() => setScreen('music_charts')}
        >
          <CardContent className="flex items-center p-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-9 w-9 mr-4 text-pink-300"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12" y2="6" />
              <line x1="7" y1="15" x2="7" y2="9" />
              <line x1="17" y1="15" x2="17" y2="9" />
            </svg>
            <div>
              <h3 className="font-bold text-lg">Music Charts</h3>
              <p className="text-sm text-gray-300">Track rankings and trends</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-teal-900/70 to-emerald-900/70 border-emerald-800/60 cursor-pointer hover:from-teal-800/70/80 hover:to-emerald-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-800/20"
          onClick={() => setScreen('merchandise_management')}
        >
          <CardContent className="flex items-center p-6">
            <ShoppingCartIcon size={36} className="mr-4 text-teal-300" />
            <div>
              <h3 className="font-bold text-lg">Merchandise</h3>
              <p className="text-sm text-gray-300">Sell merch to your fans</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-violet-900/70 to-fuchsia-900/70 border-fuchsia-800/60 cursor-pointer hover:from-violet-800/70/80 hover:to-fuchsia-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-fuchsia-800/20"
          onClick={() => setScreen('media_events')}
        >
          <CardContent className="flex items-center p-6">
            <Tv size={36} className="mr-4 text-fuchsia-300" />
            <div>
              <h3 className="font-bold text-lg">Media Events</h3>
              <p className="text-sm text-gray-300">Attend festivals, shows & interviews</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-amber-900/70 to-yellow-900/70 border-amber-800/60 cursor-pointer hover:from-amber-800/70/80 hover:to-yellow-800/70/80 transition-all rounded-xl shadow-md hover:shadow-lg hover:shadow-amber-800/20"
          onClick={() => setScreen('billboard_charts')}
        >
          <CardContent className="flex items-center p-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-9 w-9 mr-4 text-amber-300"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <div>
              <h3 className="font-bold text-lg">Billboard Charts</h3>
              <p className="text-sm text-gray-300">Track industry rankings & trends</p>
            </div>
          </CardContent>
        </Card>

        
      </div>
      
      {/* Top Songs */}
      {songs.filter(song => song.released).length > 0 && (
        <Card className="mt-6 bg-black/30 border-gray-800/60 rounded-xl shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <MusicIcon size={18} className="mr-2 text-amber-400" />
              Top Songs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-800">
              {songs
                .filter(song => song.released)
                .sort((a, b) => b.streams - a.streams)
                .slice(0, 5)
                .map(song => (
                  <div key={song.id} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                          song.performanceType === 'viral' ? 'bg-green-600' : 
                          song.performanceType === 'flop' ? 'bg-red-600' : 
                          song.performanceType === 'comeback' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}
                      >
                        {song.coverArt ? (
                          <img src={song.coverArt} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          song.icon === "fire" ? "🔥" : 
                          song.icon === "star" ? "⭐" : 
                          (song.icon as string) === "diamond" ? "💎" : 
                          (song.icon as string) === "crown" ? "👑" : 
                          song.icon === "microphone" ? "🎤" : "🎵"
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{song.title}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          {song.performanceType === 'viral' && (
                            <span className="text-green-400 font-semibold flex items-center">
                              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                              Viral
                            </span>
                          )}
                          {song.performanceType === 'flop' && (
                            <span className="text-red-400 font-semibold flex items-center">
                              <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                              Flopping
                            </span>
                          )}
                          {song.performanceType === 'comeback' && (
                            <span className="text-purple-400 font-semibold flex items-center">
                              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
                              Comeback
                            </span>
                          )}
                          {!song.performanceType || song.performanceType === 'normal' && (
                            <span className="text-gray-400">
                              Released week {song.releaseDate}
                            </span>
                          )}
                          {song.featuring.length > 0 && (
                            <span className="ml-2 text-yellow-400">
                              {song.featuring.length} feature{song.featuring.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatNumber(song.streams)}</div>
                      <div className="text-xs text-gray-400">
                        {song.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Artist Stats */}
      <Card className="mt-6 bg-black/30 border-gray-800/60 rounded-xl shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center">
            <MicrophoneIcon size={18} className="mr-2 text-amber-400" />
            Artist Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ProgressBar 
                value={stats.reputation} 
                max={100} 
                label="Reputation" 
                showValue={true} 
                size="md" 
                className="mb-3"
              />
              <ProgressBar 
                value={stats.creativity} 
                max={100} 
                label="Creativity" 
                showValue={true} 
                size="md" 
                className="mb-3"
              />
              <ProgressBar 
                value={stats.marketing} 
                max={100} 
                label="Marketing" 
                showValue={true} 
                size="md" 
                className="mb-3"
              />
            </div>
            <div>
              <ProgressBar 
                value={stats.networking} 
                max={100} 
                label="Networking" 
                showValue={true} 
                size="md" 
                className="mb-3"
              />
              <ProgressBar 
                value={stats.fanLoyalty} 
                max={100} 
                label="Fan Loyalty" 
                showValue={true} 
                size="md" 
                className="mb-3"
              />
              <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
                <span>Total Songs: {songs.length}</span>
                <span>Total Streams: {formatNumber(totalStreams)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Weekly Summary Dialog */}
      <Dialog open={showWeeklySummary} onOpenChange={setShowWeeklySummary}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Ready to advance to Week {summaryData?.previousWeek !== undefined ? summaryData.previousWeek + 1 : currentWeek + 1}?
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Click "Advance Week" to continue your career
            </DialogDescription>
          </DialogHeader>
          
          {summaryData && (
            <div className="space-y-4 py-2">
              {/* Main Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {formatNumber(summaryData.newStreams)}
                  </div>
                  <div className="text-sm text-gray-400">New Streams</div>
                </div>
                
                <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {formatNumber(summaryData.newFollowers)}
                  </div>
                  <div className="text-sm text-gray-400">New Followers</div>
                </div>
                
                <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {summaryData && typeof summaryData.revenue === 'number' && !isNaN(summaryData.revenue) 
                      ? formatMoney(summaryData.revenue) 
                      : '$0'}
                  </div>
                  <div className="text-sm text-gray-400">Revenue</div>
                </div>
              </div>
              
              {/* Song Performance Changes */}
              <div className="space-y-3">
                {summaryData.viralSongs.length > 0 && (
                  <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
                    <h3 className="font-bold text-green-400 mb-1 flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Viral Hits
                    </h3>
                    <p className="text-sm text-gray-300">
                      {summaryData.viralSongs.join(", ")} {summaryData.viralSongs.length === 1 ? "has" : "have"} gone viral! Expect a huge boost in streams.
                    </p>
                  </div>
                )}
                
                {summaryData.floppedSongs.length > 0 && (
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                    <h3 className="font-bold text-red-400 mb-1 flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      Flopped Songs
                    </h3>
                    <p className="text-sm text-gray-300">
                      {summaryData.floppedSongs.join(", ")} {summaryData.floppedSongs.length === 1 ? "is" : "are"} underperforming. Focus on new content to recover.
                    </p>
                  </div>
                )}
                
                {summaryData.comebackSongs.length > 0 && (
                  <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-3">
                    <h3 className="font-bold text-purple-400 mb-1 flex items-center">
                      <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      Comeback Songs
                    </h3>
                    <p className="text-sm text-gray-300">
                      {summaryData.comebackSongs.join(", ")} {summaryData.comebackSongs.length === 1 ? "has" : "have"} made a comeback! Fans are rediscovering these tracks.
                    </p>
                  </div>
                )}
                
                {summaryData.viralSongs.length === 0 && summaryData.floppedSongs.length === 0 && summaryData.comebackSongs.length === 0 && (
                  <div className="bg-gray-800/60 rounded-lg p-3">
                    <h3 className="font-bold text-gray-300 mb-1">Song Performance</h3>
                    <p className="text-sm text-gray-400">
                      No major changes in song performance this week. Keep working on your career!
                    </p>
                  </div>
                )}
              </div>
              
              {/* Career Advice */}
              <div className="bg-indigo-900/20 border border-indigo-800 rounded-lg p-3">
                <h3 className="font-bold text-indigo-400 mb-1">Career Tip</h3>
                <p className="text-sm text-gray-300">
                  {summaryData.newStreams > 100000 
                    ? "Your streams are growing fast! Consider releasing more music to capitalize on your momentum."
                    : summaryData.newFollowers > 10000
                    ? "Your fan base is expanding quickly. Engage more on social media to maintain this growth."
                    : summaryData.revenue > 10000
                    ? "Revenue is looking good! Consider investing in better production equipment for higher quality songs."
                    : "Keep working on building your audience by releasing quality music consistently."}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2 flex-col sm:flex-row justify-end">
            <Button 
              onClick={() => setShowWeeklySummary(false)}
              variant="outline"
              className="flex-1 bg-transparent border-gray-600 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmAdvanceWeek}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Advance Week
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Jobs Screen Dialog */}
      <Dialog open={showJobsScreen} onOpenChange={setShowJobsScreen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-amber-400" />
              Jobs
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Work for money and improve your skills
            </DialogDescription>
          </DialogHeader>
          
          {activeJob ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-amber-400">{activeJob.title}</h3>
                  <p className="text-gray-300 mt-1">{activeJob.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:bg-gray-800"
                  onClick={() => setActiveJob(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Jobs
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center text-amber-400 mb-2">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Payment</span>
                  </div>
                  <p className="text-2xl font-bold">{formatMoney(activeJob.payout)}</p>
                </div>
                
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center text-blue-400 mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Duration</span>
                  </div>
                  <p className="text-2xl font-bold">{activeJob.duration} hours</p>
                </div>
                
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center text-green-400 mb-2">
                    <Star className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Difficulty</span>
                  </div>
                  <div>
                    <Badge 
                      className={
                        activeJob.difficulty === 'easy' 
                          ? "bg-green-600" 
                          : activeJob.difficulty === 'medium' 
                          ? "bg-amber-600" 
                          : "bg-red-600"
                      }
                    >
                      {activeJob.difficulty === 'easy' 
                        ? "Easy" 
                        : activeJob.difficulty === 'medium' 
                        ? "Medium" 
                        : "Hard"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {activeJob.requiredSkill && (
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-white mb-2">Requirements</h4>
                  <p className="text-gray-300">
                    <span className="text-amber-400">{activeJob.requiredSkill}: </span>
                    <span>{activeJob.minSkillLevel}+ required</span>
                    {stats && activeJob.requiredSkill && activeJob.minSkillLevel && 
                     typeof stats[activeJob.requiredSkill as keyof typeof stats] === 'number' && 
                     (stats[activeJob.requiredSkill as keyof typeof stats] as number) < activeJob.minSkillLevel && (
                      <span className="text-red-400 ml-2">(Your level: {stats[activeJob.requiredSkill as keyof typeof stats]})</span>
                    )}
                    {stats && activeJob.requiredSkill && activeJob.minSkillLevel && 
                     typeof stats[activeJob.requiredSkill as keyof typeof stats] === 'number' && 
                     (stats[activeJob.requiredSkill as keyof typeof stats] as number) >= activeJob.minSkillLevel && (
                      <span className="text-green-400 ml-2">(Your level: {stats[activeJob.requiredSkill as keyof typeof stats]})</span>
                    )}
                  </p>
                </div>
              )}
              
              <div className="bg-indigo-900/20 border border-indigo-800 rounded-xl p-4 mt-6">
                <h4 className="font-semibold text-indigo-400 mb-2">Benefits</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    <span>Earn ${activeJob.payout} instantly upon completion</span>
                  </li>
                  {activeJob.requiredSkill && (
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span>Gain experience in {activeJob.requiredSkill}</span>
                    </li>
                  )}
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    <span>Build industry connections</span>
                  </li>
                </ul>
              </div>
              
              <DialogFooter className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 hover:bg-gray-800"
                  onClick={() => setActiveJob(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                  onClick={() => {
                    // Add job completion logic here
                    const newWealth = (stats.wealth || 0) + activeJob.payout;
                    // Update the character's wealth
                    if (updateCharacter) {
                      updateCharacter({
                        ...character,
                        // Any relevant character updates
                      });
                    }
                    // Update jobs list
                    setAvailableJobs(prev => 
                      prev.map(job => 
                        job.id === activeJob.id 
                          ? {...job, status: 'completed'} 
                          : job
                      )
                    );
                    // Close job view
                    setActiveJob(null);
                    setShowJobsScreen(false);
                    // Show success toast or message
                    alert(`Job completed! You earned ${formatMoney(activeJob.payout)}`);
                  }}
                  disabled={!!(activeJob.requiredSkill && activeJob.minSkillLevel && 
                    typeof stats[activeJob.requiredSkill as keyof typeof stats] === 'number' &&
                    (stats[activeJob.requiredSkill as keyof typeof stats] as number) < activeJob.minSkillLevel)}
                >
                  {!!(activeJob.requiredSkill && activeJob.minSkillLevel && 
                   typeof stats[activeJob.requiredSkill as keyof typeof stats] === 'number' &&
                   (stats[activeJob.requiredSkill as keyof typeof stats] as number) < activeJob.minSkillLevel)
                    ? "Skill level too low" 
                    : "Take Job"}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 gap-4 mt-4">
                {availableJobs.map(job => (
                  <Card 
                    key={job.id} 
                    className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 transition-colors cursor-pointer rounded-xl overflow-hidden"
                    onClick={() => setActiveJob(job)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-1
                            ${job.difficulty === 'easy' 
                              ? "bg-green-600/60" 
                              : job.difficulty === 'medium' 
                              ? "bg-amber-600/60" 
                              : "bg-red-600/60"}`
                          }>
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white">{job.title}</h3>
                            <p className="text-gray-300 text-sm">{job.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="bg-blue-900/40 text-blue-300 border-blue-800">
                                {job.duration} hours
                              </Badge>
                              
                              <Badge variant="outline" className="bg-green-900/40 text-green-300 border-green-800">
                                {formatMoney(job.payout)}
                              </Badge>
                              
                              <Badge 
                                variant="outline" 
                                className={
                                  job.difficulty === 'easy' 
                                    ? "bg-green-900/40 text-green-300 border-green-800" 
                                    : job.difficulty === 'medium' 
                                    ? "bg-amber-900/40 text-amber-300 border-amber-800" 
                                    : "bg-red-900/40 text-red-300 border-red-800"
                                }
                              >
                                {job.difficulty === 'easy' 
                                  ? "Easy" 
                                  : job.difficulty === 'medium' 
                                  ? "Medium" 
                                  : "Hard"}
                              </Badge>
                              
                              {job.requiredSkill && (
                                <Badge 
                                  variant="outline" 
                                  className={
                                    stats && job.minSkillLevel && job.requiredSkill && 
                                    typeof stats[job.requiredSkill as keyof typeof stats] === 'number' &&
                                    (stats[job.requiredSkill as keyof typeof stats] as number) >= job.minSkillLevel
                                      ? "bg-indigo-900/40 text-indigo-300 border-indigo-800"
                                      : "bg-red-900/40 text-red-300 border-red-800"
                                  }
                                >
                                  {job.requiredSkill} {job.minSkillLevel}+
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-800"
                  onClick={() => setShowJobsScreen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
