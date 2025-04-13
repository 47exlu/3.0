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
  Smartphone,
  Crown,
  Headphones,
  Radio,
  TrendingUp,
  Users
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
import { SongPerformanceType, type Song, type AIRapper } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { StarIcon } from '@/components/ui/icons';

// Function for formatting large numbers with K/M/B
const formatLargeNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return num.toString();
};

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
      ...aiRapperStreams,
      {
        id: 'player',
        name: character?.artistName || 'You',
        streams: totalPlayerStreams,
        monthlyListeners: totalPlayerStreams / 4, // Estimate monthly listeners
        image: character?.image
      }
    ].sort((a, b) => b.streams - a.streams);
    
    // Find player position
    const playerIndex = allArtists.findIndex(a => a.id === 'player');
    
    return {
      position: playerIndex + 1,
      totalArtists: allArtists.length,
      playerStreams: totalPlayerStreams,
      topArtists: allArtists.slice(0, 5),
    };
  }, [songs, aiRappers, character]);
  
  // Filter songs based on chart tab and genre/platform
  const filteredSongs = useMemo(() => {
    let songList = [...songs];
    
    // Only include released songs
    songList = songList.filter(song => song.released);
    
    // Apply genre filter
    if (selectedTab === 'genre' && selectedGenre !== 'all') {
      songList = songList.filter(song => song.genre === selectedGenre);
    }
    
    // Apply platform filter
    if (selectedTab === 'platform') {
      songList = songList.filter(song => 
        song.releasePlatforms?.includes(selectedPlatform) || false
      );
    }
    
    return songList;
  }, [songs, selectedTab, selectedGenre, selectedPlatform]);
  
  // Get AI rapper songs for the chart
  const aiRapperSongs = useMemo(() => {
    // Calculate how many AI songs to generate based on game week
    const numberOfSongs = Math.min(30, Math.ceil(currentWeek / 2) * 5);
    
    const aiSongs = aiRappers.flatMap(rapper => {
      // Number of songs per rapper varies based on their popularity
      const songsPerRapper = Math.ceil((rapper.monthlyListeners / 10000) * 2);
      
      return Array.from({ length: songsPerRapper }).map((_, i) => ({
        id: `ai-${rapper.id}-${i}`,
        title: `${rapper.songTitles && rapper.songTitles.length > 0 ? rapper.songTitles[i % rapper.songTitles.length] : 'Song ' + i}`,
        artistName: rapper.name,
        artistId: rapper.id,
        streams: Math.floor(rapper.monthlyListeners * (Math.random() * 0.4 + 0.1)),
        cover: rapper.songCovers?.[i % (rapper.songCovers?.length || 1)],
        isPlayerSong: false,
        performanceType: Math.random() > 0.8 
          ? 'viral' 
          : Math.random() > 0.7 
            ? 'flop' 
            : 'normal',
        previousRanking: Math.floor(Math.random() * 100),
        ranking: Math.floor(Math.random() * 100),
        genre: rapper.style.includes('trap') 
          ? 'Trap' 
          : rapper.style.includes('drill') 
            ? 'Drill' 
            : rapper.style.includes('old school') 
              ? 'Old School' 
              : rapper.style.includes('melodic') 
                ? 'Melodic' 
                : 'Other',
        releaseDate: currentWeek - Math.floor(Math.random() * 10),
        platformStreamDistribution: Object.fromEntries(
          streamingPlatforms.map(platform => [
            platform.name, 
            Math.floor(rapper.monthlyListeners * (Math.random() * 0.4 + 0.05))
          ])
        ),
        released: true,
        featuring: []
      }));
    });
    
    // Add more variety to chart positions
    return aiSongs
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfSongs);
  }, [aiRappers, currentWeek, streamingPlatforms]);
  
  // Combine player songs with AI songs and sort by streams
  const topSongs = useMemo(() => {
    const playerSongsWithMetadata = filteredSongs.map(song => ({
      ...song,
      isPlayerSong: true,
      artistName: character?.artistName || 'You',
      artistId: 'player',
      // Add some randomness for weekly changes
      previousRanking: Math.floor(Math.random() * 10) + 1,
      ranking: Math.floor(Math.random() * 10) + 1
    }));
    
    // Filter AI songs based on chart requirements
    let filteredAiSongs = [...aiRapperSongs];
    
    // Apply genre filter for AI songs
    if (selectedTab === 'genre' && selectedGenre !== 'all') {
      filteredAiSongs = filteredAiSongs.filter(song => song.genre === selectedGenre);
    }
    
    // Apply platform filter for AI songs
    if (selectedTab === 'platform') {
      filteredAiSongs = filteredAiSongs.filter(song => 
        song.platformStreamDistribution && song.platformStreamDistribution[selectedPlatform] > 0
      );
    }
    
    // Combine and sort songs
    const allSongs = [...playerSongsWithMetadata, ...filteredAiSongs];
    
    // Apply different sorting based on chart type
    if (selectedTab === 'platform') {
      // Sort by platform-specific streams
      return allSongs.sort((a, b) => {
        const aStreams = a.platformStreamDistribution?.[selectedPlatform] || 0;
        const bStreams = b.platformStreamDistribution?.[selectedPlatform] || 0;
        return bStreams - aStreams;
      });
    } else {
      // Sort by total streams
      return allSongs.sort((a, b) => b.streams - a.streams);
    }
  }, [filteredSongs, aiRapperSongs, character, selectedTab, selectedGenre, selectedPlatform]);
  
  // Get platform icon and colors
  const selectedPlatformInfo = streamingPlatforms.find(p => p.name === selectedPlatform);
  
  const [openCommandPalette, setOpenCommandPalette] = useState(false);
  
  return (
    <div className="p-4 pb-24 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Music Charts
        </h2>
        <p className="text-gray-400">
          Track your songs' performance and the music industry's top hits
        </p>
      </div>
      
      {/* Chart stats */}
      <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-800/50 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-800 flex items-center justify-center">
            <Crown className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-gray-400 text-xs">Chart Position</div>
            <div className="text-xl font-semibold">
              {stats?.chartPosition ? '#' + stats.chartPosition : '—'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-800 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-gray-400 text-xs">Your Total Streams</div>
            <div className="text-xl font-semibold">
              {formatLargeNumber(songs.filter(s => s.released).reduce((sum, song) => sum + song.streams, 0))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-800 flex items-center justify-center">
            <Radio className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-gray-400 text-xs">Songs in Top 10</div>
            <div className="text-xl font-semibold">{topSongs.filter(s => s.isPlayerSong).slice(0, 10).length}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-800 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-gray-400 text-xs">Ranking</div>
            <div className="text-xl font-semibold">
              #{playerRanking.position} / {playerRanking.totalArtists}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center gap-2 justify-between">
        <Tabs defaultValue="weekly" className="w-full" value={selectedTab} onValueChange={(value) => setSelectedTab(value as ChartType)}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="weekly" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Weekly</span>
              </TabsTrigger>
              <TabsTrigger value="allTime" className="flex items-center">
                <BarChart2 className="w-4 h-4 mr-2" />
                <span>All-Time</span>
              </TabsTrigger>
              <TabsTrigger value="genre" className="flex items-center">
                <Music2 className="w-4 h-4 mr-2" />
                <span>Genres</span>
              </TabsTrigger>
              <TabsTrigger value="platform" className="flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                <span>Platforms</span>
              </TabsTrigger>
            </TabsList>
            
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
                  <CommandInput placeholder="Search platforms..." />
                  <CommandList>
                    <CommandEmpty>No platforms found.</CommandEmpty>
                    <CommandGroup heading="Streaming Platforms">
                      {streamingPlatforms.map(platform => (
                        <CommandItem
                          key={platform.name}
                          onSelect={() => {
                            setSelectedPlatform(platform.name);
                            setOpenCommandPalette(false);
                          }}
                        >
                          {platform.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </>
            )}
          </div>
          
          <TabsContent value="weekly" className="pt-2">
            {/* Weekly chart display */}
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-indigo-400" />
              Top 50 Songs This Week
            </h3>
            
            <div className="space-y-2">
              {topSongs.map((song, index) => (
                <div 
                  key={`weekly-${song.id}`}
                  className={`
                    p-4 rounded-lg flex items-center transition-all hover:shadow-md
                    ${song.isPlayerSong 
                      ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50 shadow-sm' 
                      : 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50'}
                  `}
                >
                  {/* Position and change indicator */}
                  <div className="mr-4 w-12 text-center">
                    <div className="text-2xl font-bold">{index + 1}</div>
                    <div className="text-xs flex items-center justify-center mt-1">
                      {song.previousRanking && song.ranking && (
                        <>
                          {song.previousRanking > song.ranking ? (
                            <div className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full flex items-center">
                              <ArrowUp size={10} className="mr-0.5" />
                              <span className="font-medium">{song.previousRanking - song.ranking}</span>
                            </div>
                          ) : song.previousRanking < song.ranking ? (
                            <div className="bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full flex items-center">
                              <ArrowDown size={10} className="mr-0.5" />
                              <span className="font-medium">{song.ranking - song.previousRanking}</span>
                            </div>
                          ) : (
                            <div className="bg-gray-800/50 text-gray-400 px-2 py-0.5 rounded-full">
                              <span className="font-medium">—</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Song artwork/artist image */}
                  {song.cover ? (
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0 shadow-md">
                      <img 
                        src={song.cover} 
                        alt={song.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-4 relative shadow-md">
                      <span className="text-lg font-bold">{song.artistName?.charAt(0)}</span>
                      {song.isPlayerSong && (
                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full w-5 h-5 flex items-center justify-center border border-gray-800 shadow-sm">
                          <StarIcon2 size={12} className="text-black" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Song title and artist */}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold flex items-center text-base">
                      <span>{song.title}</span>
                      {song.isPlayerSong && (
                        <span className="shrink-0 ml-2 text-yellow-500 text-xs bg-yellow-950/30 px-2 py-0.5 rounded-full border border-yellow-800/30">YOUR SONG</span>
                      )}
                    </div>
                    <div className="text-gray-300 text-sm flex flex-wrap items-center mt-1">
                      <span>{song.artistName}</span>
                      {song.featuring && song.featuring.length > 0 && (
                        <span className="shrink-0 ml-1 text-gray-400"> feat. {song.featuring.map(id => {
                          const artist = aiRappers.find(r => r.id === id);
                          return artist ? artist.name : 'Unknown';
                        }).join(', ')}</span>
                      )}
                      
                      {song.genre && (
                        <Badge variant="outline" className="ml-2 text-[10px] px-2 py-0.5 h-4 bg-gray-800/70 border border-gray-700">
                          {song.genre}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Streams indicator */}
                  <div className="text-right ml-4 bg-gray-900/30 rounded-lg px-3 py-1.5 border border-gray-700/30">
                    <div className="font-medium whitespace-nowrap text-lg">{formatLargeNumber(song.streams)}</div>
                    <div className="text-xs text-gray-400">streams</div>
                  </div>
                  
                  {/* Performance indicator */}
                  <div className={`ml-4 shrink-0 text-xs px-3 py-1.5 rounded-full ${getPerformanceColor(song.performanceType)} bg-gray-800/70 border border-gray-700/50`}>
                    {getPerformanceText(song.performanceType)}
                  </div>
                </div>
              ))}
              
              {topSongs.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <p>No songs match your filter criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="allTime" className="pt-2">
            {/* All-time chart display */}
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-indigo-400" />
              All-Time Top Songs
            </h3>
            
            <div className="space-y-2">
              {topSongs.map((song, index) => (
                <div 
                  key={`alltime-${song.id}`}
                  className={`
                    p-4 rounded-lg flex items-center transition-all hover:shadow-md
                    ${song.isPlayerSong 
                      ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50 shadow-sm' 
                      : 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50'}
                  `}
                >
                  {/* Position */}
                  <div className="mr-4 w-12 text-center">
                    <div className="text-2xl font-bold">{index + 1}</div>
                  </div>
                  
                  {/* Song artwork/artist image */}
                  {song.cover ? (
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0 shadow-md">
                      <img 
                        src={song.cover} 
                        alt={song.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-4 relative shadow-md">
                      <span className="text-lg font-bold">{song.artistName?.charAt(0)}</span>
                      {song.isPlayerSong && (
                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full w-5 h-5 flex items-center justify-center border border-gray-800 shadow-sm">
                          <StarIcon2 size={12} className="text-black" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Song title and artist */}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold flex items-center text-base">
                      <span>{song.title}</span>
                      {song.isPlayerSong && (
                        <span className="shrink-0 ml-2 text-yellow-500 text-xs bg-yellow-950/30 px-2 py-0.5 rounded-full border border-yellow-800/30">YOUR SONG</span>
                      )}
                    </div>
                    <div className="text-gray-300 text-sm flex flex-wrap items-center mt-1">
                      <span>{song.artistName}</span>
                      {song.featuring && song.featuring.length > 0 && (
                        <span className="shrink-0 ml-1 text-gray-400"> feat. {song.featuring.map(id => {
                          const artist = aiRappers.find(r => r.id === id);
                          return artist ? artist.name : 'Unknown';
                        }).join(', ')}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Streams indicator */}
                  <div className="text-right ml-4 bg-gray-900/30 rounded-lg px-3 py-1.5 border border-gray-700/30">
                    <div className="font-medium whitespace-nowrap text-lg">{formatLargeNumber(song.allTimeStreams || song.streams)}</div>
                    <div className="text-xs text-gray-400">all-time streams</div>
                  </div>
                  
                  {/* Release date */}
                  <div className="ml-4 shrink-0 text-xs px-3 py-1.5 rounded-full bg-gray-800/70 border border-gray-700/50">
                    Week {song.releaseDate || '?'}
                  </div>
                </div>
              ))}
              
              {topSongs.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <p>No songs found for this time period.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="genre" className="pt-2">
            {/* Genre-based charts */}
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent flex items-center">
              <Music2 className="mr-2 h-5 w-5 text-indigo-400" />
              {selectedGenre === 'all' ? 'All Genres' : selectedGenre} Charts
            </h3>
            
            <div className="space-y-2">
              {topSongs.map((song, index) => (
                <div 
                  key={`genre-${song.id}`}
                  className={`
                    p-4 rounded-lg flex items-center transition-all hover:shadow-md
                    ${song.isPlayerSong 
                      ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50 shadow-sm' 
                      : 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50'}
                  `}
                >
                  {/* Position */}
                  <div className="mr-4 w-12 text-center">
                    <div className="text-2xl font-bold">{index + 1}</div>
                  </div>
                  
                  {/* Song artwork/artist image */}
                  {song.cover ? (
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0 shadow-md">
                      <img 
                        src={song.cover} 
                        alt={song.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-4 relative shadow-md">
                      <span className="text-lg font-bold">{song.artistName?.charAt(0)}</span>
                      {song.isPlayerSong && (
                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full w-5 h-5 flex items-center justify-center border border-gray-800 shadow-sm">
                          <StarIcon2 size={12} className="text-black" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Song title and artist */}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold flex items-center text-base">
                      <span>{song.title}</span>
                      {song.isPlayerSong && (
                        <span className="shrink-0 ml-2 text-yellow-500 text-xs bg-yellow-950/30 px-2 py-0.5 rounded-full border border-yellow-800/30">YOUR SONG</span>
                      )}
                    </div>
                    <div className="text-gray-300 text-sm flex flex-wrap items-center mt-1">
                      <span>{song.artistName}</span>
                      {song.featuring && song.featuring.length > 0 && (
                        <span className="shrink-0 ml-1 text-gray-400"> feat. {song.featuring.map(id => {
                          const artist = aiRappers.find(r => r.id === id);
                          return artist ? artist.name : 'Unknown';
                        }).join(', ')}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Streams indicator */}
                  <div className="text-right ml-4 bg-gray-900/30 rounded-lg px-3 py-1.5 border border-gray-700/30">
                    <div className="font-medium whitespace-nowrap text-lg">{formatLargeNumber(song.streams)}</div>
                    <div className="text-xs text-gray-400">streams</div>
                  </div>
                  
                  {/* Genre badge */}
                  <div 
                    className="ml-4 shrink-0 text-sm px-3 py-1.5 rounded-full border shadow-sm"
                    style={{ 
                      borderColor: song.color || '#8b5cf6',
                      backgroundColor: `${song.color || '#8b5cf6'}20`
                    }}
                  >
                    {song.genre}
                  </div>
                </div>
              ))}
              
              {topSongs.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <p>No songs match your filter criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="platform" className="pt-2">
            {/* Platform-specific charts */}
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent flex items-center">
              <Smartphone className="mr-2 h-5 w-5 text-indigo-400" />
              {selectedPlatform} Top 50
            </h3>
            
            <div className="space-y-2">
              {topSongs.map((song, index) => {
                // Get platform-specific streams
                const platformStreams = song.platformStreamDistribution?.[selectedPlatform] || 0;
                const percentage = Math.round((platformStreams / song.streams) * 100);
                
                return (
                  <div 
                    key={`platform-${song.id}`}
                    className={`
                      p-4 rounded-lg flex items-center transition-all hover:shadow-md
                      ${song.isPlayerSong 
                        ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50 shadow-sm' 
                        : 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50'}
                    `}
                  >
                    {/* Position */}
                    <div className="mr-4 w-12 text-center">
                      <div className="text-2xl font-bold">{index + 1}</div>
                    </div>
                    
                    {/* Song artwork/artist image */}
                    {song.cover ? (
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0 shadow-md">
                        <img 
                          src={song.cover} 
                          alt={song.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-4 relative shadow-md">
                        <span className="text-lg font-bold">{song.artistName?.charAt(0)}</span>
                        {song.isPlayerSong && (
                          <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full w-5 h-5 flex items-center justify-center border border-gray-800 shadow-sm">
                            <StarIcon2 size={12} className="text-black" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Song title and artist */}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold flex items-center text-base">
                        <span>{song.title}</span>
                        {song.isPlayerSong && (
                          <span className="shrink-0 ml-2 text-yellow-500 text-xs bg-yellow-950/30 px-2 py-0.5 rounded-full border border-yellow-800/30">YOUR SONG</span>
                        )}
                      </div>
                      <div className="text-gray-300 text-sm flex flex-wrap items-center mt-1">
                        <span>{song.artistName}</span>
                        {song.featuring && song.featuring.length > 0 && (
                          <span className="shrink-0 ml-1 text-gray-400"> feat. {song.featuring.map(id => {
                            const artist = aiRappers.find(r => r.id === id);
                            return artist ? artist.name : 'Unknown';
                          }).join(', ')}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Platform-specific streams indicator */}
                    <div className="text-right ml-4 bg-gray-900/30 rounded-lg px-3 py-1.5 border border-gray-700/30">
                      <div className="font-medium whitespace-nowrap text-lg">{formatLargeNumber(platformStreams)}</div>
                      <div className="text-xs text-gray-400">platform streams</div>
                    </div>
                    
                    {/* Platform percentage indicator */}
                    <div className={`
                      ml-4 shrink-0 text-sm px-3 py-1.5 rounded-full border border-gray-700/50 shadow-sm 
                      ${percentage > 50 ? 'bg-green-900/30 text-green-400' : 
                        percentage > 25 ? 'bg-blue-900/30 text-blue-400' : 
                        'bg-gray-800/70 text-gray-300'}
                    `}>
                      {percentage}% of total
                    </div>
                  </div>
                );
              })}
              
              {topSongs.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <p>No songs match your filter criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}