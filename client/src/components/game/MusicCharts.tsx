import { useState, useMemo, useCallback } from 'react';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { 
  Calendar, 
  Music2,
  Smartphone,
  BarChart2
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
import { Button } from '@/components/ui/button';
import { SongPerformanceType, type Song, type AIRapper } from '@/lib/types';
import { formatLargeNumber, formatNumber } from '@/lib/utils';

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

export function MusicCharts() {
  const { songs, aiRappers, character, streamingPlatforms, currentWeek } = useRapperGame();
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

  // Get all songs (both player's and AI rappers')
  const allSongs = useMemo(() => {
    // Start with player's released songs
    const playerSongs = songs.filter(s => s.released).map(song => {
      return {
        ...song,
        isPlayerSong: true,
        artistName: character?.artistName || 'You',
        artistImage: character?.image,
        genre: 'Player',
        weeklyChange: 0,
        popularity: 50,
        revenue: song.streams * 0.004,
        color: '#ff9500',
        ranking: Math.floor(Math.random() * 10) + 1,
        previousRanking: Math.floor(Math.random() * 20) + 1,
        platformStreamDistribution: {
          'Spotify': Math.floor(song.streams * 0.5),
          'YouTube Music': Math.floor(song.streams * 0.25),
          'SoundCloud': Math.floor(song.streams * 0.15),
          'iTunes': Math.floor(song.streams * 0.1),
        }
      };
    });
    
    // Add AI rapper songs (simulated)
    const aiSongs: Song[] = [];
    
    // Create a few songs for each AI rapper
    aiRappers.forEach(rapper => {
      const genre = 'Rap';
      const baseStreams = rapper.monthlyListeners * 0.2;
      
      for (let i = 0; i < 2; i++) {
        const title = `Song ${i+1}`;
        const streams = Math.floor(baseStreams * (1 - (i * 0.2)));
        
        // Create the song object
        const aiSong: any = {
          id: `ai-${rapper.id}-song-${i}`,
          title,
          artistName: rapper.name,
          artistImage: rapper.image,
          featuring: [],
          genre,
          streams,
          releaseDate: currentWeek - 5,
          weeklyChange: 0,
          performanceType: 'normal',
          color: '#6b7280',
          ranking: i + 3,
          previousRanking: i + 4,
          popularity: 40,
          revenue: streams * 0.004,
          platformStreamDistribution: {
            'Spotify': Math.floor(streams * 0.5),
            'YouTube Music': Math.floor(streams * 0.25),
            'SoundCloud': Math.floor(streams * 0.15),
            'iTunes': Math.floor(streams * 0.1),
          }
        };
        
        aiSongs.push(aiSong);
      }
    });
    
    // Combine player and AI songs
    return [...playerSongs, ...aiSongs];
  }, [songs, aiRappers, character, currentWeek]);
  
  // Filter songs based on selected tab and timeframe
  const filteredSongs = useMemo(() => {
    let filtered = [...allSongs];
    
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
  }, [allSongs, selectedTab, timeframe, selectedGenre, selectedPlatform]);
  
  // For displaying top 50 only
  const topSongs = filteredSongs.slice(0, 50);
  
  return (
    <div className="p-4 pb-24 md:pb-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-indigo-300">Music Charts</h1>
      
      {/* Music Chart Tabs */}
      <Tabs defaultValue="weekly" value={selectedTab} onValueChange={(value) => setSelectedTab(value as ChartType)} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <TabsList className="mb-4 md:mb-0 bg-gray-800/30 p-1 border border-gray-700/50">
            <TabsTrigger value="weekly" className="flex items-center data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              {getChartIcon('weekly')} Weekly Charts
            </TabsTrigger>
            <TabsTrigger value="allTime" className="flex items-center data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              {getChartIcon('allTime')} All-Time
            </TabsTrigger>
            <TabsTrigger value="genre" className="flex items-center data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              {getChartIcon('genre')} By Genre
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              {getChartIcon('platform')} By Platform
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 flex-wrap">
            {selectedTab === 'genre' && (
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-[180px] bg-gray-800/30 border border-gray-700/50">
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
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-[180px] bg-gray-800/30 border border-gray-700/50">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {streamingPlatforms.map(platform => (
                      <SelectItem key={platform.name} value={platform.name}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        {/* Tab content */}
        <TabsContent value="weekly" className="pt-2">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-indigo-400" />
            Weekly Charts
          </h3>
          
          <div className="space-y-2">
            {topSongs.map((song, index) => (
              <div 
                key={`weekly-${song.id}`}
                className={`p-3 rounded-lg flex items-center ${song.isPlayerSong ? 'bg-indigo-900/70 border border-indigo-700/50' : 'bg-gray-800/30 border border-gray-700/50'}`}
              >
                <div className="w-8 text-center mr-3">
                  <div className="text-lg font-bold">{index + 1}</div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{song.title}</div>
                  <div className="text-gray-400 text-sm">{song.artistName}</div>
                </div>
                
                <div className="text-right ml-2">
                  <div className="font-medium">{formatLargeNumber(song.streams)}</div>
                  <div className="text-xs text-gray-400">streams</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="allTime" className="pt-2">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-blue-400" />
            All-Time Charts
          </h3>
          
          <div className="space-y-2">
            {topSongs.map((song, index) => (
              <div 
                key={`allTime-${song.id}`}
                className={`p-3 rounded-lg flex items-center ${song.isPlayerSong ? 'bg-blue-900/70 border border-blue-700/50' : 'bg-gray-800/30 border border-gray-700/50'}`}
              >
                <div className="w-8 text-center mr-3">
                  <div className="text-lg font-bold">{index + 1}</div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{song.title}</div>
                  <div className="text-gray-400 text-sm">{song.artistName}</div>
                </div>
                
                <div className="text-right ml-2">
                  <div className="font-medium">{formatLargeNumber(song.streams)}</div>
                  <div className="text-xs text-gray-400">streams</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="genre" className="pt-2">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Music2 className="mr-2 h-5 w-5 text-green-400" />
            {selectedGenre === 'all' ? 'All Genres' : selectedGenre} Charts
          </h3>
          
          <div className="space-y-2">
            {topSongs.map((song, index) => (
              <div 
                key={`genre-${song.id}`}
                className={`p-3 rounded-lg flex items-center ${song.isPlayerSong ? 'bg-green-900/70 border border-green-700/50' : 'bg-gray-800/30 border border-gray-700/50'}`}
              >
                <div className="w-8 text-center mr-3">
                  <div className="text-lg font-bold">{index + 1}</div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{song.title}</div>
                  <div className="text-gray-400 text-sm">{song.artistName}</div>
                  {song.genre && (
                    <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0 h-4 bg-gray-800/70">
                      {song.genre}
                    </Badge>
                  )}
                </div>
                
                <div className="text-right ml-2">
                  <div className="font-medium">{formatLargeNumber(song.streams)}</div>
                  <div className="text-xs text-gray-400">streams</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="platform" className="pt-2">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Smartphone className="mr-2 h-5 w-5 text-amber-400" />
            {selectedPlatform} Top 50
          </h3>
          
          <div className="space-y-2">
            {topSongs.map((song, index) => {
              const platformStreams = song.platformStreamDistribution?.[selectedPlatform] || 0;
              
              return (
                <div 
                  key={`platform-${song.id}`}
                  className={`p-3 rounded-lg flex items-center ${song.isPlayerSong ? 'bg-amber-900/70 border border-amber-700/50' : 'bg-gray-800/30 border border-gray-700/50'}`}
                >
                  <div className="w-8 text-center mr-3">
                    <div className="text-lg font-bold">{index + 1}</div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{song.title}</div>
                    <div className="text-gray-400 text-sm">{song.artistName}</div>
                  </div>
                  
                  <div className="text-right ml-2">
                    <div className="font-medium">{formatLargeNumber(platformStreams)}</div>
                    <div className="text-xs text-gray-400">platform streams</div>
                  </div>
                  
                  <div className="ml-3 text-xs px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center">
                    {Math.round((platformStreams / song.streams) * 100)}% of total
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}