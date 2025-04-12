import React, { useState } from 'react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { formatNumber, formatDate } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Disc
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
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
          <TrendingUp className="w-3 h-3 mr-1" />
          Viral
        </Badge>
      );
    }

    switch(status) {
      case 'rising':
        return (
          <Badge className="bg-green-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            Rising
          </Badge>
        );
      case 'declining':
        return (
          <Badge className="bg-red-600">
            <TrendingDown className="w-3 h-3 mr-1" />
            Declining
          </Badge>
        );
      case 'peaking':
        return (
          <Badge className="bg-blue-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            Peaking
          </Badge>
        );
      case 'stable':
      default:
        return (
          <Badge className="bg-gray-600">
            <Minus className="w-3 h-3 mr-1" />
            Stable
          </Badge>
        );
    }
  };

  // Function to get certification badge style
  const getCertificationBadge = (certType: string) => {
    switch(certType) {
      case 'gold':
        return <Badge className="bg-yellow-600">Gold</Badge>;
      case 'platinum':
        return <Badge className="bg-gray-400">Platinum</Badge>;
      case '2xPlatinum':
        return <Badge className="bg-gray-400">2× Platinum</Badge>;
      case '3xPlatinum':
        return <Badge className="bg-gray-400">3× Platinum</Badge>;
      case '4xPlatinum':
        return <Badge className="bg-gray-400">4× Platinum</Badge>;
      case '5xPlatinum':
        return <Badge className="bg-gray-400">5× Platinum</Badge>;
      case 'diamond':
        return <Badge className="bg-blue-400">Diamond</Badge>;
      default:
        return null;
    }
  };

  // Function to render certifications as badges
  const renderCertifications = (certifications: any[] | undefined) => {
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
  const getTierBadge = (tier: string) => {
    switch(tier) {
      case 'S':
        return <Badge className="bg-purple-600">S Tier</Badge>;
      case 'A':
        return <Badge className="bg-red-600">A Tier</Badge>;
      case 'B':
        return <Badge className="bg-blue-600">B Tier</Badge>;
      case 'C':
        return <Badge className="bg-green-600">C Tier</Badge>;
      case 'D':
        return <Badge className="bg-gray-600">D Tier</Badge>;
      default:
        return <Badge className="bg-gray-600">{tier}</Badge>;
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
            <TableRow key={song.id} className={index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'}>
              <TableCell className="text-center font-bold">{index + 1}</TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {song.icon && (
                    <div className="w-8 h-8 rounded overflow-hidden bg-gray-800 flex items-center justify-center">
                      {typeof song.icon === 'string' ? song.icon : '🎵'}
                    </div>
                  )}
                  <div>
                    <div>{song.title}</div>
                    <div className="text-xs text-gray-400">
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
              <TableCell className="font-mono">
                {formatNumber(song.streams)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
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
            <TableRow key={album.id} className={index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'}>
              <TableCell className="text-center font-bold">{index + 1}</TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {album.coverArt && (
                    <div className="w-10 h-10 rounded overflow-hidden">
                      <img 
                        src={album.coverArt} 
                        alt={`${album.title} cover`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div>{album.title}</div>
                    <div className="text-xs text-gray-400">
                      {album.description || album.type}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={
                  album.type === 'studio' ? 'bg-blue-600' :
                  album.type === 'mixtape' ? 'bg-purple-600' :
                  album.type === 'deluxe' ? 'bg-pink-600' :
                  album.type === 'remix' ? 'bg-green-600' :
                  album.type === 'collaborative' ? 'bg-orange-600' :
                  'bg-gray-600'
                }>
                  {album.type.charAt(0).toUpperCase() + album.type.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{album.songIds?.length || 0}</TableCell>
              <TableCell className="font-mono">
                {formatNumber(album.streams)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
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
    <Card className="bg-black bg-opacity-80 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Released Music
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="songs" className="flex items-center gap-1">
              <Music className="h-4 w-4" />
              Songs ({sortedSongs.length})
            </TabsTrigger>
            <TabsTrigger value="albums" className="flex items-center gap-1">
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