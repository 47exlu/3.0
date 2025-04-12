import React, { useState } from 'react';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { Award, AwardType, CertificationType, Song, SongCertification } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

// Define certification thresholds
const CERTIFICATION_THRESHOLDS = {
  gold: 500000, // 500k streams
  platinum: 1000000, // 1M streams
  '2xPlatinum': 2000000, // 2M streams
  '3xPlatinum': 3000000, // 3M streams
  '4xPlatinum': 4000000, // 4M streams
  '5xPlatinum': 5000000, // 5M streams
  diamond: 10000000, // 10M streams
};

// Award display names
const AWARD_TYPE_NAMES: Record<AwardType, string> = {
  grammy: 'Grammy Awards',
  bet: 'BET Awards',
  vma: 'Video Music Awards',
  ama: 'American Music Awards',
  billboard: 'Billboard Music Awards',
  iheartradio: 'iHeartRadio Music Awards',
  apollo: 'Apollo Theater Awards',
  worldstar: 'WorldStar Hip Hop Awards',
};

// Award icons (emojis for simplicity, could be replaced with actual icons)
const AWARD_TYPE_ICONS: Record<AwardType, string> = {
  grammy: '🏆',
  bet: '🎭',
  vma: '📺',
  ama: '🎵',
  billboard: '📊',
  iheartradio: '📻',
  apollo: '🎤',
  worldstar: '⭐',
};

// Certification display names
const CERTIFICATION_NAMES: Record<CertificationType, string> = {
  gold: 'Gold',
  platinum: 'Platinum',
  '2xPlatinum': '2x Platinum',
  '3xPlatinum': '3x Platinum',
  '4xPlatinum': '4x Platinum',
  '5xPlatinum': '5x Platinum',
  diamond: 'Diamond',
};

// Certification icons/colors
const CERTIFICATION_COLORS: Record<CertificationType, string> = {
  gold: 'bg-yellow-500',
  platinum: 'bg-gray-300',
  '2xPlatinum': 'bg-gray-400',
  '3xPlatinum': 'bg-gray-400',
  '4xPlatinum': 'bg-gray-500',
  '5xPlatinum': 'bg-gray-600',
  diamond: 'bg-blue-300',
};

// Record type to organize awards by type/year
type AwardsByYear = Record<number, Award[]>;
type AwardsByType = Record<AwardType, AwardsByYear>;

// Helper function to group awards by type and year
const groupAwardsByTypeAndYear = (awards: Award[]): AwardsByType => {
  // Create initial structure with all award types as empty objects
  const grouped: AwardsByType = {
    grammy: {},
    bet: {},
    vma: {},
    ama: {},
    billboard: {},
    iheartradio: {},
    apollo: {},
    worldstar: {}
  };
  
  // Group awards by type and year
  awards.forEach(award => {
    if (!grouped[award.type][award.year]) {
      grouped[award.type][award.year] = [];
    }
    
    grouped[award.type][award.year].push(award);
  });
  
  return grouped;
};

