import { useState, useMemo } from 'react';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowUpRight, 
  Star,
  BarChart2, 
  Calendar, 
  Music2,
  Smartphone
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import {
  CommandGroup,
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command"
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SongPerformanceType, type Song, type AIRapper } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { StarIcon } from '@/components/ui/icons';

// Styled star icon with fill
const StarIcon2 = ({ size = 16, className = '' }) => (
  <Star size={size} className={`fill-current ${className}`} />
);

// Type definitions
type ChartType = 'weekly' | 'allTime' | 'genre' | 'platform';
type ChartPeriod = 'thisWeek' | 'lastMonth' | 'allTime';

interface ChartTimeframe {
  label: string;
  value: ChartPeriod;
}

// Helper function to get icon for chart type
const getChartIcon = (type: ChartType) => {
  switch (type) {
    case 'weekly': return <Calendar className="mr-2 h-4 w-4" />;
    case 'allTime': return <BarChart2 className="mr-2 h-4 w-4" />;
    case 'genre': return <Music2 className="mr-2 h-4 w-4" />;
    case 'platform': return <Smartphone className="mr-2 h-4 w-4" />;
    default: return <BarChart2 className="mr-2 h-4 w-4" />;
  }
};

// Time periods for chart filtering
const chartTimeframes: ChartTimeframe[] = [
  { label: 'This Week', value: 'thisWeek' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'All Time', value: 'allTime' },
];

// Helper to get color for performance indicators
const getPerformanceColor = (type: SongPerformanceType): string => {
  switch (type) {
    case 'viral': return 'text-green-500';
    case 'flop': return 'text-red-500';
    case 'comeback': return 'text-blue-500';
    case 'normal': 
    default: return 'text-gray-400';
  }
};

// Helper to get text description for performance types
const getPerformanceText = (type: SongPerformanceType): string => {
  switch (type) {
    case 'viral': return 'Viral Hit';
    case 'flop': return 'Underperforming';
    case 'comeback': return 'Making a Comeback';
    case 'normal': 
    default: return 'Stable';
  }
};

// Helper to render the weekly change indicator
const WeeklyChangeIndicator = ({ change }: { change?: number }) => {
  if (change === undefined) return <span className="text-gray-500">-</span>;
  
  if (change > 0) {
    return <span className="text-green-500">+{change}</span>;
  } else if (change < 0) {
    return <span className="text-red-500">{change}</span>;
  } else {
    return <span className="text-gray-500">-</span>;
  }
};

