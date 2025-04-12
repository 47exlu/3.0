import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ProgressBar } from '@/components/ui/progressbar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { SpotifyIcon, SoundCloudIcon, ITunesIcon, YouTubeIcon, VevoIcon, MusicIcon, StarIcon } from '@/assets/icons';
import { VIDEO_COSTS } from '@/lib/gameData';
import { ImageUploader } from '@/components/ui/image-uploader';
// Will implement AIRapperProfiles component later
const AIRapperProfiles = () => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Artist Profiles</h2>
      <p className="text-gray-500">Artist profiles will be available soon.</p>
    </div>
  );
};
// Define MusicStyle type since it's missing in types.ts
type MusicStyle = string;
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Import AlbumDetail component for showing album details
import AlbumDetail from '../spotify/AlbumDetail';

export function StreamingPlatforms() {
  const { streamingPlatforms, videosPlatforms, songs, stats, character, setScreen, updateCharacter, musicVideos, albums } = useRapperGame();
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showCoverEditor, setShowCoverEditor] = useState(false);
  const [showAboutBackgroundEditor, setShowAboutBackgroundEditor] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('spotify');
  // New state variables for album details
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [showAlbumDetail, setShowAlbumDetail] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState<string>("");
  
  // State for expanded sections
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllAlbums, setShowAllAlbums] = useState(false);
  
  // Get platform data
  const spotify = streamingPlatforms.find(p => p.name === 'Spotify');
  const soundCloud = streamingPlatforms.find(p => p.name === 'SoundCloud');
  const iTunes = streamingPlatforms.find(p => p.name === 'iTunes');
  const youtubeMusic = streamingPlatforms.find(p => p.name === 'YouTube Music');
  
  // Get video platforms
  const youtube = videosPlatforms.find(p => p.name === 'YouTube');
  const vevo = videosPlatforms.find(p => p.name === 'VEVO');
  
  // Format large numbers
  const formatNumber = (num: number): string => {
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
    return '$' + formatNumber(amount);
  };
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-900 to-black text-white p-4 overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center">
          <SpotifyIcon size={28} className="mr-2 text-green-400 flex-shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Streaming Platforms</h1>
            <p className="text-xs sm:text-sm text-gray-400">Monitor your performance across streaming services</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 h-8"
            onClick={() => setScreen('streaming_impact_dashboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
              <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
            </svg>
            Analytics Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-transparent border-gray-600 hover:bg-gray-800 mt-1 sm:mt-0 text-sm py-1 h-auto"
            onClick={() => setScreen('career_dashboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left mr-2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      <Tabs 
        value={selectedPlatform} 
        onValueChange={setSelectedPlatform}
        className="space-y-6"
      >
        <TabsList className="bg-green-950 border border-green-800 w-full flex flex-wrap overflow-x-auto h-auto">
          <TabsTrigger value="spotify" className="data-[state=active]:bg-green-800 flex-1 text-[10px] xxs:text-[11px] xs:text-xs sm:text-sm py-1 px-1 sm:px-2 h-auto">
            <SpotifyIcon size={12} className="mr-0.5 sm:mr-1 text-[#1DB954]" />
            <span className="hidden xxs:inline">Spotify</span>
            <span className="xxs:hidden">Spot</span>
          </TabsTrigger>
          <TabsTrigger value="soundcloud" className="data-[state=active]:bg-green-800 flex-1 text-[10px] xxs:text-[11px] xs:text-xs sm:text-sm py-1 px-1 sm:px-2 h-auto">
            <SoundCloudIcon size={12} className="mr-0.5 sm:mr-1 text-[#FF5500]" />
            <span className="hidden xxs:inline">SoundCloud</span>
            <span className="xxs:hidden">SC</span>
          </TabsTrigger>
          <TabsTrigger value="itunes" className="data-[state=active]:bg-green-800 flex-1 text-[10px] xxs:text-[11px] xs:text-xs sm:text-sm py-1 px-1 sm:px-2 h-auto">
            <ITunesIcon size={12} className="mr-0.5 sm:mr-1 text-[#FB5BC5]" />
            <span className="hidden xxs:inline">iTunes</span>
            <span className="xxs:hidden">iT</span>
          </TabsTrigger>
          <TabsTrigger value="youtubeMusic" className="data-[state=active]:bg-green-800 flex-1 text-[10px] xxs:text-[11px] xs:text-xs sm:text-sm py-1 px-1 sm:px-2 h-auto">
            <YouTubeIcon size={12} className="mr-0.5 sm:mr-1 text-[#FF0000]" />
            <span className="hidden xxs:inline">YT Music</span>
            <span className="xxs:hidden">YTM</span>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="data-[state=active]:bg-green-800 flex-1 text-[10px] xxs:text-[11px] xs:text-xs sm:text-sm py-1 px-1 sm:px-2 h-auto">
            <YouTubeIcon size={12} className="mr-0.5 sm:mr-1 text-[#FF0000]" />
            <span className="hidden xxs:inline">YouTube</span>
            <span className="xxs:hidden">YT</span>
          </TabsTrigger>
          <TabsTrigger value="vevo" className="data-[state=active]:bg-green-800 flex-1 text-[10px] xxs:text-[11px] xs:text-xs sm:text-sm py-1 px-1 sm:px-2 h-auto">
            <VevoIcon size={12} className="mr-0.5 sm:mr-1 text-[#FF0000]" />
            <span>VEVO</span>
          </TabsTrigger>
          <TabsTrigger value="artists" className="data-[state=active]:bg-green-800 relative flex-1 text-[10px] xxs:text-[11px] xs:text-xs sm:text-sm py-1 px-1 sm:px-2 h-auto">
            <span className="hidden xxs:inline">Artist Profiles</span>
            <span className="xxs:hidden">Artists</span>
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] rounded-full px-0.5 py-px">New</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Spotify Platform - Only platform we're keeping */}
        <TabsContent value="spotify" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Spotify Card */}
            {spotify && (
              <Card className="bg-[#121212] border-[#121212] overflow-hidden">
                <div className="flex flex-col h-full">
                  {/* Top Navbar */}
                  <div className="flex items-center justify-between bg-[#121212] px-4 py-3 border-b border-[#282828]">
                    <div className="flex items-center">
                      <SpotifyIcon size={24} className="text-[#1DB954]" />
                      <span className="ml-2 font-bold text-white">Spotify</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="h-8 rounded-full p-0 px-2 text-[#b3b3b3] hover:text-white hover:bg-[#282828]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.3-4.3"></path>
                        </svg>
                        <span className="text-xs">Search</span>
                      </Button>
                      {character?.image && (
                        <img 
                          src={character.image} 
                          alt={character.artistName} 
                          className="h-8 w-8 rounded-full cursor-pointer object-cover"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <CardContent className="p-0 flex-1 overflow-y-auto">
                    <div className="relative">
                      {/* Banner/Header Section with Artist Info */}
                      <div className="relative">
                        {/* Artist Banner with gradient background like real Spotify */}
                        <div 
                          className="h-48 w-full relative flex flex-col justify-end cursor-pointer group"
                          style={{
                            backgroundImage: character?.coverImage 
                              ? `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%), url(${character.coverImage})`
                              : `linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%)`,
                            backgroundColor: '#121212',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center 30%'
                          }}
                          onClick={() => setShowCoverEditor(true)}
                        >
                          {/* Optional overlay for better text visibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          
                          {/* Change background hint */}
                          <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/20">
                            <div className="bg-black/50 text-white rounded-full p-2 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              <span className="ml-1 text-xs font-medium">Change Cover</span>
                            </div>
                          </div>
                          
                          {/* Artist Profile with larger image */}
                          <div className="pb-3 pt-2 px-3 flex flex-col gap-1 relative z-10">
                            {/* Artist Text Info - Compact and stable design */}
                            <div className="text-white w-full">
                              <h1 className="text-4xl font-bold uppercase">{character?.artistName || "RAPPERNAME"}</h1>
                              <div className="flex items-center text-[#b3b3b3] text-xs">
                                <span>{formatNumber(spotify.listeners)} monthly listeners</span>
                                <span className="mx-2">•</span>
                                <span>{songs.filter(s => s.released).length} songs</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons row - simplified to match screenshot */}
                        <div className="px-4 sm:px-7 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 bg-black">
                          <Button 
                            className="h-8 sm:h-10 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs sm:text-sm"
                            onClick={() => setShowProfileEditor(true)}
                          >
                            Edit Profile
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="h-8 sm:h-10 text-[#b3b3b3] hover:text-white rounded-full font-normal hover:bg-[#282828] text-xs sm:text-sm"
                          >
                            <svg className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 5v14M5 12h14"/>
                            </svg>
                            Follow
                          </Button>
                        </div>
                      </div>
                      
                      {/* Main Content Sections */}
                      <div className="p-4 space-y-8">
                        {/* Popular Section */}
                        <div>
                          <h2 className="text-2xl font-bold mb-4">Popular</h2>
                          {songs.length === 0 ? (
                            <div className="text-center py-8 text-[#b3b3b3] bg-[#181818] rounded-md">
                              You haven't released any songs yet.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {songs
                                .filter(s => s.released)
                                .sort((a, b) => b.streams - a.streams)
                                .slice(0, showAllPopular ? undefined : 5)
                                .map((song, index) => (
                                  <div key={song.id} className="flex items-center px-2 xs:px-3 sm:px-5 py-2 xs:py-3 hover:bg-[#282828] rounded-md group">
                                    <div className="w-4 xxs:w-5 xs:w-6 text-center text-[#b3b3b3] mr-2 xxs:mr-3 xs:mr-4 font-normal text-xs xxs:text-sm">{index + 1}</div>
                                    <div className="h-10 w-10 xxs:h-12 xxs:w-12 xs:h-14 xs:w-14 mr-2 xxs:mr-3 xs:mr-4 overflow-hidden flex-shrink-0">
                                      {(() => {
                                        // Find album this song belongs to for the cover art
                                        const albumWithSong = (albums || []).find(a => a.songIds && a.songIds.includes(song.id));
                                        const coverArt = albumWithSong?.coverArt || song.coverArt || null;
                                        
                                        return coverArt ? (
                                          <img src={coverArt} alt={song.title} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full bg-[#333] flex items-center justify-center">
                                            <MusicIcon size={12} className="text-[#b3b3b3]" />
                                          </div>
                                        );
                                      })()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-xs xxs:text-sm xs:text-md truncate pr-1">{song.title}</div>
                                      <div className="text-[10px] xxs:text-xs text-[#b3b3b3] truncate">
                                        {song.featuring.length > 0 ? `Feat. ${song.featuring.length} artist${song.featuring.length > 1 ? 's' : ''}` : 'Single'}
                                      </div>
                                    </div>
                                    <div className="text-right text-xs xxs:text-sm text-[#b3b3b3] flex-shrink-0 pl-1">
                                      {selectedPlatform === 'spotify' && spotify ? 
                                         formatNumber(Math.floor(song.streams * 0.55)) :
                                       selectedPlatform === 'youtubeMusic' && youtubeMusic ?
                                         formatNumber(Math.floor(song.streams * 0.28)) :
                                       selectedPlatform === 'itunes' && iTunes ?
                                         formatNumber(Math.floor(song.streams * 0.12)) :
                                       selectedPlatform === 'soundcloud' && soundCloud ?
                                         formatNumber(Math.floor(song.streams * 0.05)) :
                                         formatNumber(song.streams)
                                      }
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                          
                          {songs.filter(s => s.released).length > 5 && (
                            <Button 
                              variant="ghost" 
                              className="text-[#b3b3b3] hover:text-white mt-2"
                              onClick={() => setShowAllPopular(!showAllPopular)}
                            >
                              {showAllPopular ? "See less" : "See more"}
                            </Button>
                          )}
                        </div>
                        
                        {/* Albums Section */}
                        <div>
                          <h2 className="text-xl xxs:text-2xl font-bold mb-2 xxs:mb-4">Albums</h2>
                          {!albums || albums.length === 0 ? (
                            <div className="text-center py-8 text-[#b3b3b3] bg-[#181818] rounded-md">
                              You haven't released any albums yet.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 xxs:gap-4 sm:gap-5">
                              {albums
                                .filter(album => album.released)
                                .sort((a, b) => (b.releaseDate || 0) - (a.releaseDate || 0))
                                .slice(0, showAllAlbums ? undefined : 5)
                                .map((album) => (
                                  <div 
                                    key={album.id} 
                                    className="bg-[#181818] rounded-lg p-2 xxs:p-3 sm:p-4 hover:bg-[#282828] transition-colors cursor-pointer"
                                    onClick={() => {
                                      if (selectedPlatform === 'spotify') {
                                        setSelectedAlbumId(album.id);
                                        setShowAlbumDetail(true);
                                      }
                                    }}
                                  >
                                    <div className="mb-2 xxs:mb-3 sm:mb-4 rounded overflow-hidden shadow-lg aspect-square">
                                      {album.coverArt ? (
                                        <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full bg-[#333] flex items-center justify-center">
                                          <MusicIcon size={20} className="text-[#b3b3b3]" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-sm xxs:text-md font-bold line-clamp-1">{album.title}</div>
                                    <div className="text-[10px] xxs:text-xs text-[#b3b3b3] mt-1 xxs:mt-2 line-clamp-2">
                                      {new Date().getFullYear() - Math.floor((album.releaseDate || 0) / 52)} • {album.type || 'Album'} • {album.songIds.length} tracks
                                    </div>
                                    <div className="mt-1 xxs:mt-2 text-[10px] xxs:text-xs text-[#b3b3b3] flex flex-wrap items-center">
                                      <div className="flex items-center mr-2">
                                        <StarIcon size={10} className="text-[#b3b3b3] mr-1" />
                                        <span>{album.criticalRating ? album.criticalRating.toFixed(1) : '-'}/10</span>
                                      </div>
                                      <div className="whitespace-nowrap">
                                        {selectedPlatform === 'spotify' && spotify ? 
                                           formatNumber(Math.floor((album.streams || 0) * (0.55 * (0.9 + Math.random() * 0.2)))) :
                                         selectedPlatform === 'youtubeMusic' && youtubeMusic ?
                                           formatNumber(Math.floor((album.streams || 0) * (0.28 * (0.9 + Math.random() * 0.2)))) :
                                         selectedPlatform === 'itunes' && iTunes ?
                                           formatNumber(Math.floor((album.streams || 0) * (0.12 * (0.9 + Math.random() * 0.2)))) :
                                         selectedPlatform === 'soundcloud' && soundCloud ?
                                           formatNumber(Math.floor((album.streams || 0) * (0.05 * (0.9 + Math.random() * 0.2)))) :
                                           formatNumber(album.streams || 0)
                                        } streams
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                          
                          {(albums || []).filter(album => album.released).length > 5 && (
                            <Button 
                              variant="ghost" 
                              className="text-[#b3b3b3] hover:text-white mt-2"
                              onClick={() => setShowAllAlbums(!showAllAlbums)} 
                            >
                              {showAllAlbums ? "See less" : "See more"}
                            </Button>
                          )}
                        </div>
                        
                        {/* Featuring Section - Displays songs where the player is featured */}
                        <div>
                          <h2 className="text-xl xxs:text-2xl sm:text-3xl font-bold mb-3 xxs:mb-4 sm:mb-8">Featuring {character?.artistName || "You"}</h2>
                          <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 xxs:gap-4 sm:gap-6 lg:gap-8">
                            {songs
                              .filter(s => s.released && s.featuring && s.featuring.length > 0)
                              .slice(0, 5)
                              .map((song) => (
                                <div key={song.id} className="bg-[#181818] rounded-lg p-2 xxs:p-3 sm:p-4 hover:bg-[#282828] transition-colors cursor-default">
                                  <div className="mb-2 xxs:mb-3 sm:mb-4 rounded overflow-hidden shadow-lg aspect-square">
                                    {(() => {
                                      // Find album this song belongs to for the cover art
                                      const albumWithSong = (albums || []).find(a => a.songIds && a.songIds.includes(song.id));
                                      const coverArt = albumWithSong?.coverArt || song.coverArt || null;
                                      
                                      return coverArt ? (
                                        <img src={coverArt} alt={song.title} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full bg-[#333] flex items-center justify-center">
                                          <MusicIcon size={20} className="text-[#b3b3b3]" />
                                        </div>
                                      );
                                    })()}
                                  </div>
                                  <div className="text-xs xxs:text-sm sm:text-md font-bold line-clamp-1">{song.title}</div>
                                  <div className="text-[10px] xxs:text-xs text-[#b3b3b3] mt-1 xxs:mt-2 line-clamp-2">
                                    {selectedPlatform === 'spotify' && spotify ? 
                                       formatNumber(Math.floor(song.streams * (0.55 * (0.9 + Math.random() * 0.2)))) :
                                     selectedPlatform === 'youtubeMusic' && youtubeMusic ?
                                       formatNumber(Math.floor(song.streams * (0.28 * (0.9 + Math.random() * 0.2)))) :
                                     selectedPlatform === 'itunes' && iTunes ?
                                       formatNumber(Math.floor(song.streams * (0.12 * (0.9 + Math.random() * 0.2)))) :
                                     selectedPlatform === 'soundcloud' && soundCloud ?
                                       formatNumber(Math.floor(song.streams * (0.05 * (0.9 + Math.random() * 0.2)))) :
                                       formatNumber(song.streams)
                                    } streams • Feat. {song.featuring.length} artist{song.featuring.length > 1 ? 's' : ''}
                                  </div>
                                </div>
                              ))}
                              
                            {songs.filter(s => s.released && s.featuring && s.featuring.length > 0).length === 0 && (
                              <div className="col-span-1 xxs:col-span-2 sm:col-span-3 lg:col-span-5 text-center py-6 sm:py-10 text-[#b3b3b3] bg-[#181818] rounded-md text-xs xxs:text-sm">
                                No collaborations yet. Create songs with featured artists to see them here.
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 xxs:gap-4 sm:gap-5">
                          <div className="bg-[#181818] rounded-md p-3 xxs:p-4 sm:p-5">
                            <h4 className="text-[10px] xxs:text-xs sm:text-sm font-normal text-[#b3b3b3] mb-1 xxs:mb-2">MONTHLY LISTENERS</h4>
                            <p className="text-xl xxs:text-2xl sm:text-3xl font-bold text-white">{formatNumber(spotify.listeners)}</p>
                          </div>
                          <div className="bg-[#181818] rounded-md p-3 xxs:p-4 sm:p-5">
                            <h4 className="text-[10px] xxs:text-xs sm:text-sm font-normal text-[#b3b3b3] mb-1 xxs:mb-2">TOTAL STREAMS</h4>
                            <p className="text-xl xxs:text-2xl sm:text-3xl font-bold text-white">{formatNumber(spotify.totalStreams)}</p>
                          </div>
                          <div className="bg-[#181818] rounded-md p-3 xxs:p-4 sm:p-5 sm:col-span-2 md:col-span-1">
                            <h4 className="text-[10px] xxs:text-xs sm:text-sm font-normal text-[#b3b3b3] mb-1 xxs:mb-2">TOTAL REVENUE</h4>
                            <p className="text-xl xxs:text-2xl sm:text-3xl font-bold text-[#1DB954]">{formatMoney(spotify.revenue)}</p>
                          </div>
                        </div>
                        
                        {/* About section - Redesigned to match reference images */}
                        <div>
                          <h2 className="text-xl xxs:text-2xl sm:text-3xl font-bold mb-3 xxs:mb-4 sm:mb-6">About</h2>
                          <div className="rounded-md overflow-hidden bg-black">
                            {/* Artist header with image and stats */}
                            <div className="relative w-full">
                              {/* Artist profile image (left) */}
                              <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-1/3 p-4">
                                  <div 
                                    className="relative mx-auto sm:mx-0"
                                    onClick={() => setShowProfileEditor(true)}
                                  >
                                    <div className="relative bg-blue-500 rounded-full h-24 w-24 flex items-center justify-center text-white font-bold text-2xl overflow-hidden mx-auto sm:mx-0">
                                      {character?.image ? (
                                        <img 
                                          src={character.image} 
                                          alt={character.artistName} 
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span>{character?.artistName?.[0] || "R"}</span>
                                      )}

                                    </div>
                                  </div>
                                  
                                  <div className="text-center sm:text-left mt-4">
                                    <div className="text-2xl font-bold text-white mb-0.5">{formatNumber(spotify.listeners)}</div>
                                    <div className="text-sm text-gray-400">Ascoltatori mensili</div>
                                  </div>
                                  
                                  <div className="text-center sm:text-left mt-4">
                                    <div className="text-2xl font-bold text-white mb-0.5">{formatNumber(spotify.totalStreams)}</div>
                                    <div className="text-sm text-gray-400">Follower</div>
                                  </div>
                                </div>
                                
                                {/* Artist bio and details (right) */}
                                <div className="sm:w-2/3 p-4 sm:p-6">
                                  <div className="text-white">
                                    <div className="mb-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                          <h3 className="text-lg font-semibold">
                                            {character?.artistName || 'Artist'}
                                          </h3>
                                          {/* Rank indicator with orange gradient background */}
                                          <div className="ml-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-bold px-2 py-1 rounded-lg flex items-center">
                                            #{stats?.chartPosition || character?.ranking || "—"}
                                          </div>
                                        </div>
                                        {!isEditingBio && (
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-7 px-2 text-xs hover:bg-gray-800"
                                            onClick={() => {
                                              const currentBio = character?.bio || 
                                                `${character?.artistName || 'Artist'} played fast and loose when it came to genres, often incorporating elements of punk rock, hip-hop, R&B, and heavy metal. In the late 2010s, they experienced a quick rise with dark and emotionally intense content, scoring a number one album with ${new Date().getFullYear()}'s ?. Months later, at the peak of popularity, they went viral. Born in ${character?.hometown || 'South Florida'}, they had a troubled upbringing, often getting into difficult situations; their mother couldn't cope with raising them alone, so they were often forced to stay with various relatives as a result.`;
                                              setBioText(currentBio);
                                              setIsEditingBio(true);
                                            }}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                              <path d="M12 20h9"/>
                                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                            </svg>
                                            Edit Bio
                                          </Button>
                                        )}
                                      </div>

                                      {isEditingBio ? (
                                        <div className="mt-2">
                                          <textarea
                                            value={bioText}
                                            onChange={(e) => setBioText(e.target.value)}
                                            className="w-full h-32 bg-gray-800 text-white border border-gray-700 rounded p-2 text-sm"
                                            placeholder="Write your artist bio here..."
                                          />
                                          <div className="flex gap-2 mt-2">
                                            <Button 
                                              size="sm"
                                              className="bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs h-8"
                                              onClick={() => {
                                                const updatedCharacter = { ...character, bio: bioText };
                                                updateCharacter(updatedCharacter);
                                                setIsEditingBio(false);
                                              }}
                                            >
                                              Save
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="text-xs h-8 border-gray-600"
                                              onClick={() => setIsEditingBio(false)}
                                            >
                                              Cancel
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                          {character?.bio || 
                                            `${character?.artistName || 'Artist'} played fast and loose when it came to genres, often incorporating elements of punk rock, hip-hop, R&B, and heavy metal. In the late 2010s, they experienced a quick rise with dark and emotionally intense content, scoring a number one album with ${new Date().getFullYear()}'s ?. Months later, at the peak of popularity, they went viral. Born in ${character?.hometown || 'South Florida'}, they had a troubled upbringing, often getting into difficult situations; their mother couldn't cope with raising them alone, so they were often forced to stay with various relatives as a result.`
                                          }
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Other platforms tabs - not implemented in detail */}
        <TabsContent value="soundcloud" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-white border-[#f2f2f2] overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
                  <div className="flex items-center">
                    <SoundCloudIcon size={24} className="text-[#FF5500]" />
                    <span className="ml-2 font-bold text-black">SoundCloud</span>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 bg-white text-black">
                  <p className="text-lg font-semibold mb-4">Your SoundCloud Profile</p>
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="mb-4">Connect your SoundCloud account to see your stats and tracks</p>
                    <Button variant="default" className="bg-[#FF5500] hover:bg-[#FF7700]">Connect Account</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="itunes" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-white border-[#f2f2f2] overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
                  <div className="flex items-center">
                    <ITunesIcon size={24} className="text-[#FB5BC5]" />
                    <span className="ml-2 font-bold text-black">iTunes</span>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 bg-white text-black">
                  <p className="text-lg font-semibold mb-4">Your iTunes Profile</p>
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="mb-4">Connect your iTunes account to see your stats and tracks</p>
                    <Button variant="default" className="bg-[#FB5BC5] hover:bg-[#FC72D0]">Connect Account</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="youtubeMusic" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-white border-[#f2f2f2] overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
                  <div className="flex items-center">
                    <YouTubeIcon size={24} className="text-[#FF0000]" />
                    <span className="ml-2 font-bold text-black">YouTube Music</span>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 bg-white text-black">
                  <p className="text-lg font-semibold mb-4">Your YouTube Music Profile</p>
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="mb-4">Connect your YouTube Music account to see your stats and tracks</p>
                    <Button variant="default" className="bg-[#FF0000] hover:bg-[#FF5555]">Connect Account</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="youtube" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-white border-[#f2f2f2] overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
                  <div className="flex items-center">
                    <YouTubeIcon size={24} className="text-[#FF0000]" />
                    <span className="ml-2 font-bold text-black">YouTube</span>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 bg-white text-black">
                  <p className="text-lg font-semibold mb-4">Your YouTube Channel</p>
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="mb-4">Connect your YouTube channel to see your stats and videos</p>
                    <Button variant="default" className="bg-[#FF0000] hover:bg-[#FF5555]">Connect Channel</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vevo" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-white border-[#f2f2f2] overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
                  <div className="flex items-center">
                    <VevoIcon size={24} className="text-[#FF0000]" />
                    <span className="ml-2 font-bold text-black">VEVO</span>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 bg-white text-black">
                  <p className="text-lg font-semibold mb-4">Your VEVO Channel</p>
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="mb-4">Connect your VEVO channel to see your stats and videos</p>
                    <Button variant="default" className="bg-[#FF0000] hover:bg-[#FF5555]">Connect Channel</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="artists" className="space-y-6">
          <AIRapperProfiles />
        </TabsContent>
      </Tabs>
      
      {/* Profile Image Editor Dialog */}
      <Dialog open={showProfileEditor} onOpenChange={setShowProfileEditor}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
          </DialogHeader>
          <ImageUploader 
            currentImage={character?.image || undefined}
            onImageSelected={(imageData) => {
              updateCharacter({
                ...character,
                image: imageData
              });
              setShowProfileEditor(false);
            }}
            aspectRatio="square"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileEditor(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cover Image Editor Dialog */}
      <Dialog open={showCoverEditor} onOpenChange={setShowCoverEditor}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Cover Image</DialogTitle>
          </DialogHeader>
          <ImageUploader 
            currentImage={character?.coverImage || undefined}
            onImageSelected={(imageData) => {
              updateCharacter({
                ...character,
                coverImage: imageData
              });
              setShowCoverEditor(false);
            }}
            aspectRatio="wide"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCoverEditor(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Album Detail Dialog */}
      <Dialog open={showAlbumDetail} onOpenChange={setShowAlbumDetail}>
        <DialogContent className="sm:max-w-3xl bg-[#121212] text-white border-[#282828] p-0">
          {selectedAlbumId && (
            <AlbumDetail 
              albumId={selectedAlbumId} 
              onClose={() => setShowAlbumDetail(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}