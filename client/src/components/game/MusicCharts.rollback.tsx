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
import { SongPerformanceType, type Song } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

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

// Function for formatting large numbers with K/M/B
const formatLargeNumber = (num: number): string => {
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

export function MusicCharts() {
  const { songs, aiRappers, character, streamingPlatforms, currentWeek, stats } = useRapperGame();
  const [selectedTab, setSelectedTab] = useState<ChartType>('weekly');
  const [timeframe, setTimeframe] = useState<ChartPeriod>('thisWeek');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>(streamingPlatforms[0]?.name || 'Spotify');
  
  // Get unique genres from songs
  const genres = useMemo(() => {
    const genreSet = new Set<string>();
    songs.forEach(song => {
      if (song.genre) genreSet.add(song.genre);
    });
    return ['all', ...Array.from(genreSet)];
  }, [songs]);
  
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
  
  // Get chart statistics
  const chartStats = useMemo(() => {
    // Count number of songs in top 10/50/100
    const topSongsFiltered = songs.filter(s => s.released);
    
    const songsInTop10 = topSongsFiltered.filter(s => s.ranking && s.ranking <= 10).length;
    const songsInTop50 = topSongsFiltered.filter(s => s.ranking && s.ranking <= 50).length;
    const songsInTop100 = topSongsFiltered.filter(s => s.ranking && s.ranking <= 100).length;
    
    // Get the highest ranking song
    const highestRankingSong = topSongsFiltered.reduce((best, song) => {
      if (!song.ranking) return best;
      if (!best) return song;
      return song.ranking < best.ranking ? song : best;
    }, null as Song | null);
    
    return {
      songsInTop10,
      songsInTop50,
      songsInTop100,
      highestRanking: highestRankingSong?.ranking
    };
  }, [songs]);
  
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
  
  // Generate AI songs for chart
  const aiSongs = useMemo(() => {
    // Number of AI songs to show depends on current week
    const numberOfSongs = Math.min(100, Math.ceil(currentWeek / 2) * 5);
    
    // Generate random songs with popularity
    return aiRappers.flatMap(rapper => {
      // Number of songs per rapper varies based on their popularity
      const songsPerRapper = Math.ceil(rapper.monthlyListeners / 50000);
      
      return Array.from({ length: songsPerRapper }).map((_, i) => ({
        id: `ai-${rapper.id}-${i}`,
        title: `Song ${i + 1} by ${rapper.name}`,
        artistName: rapper.name,
        artistId: rapper.id,
        streams: Math.floor(rapper.monthlyListeners * Math.random() * 0.4 + 0.1),
        cover: rapper.image,
        isPlayerSong: false,
        performanceType: Math.random() > 0.8 ? 'viral' : 'normal',
        random: Math.random(), // For consistent sorting
        previousRanking: Math.floor(Math.random() * 100),
        ranking: Math.floor(Math.random() * 100),
        genre: Math.random() > 0.5 ? 'Trap' : 'Hip Hop',
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
  }, [aiRappers, currentWeek, streamingPlatforms]);
  
  // Combine player songs with AI songs and sort by streams
  const topSongs = useMemo(() => {
    const playerSongsWithMetadata = filteredSongs.map(song => ({
      ...song,
      isPlayerSong: true,
      artistName: character?.artistName || 'You',
      artistId: 'player'
    }));
    
    // Filter AI songs based on chart requirements
    let filteredAiSongs = [...aiSongs];
    
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
  }, [filteredSongs, aiSongs, character, selectedTab, selectedGenre, selectedPlatform]);
  
  // Selected platform information
  const selectedPlatformInfo = streamingPlatforms.find(p => p.name === selectedPlatform);
  
  const [openCommandPalette, setOpenCommandPalette] = useState(false);
  
  return (
    <div className="p-4 pb-24">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Music Charts</h2>
        <p className="text-gray-400">
          Track your songs' performance and the music industry's top hits
        </p>
      </div>
      
      {/* Chart stats */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-gray-400 text-sm">Chart Position</div>
          <div className="text-xl font-semibold">
            {stats?.chartPosition ? (
              <>#{stats.chartPosition}</>
            ) : (
              <>Not Charting</>
            )}
          </div>
        </div>
        
        <div>
          <div className="text-gray-400 text-sm">Your Total Streams</div>
          <div className="text-xl font-semibold">
            {formatLargeNumber(songs.filter(s => s.released).reduce((sum, song) => sum + song.streams, 0))}
          </div>
        </div>
        
        <div>
          <div className="text-gray-400 text-sm">Songs in Top 10</div>
          <div className="text-xl font-semibold">{chartStats.songsInTop10}</div>
        </div>
        
        <div>
          <div className="text-gray-400 text-sm">Your Ranking</div>
          <div className="text-xl font-semibold">
            #{playerRanking.position} / {playerRanking.totalArtists}
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
                    <div className="text-xs flex items-center justify-center mt-1">
                      {song.previousRanking && song.ranking && (
                        <>
                          {song.previousRanking > song.ranking ? (
                            <div className="bg-green-900/50 text-green-400 px-1 py-0.5 rounded-full flex items-center">
                              <ArrowUp size={10} className="mr-0.5" />
                              <span className="font-medium">{song.previousRanking - song.ranking}</span>
                            </div>
                          ) : song.previousRanking < song.ranking ? (
                            <div className="bg-red-900/50 text-red-400 px-1 py-0.5 rounded-full flex items-center">
                              <ArrowDown size={10} className="mr-0.5" />
                              <span className="font-medium">{song.ranking - song.previousRanking}</span>
                            </div>
                          ) : (
                            <div className="bg-gray-800/50 text-gray-400 px-1 py-0.5 rounded-full">
                              <span className="font-medium">—</span>
                            </div>
                          )}
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
                      {<span>{song.title}</span>}
                      {song.isPlayerSong && (
                        <span className="ml-2 text-yellow-500 text-xs">YOUR SONG</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm flex items-center overflow-hidden">
                      {<span>{song.artistName}</span>}
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
            <h3 className="text-lg font-semibold mb-3">All-Time Top Songs</h3>
            
            <div className="space-y-1">
              {topSongs.map((song, index) => (
                <div 
                  key={`alltime-${song.id}`}
                  className={`
                    p-3 rounded-lg flex items-center
                    ${song.isPlayerSong 
                      ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50' 
                      : 'bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/50'}
                  `}
                >
                  {/* Position */}
                  <div className="mr-3 w-12 text-center">
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
                      {<span>{song.title}</span>}
                      {song.isPlayerSong && (
                        <span className="ml-2 text-yellow-500 text-xs">YOUR SONG</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm flex items-center overflow-hidden">
                      {<span>{song.artistName}</span>}
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
                    <div className="font-medium whitespace-nowrap">{formatNumber(song.allTimeStreams || song.streams)}</div>
                    <div className="text-xs text-gray-400">streams</div>
                  </div>
                  
                  {/* Release date */}
                  <div className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-800/70 border border-gray-700">
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
                  <div className="mr-3 w-12 text-center">
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
                      {<span>{song.title}</span>}
                      {song.isPlayerSong && (
                        <span className="ml-2 text-yellow-500 text-xs">YOUR SONG</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm flex items-center overflow-hidden">
                      {<span>{song.artistName}</span>}
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
                    className="ml-2 text-sm px-2 py-1 rounded-full border border-opacity-50 shadow-sm"
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
            <h3 className="text-lg font-semibold mb-3">
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
                    <div className="mr-3 w-12 text-center">
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
                        {<span>{song.title}</span>}
                        {song.isPlayerSong && (
                          <span className="ml-2 text-yellow-500 text-xs">YOUR SONG</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm flex items-center overflow-hidden">
                        {<span>{song.artistName}</span>}
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
                    <div className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-800/50 border border-gray-700">
                      {Math.round((platformStreams / song.streams) * 100)}% of total
                    </div>
                  </div>
                );
              })}
              
              {topSongs.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <p>No songs found on this platform.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}