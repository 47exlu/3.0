import React, { useState, useEffect } from 'react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { NewsArticle, NewsCategory } from '../../lib/types';
import { useAudio } from '../../lib/stores/useAudio';

const MusicNews: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [filter, setFilter] = useState<NewsCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Game state
  const gameState = useRapperGame();
  const newsArticles = gameState.newsArticles || [];
  const isSubscribed = gameState.subscriptionInfo.isSubscribed;
  const currentWeek = gameState.currentWeek;
  const currentYear = gameState.currentYear;
  
  // Audio effects
  const audioState = useAudio();
  const playClick = () => audioState.playSound('/sounds/click.mp3');
  
  // Mark all articles as read when component mounts
  useEffect(() => {
    if (gameState.unreadNewsCount && gameState.unreadNewsCount > 0 && gameState.updateGameState) {
      gameState.updateGameState({
        unreadNewsCount: 0
      });
    }
  }, []);
  
  // Filter articles based on category and search term
  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = filter === 'all' || article.category === filter;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Handle article selection
  const handleSelectArticle = (article: NewsArticle) => {
    playClick();
    
    // Check if premium article and user isn't subscribed
    if (article.isPremium && !isSubscribed) {
      setShowPremiumModal(true);
      return;
    }
    
    // Mark article as read if it hasn't been read
    if (!article.hasBeenRead && gameState.updateGameState) {
      gameState.updateGameState({
        newsArticles: newsArticles.map(a => 
          a.id === article.id ? { ...a, hasBeenRead: true } : a
        )
      });
    }
    
    setSelectedArticle(article);
  };
  
  // Handle closing article view
  const handleCloseArticle = () => {
    playClick();
    setSelectedArticle(null);
  };
  
  // Handle category filter change
  const handleFilterChange = (category: NewsCategory | 'all') => {
    playClick();
    setFilter(category);
  };
  
  // Handle subscribe button click in premium modal
  const handleSubscribe = () => {
    playClick();
    setShowPremiumModal(false);
    gameState.setScreen('premium_store');
  };
  
  // Format publish date based on game week/year
  const formatPublishDate = (article: NewsArticle) => {
    const weeksSince = (currentYear - article.publishedYear) * 52 + (currentWeek - article.publishedWeek);
    
    if (weeksSince === 0) return 'Today';
    if (weeksSince === 1) return 'Last week';
    if (weeksSince < 4) return `${weeksSince} weeks ago`;
    if (weeksSince < 52) return `${Math.floor(weeksSince / 4)} months ago`;
    return `${Math.floor(weeksSince / 52)} year${Math.floor(weeksSince / 52) > 1 ? 's' : ''} ago`;
  };
  
  // News Categories
  const categories: { value: NewsCategory | 'all', label: string }[] = [
    { value: 'all', label: 'All News' },
    { value: 'industry', label: 'Industry News' },
    { value: 'artist', label: 'Artist Spotlight' },
    { value: 'controversy', label: 'Controversies' },
    { value: 'award', label: 'Awards & Events' },
    { value: 'release', label: 'New Releases' },
    { value: 'trend', label: 'Trends & Analysis' }
  ];
  
  // Premium modal component
  const PremiumModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-purple-500">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Premium Content</h2>
        <p className="text-gray-300 mb-6">
          This article is exclusive to subscribers. Upgrade to Premium to access in-depth industry analysis, exclusive interviews, and more!
        </p>
        <div className="flex justify-between">
          <button 
            onClick={() => setShowPremiumModal(false)}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
          >
            Close
          </button>
          <button 
            onClick={handleSubscribe}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded hover:from-purple-700 hover:to-indigo-700"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Music Industry Beat
          </h1>
          <p className="text-gray-400 text-sm">Your insider source for everything happening in the music business</p>
        </div>
        
        <div className="mt-3 sm:mt-0 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none w-full sm:w-48"
          />
        </div>
      </div>
      
      <div className="flex-grow flex overflow-hidden">
        {/* Category sidebar */}
        <div className="hidden md:block w-56 p-4 border-r border-gray-800 overflow-y-auto space-y-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => handleFilterChange(category.value)}
              className={`w-full text-left px-3 py-2 rounded ${
                filter === category.value 
                  ? 'bg-purple-700 text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Mobile category selector */}
        <div className="md:hidden p-2 border-b border-gray-800">
          <select 
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as NewsCategory | 'all')}
            className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Main content area */}
        <div className="flex-grow overflow-y-auto">
          {selectedArticle ? (
            <div className="p-4">
              <button 
                onClick={handleCloseArticle}
                className="mb-4 px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center text-sm"
              >
                ← Back to articles
              </button>
              
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                {selectedArticle.featuredImage && (
                  <div className="w-full h-48 sm:h-64 bg-gray-700 overflow-hidden">
                    <img 
                      src={selectedArticle.featuredImage} 
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {selectedArticle.sourceImage && (
                      <img 
                        src={selectedArticle.sourceImage} 
                        alt={selectedArticle.sourceName} 
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    )}
                    
                    <div>
                      <div className="text-gray-400 text-sm">{selectedArticle.sourceName}</div>
                      <div className="text-gray-500 text-xs">{formatPublishDate(selectedArticle)}</div>
                    </div>
                    
                    {selectedArticle.isPremium && (
                      <div className="ml-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-xs px-2 py-1 rounded text-white">
                        PREMIUM
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-bold mb-4">{selectedArticle.title}</h1>
                  
                  <div className="prose prose-invert max-w-none">
                    {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                  
                  {/* Article tags */}
                  {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {selectedArticle.tags.map(tag => (
                        <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Engagement stats */}
                  {selectedArticle.reactions && (
                    <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between text-gray-400 text-sm">
                      <span>{selectedArticle.reactions.views.toLocaleString()} views</span>
                      <span>{selectedArticle.reactions.likes.toLocaleString()} likes</span>
                      <span>{selectedArticle.reactions.shares.toLocaleString()} shares</span>
                      <span>{selectedArticle.reactions.comments.toLocaleString()} comments</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <div 
                    key={article.id}
                    onClick={() => handleSelectArticle(article)}
                    className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg ${
                      !article.hasBeenRead ? 'border-l-4 border-purple-500' : ''
                    }`}
                  >
                    {article.featuredImage && (
                      <div className="h-40 bg-gray-700 overflow-hidden">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-gray-400">{article.sourceName}</div>
                        <div className="flex items-center">
                          {article.isPremium && (
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-xs px-2 py-0.5 rounded text-white">
                              PREMIUM
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                        {article.summary}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{formatPublishDate(article)}</span>
                        
                        <div className="flex items-center space-x-2">
                          <span>{article.reactions?.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center text-center p-8">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 text-gray-700 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M8 7v8m4-8v8m4-8v8" 
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-400">No articles found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your filters or search term</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Premium modal */}
      {showPremiumModal && <PremiumModal />}
    </div>
  );
};

export default MusicNews;