const AwardsAndCertifications: React.FC = () => {
  const { songs, albums, awards, updateGameState } = useRapperGame();
  const [activeTab, setActiveTab] = useState<'awards' | 'certifications'>('awards');
  
  // Helper function to add a test certification (for testing only)
  const addTestCertification = () => {
    if (!songs || songs.length === 0) return;
    
    // Find a song with over 500,000 streams 
    const eligibleSong = songs.find(song => song.streams >= 500000 && (!song.certifications || song.certifications.length === 0));
    
    if (eligibleSong) {
      // Create a new certification
      const newCertification: SongCertification = {
        id: `cert_${Date.now()}`,
        type: 'gold',
        streams: eligibleSong.streams,
        dateAwarded: 0, // Current week
        issuingOrganization: 'RIAA'
      };
      
      // Update the song with the new certification
      const updatedSongs = songs.map(song => {
        if (song.id === eligibleSong.id) {
          const songCertifications = song.certifications || [];
          return {
            ...song,
            certifications: [...songCertifications, newCertification]
          };
        }
        return song;
      });
      
      // Update game state
      updateGameState?.({ songs: updatedSongs });
    }
  };
  
  // Group awards by type and year for better organization
  const awardsByTypeAndYear = awards ? groupAwardsByTypeAndYear(awards) : {
    grammy: {}, bet: {}, vma: {}, ama: {}, billboard: {}, 
    iheartradio: {}, apollo: {}, worldstar: {}
  };
  
  // Filter songs with certifications
  const songsWithCertifications = songs.filter(song => 
    song.certifications && song.certifications.length > 0
  );
  
  // Calculate total awards
  const totalAwards = awards ? awards.length : 0;
  const totalWonAwards = awards ? awards.filter(award => award.isWinner).length : 0;
  const totalCertifications = songsWithCertifications.reduce(
    (count, song) => count + (song.certifications?.length || 0), 
    0
  );
  
  return (
    <div className="awards-certifications-container p-4 h-full overflow-y-auto text-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
          Awards & Certifications
        </h1>
        <p className="text-gray-300 mb-6">
          Your musical achievements and industry recognition
        </p>
        
        {/* Stats overview */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-300">Total Awards</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              {totalAwards}
            </p>
            <p className="text-sm text-gray-400">{totalWonAwards} wins</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-300">Certifications</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-gray-400 to-blue-300 bg-clip-text text-transparent">
              {totalCertifications}
            </p>
            <p className="text-sm text-gray-400">across {songsWithCertifications.length} songs</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-300">Highest Cert</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {getHighestCertification(songsWithCertifications)}
            </p>
            <p className="text-sm text-gray-400">achievement level</p>
          </div>
        </div>
      </div>
      
      {/* Tabs for awards and certifications */}
      <div className="flex justify-between items-center mb-6">
        <div className="tabs flex border-b border-gray-700">
          <button
            className={`tab px-6 py-2 text-lg font-medium ${
              activeTab === 'awards' 
                ? 'text-yellow-400 border-b-2 border-yellow-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('awards')}
          >
            Awards
          </button>
          <button
            className={`tab px-6 py-2 text-lg font-medium ${
              activeTab === 'certifications' 
                ? 'text-yellow-400 border-b-2 border-yellow-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('certifications')}
          >
            Certifications
          </button>
        </div>
        <button
          className="px-3 py-1 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-md hover:from-yellow-600 hover:to-yellow-700 transition"
          onClick={addTestCertification}
        >
          Certify Eligible Song
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="tab-content">
        {activeTab === 'awards' ? (
          <AwardsSection awards={awards || []} awardsByTypeAndYear={awardsByTypeAndYear} />
        ) : (
          <CertificationsSection songs={songsWithCertifications} />
        )}
      </div>
    </div>
  );
};

// Component to display the awards section
const AwardsSection: React.FC<{ 
  awards: Award[], 
  awardsByTypeAndYear: {
    grammy: Record<number, Award[]>;
    bet: Record<number, Award[]>;
    vma: Record<number, Award[]>;
    ama: Record<number, Award[]>;
    billboard: Record<number, Award[]>;
    iheartradio: Record<number, Award[]>;
    apollo: Record<number, Award[]>;
    worldstar: Record<number, Award[]>;
  } 
}> = ({ 
  awards, 
  awardsByTypeAndYear 
}) => {
  if (awards.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-medium text-gray-300 mb-2">No Awards Yet</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Keep releasing hit songs, attending industry events, and growing your reputation to be nominated for music awards.
        </p>
      </div>
    );
  }
  
  return (
    <div className="awards-grid">
      {Object.entries(awardsByTypeAndYear).map(([awardType, yearGroups]) => {
        const awardsForType = Object.values(yearGroups).flat();
        if (awardsForType.length === 0) return null;
        
        return (
          <div key={awardType} className="award-type-section mb-8">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">{AWARD_TYPE_ICONS[awardType as AwardType]}</span>
              <h2 className="text-xl font-bold text-gray-200">
                {AWARD_TYPE_NAMES[awardType as AwardType]}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(yearGroups).map(([year, awardsInYear]) => (
                <div key={year} className="bg-gray-800/50 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">
                    {year} {AWARD_TYPE_NAMES[awardType as AwardType]}
                  </h3>
                  
                  <ul className="space-y-2">
                    {awardsInYear.map(award => (
                      <li 
                        key={award.id} 
                        className={`p-2 rounded ${
                          award.isWinner 
                            ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-700/30 border-l-4 border-yellow-500' 
                            : 'bg-gray-700/30'
                        }`}
                      >
                        <div className="flex items-center">
                          {award.isWinner && (
                            <span className="text-yellow-500 mr-2">🏆</span>
                          )}
                          <div>
                            <p className="font-medium text-gray-200">
                              {award.category.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </p>
                            {award.songId && (
                              <p className="text-sm text-gray-400">
                                {getEntityName(award.songId, 'song')}
                              </p>
                            )}
                            {award.albumId && (
                              <p className="text-sm text-gray-400">
                                {getEntityName(award.albumId, 'album')}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Component to display the certifications section
const CertificationsSection: React.FC<{ songs: Song[] }> = ({ songs }) => {
  if (songs.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">💿</div>
        <h3 className="text-xl font-medium text-gray-300 mb-2">No Certified Songs Yet</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Songs need to reach specific streaming milestones to earn certifications. Keep promoting your music to achieve gold, platinum, and diamond status.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {songs.map(song => (
        <div key={song.id} className="bg-gray-800/50 rounded-lg overflow-hidden shadow">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-white">{song.title}</h3>
              <div className="text-sm text-gray-400">
                {formatNumber(song.streams)} streams
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {song.certifications?.map(cert => (
                <div 
                  key={cert.id} 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${CERTIFICATION_COLORS[cert.type]} text-black flex items-center`}
                >
                  {cert.type === 'diamond' ? '💎' : '🏅'} 
                  {CERTIFICATION_NAMES[cert.type]}
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                <span className="font-medium">Latest certification:</span> {getLatestCertification(song)} 
                ({song.certifications ? formatNumber(song.certifications[song.certifications.length - 1]?.streams || 0) : 0} streams)
              </div>
              
              {/* Streams progress bar to next certification */}
              <div className="mt-2">
                <div className="relative">
                  <div className="text-xs text-gray-400 flex justify-between mb-1">
                    <span>Current: {getLatestCertification(song)}</span>
                    <span>Next: {getNextCertification(song)}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                      style={{ width: `${getProgressToNextCertification(song)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to get entity name (song or album)
function getEntityName(id: string, type: 'song' | 'album'): string {
  const { songs, albums } = useRapperGame();
  
  if (type === 'song') {
    const song = songs.find(s => s.id === id);
    return song ? song.title : 'Unknown Song';
  } else {
    const album = albums?.find(a => a.id === id);
    return album ? album.title : 'Unknown Album';
  }
}

// Helper function to get the highest certification a song has
function getLatestCertification(song: Song): string {
  if (!song.certifications || song.certifications.length === 0) {
    return 'None';
  }
  
  // Sort by streams to get the highest certification
  const highestCert = [...song.certifications].sort((a, b) => b.streams - a.streams)[0];
  return CERTIFICATION_NAMES[highestCert.type];
}

// Helper function to get the next certification level
function getNextCertification(song: Song): string {
  if (!song.certifications || song.certifications.length === 0) {
    return 'Gold';
  }
  
  // Get the highest certification type
  const highestCert = [...song.certifications].sort((a, b) => b.streams - a.streams)[0].type;
  
  // Determine the next certification level
  const certLevels: CertificationType[] = [
    'gold', 'platinum', '2xPlatinum', '3xPlatinum', '4xPlatinum', '5xPlatinum', 'diamond'
  ];
  
  const currentIndex = certLevels.indexOf(highestCert);
  if (currentIndex === certLevels.length - 1) {
    return 'Max Achieved';
  }
  
  return CERTIFICATION_NAMES[certLevels[currentIndex + 1]];
}

// Helper function to calculate progress percentage to next certification
function getProgressToNextCertification(song: Song): number {
  if (!song.certifications || song.certifications.length === 0) {
    // Progress from 0 to gold
    return Math.min(100, (song.streams / CERTIFICATION_THRESHOLDS.gold) * 100);
  }
  
  // Get the highest certification type
  const highestCert = [...song.certifications].sort((a, b) => b.streams - a.streams)[0].type;
  
  // Determine the next certification level
  const certLevels: CertificationType[] = [
    'gold', 'platinum', '2xPlatinum', '3xPlatinum', '4xPlatinum', '5xPlatinum', 'diamond'
  ];
  
  const currentIndex = certLevels.indexOf(highestCert);
  if (currentIndex === certLevels.length - 1) {
    return 100; // Already at the highest level
  }
  
  const nextCertType = certLevels[currentIndex + 1];
  const currentThreshold = CERTIFICATION_THRESHOLDS[highestCert];
  const nextThreshold = CERTIFICATION_THRESHOLDS[nextCertType];
  
  // Calculate progress percentage
  const progressRange = nextThreshold - currentThreshold;
  const currentProgress = song.streams - currentThreshold;
  return Math.min(100, (currentProgress / progressRange) * 100);
}

// Helper function to get the highest certification across all songs
function getHighestCertification(songs: Song[]): string {
  if (songs.length === 0) {
    return 'None';
  }
  
  const certLevels: CertificationType[] = [
    'gold', 'platinum', '2xPlatinum', '3xPlatinum', '4xPlatinum', '5xPlatinum', 'diamond'
  ];
  
  let highestCertIndex = -1;
  
  songs.forEach(song => {
    if (song.certifications && song.certifications.length > 0) {
      song.certifications.forEach(cert => {
        const certIndex = certLevels.indexOf(cert.type);
        if (certIndex > highestCertIndex) {
          highestCertIndex = certIndex;
        }
      });
    }
  });
  
  return highestCertIndex >= 0 ? CERTIFICATION_NAMES[certLevels[highestCertIndex]] : 'None';
}

export default AwardsAndCertifications;