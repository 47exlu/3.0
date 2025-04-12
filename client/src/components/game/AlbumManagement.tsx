import React, { useState, useEffect } from 'react';
import {
  Disc,
  Plus,
  Play,
  Trash,
  Download,
  Share,
  Calendar,
  Music,
  X,
  Check,
  Edit,
  Filter,
  ArrowUp,
  ArrowDown,
  Search
} from 'lucide-react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { Album, Song } from '../../lib/types';
import { formatDate, formatNumber } from '../../lib/utils';

export const AlbumManagement: React.FC = () => {
  const { 
    setScreen, albums, songs, releaseAlbum, createAlbum,
    character
  } = useRapperGame();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<'standard' | 'deluxe' | 'remix'>('standard');
  const [selectedParentAlbumId, setSelectedParentAlbumId] = useState<string | undefined>(undefined);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter albums based on active tab
  const filteredAlbums = albums?.filter(album => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unreleased') return !album.released;
    if (activeTab === 'released') return album.released;
    if (activeTab === 'standard') return album.type === 'standard';
    if (activeTab === 'deluxe') return album.type === 'deluxe';
    if (activeTab === 'remix') return album.type === 'remix';
    return true;
  }) || [];
  
  // Standard albums that can be used for deluxe/remix versions
  const standardAlbums = albums?.filter(album => 
    album.type === 'standard' && album.released
  ) || [];
  
  // Get songs for specific album
  const getAlbumSongs = (albumId: string): Song[] => {
    // Since Song type doesn't have albumId, we'll assume it's stored in a custom property
    // We'll cast to any to avoid TypeScript errors while maintaining compatibility
    return songs?.filter(song => (song as any).albumId === albumId) || [];
  };
  
  // Calculate album stats
  const calculateAlbumStats = (album: Album) => {
    const albumSongs = getAlbumSongs(album.id);
    const totalStreams = albumSongs.reduce((total, song) => total + (song.streams || 0), 0);
    // Since Song type doesn't have duration property, we'll use a default duration of 3 minutes per song
    // or get it from the custom property if it exists
    const totalDuration = albumSongs.reduce((total, song) => total + ((song as any).duration || 180), 0);
    const minutes = Math.floor(totalDuration / 60);
    const seconds = totalDuration % 60;
    
    return {
      totalStreams,
      songCount: albumSongs.length,
      duration: `${minutes}:${seconds.toString().padStart(2, '0')}`
    };
  };
  
  // Filter available songs for album based on search and release status
  const getAvailableSongs = () => {
    // First check if we have any songs at all
    console.log("Total songs in store:", songs?.length, songs);
    
    // Instead of filtering, let's just use all songs and show a more descriptive status
    const availableSongs = songs?.filter(song => {
      // Accept all unreleased songs for now (since users are having issues)
      // This allows all songs to be included in albums
      const isValidSong = !song.released; // Allow any unreleased song
      
      // Skip songs that don't meet the basic criteria
      if (!isValidSong) return false;
      
      // Filter by search query if provided
      if (searchQuery && !song.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    }) || [];
    
    // Debug log to see what songs are available
    console.log("Available songs for album:", availableSongs.length, availableSongs);
    console.log("Song selector criteria:", songs?.map(s => ({
      id: s.id,
      title: s.title,
      released: s.released,
      completed: s.completed,
      progress: s.productionProgress,
      isValid: s.released || (s.completed && !s.released) || (s.productionProgress >= 90)
    })));
    
    return availableSongs;
  };
  
  const toggleSongSelection = (songId: string) => {
    setSelectedSongIds(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  const handleCreateAlbum = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate form
    if (!albumTitle.trim()) {
      alert("Please enter an album title");
      return;
    }
    
    if (selectedSongIds.length === 0) {
      alert("Please select at least one song for the album");
      return;
    }
    
    // Generate a default album cover (in a real app, this would be customizable)
    const defaultCoverArt = "/images/default-album.jpg";
    
    // Create the album using the store function
    try {
      const albumId = createAlbum(albumTitle, formType, defaultCoverArt, selectedSongIds);
      
      if (albumId) {
        // Reset form state
        setAlbumTitle('');
        setSelectedSongIds([]);
        setShowCreateForm(false);
        setSearchQuery('');
        
        // Show confirmation message
        alert(`Album "${albumTitle}" created successfully!`);
      }
    } catch (error) {
      console.error("Failed to create album:", error);
      alert("Failed to create album. Please try again.");
    }
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Render album details when an album is selected
  const renderAlbumDetails = () => {
    if (!selectedAlbum) return null;
    
    const albumSongs = getAlbumSongs(selectedAlbum.id);
    const stats = calculateAlbumStats(selectedAlbum);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col overflow-y-auto">
        <div className="bg-gradient-to-b from-gray-900 to-black p-4 sm:p-6 max-w-4xl mx-auto w-full h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => setSelectedAlbum(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <Share className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <Edit className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
              <img 
                src={selectedAlbum.coverArt || '/images/default-album.jpg'} 
                alt={selectedAlbum.title} 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div className="flex-1">
              <div className="uppercase text-xs font-bold text-gray-400 mb-1">{selectedAlbum.type} ALBUM</div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{selectedAlbum.title}</h1>
              
              <div className="text-sm text-gray-400 mb-4">
                <span className="text-white font-medium">{character?.artistName}</span> • {selectedAlbum.releaseDate ? formatDate(selectedAlbum.releaseDate) : 'Unreleased'} • {stats.songCount} songs, {stats.duration}
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <button className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-full p-3">
                  <Play className="h-6 w-6 text-white" />
                </button>
                
                {!selectedAlbum.released && (
                  <button 
                    className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 px-4 rounded-full text-sm font-medium flex items-center"
                    onClick={() => {
                      releaseAlbum?.(selectedAlbum.id);
                      setSelectedAlbum({...selectedAlbum, released: true});
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Release Album
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Total Streams</div>
                  <div className="text-xl font-bold">{formatNumber(stats.totalStreams)}</div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Songs</div>
                  <div className="text-xl font-bold">{stats.songCount}</div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Duration</div>
                  <div className="text-xl font-bold">{stats.duration}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Tracks</h2>
            <div className="bg-gray-900 bg-opacity-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">#</th>
                    <th className="text-left py-2 px-4 text-gray-400 font-medium text-sm">Title</th>
                    <th className="text-right py-2 px-4 text-gray-400 font-medium text-sm">Streams</th>
                    <th className="text-right py-2 px-4 text-gray-400 font-medium text-sm">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {albumSongs.map((song, index) => {
                    // Use default duration of 3 minutes per song or get from custom property if it exists
                    const songDuration = ((song as any).duration || 180);
                    const minutes = Math.floor(songDuration / 60);
                    const seconds = songDuration % 60;
                    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    
                    return (
                      <tr key={song.id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-3 px-4 text-gray-300">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{song.title}</div>
                          {song.featuring && (
                            <div className="text-sm text-gray-400">feat. {song.featuring}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">{formatNumber(song.streams || 0)}</td>
                        <td className="py-3 px-4 text-right text-gray-300">{duration}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Create album form
  const renderCreateForm = () => {
    if (!showCreateForm) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create New Album</h2>
            <button 
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleCreateAlbum}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-medium mb-2">Album Title</label>
              <input 
                type="text" 
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter album title"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-medium mb-2">Album Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`py-2 px-3 rounded-md text-center text-sm ${formType === 'standard' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                  onClick={() => setFormType('standard')}
                >
                  Standard
                </button>
                <button
                  type="button"
                  className={`py-2 px-3 rounded-md text-center text-sm ${formType === 'deluxe' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                  onClick={() => setFormType('deluxe')}
                >
                  Deluxe
                </button>
                <button
                  type="button"
                  className={`py-2 px-3 rounded-md text-center text-sm ${formType === 'remix' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                  onClick={() => setFormType('remix')}
                >
                  Remix
                </button>
              </div>
            </div>
            
            {(formType === 'deluxe' || formType === 'remix') && standardAlbums.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-medium mb-2">Parent Album</label>
                <select 
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedParentAlbumId}
                  onChange={(e) => setSelectedParentAlbumId(e.target.value)}
                >
                  <option value="">Select parent album</option>
                  {standardAlbums.map(album => (
                    <option key={album.id} value={album.id}>{album.title}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-400 text-sm font-medium">Song Selection</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md pl-8 pr-4 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto bg-gray-800 rounded-md">
                {!songs || songs.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <p>You haven't created any songs yet.</p>
                    <p className="mt-2">Go to <span className="font-bold text-blue-400">Music Studio</span> to create songs first.</p>
                  </div>
                ) : getAvailableSongs().length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <p>No songs available for your album.</p>
                    <p className="mt-2">You need to:</p>
                    <ul className="mt-1 list-disc list-inside">
                      <li>Finish producing your songs (100% completion)</li>
                      <li>OR release some songs first</li>
                    </ul>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-700">
                    {getAvailableSongs().map(song => {
                      const isSelected = selectedSongIds.includes(song.id);
                      return (
                        <li 
                          key={song.id}
                          className={`p-3 hover:bg-gray-700 transition-colors flex justify-between items-center cursor-pointer ${isSelected ? 'bg-gray-700' : ''}`}
                          onClick={() => toggleSongSelection(song.id)}
                        >
                          <div className="flex items-center">
                            <Music className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <div className="font-medium">{song.title}</div>
                              <div className="text-xs text-gray-400">
                                Quality: {song.quality}
                                {song.featuring && ` • Feat. ${song.featuring}`}
                                {song.released ? " • Released" : " • Unreleased"}
                              </div>
                            </div>
                          </div>
                          <div className={`h-5 w-5 rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-500'} flex items-center justify-center`}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              
              <div className="mt-2 text-sm text-gray-400 flex justify-between">
                <span>{selectedSongIds.length} songs selected</span>
                {selectedSongIds.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setSelectedSongIds([])}
                    className="text-gray-400 hover:text-red-400"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md"
              >
                Create Album
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  // Main component render
  return (
    <div className="albums-container p-4 text-white overflow-y-auto h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Albums</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setScreen('music_production')}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm flex items-center"
          >
            <Music className="h-4 w-4 mr-1" />
            Music Studio
          </button>
          <button
            onClick={() => {
              setFormType('standard');
              setShowCreateForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Album
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2 overflow-x-auto mb-6 pb-2">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-800/50 text-gray-400'}`}
          onClick={() => handleTabChange('all')}
        >
          All Albums
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'unreleased' ? 'bg-gray-800 text-white' : 'bg-gray-800/50 text-gray-400'}`}
          onClick={() => handleTabChange('unreleased')}
        >
          Unreleased
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'released' ? 'bg-gray-800 text-white' : 'bg-gray-800/50 text-gray-400'}`}
          onClick={() => handleTabChange('released')}
        >
          Released
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'standard' ? 'bg-gray-800 text-white' : 'bg-gray-800/50 text-gray-400'}`}
          onClick={() => handleTabChange('standard')}
        >
          Standard
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'deluxe' ? 'bg-gray-800 text-white' : 'bg-gray-800/50 text-gray-400'}`}
          onClick={() => handleTabChange('deluxe')}
        >
          Deluxe
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'remix' ? 'bg-gray-800 text-white' : 'bg-gray-800/50 text-gray-400'}`}
          onClick={() => handleTabChange('remix')}
        >
          Remix
        </button>
      </div>
      
      {filteredAlbums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Disc className="w-16 h-16 text-gray-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Albums Found</h2>
          <p className="text-gray-400 max-w-md mb-4">
            {activeTab === 'all' 
              ? "You haven't created any albums yet. To create an album, you need to have songs first."
              : `No ${activeTab} albums found. Try a different filter or create a new album.`}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={() => setScreen('music_production')}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm flex items-center justify-center"
            >
              <Music className="h-4 w-4 mr-2" />
              Create Songs First
            </button>
            
            <button
              onClick={() => {
                setFormType('standard');
                setShowCreateForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Album
            </button>
          </div>
          
          <p className="text-sm text-gray-500 max-w-md">
            Remember: You need to create and complete songs in the Music Studio before you can add them to an album.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlbums.map(album => {
            const stats = calculateAlbumStats(album);
            
            return (
              <div 
                key={album.id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedAlbum(album)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={album.coverArt || '/images/default-album.jpg'} 
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div>
                      <div className="uppercase text-xs font-bold text-gray-400 mb-1">{album.type}</div>
                      <h3 className="text-lg font-bold line-clamp-2">{album.title}</h3>
                    </div>
                  </div>
                  {!album.released && (
                    <div className="absolute top-2 right-2 bg-yellow-600 text-xs px-2 py-1 rounded-full font-medium">
                      Unreleased
                    </div>
                  )}
                </div>
                <div className="p-4 pt-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{stats.songCount} songs</span>
                    <span>{formatNumber(stats.totalStreams)} streams</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {selectedAlbum && renderAlbumDetails()}
      {renderCreateForm()}
    </div>
  );
};

export default AlbumManagement;