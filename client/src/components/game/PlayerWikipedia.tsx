import React, { useState } from 'react';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { 
  Menu, Music, Users, TrendingUp, Calendar, Star, Trophy
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

// A simple function to format month name from a week number
const getMonthFromWeek = (week: number): string => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthIndex = Math.floor((week % 52) / 4.33) % 12;
  return monthNames[monthIndex];
};

export function PlayerWikipedia() {
  const gameState = useRapperGame();
  const [activeSection, setActiveSection] = useState<'main' | 'discography' | 'career' | 'references'>('main');
  
  // Safe destructuring with fallbacks
  const { 
    character = {}, 
    currentWeek = 1, 
    currentYear = 2024,
    stats = {}, 
    songs = [], 
    albums = [], 
    socialMediaStats = {}, 
    streamingPlatforms = []
  } = gameState || {};
  
  // Calculate total career stats  
  const safeSongs = Array.isArray(songs) ? songs : [];
  const safeAlbums = Array.isArray(albums) ? albums : [];
  
  // Calculate release stats
  const totalSongs = safeSongs.filter(song => song.released)?.length || 0;
  const totalAlbums = safeAlbums.filter(album => album.released)?.length || 0;
  
  // Streaming stats
  const totalStreams = safeSongs.reduce((total, song) => {
    const streamCount = typeof song.streams === 'number' ? song.streams : 0;
    return total + streamCount;
  }, 0);
  
  // Calculate total followers
  const calculateTotalFollowers = () => {
    let total = 0;
    if (socialMediaStats?.twitter?.followers) total += socialMediaStats.twitter.followers;
    if (socialMediaStats?.instagram?.followers) total += socialMediaStats.instagram.followers;
    if (socialMediaStats?.tiktok?.followers) total += socialMediaStats.tiktok.followers;
    return total;
  };
  const totalFollowers = calculateTotalFollowers();

  // Calculate monthly listeners
  const calculateMonthlyListeners = () => {
    let total = 0;
    if (streamingPlatforms && Array.isArray(streamingPlatforms)) {
      streamingPlatforms.forEach(platform => {
        const listeners = platform.listeners || 0;
        total += listeners;
      });
    }
    return total;
  };
  const monthlyListeners = calculateMonthlyListeners();

  // Find most successful song and album
  const mostSuccessfulSong = safeSongs.length > 0 
    ? [...safeSongs].filter(s => s.released).sort((a, b) => {
        const aStreams = typeof a.streams === 'number' ? a.streams : 0;
        const bStreams = typeof b.streams === 'number' ? b.streams : 0;
        return bStreams - aStreams;
      })[0] || null
    : null;
    
  const mostSuccessfulAlbum = safeAlbums.length > 0
    ? [...safeAlbums].filter(a => a.released).sort((a, b) => {
        const aStreams = typeof a.streams === 'number' ? a.streams : 0;
        const bStreams = typeof b.streams === 'number' ? b.streams : 0;
        return bStreams - aStreams;
      })[0] || null
    : null;
    
  // Career details
  const careerStart = currentYear - Math.floor(currentWeek / 52);
  const careerStartYear = careerStart;
  const careerLength = Math.max(1, Math.floor(currentWeek / 52));
  const artistName = character?.artistName || 'Unknown Artist';
  const artistBirthYear = careerStartYear - 20; // Assuming artist starts at age 20
  const artistBirthDate = `${getMonthFromWeek(1)} ${artistBirthYear}`;
  const careerStartDate = `${getMonthFromWeek(1)} ${careerStartYear}`;
  const artistHometown = character?.hometown || 'Unknown';
  
  // Table of contents sections
  const tocSections = [
    { id: 'main', label: 'Overview' },
    { id: 'discography', label: 'Discography' },
    { id: 'career', label: 'Career' },
    { id: 'references', label: 'References' }
  ];
  
  return (
    <div className="bg-[#f8f9fa] text-[#202122] overflow-y-auto max-h-[calc(100vh-60px)] border border-gray-300 rounded">
      {/* Wikipedia Header */}
      <div className="bg-white border-b border-gray-300 p-2 flex flex-wrap items-center">
        <div className="mr-4">
          <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 230 230">
            <path d="M115 0C51.536 0 0 51.536 0 115c0 63.464 51.536 115 115 115 63.464 0 115-51.536 115-115C230 51.536 178.463 0 115 0zm79.878 56.715l-16.9 16.9a4 4 0 0 1-5.657 0l-11.975-11.975a4 4 0 0 1 0-5.657l16.9-16.9a58.908 58.908 0 0 1 17.632 17.632zm-45.446 40.194c-.333 3.013-1.022 5.489-2.116 7.472-1.094 1.984-2.583 3.548-4.52 4.822-1.93 1.258-4.071 2.206-6.422 2.776-2.344.57-4.95.842-7.832.842-2.761 0-5.292-.263-7.619-.766-2.328-.504-4.483-1.258-6.422-2.221-1.947-.97-3.665-2.129-5.117-3.532-1.452-1.404-2.712-2.974-3.785-4.747h-.164v26.868h-16.492V57.535h16.492v8.643h.164c.84-1.36 1.947-2.682 3.333-3.971 1.38-1.289 2.998-2.43 4.854-3.366 1.848-.937 3.873-1.683 6.06-2.221 2.188-.546 4.549-.809 7.106-.809 5.326 0 9.982.937 13.972 2.842 3.989 1.905 7.307 4.467 9.962 7.719 2.653 3.252 4.638 7.057 5.975 11.447 1.346 4.39 2.019 9.04 2.019 13.972 0 4.298-.377 8.5-1.106 12.604zm31.621 45.841l-16.899-16.9a4 4 0 0 1 0-5.657l10.606-10.606a4 4 0 0 1 5.657 0l16.9 16.9a58.913 58.913 0 0 1-16.264 16.263zm18.658-31.326l-16.9 16.9a4 4 0 0 1-5.657 0L165.18 116.348a4 4 0 0 1 0-5.657l16.9-16.9a59.158 59.158 0 0 1 1.903 15.94c0 1.38-.076 2.743-.193 4.098l16.921-16.921a58.903 58.903 0 0 1-1.1 14.516z"/>
          </svg>
        </div>
        <div className="mr-4">
          <div className="text-[10px] text-gray-500">From Wikipedia, the free encyclopedia</div>
          <div className="text-2xl font-serif">{artistName}</div>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center text-xs text-blue-600 space-x-4">
          <a href="#" className="hover:underline">Article</a>
          <a href="#" className="hover:underline">Talk</a>
          <div className="h-4 border-l border-gray-300"></div>
          <a href="#" className="hover:underline">Read</a>
          <a href="#" className="hover:underline">Edit</a>
          <a href="#" className="hover:underline">View history</a>
          <div className="h-4 border-l border-gray-300"></div>
          <div className="w-5 h-5 flex items-center justify-center">
            <Menu className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-40 shrink-0 p-3 text-sm border-r border-gray-300">
          <div className="mb-4">
            <div className="font-bold mb-1">Navigation</div>
            <ul className="space-y-1 text-[13px] text-blue-600">
              <li><a href="#" className="hover:underline">Main page</a></li>
              <li><a href="#" className="hover:underline">Contents</a></li>
              <li><a href="#" className="hover:underline">Current events</a></li>
              <li><a href="#" className="hover:underline">Random article</a></li>
              <li><a href="#" className="hover:underline">About Wikipedia</a></li>
            </ul>
          </div>
          
          <div className="mb-4">
            <div className="font-bold mb-1">Contribute</div>
            <ul className="space-y-1 text-[13px] text-blue-600">
              <li><a href="#" className="hover:underline">Help</a></li>
              <li><a href="#" className="hover:underline">Learn to edit</a></li>
              <li><a href="#" className="hover:underline">Community portal</a></li>
              <li><a href="#" className="hover:underline">Recent changes</a></li>
            </ul>
          </div>
          
          <div className="mb-4">
            <div className="font-bold mb-1">Tools</div>
            <ul className="space-y-1 text-[13px] text-blue-600">
              <li><a href="#" className="hover:underline">What links here</a></li>
              <li><a href="#" className="hover:underline">Special pages</a></li>
              <li><a href="#" className="hover:underline">Permanent link</a></li>
              <li><a href="#" className="hover:underline">Page information</a></li>
              <li><a href="#" className="hover:underline">Cite this page</a></li>
            </ul>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="flex-1 p-4">
          {/* Article Header */}
          <div className="border-b border-gray-300 pb-2 mb-4">
            <h1 className="text-3xl font-serif">{artistName}</h1>
          </div>
          
          {/* Article Main Content */}
          <div className="flex flex-col md:flex-row">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Lead Paragraph */}
              <p className="text-[15px] mb-4 font-serif">
                <b>{artistName}</b> (born {artistBirthDate}) is an American rapper, songwriter, and record producer.
                {totalSongs > 0 && ` Known for hits like "${mostSuccessfulSong?.title || 'Unknown'}", ${artistName} has released ${totalSongs} songs and ${totalAlbums} albums since ${careerStartDate}.`}
                {totalStreams > 0 && ` ${artistName}'s music has accumulated over ${formatNumber(totalStreams)} streams across all platforms.`}
              </p>
              
              {/* Table of Contents */}
              <div className="border border-gray-300 bg-[#f8f9fa] p-3 mb-4 inline-block">
                <div className="font-bold text-sm mb-2">Contents</div>
                <ol className="list-none pl-0 text-[13px]">
                  {tocSections.map((section, index) => (
                    <li key={section.id} className="mb-1">
                      <span className="inline-block w-6 text-right pr-1">{index + 1}</span>
                      <button 
                        onClick={() => setActiveSection(section.id as any)}
                        className={`text-blue-600 hover:underline ${activeSection === section.id ? 'font-bold' : ''}`}
                      >
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              
              {/* Section content based on activeSection */}
              {activeSection === 'main' && (
                <div>
                  <h2 className="text-xl font-serif border-b border-gray-300 pb-1 mb-3">Early life</h2>
                  <p className="mb-3 text-[15px]">
                    {artistName} was born on {artistBirthDate} in {artistHometown}. 
                    {character?.bio ? ` ${character.bio}` : ` Before beginning a career in music, ${artistName} worked various jobs to support the dream of becoming a successful artist.`}
                  </p>
                  
                  <h2 className="text-xl font-serif border-b border-gray-300 pb-1 mb-3">Career</h2>
                  <p className="mb-3 text-[15px]">
                    {artistName} began a professional music career in {careerStartDate}. 
                    {totalSongs > 0 
                      ? ` To date, ${artistName} has released ${totalSongs} songs and ${totalAlbums} albums.` 
                      : ` ${artistName} is currently working on debut music.`
                    }
                    {mostSuccessfulSong && ` The most successful song to date is "${mostSuccessfulSong.title}" with ${formatNumber(mostSuccessfulSong.streams || 0)} streams.`}
                  </p>
                  
                  <h2 className="text-xl font-serif border-b border-gray-300 pb-1 mb-3">Musical style and influences</h2>
                  <p className="mb-3 text-[15px]">
                    {artistName} is known for a unique style that blends traditional hip-hop elements with innovative production techniques.
                    Critics have noted the distinctive flow and lyrical content that addresses contemporary social issues while maintaining commercial appeal.
                  </p>
                </div>
              )}
              
              {activeSection === 'discography' && (
                <div>
                  <h2 className="text-xl font-serif border-b border-gray-300 pb-1 mb-3">Discography</h2>
                  
                  {safeAlbums.filter(album => album.released).length > 0 ? (
                    <div className="mb-4">
                      <h3 className="text-lg font-serif mb-2">Albums</h3>
                      <ul className="list-disc pl-5 text-[15px]">
                        {safeAlbums
                          .filter(album => album.released)
                          .map(album => (
                            <li key={album.id} className="mb-1">
                              <i>{album.title}</i> ({album.releaseDate ? getMonthFromWeek(album.releaseDate) + " " + careerStartYear : "Unknown date"})
                              {album.songIds && ` - ${album.songIds.length} tracks`}
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  ) : (
                    <p className="italic text-[15px] mb-3">No albums have been released yet.</p>
                  )}
                  
                  {safeSongs.filter(song => song.released).length > 0 ? (
                    <div>
                      <h3 className="text-lg font-serif mb-2">Singles</h3>
                      <ul className="list-disc pl-5 text-[15px]">
                        {safeSongs
                          .filter(song => song.released)
                          .sort((a, b) => (b.releaseDate || 0) - (a.releaseDate || 0))
                          .map(song => (
                            <li key={song.id} className="mb-1">
                              "{song.title}" ({song.releaseDate ? getMonthFromWeek(song.releaseDate) + " " + careerStartYear : "Unknown date"})
                              {song.streams ? ` - ${formatNumber(song.streams)} streams` : ""}
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  ) : (
                    <p className="italic text-[15px]">No singles have been released yet.</p>
                  )}
                </div>
              )}
              
              {activeSection === 'career' && (
                <div>
                  <h2 className="text-xl font-serif border-b border-gray-300 pb-1 mb-3">Career highlights</h2>
                  <p className="mb-3 text-[15px]">
                    Since beginning a music career in {careerStartDate}, {artistName} has achieved significant milestones in the industry.
                  </p>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-serif mb-2">Streaming success</h3>
                    <p className="text-[15px] mb-2">
                      {artistName} has accumulated {formatNumber(totalStreams)} total streams across all platforms, with {formatNumber(monthlyListeners)} monthly listeners.
                    </p>
                    {mostSuccessfulSong && (
                      <p className="text-[15px] mb-2">
                        Most popular song: <b>"{mostSuccessfulSong.title}"</b> with {formatNumber(mostSuccessfulSong.streams || 0)} streams.
                      </p>
                    )}
                    {stats?.chartPosition && (
                      <p className="text-[15px] mb-2">
                        Current chart position: <b>#{stats.chartPosition}</b> on Billboard charts.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-serif mb-2">Social media presence</h3>
                    <p className="text-[15px]">
                      {artistName} maintains an active social media presence with {formatNumber(totalFollowers)} total followers across platforms.
                      This strong online presence has helped build a dedicated fanbase and promotes new music releases effectively.
                    </p>
                  </div>
                </div>
              )}
              
              {activeSection === 'references' && (
                <div>
                  <h2 className="text-xl font-serif border-b border-gray-300 pb-1 mb-3">References</h2>
                  <ol className="list-decimal pl-8 text-[13px]">
                    <li className="mb-2">
                      "Artist Profile: {artistName}". <i>Billboard Magazine</i>. Retrieved {getMonthFromWeek(currentWeek)} {currentYear}.
                    </li>
                    <li className="mb-2">
                      "The Rise of {artistName}". <i>Rolling Stone</i>. {getMonthFromWeek(Math.max(1, currentWeek - 26))} {currentYear}. p. 45.
                    </li>
                    <li className="mb-2">
                      Smith, John. "{artistName}'s Impact on Modern Hip-Hop". <i>XXL Magazine</i>. Retrieved {getMonthFromWeek(currentWeek)} {currentYear}.
                    </li>
                    <li className="mb-2">
                      "Streaming Numbers Analysis: Q{Math.floor((currentWeek % 52) / 13) + 1} {currentYear}". <i>Music Industry Quarterly</i>. {currentYear}.
                    </li>
                  </ol>
                </div>
              )}
            </div>
            
            {/* Info Box */}
            <div className="md:w-72 shrink-0 md:ml-4 mt-4 md:mt-0">
              <div className="border border-gray-300 bg-[#f8f9fa]">
                <div className="bg-[#dcdcdc] border-b border-gray-300 p-2 font-serif text-center font-bold">
                  {artistName}
                  <div className="flex justify-center items-center mt-1">
                    {stats?.chartPosition ? (
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-orange-500" />
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">{stats.chartPosition}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                
                <div className="p-2">
                  {/* Artist Image */}
                  <div className="bg-gray-200 h-64 w-full flex items-center justify-center mb-2">
                    {character?.image ? (
                      <img src={character.image} alt={artistName} className="max-w-full max-h-full" />
                    ) : (
                      <Music className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Artist Info Table */}
                  <table className="w-full text-[13px] mb-2">
                    <tbody>
                      <tr>
                        <th className="text-left font-bold align-top pr-2 py-1">Born</th>
                        <td className="py-1">{artistBirthDate}</td>
                      </tr>
                      <tr>
                        <th className="text-left font-bold align-top pr-2 py-1">Origin</th>
                        <td className="py-1">{artistHometown}</td>
                      </tr>
                      <tr>
                        <th className="text-left font-bold align-top pr-2 py-1">Genres</th>
                        <td className="py-1">Hip hop, Rap</td>
                      </tr>
                      <tr>
                        <th className="text-left font-bold align-top pr-2 py-1">Years active</th>
                        <td className="py-1">{careerStartYear}–present</td>
                      </tr>
                      {stats?.chartPosition && (
                        <tr>
                          <th className="text-left font-bold align-top pr-2 py-1">Chart ranking</th>
                          <td className="py-1">
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-orange-500" />
                              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">{stats.chartPosition}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <th className="text-left font-bold align-top pr-2 py-1">Total streams</th>
                        <td className="py-1">{formatNumber(totalStreams)}</td>
                      </tr>
                      <tr>
                        <th className="text-left font-bold align-top pr-2 py-1">Monthly listeners</th>
                        <td className="py-1">{formatNumber(monthlyListeners)}</td>
                      </tr>
                      <tr>
                        <th className="text-left font-bold align-top pr-2 py-1">Social followers</th>
                        <td className="py-1">{formatNumber(totalFollowers)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}