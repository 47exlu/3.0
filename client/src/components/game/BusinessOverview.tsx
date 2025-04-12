import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  BarChart2,
  Activity,
  PieChart,
  Share2
} from 'lucide-react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { formatCurrency, formatNumber } from '../../lib/utils';

export const BusinessOverview: React.FC = () => {
  const { 
    stats, 
    songs,
    albums,
    currentWeek,
    weeklyStats
  } = useRapperGame();
  
  // Calculate weekly totals using the weekly stats
  const totalStreams = songs?.reduce((total, song) => total + (song.streams || 0), 0) || 0;
  
  const currentWeekData = {
    week: currentWeek,
    newStreamsThisWeek: weeklyStats?.[currentWeek]?.newStreamsThisWeek || 0,
    totalStreams: weeklyStats?.[currentWeek]?.totalStreams || totalStreams,
    revenue: weeklyStats?.[currentWeek]?.revenue || 0
  };
  
  const prevWeekData = {
    week: currentWeek - 1,
    newStreamsThisWeek: weeklyStats?.[currentWeek - 1]?.newStreamsThisWeek || 0,
    totalStreams: weeklyStats?.[currentWeek - 1]?.totalStreams || (totalStreams - currentWeekData.newStreamsThisWeek),
    revenue: weeklyStats?.[currentWeek - 1]?.revenue || 0
  };
  
  const weeklyStreamingDifference = currentWeekData.newStreamsThisWeek - prevWeekData.newStreamsThisWeek;
  const weeklyStreamingPercent = prevWeekData.newStreamsThisWeek > 0 
    ? Math.round((weeklyStreamingDifference / prevWeekData.newStreamsThisWeek) * 100) 
    : 0;
    
  const weeklyRevenueDifference = currentWeekData.revenue - prevWeekData.revenue;
  const weeklyRevenuePercent = prevWeekData.revenue > 0 
    ? Math.round((weeklyRevenueDifference / prevWeekData.revenue) * 100) 
    : 0;
  
  const totalReleased = songs?.filter(song => song.released)?.length || 0;
  const totalAlbums = albums?.filter(album => album.released)?.length || 0;
  
  // Calculate total revenue
  const totalRevenue = stats?.wealth || 0;
  
  // Record deal info - simplified since we don't have full recordDeal in the store
  const hasRecordDeal = false; // Simplified since we don't have full record deal information
  
  return (
    <div className="p-4 sm:p-6 text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Financial Overview</h1>
        <p className="text-gray-400">Track your revenue, streaming performance, and business metrics</p>
      </div>
      
      {/* Main stats dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
            <div className="bg-emerald-500/20 p-1 rounded">
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatCurrency(totalRevenue)}</h3>
          <div className="flex items-center">
            <span className={`text-xs font-medium flex items-center ${weeklyRevenuePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {weeklyRevenuePercent >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(weeklyRevenuePercent)}% 
            </span>
            <span className="text-gray-500 text-xs ml-1">vs last week</span>
          </div>
        </div>
        
        {/* Weekly Streams Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-400 text-sm font-medium">Weekly Streams</p>
            <div className="bg-blue-500/20 p-1 rounded">
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{currentWeekData.totalStreams.toLocaleString()}</h3>
          <div className="flex items-center">
            <span className={`text-xs font-medium flex items-center ${weeklyStreamingPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {weeklyStreamingPercent >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(weeklyStreamingPercent)}% 
            </span>
            <span className="text-gray-500 text-xs ml-1">vs last week</span>
          </div>
        </div>
        
        {/* Total Songs Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-400 text-sm font-medium">Released Songs</p>
            <div className="bg-purple-500/20 p-1 rounded">
              <BarChart2 className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{totalReleased}</h3>
          <div className="flex items-center">
            <span className="text-gray-500 text-xs ml-1">{totalAlbums} albums released</span>
          </div>
        </div>
        
        {/* Record Deal Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-400 text-sm font-medium">Record Deal</p>
            <div className="bg-amber-500/20 p-1 rounded">
              <Share2 className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          {hasRecordDeal ? (
            <>
              <h3 className="text-lg font-bold mb-1">Label Name</h3>
              <div className="flex items-center text-xs text-gray-400">
                <span>15% royalty rate</span>
                <span className="mx-1">•</span>
                <span>$50,000 advance</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col">
              <h3 className="text-lg font-bold mb-1">No Deal</h3>
              <span className="text-xs text-gray-400">Independent artist</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button 
            className="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950 p-3 rounded-lg text-center flex flex-col items-center justify-center transition-all"
            onClick={() => useRapperGame.getState().setScreen('streaming')}
          >
            <Activity className="h-5 w-5 mb-1" />
            <span className="text-sm">Streaming</span>
          </button>
          
          <button 
            className="bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 p-3 rounded-lg text-center flex flex-col items-center justify-center transition-all"
            onClick={() => useRapperGame.getState().setScreen('career_dashboard')}
          >
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-sm">Dashboard</span>
          </button>
          
          <button 
            className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 p-3 rounded-lg text-center flex flex-col items-center justify-center transition-all"
            onClick={() => useRapperGame.getState().setScreen('music_production')}
          >
            <BarChart2 className="h-5 w-5 mb-1" />
            <span className="text-sm">Studio</span>
          </button>
          
          <button 
            className="bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 p-3 rounded-lg text-center flex flex-col items-center justify-center transition-all"
            onClick={() => useRapperGame.getState().setScreen('company_management')}
          >
            <PieChart className="h-5 w-5 mb-1" />
            <span className="text-sm">Company</span>
          </button>
        </div>
      </div>
      
      {/* Weekly Revenue Chart Preview (placeholder) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Weekly Revenue</h2>
          <button className="text-sm text-gray-400 hover:text-white">View Details</button>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-4 h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-gray-500">
              <BarChart2 className="h-6 w-6 mx-auto mb-2" />
              <p>Revenue Chart</p>
            </div>
            <p className="text-sm text-gray-400">Detailed analytics coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOverview;