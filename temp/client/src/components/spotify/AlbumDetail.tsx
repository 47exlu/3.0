import React, { useState } from 'react';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { Play, Heart, MoreHorizontal, Clock, Download, X } from 'lucide-react';
import { formatCompactNumber as formatNumber } from '@/lib/utils';

interface AlbumDetailProps {
  albumId: string;
  onBack: () => void;
}

const AlbumDetail: React.FC<AlbumDetailProps> = ({ albumId, onBack }) => {
  const { albums = [], songs = [] } = useRapperGame() || {};
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Find the album and its songs
  const album = albums?.find(a => a.id === albumId);
  if (!album) return <div className="p-8 text-center">Album not found</div>;
  
  const albumSongs = songs.filter(song => album.songIds.includes(song.id))
    .sort((a, b) => (a.releaseDate || 0) - (b.releaseDate || 0));
  
  // Format total album duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // Random song durations between 2:30 and 4:30
  const getSongDuration = (songId: string) => {
    // Use the song ID to create a consistent "random" duration
    const hash = songId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seconds = 150 + (hash % 120); // 150s (2:30) to 270s (4:30)
    return formatDuration(seconds);
  };
  
  // Format release date
  const formatReleaseDate = (releaseWeek: number | undefined) => {
    if (!releaseWeek) return 'Unreleased';
    // In the game world, the current year is 2025
    const gameCurrentYear = 2025;
    // Simulate a release date based on the release week
    return `${gameCurrentYear - Math.floor(releaseWeek / 52)}`;
  };
  
  // Calculate total duration
  const totalDuration = albumSongs.reduce((acc, song) => {
    const songHash = song.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return acc + (150 + (songHash % 120));
  }, 0);
  
  const totalMinutes = Math.floor(totalDuration / 60);
  
  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-black text-white h-full relative flex flex-col overflow-hidden">
      {/* Fixed top navigation header with close button */}
      <div className="sticky top-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm">
        <button 
          className="px-4 py-1.5 border border-gray-600 rounded-full text-xs font-semibold hover:bg-gray-800 flex items-center"
          onClick={onBack}
        >
          <X className="h-3 w-3 mr-1" />
          Back
        </button>
        
        <button 
          className="p-2 rounded-full bg-green-500 hover:bg-green-400 shadow-lg"
          onClick={onBack}
          aria-label="Close album view"
        >
          <X className="h-4 w-4 text-black" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-0">
        {/* Album header */}
        <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8 mt-2">
          <div className="w-32 h-32 sm:w-48 sm:h-48 flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <img 
              src={album.coverArt || 'https://via.placeholder.com/200'} 
              alt={album.title}
              className="w-full h-full object-cover shadow-lg rounded"
            />
          </div>
          
          <div className="text-center sm:text-left">
            <div className="text-xs font-bold uppercase mb-1">{album.type}</div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 line-clamp-2">{album.title}</h1>
            <div className="text-xs sm:text-sm text-gray-300 mb-4">
              <span className="font-medium">Your Artist</span> • {formatReleaseDate(album.releaseDate)} • {albumSongs.length} songs, {totalMinutes} min
            </div>
            
            <div className="flex justify-center sm:justify-start space-x-4 items-center">
              <button 
                className="bg-green-500 rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <Play className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
              </button>
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-white cursor-pointer" />
              <MoreHorizontal className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
        
        {/* Songs list with max height and scrolling */}
        <div className="mb-6 sm:mb-8">
          <div className="max-h-[400px] overflow-y-auto rounded border border-gray-800">
            <table className="w-full text-left table-fixed">
              <thead className="text-xs sm:text-sm text-gray-400 border-b border-gray-800 sticky top-0 bg-black/70 backdrop-blur-sm">
                <tr>
                  <th className="pb-2 pt-2 w-8 sm:w-12 pl-2">#</th>
                  <th className="pb-2 pt-2">Title</th>
                  <th className="pb-2 pt-2 text-right pr-1 sm:pr-8 w-16 sm:w-24">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 inline" />
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {albumSongs.map((song, index) => (
                  <tr 
                    key={song.id}
                    className="text-gray-300 hover:bg-gray-800 group"
                  >
                    <td className="py-2 sm:py-3 pr-1 sm:pr-2 align-top pl-2">{index + 1}</td>
                    <td className="py-2 sm:py-3 align-top">
                      <div className="font-medium text-white line-clamp-1">{song.title}</div>
                      <div className="flex flex-col sm:flex-row text-xs text-gray-400 gap-1 sm:gap-2 items-start sm:items-center">
                        {song.featuring && song.featuring.length > 0 && (
                          <div className="line-clamp-1">
                            feat. {song.featuring.join(', ')}
                          </div>
                        )}
                        {/* Show song streams on mobile too */}
                        {song.streams > 0 && (
                          <div className="text-[10px] sm:text-xs text-gray-500">
                            {formatNumber(song.streams)} plays
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 text-right pl-1 pr-1 sm:pr-8 align-top">
                      <div className="flex items-center justify-end space-x-1 sm:space-x-3">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-transparent group-hover:text-gray-400 cursor-pointer" />
                        <span className="text-xs sm:text-sm whitespace-nowrap">{getSongDuration(song.id)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Album stats - improved mobile layout */}
        <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400">
          <p className="mb-1">{formatNumber(album.streams || 0)} streams</p>
          <p>Released: {formatReleaseDate(album.releaseDate)}</p>
          
          {album.criticalRating && album.fanRating && (
            <div className="mt-4 flex space-x-4 sm:space-x-8">
              <div>
                <p className="font-bold text-white">Critical Rating</p>
                <p className="text-lg sm:text-xl">{album.criticalRating.toFixed(1)}/10</p>
              </div>
              <div>
                <p className="font-bold text-white">Fan Rating</p>
                <p className="text-lg sm:text-xl">{album.fanRating.toFixed(1)}/10</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Additional Back button at the bottom */}
        <div className="mt-6 pb-4 flex justify-center">
          <button 
            className="px-4 py-2 bg-green-500 text-black rounded-full text-xs sm:text-sm font-bold hover:bg-green-400"
            onClick={onBack}
          >
            Back to profile
          </button>
        </div>
      </div>
      
      {/* Floating bottom back button for easy access */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          className="p-3 bg-green-500 text-black rounded-full shadow-lg hover:bg-green-400"
          onClick={onBack}
          aria-label="Back to profile"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default AlbumDetail;