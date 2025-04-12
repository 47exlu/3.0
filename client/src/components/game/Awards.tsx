import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Music, 
  Disc, 
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { Award as AwardType, AwardType as AwardTypeEnum } from '../../lib/types';

// Maps for award types to display names and icons
const AWARD_TYPE_NAMES: Record<string, string> = {
  grammy: 'Grammy Awards',
  bet: 'BET Awards',
  vma: 'Video Music Awards',
  ama: 'American Music Awards', 
  billboard: 'Billboard Music Awards',
  iheartradio: 'iHeartRadio Music Awards',
  apollo: 'Apollo Honors',
  worldstar: 'Worldstar Hip Hop Awards'
};

const AWARD_TYPE_ICONS: Record<string, string> = {
  grammy: '🏆',
  bet: '🎭',
  vma: '📺',
  ama: '🎵', 
  billboard: '📊',
  iheartradio: '📻',
  apollo: '🎤',
  worldstar: '🌟'
};

export const Awards: React.FC = () => {
  const { awards, nominations } = useRapperGame();
  const [filterType, setFilterType] = useState<string>('all');
  const [showWon, setShowWon] = useState<boolean>(true);
  const [showNominated, setShowNominated] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Helper function to get entity name (song or album)
  const getEntityName = (id: string | undefined, type: 'song' | 'album') => {
    if (!id) return '';
    
    const { songs, albums } = useRapperGame.getState();
    
    if (type === 'song') {
      const song = songs?.find(s => s.id === id);
      return song?.title || 'Unknown Song';
    } else {
      const album = albums?.find(a => a.id === id);
      return album?.title || 'Unknown Album';
    }
  };
  
  // Combine awards and nominations based on filters
  const allAwards = [];
  
  if (showWon && awards) {
    allAwards.push(...awards);
  }
  
  if (showNominated && nominations) {
    allAwards.push(...nominations);
  }
  
  // Filter by award type
  const filteredAwards = allAwards.filter(award => {
    if (filterType === 'all') return true;
    return award.type === filterType;
  });
  
  // Sort awards
  const sortedAwards = [...filteredAwards].sort((a, b) => {
    if (sortBy === 'date') {
      // Sort by year and then by date (week number)
      if (a.year !== b.year) {
        return sortDirection === 'desc' ? b.year - a.year : a.year - b.year;
      }
      return sortDirection === 'desc' ? b.date - a.date : a.date - b.date;
    } else {
      // Sort by award type
      if (a.type !== b.type) {
        return sortDirection === 'desc' 
          ? b.type.localeCompare(a.type) 
          : a.type.localeCompare(b.type);
      }
      // Secondary sort by date
      if (a.year !== b.year) {
        return sortDirection === 'desc' ? b.year - a.year : a.year - b.year;
      }
      return sortDirection === 'desc' ? b.date - a.date : a.date - b.date;
    }
  });
  
  // Calculate award stats
  const totalAwards = awards?.length || 0;
  const totalNominations = nominations?.length || 0;
  const winRate = totalNominations > 0 
    ? Math.round((totalAwards / (totalAwards + totalNominations)) * 100) 
    : 0;
  
  // Count awards by type
  const awardsByType: Record<string, number> = {};
  awards?.forEach(award => {
    awardsByType[award.type] = (awardsByType[award.type] || 0) + 1;
  });
  
  const topAwardType = Object.entries(awardsByType)
    .sort(([, a], [, b]) => b - a)
    .map(([type]) => type)[0] || 'none';
  
  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
          Awards & Nominations
        </h1>
        <p className="text-gray-400 mt-1">Your music industry recognition and achievements</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-yellow-500 mb-1">{totalAwards}</div>
          <div className="text-xs sm:text-sm text-gray-400">Awards Won</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">{totalNominations}</div>
          <div className="text-xs sm:text-sm text-gray-400">Nominations</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-400 mb-1">{winRate}%</div>
          <div className="text-xs sm:text-sm text-gray-400">Win Rate</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1">
            {topAwardType !== 'none' ? AWARD_TYPE_NAMES[topAwardType].split(' ')[0] : 'None'}
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Top Award Show</div>
        </div>
      </div>
      
      {/* Filters and controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select 
          className="bg-gray-800 border border-gray-700 rounded p-2 text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Award Types</option>
          <option value="grammy">Grammy Awards</option>
          <option value="bet">BET Awards</option>
          <option value="vma">Video Music Awards</option>
          <option value="ama">American Music Awards</option>
          <option value="billboard">Billboard Music Awards</option>
          <option value="iheartradio">iHeartRadio Music Awards</option>
          <option value="apollo">Apollo Honors</option>
          <option value="worldstar">Worldstar Hip Hop Awards</option>
        </select>
        
        <div className="flex gap-2">
          <button 
            className={`px-3 py-2 rounded text-sm ${showWon ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
            onClick={() => setShowWon(!showWon)}
          >
            <Trophy className="h-4 w-4 inline-block mr-1" />
            Won
          </button>
          
          <button 
            className={`px-3 py-2 rounded text-sm ${showNominated ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
            onClick={() => setShowNominated(!showNominated)}
          >
            <Award className="h-4 w-4 inline-block mr-1" />
            Nominated
          </button>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <button 
            className="flex items-center gap-1 px-3 py-2 rounded text-sm bg-gray-800 text-gray-300 border border-gray-700"
            onClick={() => {
              if (sortBy === 'date') {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('date');
                setSortDirection('desc');
              }
            }}
          >
            <Calendar className="h-4 w-4" />
            Date
            {sortBy === 'date' && (
              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          <button 
            className="flex items-center gap-1 px-3 py-2 rounded text-sm bg-gray-800 text-gray-300 border border-gray-700"
            onClick={() => {
              if (sortBy === 'type') {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('type');
                setSortDirection('desc');
              }
            }}
          >
            <Filter className="h-4 w-4" />
            Type
            {sortBy === 'type' && (
              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      {/* Awards list */}
      {sortedAwards.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="h-16 w-16 mx-auto text-gray-700 mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Awards Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Continue releasing hit songs, attending industry events, and growing your reputation to be nominated for music awards.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAwards.map(award => (
            <div 
              key={award.id}
              className={`p-4 rounded-lg border ${
                award.isWinner 
                  ? 'bg-yellow-500/10 border-yellow-600/30' 
                  : 'bg-blue-500/10 border-blue-600/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">{award.year}</div>
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{AWARD_TYPE_ICONS[award.type]}</span>
                    <h3 className="font-bold text-lg">{AWARD_TYPE_NAMES[award.type]}</h3>
                  </div>
                </div>
                {award.isWinner && (
                  <div className="bg-yellow-500/20 p-1 rounded-full">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <div className="font-semibold text-lg">
                  {award.category.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </div>
                
                {award.songId && (
                  <div className="flex items-center text-gray-300 mt-1">
                    <Music className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{getEntityName(award.songId, 'song')}</span>
                  </div>
                )}
                
                {award.albumId && (
                  <div className="flex items-center text-gray-300 mt-1">
                    <Disc className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{getEntityName(award.albumId, 'album')}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-400">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  <span>Week {award.date}</span>
                </div>
                
                <div>
                  {award.isWinner 
                    ? <span className="text-yellow-400">Winner</span> 
                    : <span className="text-blue-400">Nominee</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Awards;