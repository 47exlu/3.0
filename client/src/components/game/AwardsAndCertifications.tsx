import React, { useState } from 'react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { Award, SongCertification } from '../../lib/types';
import { formatNumber } from '../../lib/utils';

const AwardsAndCertifications: React.FC = () => {
  const { songs, albums, awards, nominations } = useRapperGame();
  const [activeTab, setActiveTab] = useState<'awards' | 'certifications'>('awards');

  // Get all certified songs
  const certifiedSongs = songs.filter(song => song.certifications && song.certifications.length > 0);
  
  // Get all certified albums
  const certifiedAlbums = albums?.filter(album => album.certifications && album.certifications.length > 0) || [];

  // Format award category for display
  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Award badge component
  const AwardBadge: React.FC<{ award: Award }> = ({ award }) => {
    const badgeColor = 
      award.type === 'grammy' ? 'bg-yellow-500' :
      award.type === 'bet' ? 'bg-blue-500' : 
      award.type === 'vma' ? 'bg-red-500' : 
      'bg-purple-500';
    
    return (
      <div className="relative mb-4 bg-black border border-gray-800 rounded-lg p-4 transition-all hover:border-gray-600">
        <div className={`absolute top-0 right-0 ${badgeColor} text-white text-xs px-2 py-1 rounded-bl rounded-tr font-bold`}>
          {award.type.toUpperCase()}
        </div>
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badgeColor} mr-4`}>
            <span className="text-white text-2xl">🏆</span>
          </div>
          <div>
            <h3 className="font-bold text-white">{formatCategory(award.category)}</h3>
            <p className="text-gray-400 text-sm">{award.name}</p>
            <div className="mt-1">
              <span className={`px-2 py-0.5 rounded text-xs ${award.isWinner ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {award.isWinner ? 'Winner' : 'Nominee'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Certification badge component
  const CertificationBadge: React.FC<{ 
    title: string, 
    certification: SongCertification, 
    streams: number,
    week: number 
  }> = ({ title, certification, streams, week }) => {
    const certColor = {
      'gold': 'bg-yellow-500',
      'platinum': 'bg-gray-300',
      '2xPlatinum': 'bg-gray-300',
      '3xPlatinum': 'bg-gray-300',
      '4xPlatinum': 'bg-gray-300',
      '5xPlatinum': 'bg-gray-300',
      'diamond': 'bg-blue-400',
    }[certification.type] || 'bg-gray-500';
    
    const certName = {
      'gold': 'Gold',
      'platinum': 'Platinum',
      '2xPlatinum': '2× Platinum',
      '3xPlatinum': '3× Platinum',
      '4xPlatinum': '4× Platinum',
      '5xPlatinum': '5× Platinum',
      'diamond': 'Diamond',
    }[certification.type] || certification.type;
    
    return (
      <div className="relative mb-4 bg-black border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-all">
        <div className={`absolute top-0 right-0 ${certColor} text-white text-xs px-2 py-1 rounded-bl rounded-tr font-bold`}>
          {certName}
        </div>
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${certColor} mr-4`}>
            <span className="text-white text-xl">💿</span>
          </div>
          <div>
            <h3 className="font-bold text-white truncate max-w-[200px]">{title}</h3>
            <p className="text-gray-400 text-sm">{formatNumber(streams)} streams</p>
            <p className="text-gray-500 text-xs mt-1">Awarded on week {certification.dateAwarded}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Awards & Certifications</h1>
      
      {/* Tabs */}
      <div className="flex mb-6 bg-gray-900 rounded-lg p-1">
        <button 
          onClick={() => setActiveTab('awards')} 
          className={`flex-1 py-2 rounded-lg ${activeTab === 'awards' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
        >
          Awards
        </button>
        <button 
          onClick={() => setActiveTab('certifications')} 
          className={`flex-1 py-2 rounded-lg ${activeTab === 'certifications' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
        >
          Certifications
        </button>
      </div>
      
      {/* Awards content */}
      {activeTab === 'awards' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Awards</h2>
          
          {awards && awards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awards.map(award => (
                <AwardBadge key={award.id} award={award} />
              ))}
            </div>
          ) : (
            <div className="bg-black/30 rounded-lg p-6 text-center">
              <p className="text-gray-400">You haven't won any awards yet. Keep creating great music!</p>
            </div>
          )}
          
          <h2 className="text-xl font-bold mt-8 mb-4">Your Nominations</h2>
          
          {nominations && nominations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nominations.map(nomination => (
                <AwardBadge key={nomination.id} award={nomination} />
              ))}
            </div>
          ) : (
            <div className="bg-black/30 rounded-lg p-6 text-center">
              <p className="text-gray-400">No nominations yet. Keep releasing music to get noticed by award committees.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Certifications content */}
      {activeTab === 'certifications' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Certified Songs</h2>
          
          {certifiedSongs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifiedSongs.flatMap(song => 
                song.certifications?.map(cert => (
                  <CertificationBadge 
                    key={cert.id} 
                    title={song.title} 
                    certification={cert} 
                    streams={song.streams}
                    week={cert.dateAwarded}
                  />
                )) || []
              )}
            </div>
          ) : (
            <div className="bg-black/30 rounded-lg p-6 text-center">
              <p className="text-gray-400">You don't have any certified songs yet. Keep promoting your music!</p>
              <p className="text-gray-500 text-sm mt-2">Songs need 500,000 streams for Gold certification.</p>
            </div>
          )}
          
          <h2 className="text-xl font-bold mt-8 mb-4">Certified Albums</h2>
          
          {certifiedAlbums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifiedAlbums.flatMap(album => 
                album.certifications?.map(cert => (
                  <CertificationBadge 
                    key={cert.id} 
                    title={album.title} 
                    certification={cert} 
                    streams={album.streams}
                    week={cert.dateAwarded}
                  />
                )) || []
              )}
            </div>
          ) : (
            <div className="bg-black/30 rounded-lg p-6 text-center">
              <p className="text-gray-400">You don't have any certified albums yet. Keep creating and promoting albums!</p>
              <p className="text-gray-500 text-sm mt-2">Albums need 500,000 streams for Gold certification.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AwardsAndCertifications;