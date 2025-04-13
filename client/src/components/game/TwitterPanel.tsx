import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { useAudio } from '@/lib/stores/useAudio';
import { MusicChart, SocialMediaPost, TwitterTrend, ViralStatus } from '@/lib/types';
import { 
  Image as ImageIcon, 
  Heart, 
  MessageCircle, 
  Repeat, 
  Share, 
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  X,
  Sparkles,
  BarChart2,
  Calendar,
  Gift,
  Smile,
  MapPin,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
};

const formatDate = (date?: Date, postWeek?: number, currentWeek?: number): string => {
  if (date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h`;
    
    const days = Math.floor(diff / 86400000);
    if (days < 7) return `${days}d`;
    
    const months = Math.floor(diff / 2592000000);
    if (months < 12) return `${months}mo`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  } else if (postWeek && currentWeek) {
    const weeksDiff = currentWeek - postWeek;
    if (weeksDiff === 0) return 'now';
    if (weeksDiff === 1) return '1w';
    return `${weeksDiff}w`;
  }
  
  return '';
};

export function TwitterPanel() {
  const { socialMediaStats, socialMedia, postOnSocialMedia, character, currentWeek, aiRappers } = useRapperGame();
  const { playSuccess } = useAudio();
  const [tweetText, setTweetText] = useState('');
  const [replyingTo, setReplyingTo] = useState<SocialMediaPost | null>(null);
  const [quoteRetweeting, setQuoteRetweeting] = useState<SocialMediaPost | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'analytics'>('for-you');
  const [tweetThreadView, setTweetThreadView] = useState<SocialMediaPost | null>(null);
  const [userProfileView, setUserProfileView] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if Twitter data exists
  if (!socialMediaStats?.twitter) {
    return (
      <Card className="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-950 dark:to-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">X data not available</div>
        </CardContent>
      </Card>
    );
  }
  
  const twitterData = socialMediaStats.twitter;
  const trends = twitterData.trends || [];
  const musicChartAccounts = twitterData.musicChartAccounts || [];
  
  // Calculate engagement statistics
  const getEngagementStats = () => {
    const platform = socialMedia.find(p => p.name === "Twitter");
    if (!platform || !platform.posts || !Array.isArray(platform.posts) || platform.posts.length === 0) {
      return {
        engagementRate: "0%",
        avgLikes: 0,
        avgRetweets: 0,
        avgComments: 0,
        totalPosts: 0,
        bestPerforming: null
      };
    }
    
    const posts = platform.posts as SocialMediaPost[];
    const totalLikes = posts.reduce((sum: number, post: SocialMediaPost) => sum + post.likes, 0);
    const totalRetweets = posts.reduce((sum: number, post: SocialMediaPost) => sum + post.shares, 0);
    const totalComments = posts.reduce((sum: number, post: SocialMediaPost) => sum + post.comments, 0);
    const totalInteractions = totalLikes + totalRetweets + totalComments;
    
    // Find best performing post
    const bestPost = [...posts].sort((a: SocialMediaPost, b: SocialMediaPost) => 
      (b.likes + b.shares + b.comments) - (a.likes + a.shares + a.comments)
    )[0];
    
    const followers = typeof platform.followers === 'number' ? platform.followers : 0;
    
    return {
      engagementRate: `${((totalInteractions / (posts.length * followers || 1)) * 100).toFixed(2)}%`,
      avgLikes: Math.round(totalLikes / posts.length),
      avgRetweets: Math.round(totalRetweets / posts.length),
      avgComments: Math.round(totalComments / posts.length),
      totalPosts: posts.length,
      bestPerforming: bestPost
    };
  };
  
  // Get trending topics based on game state
  const getTrendingTopics = () => {
    // If we have trends in social media stats, use those
    if (trends && trends.length > 0) {
      return trends;
    }
    
    // Otherwise generate some defaults based on music industry
    return [
      { id: '1', category: 'Music', name: 'NewMusicFriday', tweetCount: 125000, trending: true },
      { id: '2', category: 'Entertainment', name: 'GrammyAwards', tweetCount: 85000, trending: true },
      { id: '3', category: 'Music', name: 'HipHopAwards', tweetCount: 52000, trending: true },
      { id: '4', category: 'Entertainment', name: 'TopCharts', tweetCount: 42000, trending: true },
      { id: '5', category: 'Music', name: 'MusicIndustry', tweetCount: 38000, trending: true },
      { id: '6', category: 'Entertainment', name: 'BillboardHot100', tweetCount: 35000, trending: true },
      { id: '7', category: 'Music', name: 'RapGame', tweetCount: 28000, trending: true },
      { id: '8', category: 'Entertainment', name: 'StudioSession', tweetCount: 18000, trending: true },
      { id: '9', category: 'Music', name: 'ProducerLife', tweetCount: 15000, trending: true },
      { id: '10', category: 'Entertainment', name: 'MusicProducers', tweetCount: 12000, trending: true },
    ];
  };
  
  // Get follow suggestions based on AI rappers
  const getFollowSuggestions = () => {
    if (!aiRappers || aiRappers.length === 0) return [];
    
    // Take a few random AI rappers to suggest
    return aiRappers
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map(rapper => ({
        id: rapper.id,
        name: rapper.name,
        handle: rapper.name.toLowerCase().replace(/\s+/g, ''),
        avatar: rapper.image || '',
        verified: Math.random() > 0.5,
        followers: Math.floor(Math.random() * 1000000) + 10000
      }));
  };
  
  const handleTweetSubmit = () => {
    if (tweetText.trim()) {
      const images = selectedImage ? [selectedImage] : [];
      let content = tweetText;
      
      // If replying, add mention at the beginning
      if (replyingTo) {
        const mentionHandle = replyingTo.handle || twitterData.handle;
        content = `@${mentionHandle} ${content}`;
      }
      
      // If quote retweeting, embed original tweet
      if (quoteRetweeting) {
        // In a real implementation, would store reference to original tweet
        content += `\n\nRetweeted: "${quoteRetweeting.content}"`;
      }
      
      postOnSocialMedia("Twitter", content, images);
      
      try {
        if (playSuccess) {
          playSuccess();
        }
      } catch (error) {
        console.log("Could not play audio effect");
      }
      
      setTweetText('');
      setSelectedImage(null);
      setIsComposeOpen(false);
      setReplyingTo(null);
      setQuoteRetweeting(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };
  
  // Handle reply to tweet
  const handleReply = (tweet: SocialMediaPost) => {
    setReplyingTo(tweet);
    setIsComposeOpen(true);
  };
  
  // Handle retweet
  const handleRetweet = (tweet: SocialMediaPost, isQuote = false) => {
    if (isQuote) {
      setQuoteRetweeting(tweet);
      setIsComposeOpen(true);
    } else {
      // Simple retweet without quote
      // In a real implementation, would create a retweet record
      const content = `RT @${tweet.handle || 'user'}: ${tweet.content}`;
      postOnSocialMedia("Twitter", content, []);
      try {
        if (playSuccess) {
          playSuccess();
        }
      } catch (error) {
        console.log("Could not play audio effect");
      }
    }
  };
  
  // Handle like
  const handleLike = (tweet: SocialMediaPost) => {
    // In a real implementation, would toggle like status
    try {
      if (playSuccess) {
        playSuccess();
      }
    } catch (error) {
      console.log("Could not play audio effect");
    }
  };
  
  // Helper function to render a tweet
  const renderTweet = (post: SocialMediaPost, account?: MusicChart, isThread = false) => {
    const tweetAuthor = account || {
      id: 'user',
      accountName: character?.artistName || 'You',
      handle: twitterData.handle,
      avatar: character?.image || '',
      verified: twitterData.verified
    };
    
    return (
      <div 
        key={post.id} 
        className={`p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${isThread ? 'border-l-4 border-l-gray-200 dark:border-l-gray-700 pl-6' : ''}`}
        onClick={() => !isThread && setTweetThreadView(post)}
      >
        {isThread && post !== tweetThreadView && (
          <div className="absolute top-4 left-4 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
        )}
        
        <div className="flex items-start">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarImage src={tweetAuthor.avatar} alt={tweetAuthor.accountName} />
            <AvatarFallback>{tweetAuthor.accountName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <span 
                className="font-bold text-black dark:text-white hover:underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserProfileView(tweetAuthor.handle);
                }}
              >
                {tweetAuthor.accountName}
              </span>
              {tweetAuthor.verified && (
                <span className="flex items-center justify-center bg-blue-500 text-white rounded-full w-4 h-4 text-[10px]">
                  ✓
                </span>
              )}
              <span className="text-gray-500 text-sm">@{tweetAuthor.handle} · {formatDate(post.date, post.postWeek, currentWeek)}</span>
              <button className="ml-auto text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                <MoreHorizontal size={16} />
              </button>
            </div>
            
            {/* If this is a reply, show 'Replying to @someone' */}
            {post.replyToId && (
              <div className="text-sm text-blue-500 mb-1">
                Replying to @{post.replyToHandle || 'someone'}
              </div>
            )}
            
            <div className="mt-1 text-black dark:text-white">{post.content}</div>
            {(post.image || (post.images && post.images.length > 0)) && (
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <img src={post.image || post.images?.[0]} alt="Tweet media" className="w-full h-auto" />
              </div>
            )}
            
            {/* If this is a quote retweet, show the quoted tweet */}
            {post.quoteTweetId && (
              <div className="mt-2 border border-gray-200 dark:border-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm">{post.quoteTweetAuthor || 'Someone'}</span>
                  <span className="text-gray-500 text-xs">@{post.quoteTweetHandle || 'handle'}</span>
                </div>
                <div className="text-sm mt-1">{post.quoteTweetContent || 'Quoted tweet content'}</div>
              </div>
            )}
            
            <div className="mt-3 flex justify-between text-gray-500 text-sm">
              <button 
                className="flex items-center hover:text-blue-500 group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReply(post);
                }}
              >
                <div className="p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 mr-1">
                  <MessageCircle size={16} />
                </div>
                <span>{formatNumber(post.comments)}</span>
              </button>
              <button 
                className="flex items-center hover:text-green-500 group relative"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetweet(post);
                }}
              >
                <div className="p-2 rounded-full group-hover:bg-green-100 dark:group-hover:bg-green-900/30 mr-1">
                  <Repeat size={16} />
                </div>
                <span>{formatNumber(post.shares)}</span>
              </button>
              <button 
                className="flex items-center hover:text-pink-500 group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post);
                }}
              >
                <div className="p-2 rounded-full group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30 mr-1">
                  <Heart size={16} />
                </div>
                <span>{formatNumber(post.likes)}</span>
              </button>
              <button className="flex items-center hover:text-blue-500 group">
                <div className="p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                  <Share size={16} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render a thread of tweets
  const renderTweetThread = () => {
    if (!tweetThreadView) return null;
    
    // Check if the tweet is from chart account or user
    const chartAccount = musicChartAccounts.find(account => 
      account.tweets.some(tweet => tweet.id === tweetThreadView.id)
    );
    
    const isUserTweet = !chartAccount;
    
    // Generate related replies
    const replies = Array.from({ length: 2 + Math.floor(Math.random() * 4) }, (_, i) => ({
      id: `reply-${tweetThreadView.id}-${i}`,
      platformName: 'Twitter',
      content: `This is a reply to the original tweet. ${i === 0 ? 'First comment!' : `Reply #${i+1}`}`,
      postWeek: tweetThreadView.postWeek + 1,
      date: tweetThreadView.date ? new Date(tweetThreadView.date.getTime() + (i+1) * 3600000) : undefined,
      likes: Math.floor(Math.random() * tweetThreadView.likes * 0.5),
      comments: Math.floor(Math.random() * 10),
      shares: Math.floor(Math.random() * 5),
      viralStatus: "not_viral" as ViralStatus,
      viralMultiplier: 1,
      followerGain: 0,
      reputationGain: 0,
      wealthGain: 0,
      replyToId: tweetThreadView.id,
      replyToHandle: chartAccount ? chartAccount.handle : twitterData.handle
    }));
    
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full p-2"
            onClick={() => setTweetThreadView(null)}
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="font-bold ml-2">Thread</span>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {/* Original tweet */}
            {renderTweet(tweetThreadView, chartAccount)}
            
            {/* Replies */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-black dark:text-white">Replies</h3>
            </div>
            
            {replies.map(reply => {
              // Generate random account for replies
              const randomAiRapper = aiRappers ? aiRappers[Math.floor(Math.random() * aiRappers.length)] : null;
              const randomAccount = {
                id: `reply-account-${reply.id}`,
                accountName: randomAiRapper?.name || 'Fan Account',
                handle: (randomAiRapper?.name || 'fan_account').toLowerCase().replace(/\s+/g, ''),
                avatar: randomAiRapper?.image || '',
                verified: Math.random() > 0.8
              };
              
              // Cast reply to ensure viralStatus is properly typed
              const typedReply = {
                ...reply,
                viralStatus: reply.viralStatus as ViralStatus
              };
              return renderTweet(typedReply, randomAccount as MusicChart, true);
            })}
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  // Render user profile
  const renderUserProfile = () => {
    if (!userProfileView) return null;
    
    // Check if profile is from chart account or user
    const chartAccount = musicChartAccounts.find(account => account.handle === userProfileView);
    const isUserProfile = userProfileView === twitterData.handle;
    
    // User data
    const userData = {
      name: isUserProfile 
        ? character?.artistName || 'You'
        : chartAccount?.accountName || 'User',
      handle: userProfileView,
      avatar: isUserProfile 
        ? character?.image || ''
        : chartAccount?.avatar || '',
      verified: isUserProfile 
        ? twitterData.verified
        : chartAccount?.verified || false,
      bio: isUserProfile
        ? `${character?.artistName} | Official Account | Music Artist`
        : chartAccount 
          ? `${chartAccount.accountName} | Official Account | Music Charts & News`
          : 'Twitter user',
      followers: isUserProfile
        ? twitterData.followers
        : chartAccount?.followers || 0,
      following: Math.floor(Math.random() * 1000) + 100,
      joined: 'January 2023'
    };
    
    // Get tweets for this profile
    const profileTweets = isUserProfile
      ? twitterData.tweets
      : chartAccount?.tweets || [];
    
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full p-2"
            onClick={() => setUserProfileView(null)}
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="font-bold ml-2">{userData.name}</span>
        </div>
        
        <ScrollArea className="flex-1">
          {/* Cover and profile photo */}
          <div className="relative">
            <div className="h-32 bg-blue-500"></div>
            <div className="absolute -bottom-16 left-4">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-black">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="text-xl">{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            {/* Follow button */}
            {!isUserProfile && (
              <div className="absolute bottom-4 right-4">
                <Button className="rounded-full bg-black text-white dark:bg-white dark:text-black">
                  Follow
                </Button>
              </div>
            )}
          </div>
          
          {/* Profile info */}
          <div className="mt-16 px-4">
            <div className="flex items-center">
              <h2 className="text-xl font-bold">{userData.name}</h2>
              {userData.verified && (
                <span className="flex items-center justify-center bg-blue-500 text-white rounded-full w-5 h-5 text-xs ml-1">
                  ✓
                </span>
              )}
            </div>
            <div className="text-gray-500">@{userData.handle}</div>
            
            <div className="mt-2">{userData.bio}</div>
            
            <div className="flex items-center mt-2 text-gray-500 text-sm">
              <div className="flex items-center mr-4">
                <Calendar size={14} className="mr-1" />
                <span>Joined {userData.joined}</span>
              </div>
            </div>
            
            <div className="flex mt-2">
              <div className="mr-4">
                <span className="font-bold">{formatNumber(userData.following)}</span> <span className="text-gray-500">Following</span>
              </div>
              <div>
                <span className="font-bold">{formatNumber(userData.followers)}</span> <span className="text-gray-500">Followers</span>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800 mt-4">
            <div className="flex">
              <div className="flex-1 text-center py-4 font-medium border-b-2 border-blue-500">Posts</div>
              <div className="flex-1 text-center py-4 text-gray-500">Replies</div>
              <div className="flex-1 text-center py-4 text-gray-500">Media</div>
              <div className="flex-1 text-center py-4 text-gray-500">Likes</div>
            </div>
          </div>
          
          {/* Tweets */}
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {profileTweets.length > 0 ? (
              profileTweets.map(tweet => renderTweet(tweet, chartAccount))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p className="mb-2">No posts yet</p>
                <p className="text-sm">When they post, their posts will show up here.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  // Render analytics dashboard
  const renderAnalytics = () => {
    const stats = getEngagementStats();
    
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full p-2"
            onClick={() => setShowAnalytics(false)}
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="font-bold ml-2">Analytics</span>
        </div>
        
        <ScrollArea className="flex-1">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-blue-500"></div>
            <div className="absolute -bottom-12 left-4">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800">
                <AvatarImage src={character?.image} alt={character?.artistName} />
                <AvatarFallback className="text-xl">{character?.artistName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="pt-14 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{character?.artistName}</h2>
                <p className="text-gray-500">@{twitterData.handle}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Verified Account
              </Badge>
            </div>
            
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {character?.artistName} | Official Account | Music Artist
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full mr-3">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{formatNumber(twitterData.followers)}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full mr-3">
                    <BarChart2 size={18} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{stats.engagementRate}</div>
                    <div className="text-sm text-gray-500">Engagement Rate</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mt-4">
              <h3 className="font-bold mb-3">Post Engagement</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-pink-500">{formatNumber(stats.avgLikes)}</div>
                  <div className="text-sm text-gray-500">Avg. Likes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{formatNumber(stats.avgRetweets)}</div>
                  <div className="text-sm text-gray-500">Avg. Retweets</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">{formatNumber(stats.avgComments)}</div>
                  <div className="text-sm text-gray-500">Avg. Replies</div>
                </div>
              </div>
            </div>
            
            {stats.bestPerforming && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mt-4">
                <h3 className="font-bold mb-3">Top Performing Post</h3>
                <div className="border-l-4 border-blue-500 pl-3 py-2 italic text-gray-700 dark:text-gray-300">
                  {stats.bestPerforming.content.length > 100 
                    ? stats.bestPerforming.content.substring(0, 97) + '...' 
                    : stats.bestPerforming.content}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="text-pink-500 font-bold">{formatNumber(stats.bestPerforming.likes)}</div>
                    <div className="text-gray-500">Likes</div>
                  </div>
                  <div>
                    <div className="text-green-500 font-bold">{formatNumber(stats.bestPerforming.shares)}</div>
                    <div className="text-gray-500">Retweets</div>
                  </div>
                  <div>
                    <div className="text-blue-500 font-bold">{formatNumber(stats.bestPerforming.comments)}</div>
                    <div className="text-gray-500">Replies</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mt-4">
              <h3 className="font-bold mb-3">Audience Demographics</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Music Fans</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Industry Professionals</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Other Artists</span>
                    <span>12%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Media</span>
                    <span>8%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  // If we're viewing a specific tweet thread
  if (tweetThreadView) {
    return (
      <Card className="w-full max-w-md mx-auto overflow-hidden dark:bg-black bg-white border-0 shadow-md relative h-[600px]">
        <CardContent className="p-0 h-full flex flex-col">
          {renderTweetThread()}
        </CardContent>
      </Card>
    );
  }
  
  // If we're viewing a specific user profile
  if (userProfileView) {
    return (
      <Card className="w-full max-w-md mx-auto overflow-hidden dark:bg-black bg-white border-0 shadow-md relative h-[600px]">
        <CardContent className="p-0 h-full flex flex-col">
          {renderUserProfile()}
        </CardContent>
      </Card>
    );
  }
  
  // If we're viewing analytics
  if (showAnalytics) {
    return (
      <Card className="w-full max-w-md mx-auto overflow-hidden dark:bg-black bg-white border-0 shadow-md relative h-[600px]">
        <CardContent className="p-0 h-full flex flex-col">
          {renderAnalytics()}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden dark:bg-black bg-white border-0 shadow-md relative h-[600px]">
      <CardContent className="p-0 h-full flex">
        {/* Left Sidebar */}
        <div className="hidden md:flex w-16 lg:w-64 flex-col border-r border-gray-200 dark:border-gray-800 h-full p-2">
          <div className="p-3 flex items-center justify-center lg:justify-start mb-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
              <X size={18} />
            </div>
          </div>
          
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-4 font-normal">
              <Home className="h-5 w-5" />
              <span className="hidden lg:inline">Home</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 font-normal">
              <Search className="h-5 w-5" />
              <span className="hidden lg:inline">Explore</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 font-normal">
              <Bell className="h-5 w-5" />
              <span className="hidden lg:inline">Notifications</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 font-normal">
              <Mail className="h-5 w-5" />
              <span className="hidden lg:inline">Messages</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 font-normal">
              <Bookmark className="h-5 w-5" />
              <span className="hidden lg:inline">Bookmarks</span>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-4 font-normal"
              onClick={() => setUserProfileView(twitterData.handle)}
            >
              <User className="h-5 w-5" />
              <span className="hidden lg:inline">Profile</span>
            </Button>
          </div>
          
          <Button 
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            onClick={() => setIsComposeOpen(true)}
          >
            <span className="hidden lg:inline">Post</span>
            <Sparkles className="h-5 w-5 lg:hidden" />
          </Button>
          
          <div className="mt-auto">
            <div className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage src={character?.image} alt={character?.artistName} />
                <AvatarFallback>{character?.artistName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block flex-1 min-w-0">
                <div className="font-bold truncate">{character?.artistName}</div>
                <div className="text-gray-500 text-sm truncate">@{twitterData.handle}</div>
              </div>
              <MoreHorizontal className="h-5 w-5 hidden lg:block text-gray-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'for-you' | 'following' | 'analytics')}
            className="w-full flex-1 flex flex-col"
          >
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur">
              <div className="flex items-center px-4 py-3">
                <Avatar className="w-8 h-8 md:hidden mr-3">
                  <AvatarImage src={character?.image} alt={character?.artistName} />
                  <AvatarFallback>{character?.artistName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-xl font-bold">Home</div>
              </div>
              <TabsList className="grid grid-cols-3 p-0 bg-transparent w-full">
                <TabsTrigger value="for-you" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none py-3 data-[state=active]:font-semibold">
                  For you
                </TabsTrigger>
                <TabsTrigger value="following" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none py-3 data-[state=active]:font-semibold">
                  Following
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none py-3 data-[state=active]:font-semibold"
                  onClick={() => setShowAnalytics(true)}
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center md:hidden">
              <Avatar className="w-10 h-10 mr-3">
                <AvatarImage src={character?.image} alt={character?.artistName} />
                <AvatarFallback>{character?.artistName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className="flex-1 text-gray-500 rounded-full py-2 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsComposeOpen(true)}
              >
                What's happening?
              </div>
            </div>

            <ScrollArea className="flex-1">
              <TabsContent value="for-you" className="m-0 p-0 flex-1">
                {/* Feed content: Music charts, trends, and user posts */}
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {/* User tweets first */}
                  {twitterData.tweets.length > 0 && twitterData.tweets.map(tweet => renderTweet(tweet))}
                  
                  {/* Then music chart tweets */}
                  {musicChartAccounts.map(account => (
                    <React.Fragment key={account.id}>
                      {account.tweets.slice(0, 3).map(tweet => renderTweet(tweet, account))}
                    </React.Fragment>
                  ))}
                  
                  {/* If no tweets at all */}
                  {twitterData.tweets.length === 0 && (!musicChartAccounts || musicChartAccounts.length === 0) && (
                    <div className="p-8 py-16 text-center text-gray-500">
                      <p className="text-lg font-bold mb-1">Welcome to X!</p>
                      <p className="text-sm mb-4">This is the best place to see what's happening in your music world.</p>
                      <Button 
                        className="bg-black text-white dark:bg-white dark:text-black rounded-full"
                        onClick={() => setIsComposeOpen(true)}
                      >
                        Create your first post
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="following" className="m-0 p-0">
                <div className="p-4 py-10">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-bold mb-1">Start following accounts</p>
                    <p className="text-sm">When you do, their posts will show up here.</p>
                    
                    {/* Suggested accounts to follow */}
                    <div className="mt-6 space-y-4">
                      {getFollowSuggestions().map(suggestion => (
                        <div key={suggestion.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                          <div className="flex items-center">
                            <Avatar className="w-10 h-10 mr-3">
                              <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                              <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <div className="font-bold text-black dark:text-white">{suggestion.name}</div>
                                {suggestion.verified && (
                                  <span className="flex items-center justify-center bg-blue-500 text-white rounded-full w-4 h-4 text-[10px] ml-1">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-500 text-sm">@{suggestion.handle}</div>
                            </div>
                          </div>
                          <Button className="rounded-full bg-black text-white dark:bg-white dark:text-black">
                            Follow
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Right Sidebar - Trending */}
        <div className="hidden lg:flex w-80 flex-col border-l border-gray-200 dark:border-gray-800 h-full">
          <div className="sticky top-0 p-3">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-full pl-10 pr-4 py-2 border-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-xl mb-3">Trends for you</h3>
              {getTrendingTopics().map(trend => (
                <div key={trend.id} className="py-2 hover:bg-gray-200 dark:hover:bg-gray-700 -mx-4 px-4 cursor-pointer">
                  <div className="text-xs text-gray-500">{trend.category} · Trending</div>
                  <div className="font-semibold">#{trend.name}</div>
                  <div className="text-xs text-gray-500">{formatNumber(trend.tweetCount)} posts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Compose Tweet Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {replyingTo ? "Reply" : quoteRetweeting ? "Quote Post" : "Create post"}
            </DialogTitle>
          </DialogHeader>
          
          {/* If replying, show the original tweet */}
          {replyingTo && (
            <div className="mt-2 border-l-2 border-gray-200 dark:border-gray-700 pl-3 py-1 mb-4 text-sm text-gray-500">
              <div className="font-bold text-black dark:text-white">
                Replying to @{replyingTo.handle || twitterData.handle}
              </div>
              <div className="line-clamp-2">{replyingTo.content}</div>
            </div>
          )}
          
          {/* If quote retweeting, show the original tweet */}
          {quoteRetweeting && (
            <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-4 text-sm">
              <div className="font-bold text-black dark:text-white">
                @{quoteRetweeting.handle || twitterData.handle}
              </div>
              <div className="line-clamp-3">{quoteRetweeting.content}</div>
            </div>
          )}
          
          <div className="flex gap-4 mt-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={character?.image} alt={character?.artistName} />
              <AvatarFallback>{character?.artistName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="What's happening?"
                className="min-h-[120px] border-0 focus-visible:ring-0 resize-none text-lg"
                maxLength={280}
              />
              {selectedImage && (
                <div className="relative mt-2 rounded-xl overflow-hidden">
                  <img src={selectedImage} alt="Uploaded" className="w-full max-h-[240px] object-cover" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full p-0"
                    onClick={() => setSelectedImage(null)}
                  >
                    ✕
                  </Button>
                </div>
              )}
              <div className="mt-4 flex justify-between items-center border-t pt-2">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    onClick={openGallery}
                  >
                    <ImageIcon size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Gift size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Smile size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <MapPin size={20} />
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-sm flex items-center">
                    <span className={tweetText.length > 260 ? "text-orange-500" : "text-gray-500"}>
                      {tweetText.length}
                    </span>
                    <span className="mx-1">/</span>
                    <span className="text-gray-500">280</span>
                  </div>
                  <Button
                    onClick={handleTweetSubmit}
                    disabled={!tweetText.trim()}
                    className="rounded-full bg-blue-500 hover:bg-blue-600"
                  >
                    {replyingTo ? "Reply" : quoteRetweeting ? "Quote" : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}