export function MusicCharts() {
  const { songs, aiRappers, character, streamingPlatforms, currentWeek, stats } = useRapperGame();
  const [selectedTab, setSelectedTab] = useState<ChartType>('weekly');
  const [timeframe, setTimeframe] = useState<ChartPeriod>('thisWeek');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>(streamingPlatforms[0]?.name || 'Spotify');
  
  // Get unique genres from AI rappers
  const genres = useMemo(() => {
    const genreSet = new Set<string>();
    aiRappers.forEach(rapper => {
      const style = rapper.style.toLowerCase();
      if (style.includes('trap')) genreSet.add('Trap');
      else if (style.includes('drill')) genreSet.add('Drill');
      else if (style.includes('old school')) genreSet.add('Old School');
      else if (style.includes('melodic')) genreSet.add('Melodic');
      else genreSet.add('Other');
    });
    return ['all', ...Array.from(genreSet)];
  }, [aiRappers]);
  
  const { toast } = useToast();

  // Calculate player's position in overall rankings
  const playerRanking = useMemo(() => {
    // Calculate total streams across all platforms
    const totalPlayerStreams = songs.filter(s => s.released).reduce((sum, song) => sum + song.streams, 0);
    
    // Get total AI streams for comparison
    const aiRapperStreams = aiRappers.map(rapper => ({
      id: rapper.id,
      name: rapper.name,
      streams: rapper.totalStreams,
      monthlyListeners: rapper.monthlyListeners,
      image: rapper.image
    }));
    
    // Add player data
    const allArtists = [
      {
        id: 'player',
        name: character?.artistName || 'You',
        streams: totalPlayerStreams,
        monthlyListeners: streamingPlatforms.reduce((sum, platform) => sum + platform.listeners, 0),
        image: character?.image
      },
      ...aiRapperStreams
    ].sort((a, b) => b.streams - a.streams);
    
    // Find player's ranking
    const playerRankIndex = allArtists.findIndex(a => a.id === 'player');
    const ranking = playerRankIndex + 1;
    
    return {
      ranking,
      totalArtists: allArtists.length,
      percentile: Math.round(((allArtists.length - ranking) / allArtists.length) * 100),
      topArtist: allArtists[0],
      nearbyArtists: allArtists.slice(Math.max(0, playerRankIndex - 1), playerRankIndex + 2)
    };
  }, [songs, aiRappers, character, streamingPlatforms]);

  // Get all songs (both player's and AI rappers')
  const allSongs = useMemo(() => {
    // Start with player's released songs
    const playerSongs = songs.filter(s => s.released).map(song => {
      // Calculate a reasonable weekly change based on song performance
      let weeklyChange = 0;
      if (song.performanceType === 'viral') {
        weeklyChange = Math.floor(Math.random() * 3) + 1; // +1 to +3
      } else if (song.performanceType === 'flop') {
        weeklyChange = -Math.floor(Math.random() * 3) - 1; // -1 to -3
      } else if (song.performanceType === 'comeback') {
        weeklyChange = Math.floor(Math.random() * 4) + 1; // +1 to +4
      } else {
        weeklyChange = Math.floor(Math.random() * 3) - 1; // -1 to +1
      }
      
      // Calculate popularity score (0-100)
      const popularity = Math.min(100, Math.round((song.streams / 10000) * 20) + 
        (song.featuring.length * 5) + 
        (song.performanceType === 'viral' ? 20 : 0) +
        (song.performanceType === 'comeback' ? 10 : 0) +
        (song.performanceType === 'flop' ? -15 : 0)
      );
      
      // Calculate per-song revenue
      const averageRatePerStream = 0.004; // $0.004 per stream on average
      const revenue = song.streams * averageRatePerStream;
      
      // If the song doesn't already have platform distribution, generate it
      let platformStreamDistribution = song.platformStreamDistribution || {};
      
      if (Object.keys(platformStreamDistribution).length === 0) {
        // Define platform market shares for consistency with AI rappers
        const platformMarketShare = {
          'Spotify': 0.55,            // Highest - Spotify is always #1 (55%)
          'YouTube Music': 0.28,      // Second highest - YT Music always #2 (28%)
          'iTunes': 0.12,             // Third place - iTunes always #3 (12%)  
          'SoundCloud': 0.05,         // Lowest - SoundCloud always last (5%)
          'Amazon Music': 0.10,       // Medium tier platform (10%)
          'Deezer': 0.03,             // Minor platform (3%)
          'Tidal': 0.02,              // Minor platform (2%)
          'Other': 0.08,              // All others combined (8%)
        };
        
        // Generate a unique, deterministic seed for this song
        const songSeed = song.id.charCodeAt(0) + (song.title ? song.title.charCodeAt(0) : 0);
        
        // Create platform distribution
        const tempPlatformDistribution: Record<string, number> = {};
        let distributedStreams = 0;
        
        // Get platforms this song was released on
        const availablePlatforms = song.releasePlatforms || streamingPlatforms.map(p => p.name);
        
        // Generate platform-specific streams
        availablePlatforms.forEach((platformName, index) => {
          // Get market share for this platform
          const marketShare = platformMarketShare[platformName as keyof typeof platformMarketShare] || 0.05;
          
          // Create deterministic bias: some songs do better on specific platforms
          const titleSeed = song.title ? song.title.charCodeAt(0) : 0;
          const platformSeed = platformName.charCodeAt(0) + platformName.length;
          
          // Deterministic platform bias
          const biasBase = ((titleSeed + platformSeed + songSeed) % 100) / 100;
          const platformBias = 0.7 + (biasBase * 0.6); // 0.7-1.3 range
          
          // Apply bias to market share
          const adjustedMarketShare = marketShare * platformBias;
          
          // Add randomness based on song attributes
          const randomSeed = (songSeed + index) / 10;
          const randomComponent = Math.sin(randomSeed) * 0.4; // -0.4 to 0.4 range
          
          // Combined factor for distribution
          const platformFactor = adjustedMarketShare * (1 + randomComponent);
          
          // Calculate streams for this platform
          let platformStreams = Math.max(10, Math.floor(song.streams * platformFactor));
          
          // Ensure unique values
          const currentValues = Object.values(tempPlatformDistribution);
          while (currentValues.includes(platformStreams)) {
            platformStreams += 1;
          }
          
          tempPlatformDistribution[platformName] = platformStreams;
          distributedStreams += platformStreams;
        });
        
        // Adjust to match original total
        const adjustmentFactor = song.streams / distributedStreams;
        Object.keys(tempPlatformDistribution).forEach(platform => {
          platformStreamDistribution[platform] = Math.floor(tempPlatformDistribution[platform] * adjustmentFactor);
        });
      }
      
      return {
        ...song,
        isPlayerSong: true,
        artistName: character?.artistName || 'You',
        artistImage: character?.image,
        genre: 'Player',
        weeklyChange,
        popularity,
        revenue,
        color: '#ff9500',
        ranking: Math.floor(Math.random() * 10) + 1, // Simulated ranking
        previousRanking: Math.floor(Math.random() * 20) + 1,
        platformStreamDistribution, // Add platform-specific streams
      };
    });
    
    // Add AI rapper songs (simulated)
    const aiSongs: Song[] = [];
    
    // Create a few songs for each AI rapper
    aiRappers.forEach(rapper => {
      // Determine genre based on rapper style
      let genre = 'Other';
      const style = rapper.style.toLowerCase();
      if (style.includes('trap')) genre = 'Trap';
      else if (style.includes('drill')) genre = 'Drill';
      else if (style.includes('old school')) genre = 'Old School';
      else if (style.includes('melodic')) genre = 'Melodic';
      
      // Realistic stream distribution - more popular rappers have more streams
      const baseStreams = rapper.monthlyListeners * (0.1 + (Math.random() * 0.3));
      
      // Create 2-5 songs per rapper based on popularity
      const songCount = Math.floor(rapper.popularity / 25) + 2;
      
      for (let i = 0; i < songCount; i++) {
        // Generate song titles
        const prefixes = ['Money', 'Streets', 'Life', 'Flex', 'Boss', 'Grind', 'Dream', 'Hustle'];
        const suffixes = ['Talk', 'Season', 'Chronicles', 'Life', 'Time', 'Wave', 'Gang', 'World'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const title = `${prefix} ${suffix}`;
        
        // Add featuring info sometimes (25% chance)
        const hasFeaturing = Math.random() < 0.25;
        const featuredArtistIndex = Math.floor(Math.random() * aiRappers.length);
        const featuring = hasFeaturing && featuredArtistIndex !== aiRappers.indexOf(rapper) 
          ? [aiRappers[featuredArtistIndex].id] 
          : [];
        
        // Decay streams based on index (first songs have more streams)
        const streamMultiplier = 1 / Math.pow(i + 1, 0.5);
        const streams = Math.floor(baseStreams * streamMultiplier * (0.8 + Math.random() * 0.4));
        
        // Determine performance type
        let performanceType: SongPerformanceType = 'normal';
        const rand = Math.random();
        if (rand > 0.9) performanceType = 'viral';
        else if (rand < 0.1) performanceType = 'flop';
        else if (rand > 0.8 && rand <= 0.9) performanceType = 'comeback';
        
        // Calculate a reasonable weekly change based on song performance
        let weeklyChange = 0;
        if (performanceType === 'viral') {
          weeklyChange = Math.floor(Math.random() * 3) + 1; // +1 to +3
        } else if (performanceType === 'flop') {
          weeklyChange = -Math.floor(Math.random() * 3) - 1; // -1 to -3
        } else if (performanceType === 'comeback') {
          weeklyChange = Math.floor(Math.random() * 4) + 1; // +1 to +4
        } else {
          weeklyChange = Math.floor(Math.random() * 3) - 1; // -1 to +1
        }
        
        // Calculate popularity score (0-100)
        const popularity = Math.min(100, Math.round((streams / 5000) * 15) + 
          (featuring.length * 5) + 
          (performanceType === 'viral' ? 20 : 0) +
          (performanceType === 'comeback' ? 10 : 0) +
          (performanceType === 'flop' ? -15 : 0)
        );
        
        // Calculate per-song revenue
        const averageRatePerStream = 0.004; // $0.004 per stream on average
        const revenue = streams * averageRatePerStream;
        
        // Calculate rankings
        const previousRanking = Math.floor(Math.random() * 40) + 1;
        const currentRanking = Math.max(1, Math.min(50, previousRanking + weeklyChange));
        
        // Generate a unique song identifier based on rapper's name and song title
        const songSeed = (rapper.name.charCodeAt(0) + title.charCodeAt(0)) % 1000;
        
        // Create platform-specific stream distributions, just like for player songs
        // Define platform market shares based on real-world streaming platform dominance
        const platformMarketShare = {
          'Spotify': 0.55,            // Highest - Spotify is always #1 (55%)
          'YouTube Music': 0.28,      // Second highest - YT Music always #2 (28%)
          'iTunes': 0.12,             // Third place - iTunes always #3 (12%)  
          'SoundCloud': 0.05,         // Lowest - SoundCloud always last (5%)
          'Amazon Music': 0.10,       // Medium tier platform (10%)
          'Deezer': 0.03,             // Minor platform (3%)
          'Tidal': 0.02,              // Minor platform (2%)
          'Other': 0.08,              // All others combined (8%)
        };
        
        // Each artist has unique platform biases based on their style and fanbase
        // Create a deterministic platform distribution for this AI rapper
        let platformStreamMap: Record<string, number> = {};
        let distributedStreams = 0;
        
        // Get all available platforms from the game
        const availablePlatforms = streamingPlatforms.map(p => p.name);
        
        // Generate different stream counts for each platform
        availablePlatforms.forEach((platformName, index) => {
          // Get base market share for this platform
          const marketShare = platformMarketShare[platformName as keyof typeof platformMarketShare] || 0.05;
          
          // Create deterministic bias: some artists naturally do better on specific platforms
          // Based on artist name, platform and song characteristics
          const artistNameSeed = rapper.name.charCodeAt(0);
          const platformSeed = platformName.charCodeAt(0) + platformName.length;
          
          // Deterministic bias (consistent for this artist/platform combination)
          const biasBase = ((artistNameSeed + platformSeed + songSeed) % 100) / 100;
          
          // Calculate bias factor (0.6-1.4 range)
          const artistPlatformBias = 0.6 + (biasBase * 0.8);
          
          // Apply bias to market share
          const adjustedMarketShare = marketShare * artistPlatformBias;
          
          // Add randomness based on song seed and platform index
          const randomSeed = (songSeed + index) / 10;
          const randomComponent = Math.sin(randomSeed) * 0.5; // -0.5 to 0.5 range
          
          // Combined factor creates different distributions
          const platformFactor = adjustedMarketShare * (1 + randomComponent);
          
          // Calculate platform-specific streams
          let platformStreams = Math.max(10, Math.floor(streams * platformFactor));
          
          // Make sure values are unique between platforms to create distinct distributions
          const currentMapValues = Object.values(platformStreamMap);
          while (currentMapValues.includes(platformStreams)) {
            platformStreams += 1;
          }
          
          platformStreamMap[platformName] = platformStreams;
          distributedStreams += platformStreams;
        });
        
        // Adjust to match original total
        const adjustmentFactor = streams / distributedStreams;
        Object.keys(platformStreamMap).forEach(platform => {
          platformStreamMap[platform] = Math.floor(platformStreamMap[platform] * adjustmentFactor);
        });
        
        // Adjust colors based on genre
        let color = '#6b7280'; // Default gray
        if (genre === 'Trap') color = '#f59e0b'; // Amber
        else if (genre === 'Drill') color = '#ef4444'; // Red
        else if (genre === 'Old School') color = '#3b82f6'; // Blue
        else if (genre === 'Melodic') color = '#8b5cf6'; // Purple
        
        // Create the song object with all metadata
        const aiSong: any = {
          id: `ai-${rapper.id}-song-${i}`,
          title,
          artistName: rapper.name,
          artistImage: rapper.image,
          featuring,
          genre,
          streams,
          releaseDate: currentWeek - Math.floor(Math.random() * 20) - 1,
          weeklyChange,
          performanceType,
          color,
          ranking: currentRanking,
          previousRanking,
          popularity,
          revenue,
          platformStreamDistribution: platformStreamMap
        };
        
        aiSongs.push(aiSong);
      }
    });
    
    // Combine player and AI songs
    const combined = [...playerSongs, ...aiSongs];
    
    // Random but deterministic ordering
    const seed = currentWeek * 1234;
    combined.forEach(song => {
      const songSeed = song.id.charCodeAt(0) + (song.artistName?.charCodeAt(0) || 0);
      song.random = (seed + songSeed) % 1000 / 1000;
    });
    
    return combined;
  }, [songs, aiRappers, character, currentWeek, streamingPlatforms]);
  
  // Filter songs based on selected tab and timeframe
  const filteredSongs = useMemo(() => {
    let filtered = [...allSongs];
    
    // Apply timeframe filter
    if (timeframe === 'thisWeek') {
      // Only recent songs
      filtered = filtered.filter(song => {
        const releaseDate = song.releaseDate;
        return releaseDate && currentWeek - releaseDate <= 8;
      });
    } else if (timeframe === 'lastMonth') {
      // Songs from the last month (4 weeks)
      filtered = filtered.filter(song => {
        const releaseDate = song.releaseDate;
        return releaseDate && currentWeek - releaseDate <= 4;
      });
    }
    
    // Apply tab-specific filtering
    if (selectedTab === 'genre' && selectedGenre !== 'all') {
      // Filter by genre
      filtered = filtered.filter(song => song.genre === selectedGenre);
    } else if (selectedTab === 'platform') {
      // Filter by platform
      filtered = filtered.filter(song => {
        if (!song.platformStreamDistribution) return false;
        return song.platformStreamDistribution[selectedPlatform] !== undefined;
      });
      
      // Sort by platform-specific streams
      filtered.sort((a, b) => {
        const aStreams = a.platformStreamDistribution?.[selectedPlatform] || 0;
        const bStreams = b.platformStreamDistribution?.[selectedPlatform] || 0;
        return bStreams - aStreams;
      });
      return filtered;
    }
    
    // Default sorting: all songs by total streams
    filtered.sort((a, b) => b.streams - a.streams);
    return filtered;
  }, [allSongs, selectedTab, timeframe, selectedGenre, selectedPlatform, currentWeek]);
  
  // Command palette state
  const [openCommandPalette, setOpenCommandPalette] = useState(false);
  
  // Platform search query
  const [platformSearchQuery, setPlatformSearchQuery] = useState('');
  
  // Filter platforms
  const filteredPlatforms = useMemo(() => {
    return streamingPlatforms.filter(p => 
      p.name.toLowerCase().includes(platformSearchQuery.toLowerCase())
    );
  }, [streamingPlatforms, platformSearchQuery]);
  
  // Calculate chart performance stats
  const chartStats = useMemo(() => {
    // How many songs the player has in the charts
    const playerSongsInChart = filteredSongs.filter(s => s.isPlayerSong).length;
    
    // Highest ranking song
    const playerSongs = filteredSongs.filter(s => s.isPlayerSong);
    const highestRanking = playerSongs.sort((a, b) => (a.ranking || 999) - (b.ranking || 999))[0]?.ranking || 0;
    
    return {
      playerSongsInChart,
      totalSongs: filteredSongs.length,
      percentageOfChart: Math.round((playerSongsInChart / Math.max(1, filteredSongs.length)) * 100),
      highestRanking
    };
  }, [filteredSongs]);
  
  // For displaying top 50 only
  const topSongs = filteredSongs.slice(0, 50);
  
  return (
    <div className="p-4 pb-24 md:pb-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Music Charts</h1>
      
      {/* Player's Overall Ranking */}
      <div className="mb-6 p-4 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
        <h2 className="text-lg font-semibold mb-2">Your Artist Ranking</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full overflow-hidden flex items-center justify-center mr-4">
              {character?.image ? (
                <img src={character.image} className="w-full h-full object-cover" alt="Artist" />
              ) : (
                <span className="text-white text-xl font-bold">
                  {character?.artistName?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <div>
              <p className="font-bold text-xl">{character?.artistName || 'You'}</p>
              <p className="text-gray-400">
                {playerRanking.ranking === 1 ? (
                  <span className="text-yellow-500 flex items-center">
                    <StarIcon2 size={14} className="mr-1" /> 
                    Top Artist
                  </span>
                ) : (
                  <>Ranked #{playerRanking.ranking}</>
                )}
              </p>
            </div>
          </div>
          
          <div className="col-span-1">
            <p className="text-gray-400 text-sm">Monthly Listeners</p>
            <p className="font-bold text-xl">
              {formatNumber(streamingPlatforms.reduce((sum, platform) => sum + platform.listeners, 0))}
            </p>
          </div>
          
          <div className="col-span-1">
            <p className="text-gray-400 text-sm">Total Streams</p>
            <p className="font-bold text-xl">
              {formatNumber(songs.filter(s => s.released).reduce((sum, song) => sum + song.streams, 0))}
            </p>
          </div>
          
          <div className="col-span-1">
            <p className="text-gray-400 text-sm">Industry Percentile</p>
            <p className="font-bold text-xl">
              Top {playerRanking.percentile}%
            </p>
          </div>
        </div>
        
        {/* Nearby artists in ranking */}
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Nearby Artists in Rankings</p>
          <div className="flex flex-wrap gap-2">
            {playerRanking.nearbyArtists.map((artist, index) => (
              <div 
                key={artist.id} 
                className={`
                  flex items-center p-2 rounded-lg
                  ${artist.id === 'player' 
                    ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50' 
                    : 'bg-gray-800/30 border border-gray-700/50'}
                `}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-2 bg-gray-700">
                  {artist.image ? (
                    <img src={artist.image} className="w-full h-full object-cover" alt={artist.name} />
                  ) : (
                    <span className="text-sm font-bold">{artist.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{artist.name}</p>
                  <p className="text-xs text-gray-400">#{playerRanking.ranking - 1 + index}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Music Chart Tabs */}
      <Tabs defaultValue="weekly" value={selectedTab} onValueChange={(value) => setSelectedTab(value as ChartType)} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger value="weekly" className="flex items-center">
              {getChartIcon('weekly')} Weekly Charts
            </TabsTrigger>
            <TabsTrigger value="allTime" className="flex items-center">
              {getChartIcon('allTime')} All-Time
            </TabsTrigger>
            <TabsTrigger value="genre" className="flex items-center">
              {getChartIcon('genre')} By Genre
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center">
              {getChartIcon('platform')} By Platform
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 flex-wrap">
            {selectedTab !== 'platform' && selectedTab !== 'genre' && (
              <Select value={timeframe} onValueChange={(value) => setTimeframe(value as ChartPeriod)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {chartTimeframes.map(tf => (
                      <SelectItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            
            {selectedTab === 'genre' && (
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>
                        {genre === 'all' ? 'All Genres' : genre}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            
            {selectedTab === 'platform' && (
              <>
                <Button
                  variant="outline"
                  className="w-[180px] justify-between"
                  onClick={() => setOpenCommandPalette(true)}
                >
                  {selectedPlatform}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                
                <CommandDialog open={openCommandPalette} onOpenChange={setOpenCommandPalette}>
                  <CommandInput
                    placeholder="Search platforms..."
                    value={platformSearchQuery}
                    onValueChange={setPlatformSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No platforms found.</CommandEmpty>
                    <CommandGroup heading="Streaming Platforms">
                      {filteredPlatforms.map(platform => (
                        <CommandItem
                          key={platform.name}
                          onSelect={() => {
                            setSelectedPlatform(platform.name);
                            setOpenCommandPalette(false);
                          }}
                          className="flex items-center"
                        >
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: platform.color }}
                          />
                          {platform.name}
                          {platform.name === selectedPlatform && (
                            <span className="ml-auto text-green-500">✓</span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </>
            )}
          </div>
        </div>
        
        {/* Chart stats section */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="px-3 py-2 bg-gray-800/30 backdrop-blur-sm rounded-lg">
            <p className="text-xs text-gray-400">Your Songs in Chart</p>
            <p className="font-bold">{chartStats.playerSongsInChart} of {chartStats.totalSongs}</p>
          </div>
          
          <div className="px-3 py-2 bg-gray-800/30 backdrop-blur-sm rounded-lg">
            <p className="text-xs text-gray-400">Chart Dominance</p>
            <p className="font-bold">{chartStats.percentageOfChart}%</p>
          </div>
          
          <div className="px-3 py-2 bg-gray-800/30 backdrop-blur-sm rounded-lg">
            <p className="text-xs text-gray-400">Highest Position</p>
            <p className="font-bold">
              {chartStats.highestRanking ? (
                <>#{chartStats.highestRanking}</>
              ) : (
                <>Not Charting</>
              )}
            </p>
          </div>
        </div>
        
        {/* Tab content */}
        <TabsContent value="weekly" className="pt-2">
          {/* Weekly chart display */}
          <h3 className="text-lg font-semibold mb-3">Top 50 Songs This Week</h3>
          
          <div className="space-y-1">
            {topSongs.map((song, index) => (
              <div 
                key={`weekly-${song.id}`}
                className={`
                  p-3 rounded-lg flex items-center
                  ${song.isPlayerSong 
                    ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50' 
                    : 'bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/50'}
                `}
              >
                {/* Position and change indicator */}
                <div className="mr-3 w-12 text-center">
                  <div className="text-xl font-bold">{index + 1}</div>
                  <div className="text-xs flex items-center justify-center">
                    {song.previousRanking && song.ranking && (
                      <>
                        {song.previousRanking > song.ranking ? (
                          <ArrowUp size={12} className="text-green-500 mr-1" />
                        ) : song.previousRanking < song.ranking ? (
                          <ArrowDown size={12} className="text-red-500 mr-1" />
                        ) : (
                          <span className="text-gray-500 mr-1">-</span>
                        )}
                        <span>
                          <WeeklyChangeIndicator 
                            change={song.previousRanking - song.ranking} 
                          />
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Song artwork/artist image */}
                {song.cover ? (
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-3 relative">
                    <span className="text-sm font-bold">{song.artistName?.charAt(0)}</span>
                    {song.isPlayerSong && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full w-4 h-4 flex items-center justify-center border border-black">
                        <StarIcon2 size={10} className="text-black" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Song title and artist */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold flex items-center overflow-hidden">
                    {<span className="overflow-hidden text-ellipsis whitespace-nowrap">{song.title}</span>}
                    {song.isPlayerSong && (
                      <span className="ml-2 text-yellow-500 text-xs">YOUR SONG</span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm flex items-center overflow-hidden">
                    {<span className="overflow-hidden text-ellipsis whitespace-nowrap">{song.artistName}</span>}
                    {song.featuring && song.featuring.length > 0 && (
                      <span className="shrink-0 ml-1"> feat. {song.featuring.map(id => {
                        const artist = aiRappers.find(r => r.id === id);
                        return artist ? artist.name : 'Unknown';
                      }).join(', ')}</span>
                    )}
                    
                    {song.genre && (
                      <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4 bg-gray-800/50">
                        {song.genre}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Streams indicator */}
                <div className="text-right ml-2">
                  <div className="font-medium whitespace-nowrap">{formatNumber(song.streams)}</div>
                  <div className="text-xs text-gray-400">streams</div>
                </div>
                
                {/* Performance indicator */}
                <div className={`ml-4 text-xs px-2 py-1 rounded-full ${getPerformanceColor(song.performanceType)} bg-gray-800/50`}>
                  {getPerformanceText(song.performanceType)}
                </div>
              </div>
            ))}
            
            {filteredSongs.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p>No songs match your filter criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="allTime" className="pt-2">
          {/* All time hits display */}
          <h3 className="text-lg font-semibold mb-3">All-Time Greatest Hits</h3>
          
          <div className="space-y-1">
            {topSongs.map((song, index) => (
              <div 
                key={`allTime-${song.id}`}
                className={`
                  p-3 rounded-lg flex items-center
                  ${song.isPlayerSong 
                    ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50' 
                    : 'bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/50'}
                `}
              >
                {/* Position */}
                <div className="mr-3 w-10 text-center">
                  <div className="text-xl font-bold">{index + 1}</div>
                </div>
                
                {/* Song artwork/artist image */}
                {song.cover ? (
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-3 relative">
                    <span className="text-sm font-bold">{song.artistName?.charAt(0)}</span>
                    {song.isPlayerSong && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full w-4 h-4 flex items-center justify-center border border-black">
                        <StarIcon2 size={10} className="text-black" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Song title and artist */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold flex items-center overflow-hidden">
                    {<span className="overflow-hidden text-ellipsis whitespace-nowrap">{song.title}</span>}
                    {song.isPlayerSong && (
                      <span className="ml-2 text-yellow-500 text-xs">YOUR SONG</span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm flex items-center overflow-hidden">
                    {<span className="overflow-hidden text-ellipsis whitespace-nowrap">{song.artistName}</span>}
                    {song.featuring && song.featuring.length > 0 && (
                      <span className="shrink-0 ml-1"> feat. {song.featuring.map(id => {
                        const artist = aiRappers.find(r => r.id === id);
                        return artist ? artist.name : 'Unknown';
                      }).join(', ')}</span>
                    )}
                  </div>
                </div>
                
                {/* Popularity indicator */}
                <div className="flex flex-col items-end ml-2">
                  <div className="font-medium">{formatNumber(song.streams)}</div>
                  <div className="mt-1 w-24 bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ 
                        width: `${song.popularity || 0}%`,
                        backgroundColor: song.color || '#8b5cf6'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {filteredSongs.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p>No songs match your filter criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="genre" className="pt-2">
          {/* Genre-based charts */}
          <h3 className="text-lg font-semibold mb-3">
            {selectedGenre === 'all' ? 'All Genres' : selectedGenre} Charts
          </h3>
          
          <div className="space-y-1">
            {topSongs.map((song, index) => (
              <div 
                key={`genre-${song.id}`}
                className={`
                  p-3 rounded-lg flex items-center
                  ${song.isPlayerSong 
                    ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50' 
                    : 'bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/50'}
                `}
              >
                {/* Position */}
                <div className="mr-3 w-10 text-center">
                  <div className="text-xl font-bold">{index + 1}</div>
                </div>
                
                {/* Song artwork/artist image */}
                {song.cover ? (
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-3 relative">
                    <span className="text-sm font-bold">{song.artistName?.charAt(0)}</span>
                    {song.isPlayerSong && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full w-4 h-4 flex items-center justify-center border border-black">
                        <StarIcon2 size={10} className="text-black" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Song title and artist */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold flex items-center overflow-hidden">
                    {<span className="overflow-hidden text-ellipsis whitespace-nowrap">{song.title}</span>}
                    {song.isPlayerSong && (
                      <span className="ml-2 text-yellow-500 text-xs">YOUR SONG</span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm flex items-center overflow-hidden">
                    {<span className="overflow-hidden text-ellipsis whitespace-nowrap">{song.artistName}</span>}
                    {song.featuring && song.featuring.length > 0 && (
                      <span className="shrink-0 ml-1"> feat. {song.featuring.map(id => {
                        const artist = aiRappers.find(r => r.id === id);
                        return artist ? artist.name : 'Unknown';
                      }).join(', ')}</span>
                    )}
                  </div>
                </div>
                
                {/* Streams indicator */}
                <div className="text-right ml-2">
                  <div className="font-medium whitespace-nowrap">{formatNumber(song.streams)}</div>
                  <div className="text-xs text-gray-400">streams</div>
                </div>
                
                {/* Genre badge */}
                <div 
                  className="ml-4 text-xs px-2 py-1 rounded-full border"
                  style={{ 
                    borderColor: song.color || '#8b5cf6',
                    backgroundColor: `${song.color || '#8b5cf6'}20`
                  }}
                >
                  {song.genre}
                </div>
              </div>
            ))}
            
            {filteredSongs.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p>No songs match your filter criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="platform" className="pt-2">
          {/* Platform-specific charts */}
          <h3 className="text-lg font-semibold mb-3 flex">
            {selectedPlatform} Top 50
          </h3>
          
          <div className="space-y-1">
            {topSongs.map((song, index) => {
              // Get platform-specific streams
              const platformStreams = song.platformStreamDistribution?.[selectedPlatform] || 0;
              
              return (
                <div 
                  key={`platform-${song.id}`}
                  className={`
                    p-3 rounded-lg flex items-center
                    ${song.isPlayerSong 
                      ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50' 
                      : 'bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/50'}
                  `}
                >
                  {/* Position */}
                  <div className="mr-3 w-10 text-center">
                    <div className="text-xl font-bold">{index + 1}</div>
                  </div>
                  
                  {/* Song artwork/artist image */}
                  {song.cover ? (
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      <img 
                        src={song.cover} 
                        alt={song.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-3 relative">
                      <span className="text-sm font-bold">{song.artistName?.charAt(0)}</span>
                      {song.isPlayerSong && (
                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full w-4 h-4 flex items-center justify-center border border-black">
                          <StarIcon2 size={10} className="text-black" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Song title and artist */}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold flex items-center overflow-hidden">
                      {<span className="overflow-hidden text-ellipsis whitespace-nowrap">{song.title}</span>}
                      {song.isPlayerSong && (
                        <span className="ml-2 text-yellow-500 text-xs">YOUR SONG</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm flex items-center overflow-hidden">
                      {<span className="overflow-hidden text-ellipsis whitespace-nowrap">{song.artistName}</span>}
                      {song.featuring && song.featuring.length > 0 && (
                        <span className="shrink-0 ml-1"> feat. {song.featuring.map(id => {
                          const artist = aiRappers.find(r => r.id === id);
                          return artist ? artist.name : 'Unknown';
                        }).join(', ')}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Platform-specific streams indicator */}
                  <div className="text-right ml-2">
                    <div className="font-medium whitespace-nowrap">{formatNumber(platformStreams)}</div>
                    <div className="text-xs text-gray-400">platform streams</div>
                  </div>
                  
                  {/* Platform percentage indicator */}
                  <div className="ml-4 text-xs px-2 py-1 rounded-full bg-gray-800/50">
                    {Math.round((platformStreams / song.streams) * 100)}% of total
                  </div>
                </div>
              );
            })}
            
            {filteredSongs.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p>No songs match your filter criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}