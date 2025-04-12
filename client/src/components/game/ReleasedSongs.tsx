import React, { useState } from 'react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { formatNumber, formatDate } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SongCertification, CertificationType, Song, AlbumType } from '@/lib/types';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Award, 
  Music, 
  Calendar,
  BarChart3, 
  Play, 
  Users,
  Disc,
  Star,
  Flame,
  Sparkles
} from 'lucide-react';

const ReleasedSongs: React.FC = () => {
  const { songs, albums } = useRapperGame();
  const [activeTab, setActiveTab] = useState('songs');

  // Sort songs by streams (highest first)
  const sortedSongs = [...(songs || [])].filter(song => song.released).sort((a, b) => b.streams - a.streams);
  
  // Sort albums by streams (highest first)
  const sortedAlbums = [...(albums || [])].filter(album => album.released).sort((a, b) => b.streams - a.streams);

  // Function to render performance status
  const renderPerformanceStatus = (status: string | undefined, isViral: boolean = false) => {
    if (isViral) {
      return (
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-1 text-white shadow-lg">
          <Flame className="w-3 h-3" />
          Viral
        </Badge>
      );
    }

    switch(status) {
      case 'rising':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-green-700 flex items-center gap-1 text-white shadow-sm">
            <TrendingUp className="w-3 h-3" />
            Rising
          </Badge>
        );
      case 'declining':
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-700 flex items-center gap-1 text-white shadow-sm">
            <TrendingDown className="w-3 h-3" />
            Falling
          </Badge>
        );
      case 'peaking':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 flex items-center gap-1 text-white shadow-sm">
            <TrendingUp className="w-3 h-3" />
            Peaking
          </Badge>
        );
      case 'flop':
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-700 flex items-center gap-1 text-white shadow-sm">
            <TrendingDown className="w-3 h-3" />
            Flop
          </Badge>
        );
      case 'stable':
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-600 to-gray-800 flex items-center gap-1 text-white shadow-sm">
            <Minus className="w-3 h-3" />
            Stable
          </Badge>
        );
    }
  };

  // Function to get certification badge style
  const getCertificationBadge = (certType: string) => {
    switch(certType) {
      case 'gold':
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-700 flex items-center gap-1 text-yellow-100">
            <Star className="w-3 h-3" />
            Gold
          </Badge>
        );
      case 'platinum':
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 flex items-center gap-1 text-white">
            <Star className="w-3 h-3" />
            Platinum
          </Badge>
        );
      case '2xPlatinum':
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 flex items-center gap-1 text-white">
            <Star className="w-3 h-3" />
            2× Plat
          </Badge>
        );
      case '3xPlatinum':
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 flex items-center gap-1 text-white">
            <Star className="w-3 h-3" />
            3× Plat
          </Badge>
        );
      case '4xPlatinum':
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 flex items-center gap-1 text-white">
            <Star className="w-3 h-3" />
            4× Plat
          </Badge>
        );
      case '5xPlatinum':
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 flex items-center gap-1 text-white">
            <Star className="w-3 h-3" />
            5× Plat
          </Badge>
        );
      case 'diamond':
        return (
          <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 flex items-center gap-1 text-white">
            <Sparkles className="w-3 h-3" />
            Diamond
          </Badge>
        );
      default:
        return null;
    }
  };

  // Function to render certifications as badges
  const renderCertifications = (certifications: SongCertification[] | undefined) => {
    if (!certifications || certifications.length === 0) return 'None';
    
    return (
      <div className="flex flex-wrap gap-1">
        {certifications.map((cert, index) => (
          <div key={index}>{getCertificationBadge(cert.type)}</div>
        ))}
      </div>
    );
  };

  // Function to get tier badge style
  const getTierBadge = (tier: number | string) => {
    // If tier is a number (SongTier), convert to string
    const tierStr = tier.toString();
    
    switch(tierStr) {
      case 'S':
      case '5':
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 flex items-center gap-1 text-white shadow-sm">
            <Sparkles className="w-3 h-3" />
            S Tier
          </Badge>
        );
      case 'A':
      case '4':
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-700 flex items-center gap-1 text-white shadow-sm">
            <Star className="w-3 h-3" />
            A Tier
          </Badge>
        );
      case 'B':
      case '3':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 flex items-center gap-1 text-white shadow-sm">
            <Star className="w-3 h-3" />
            B Tier
          </Badge>
        );
      case 'C':
      case '2':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-green-700 flex items-center gap-1 text-white shadow-sm">
            <Star className="w-3 h-3" />
            C Tier
          </Badge>
        );
      case 'D':
      case '1':
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-gray-700 flex items-center gap-1 text-white shadow-sm">
            <Star className="w-3 h-3" />
            D Tier
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-gray-700 flex items-center gap-1 text-white shadow-sm">
            <Star className="w-3 h-3" />
            {tierStr}
          </Badge>
        );
    }
  };

  // Render songs table
  const renderSongsTable = () => {
    if (sortedSongs.length === 0) {
      return (
        <div className="text-center p-8 text-gray-400">
          <Music className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">You haven't released any songs yet.</p>
          <p className="text-sm">Create and release songs to see them here.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Quality</TableHead>
            <TableHead>Streams</TableHead>
            <TableHead className="hidden md:table-cell">Released</TableHead>
            <TableHead className="hidden md:table-cell">Platforms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Certifications</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSongs.map((song, index) => (
            <TableRow key={song.id} className={`${index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'} hover:bg-gray-800/40 transition-colors`}>
              <TableCell className="text-center font-bold">{index + 1}</TableCell>
              <TableCell className="font-medium min-w-[180px]">
                <div className="flex items-center gap-2">
                  {song.icon && (
                    <div className="min-w-[32px] w-8 h-8 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-inner">
                      {typeof song.icon === 'string' ? song.icon : '🎵'}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="truncate font-semibold">{song.title}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {song.featuring && song.featuring.length > 0 
                        ? `feat. ${song.featuring.join(', ')}` 
                        : 'Solo'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {getTierBadge(song.tier)}
              </TableCell>
              <TableCell className="font-mono whitespace-nowrap">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="font-semibold">{formatNumber(song.streams)}</span>
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell text-gray-400 text-sm">
                {song.releaseDate 
                  ? formatDate(song.releaseDate)
                  : 'Unknown'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {(song.releasePlatforms || []).map((platform, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {renderPerformanceStatus(song.performanceType, song.performanceType === 'viral')}
              </TableCell>
              <TableCell>
                {renderCertifications(song.certifications)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  // Render albums table
  const renderAlbumsTable = () => {
    if (sortedAlbums.length === 0) {
      return (
        <div className="text-center p-8 text-gray-400">
          <Disc className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">You haven't released any albums yet.</p>
          <p className="text-sm">Create and release albums to see them here.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Tracks</TableHead>
            <TableHead>Streams</TableHead>
            <TableHead className="hidden md:table-cell">Released</TableHead>
            <TableHead>Certifications</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAlbums.map((album, index) => (
            <TableRow key={album.id} className={`${index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'} hover:bg-gray-800/40 transition-colors`}>
              <TableCell className="text-center font-bold">{index + 1}</TableCell>
              <TableCell className="font-medium min-w-[180px]">
                <div className="flex items-center gap-2">
                  {album.coverArt && (
                    <div className="min-w-[40px] w-10 h-10 rounded-md overflow-hidden flex-shrink-0 shadow-md">
                      <img 
                        src={album.coverArt} 
                        alt={`${album.title} cover`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="truncate font-semibold">{album.title}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {album.description || String(album.type).charAt(0).toUpperCase() + String(album.type).slice(1)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={
                  String(album.type) === 'standard' ? 'bg-gradient-to-r from-blue-500 to-blue-700 flex items-center gap-1 text-white shadow-sm' :
                  String(album.type) === 'deluxe' ? 'bg-gradient-to-r from-pink-500 to-pink-700 flex items-center gap-1 text-white shadow-sm' :
                  String(album.type) === 'remix' ? 'bg-gradient-to-r from-green-500 to-green-700 flex items-center gap-1 text-white shadow-sm' :
                  String(album.type) === 'ep' ? 'bg-gradient-to-r from-purple-500 to-purple-700 flex items-center gap-1 text-white shadow-sm' :
                  String(album.type) === 'compilation' ? 'bg-gradient-to-r from-orange-500 to-orange-700 flex items-center gap-1 text-white shadow-sm' :
                  'bg-gradient-to-r from-gray-500 to-gray-700 flex items-center gap-1 text-white shadow-sm'
                }>
                  <Disc className="w-3 h-3" />
                  {String(album.type).charAt(0).toUpperCase() + String(album.type).slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-sm">
                  {album.songIds?.length || 0}
                </Badge>
              </TableCell>
              <TableCell className="font-mono whitespace-nowrap">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="font-semibold">{formatNumber(album.streams)}</span>
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell text-gray-400 text-sm">
                {album.releaseDate 
                  ? formatDate(album.releaseDate)
                  : 'Unknown'}
              </TableCell>
              <TableCell>
                {renderCertifications(album.certifications)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-800">
        <CardTitle className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
          <Award className="h-6 w-6 text-yellow-500" />
          Released Music
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4 bg-gray-900/60 p-1 rounded-lg">
            <TabsTrigger value="songs" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-800">
              <Music className="h-4 w-4" />
              Songs ({sortedSongs.length})
            </TabsTrigger>
            <TabsTrigger value="albums" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-800">
              <Disc className="h-4 w-4" />
              Albums ({sortedAlbums.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="mt-0">
            <div className="overflow-x-auto">
              {renderSongsTable()}
            </div>
          </TabsContent>

          <TabsContent value="albums" className="mt-0">
            <div className="overflow-x-auto">
              {renderAlbumsTable()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReleasedSongs;