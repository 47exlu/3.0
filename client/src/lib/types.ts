// Define game data types
export type GameScreen = 
  | "main_menu" 
  | "character_creation" 
  | "career_dashboard" 
  | "studio" 
  | "social_media" 
  | "social_media_hub" // Social media hub screen
  | "streaming" 
  | "music_videos"
  | "beefs" // New screen for beefs
  | "shop"
  | "touring" // New screen for tours and concerts
  | "skills" // New screen for skills training
  | "music_production" // Music production screen
  | "unreleased_songs" // Unreleased songs screen
  | "streaming_platforms" // Streaming platforms screen
  | "streaming_impact_dashboard" // Streaming platform impact analytics screen
  | "collaborations" // Collaborations screen
  | "save_load" // Save/load game screen
  | "premium_store" // Premium store screen
  | "music_charts" // Music charts and rankings screen
  | "hype_tester" // Hype and controversy tester screen
  | "album_management" // Album management screen
  | "song_promotion" // Song promotion screen
  | "merchandise" // Merchandise management screen
  | "merchandise_management" // Merchandise management screen
  | "merchandise_sales_charts" // Merchandise sales charts and analytics
  | "fanbase_naming" // Fanbase naming screen
  | "media_events" // Media events screen (festivals, talk shows, interviews)
  | "music_news" // Music industry news and magazine screen
  | "billboard_charts" // Billboard Hot 100 and album charts screen
  | "player_wikipedia" // Player's career Wikipedia-style page
  | "team_management" // Team management screen - for hiring manager, publicist, etc.
  | "awards_certifications" // Awards and certifications screen
  | "settings" // Game settings page
  | "jobs" // Jobs screen for taking on part-time music industry jobs

export interface CharacterInfo {
  id: string;
  artistName: string;
  image?: string;
  coverImage?: string;
  aboutBackgroundImage?: string;
  about?: string;
  musicStyle?: string;
  hometown?: string;
  background?: string;
  fanbaseName?: string; // Name for the artist's fandom
}

export interface PlayerStats {
  careerLevel: number;
  reputation: number;
  wealth: number;
  creativity: number;
  marketing: number;
  networking: number;
  fanLoyalty: number;
  stagePower?: number; // Added for touring/concerts system
  totalFans?: number; // Total number of fans across all platforms
  popularity?: number; // Overall popularity score (0-100)
}

export interface WeeklyStats {
  week: number;
  totalStreams: number;
  newStreamsThisWeek: number; // New field to track streams gained this week
  totalFollowers: number;
  totalListeners: number;
  wealth: number;
  revenue: number; // Revenue gained this week
  reputation: number;
  songsReleased: number;
  songIds: string[]; // IDs of songs released this week
  ghostProduction?: number; // Number of ghost productions completed this week
  expenses?: number; // Expenses incurred this week
}

export type SongTier = 1 | 2 | 3 | 4 | 5;

export interface SongTierInfo {
  tier: SongTier;
  name: string;
  description: string;
  minQuality: number;
  cost: number;
  minCareerLevel?: number;
  baseProduction: number;
  productionTimeWeeks: number;
  chanceOfSuccess: number;
  fanGrowthMultiplier: number;
}

export type ViralStatus = "not_viral" | "trending" | "viral" | "super_viral";

export interface SocialMediaPost {
  id: string;
  platformName: string;
  content: string;
  images?: string[];
  image?: string; // For new implementation, single image support
  postWeek: number;
  date?: Date;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  viralStatus: ViralStatus;
  viralMultiplier: number;
  followerGain: number;
  reputationGain: number;
  type?: 'regular' | 'sponsored' | 'announcement';
  wealthGain: number;
  // Fields for enhanced social media UI:
  username?: string; // Display name for the post author
  handle?: string;   // Handle/username for the post author
  avatar?: string;   // Avatar image URL for post author
  verified?: boolean; // Whether the account is verified
  // TikTok specific fields:
  video?: string;     // Video URL for TikTok posts
  thumbnail?: string; // Thumbnail for TikTok videos
  musicTitle?: string; // Music title for TikTok videos
  duration?: number;  // Duration in seconds for videos
  bookmarks?: number; // Number of bookmarks/saves
  // UI state fields:
  liked?: boolean;    // Whether the user has liked this post
  saved?: boolean;    // Whether the user has saved/bookmarked this post
  followed?: boolean; // Whether the user follows this account
  retweeted?: boolean; // Whether the user has retweeted this post (Twitter/X specific)
}

export type SocialMediaPlatform = {
  name: string;
  followers: number;
  posts: number;
  engagement: number;
  lastPostWeek: number;
  viralPosts?: SocialMediaPost[];
};

// New enhanced social media types for the platforms UI
export interface SocialMediaAccount {
  followers: number;
  posts: SocialMediaPost[];
  handle: string;
  verified: boolean;
  engagement: number;
  isBurner: boolean;
  displayName?: string;
  bio?: string;
  creationWeek: number;
}

export interface TwitterTrend {
  id: string;
  name: string;
  category: 'Music' | 'Entertainment' | 'Gaming' | 'Sports' | 'News';
  tweetCount: number;
  trending: boolean;
  description?: string;
}

export interface MusicChart {
  id: string;
  accountName: string; // E.g. "PopBase", "PopMusic", "RapRadar"
  handle: string;      // E.g. "popbase", "popcrave", "rapradar"
  verified: boolean;
  avatar: string;
  tweets: SocialMediaPost[];
  followers: number;
}

export interface SocialMediaStats {
  instagram?: {
    followers: number;
    posts: SocialMediaPost[];
    handle: string;
    verified: boolean;
    engagement: number;
    burnerAccounts?: SocialMediaAccount[];
  };
  twitter?: {
    followers: number;
    tweets: SocialMediaPost[];
    handle: string;
    verified: boolean;
    engagement: number;
    burnerAccounts?: SocialMediaAccount[];
    trends?: TwitterTrend[];
    musicChartAccounts?: MusicChart[];
  };
  tiktok?: {
    followers: number;
    videos: SocialMediaPost[];
    handle: string;
    verified: boolean;
    engagement: number;
    burnerAccounts?: SocialMediaAccount[];
  };
};

export interface StreamingPlatform {
  name: string;
  listeners: number;
  totalStreams: number;
  revenue: number;
  weeklyGrowth?: number; // Weekly growth in streams
  isUnlocked: boolean; // Whether the platform is available to the player
  logo?: string; // Platform logo image
}

export interface VideosPlatform {
  name: string;
  subscribers: number;
  totalViews: number;
  videos: number;
  views?: number; // Alias for totalViews for consistency
  weeklyGrowth?: number; // Weekly growth in views
  revenue?: number; // Revenue generated from video platforms
}

export type SongPerformanceType = "normal" | "viral" | "flop" | "comeback";

export type SongIcon = 
  | "microphone" 
  | "fire" 
  | "bolt" 
  | "heart" 
  | "star" 
  | "dollar" 
  | "globe"
  | "cloud";

export interface Song {
  id: string;
  title: string;
  tier: SongTier;
  quality: number;
  completed: boolean;
  productionStartWeek: number;
  productionProgress: number;
  released: boolean;
  releaseDate?: number;
  streams: number;
  isActive: boolean;
  icon?: SongIcon;
  releasePlatforms: string[];
  featuring: string[];
  performanceType: SongPerformanceType;
  performanceStatusWeek: number;
  coverArt?: string;
  aiRapperOwner?: string;
  aiRapperFeaturesPlayer?: boolean;
  platformStreamDistribution?: Record<string, number>; // Platform-specific stream distribution
  producedByPlayer?: boolean; // Indicates this song was produced by player for another artist
  hype?: number; // Hype level from promotion activities
  certifications?: SongCertification[]; // Song certifications (gold, platinum, etc.)
}

export type VideoQuality = "basic" | "premium";
export type VideoStyle = "performance" | "story" | "artistic" | "animation" | "lyric";
export type VideoSetting = "studio" | "city" | "nature" | "club" | "mansion" | "abstract";

export interface MusicVideo {
  id: string;
  songId: string;
  quality: VideoQuality;
  style: VideoStyle;
  setting: VideoSetting;
  releaseDate: number;
  views: number;
  likes: number;
  isActive: boolean;
  platforms: string[];
  platform?: "YouTube" | "VEVO"; // For backward compatibility
  streamMultiplier?: number;
  thumbnail?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: "beat" | "lyrics" | "producer" | "feature" | "marketing";
  cost: number;
  tier: SongTier;
  quality: number;
  artistId?: string;
  purchased: boolean;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  week: number;
  type: "opportunity" | "challenge" | "neutral" | "fan";
  requiresStats?: Partial<Record<keyof PlayerStats, number>>;
  options: {
    text: string;
    results?: {
      reputation?: number;
      wealth?: number;
      creativity?: number;
      marketing?: number;
      networking?: number;
      fanLoyalty?: number;
      followers?: Record<string, number>;
      streams?: number;
    };
    requiresStats?: Partial<Record<keyof PlayerStats, number>>;
    effect?: (state: GameState) => GameState;
  }[];
  resolved: boolean;
  selectedOption?: number;
}

export interface FeatureRequest {
  id: string;
  fromRapperId?: string;
  toRapperId?: string;
  tier: SongTier;
  weekRequested: number;
  status: "pending" | "accepted" | "rejected" | "expired";
  expiresWeek: number;
}

export interface AIRapper {
  id: string;
  name: string;
  image?: string;
  style: string;
  bio?: string;
  popularity: number; // 1-100
  monthlyListeners: number;
  totalStreams: number;
  personality?: "friendly" | "arrogant" | "mysterious" | "controversial" | "humble";
  featureCost?: number;
  relationshipStatus?: "neutral" | "friend" | "rival" | "enemy";
  relationship?: "neutral" | "friend" | "rival" | "enemy"; // For backward compatibility
  collabHistory?: {
    count: number;
    lastWeek: number;
    tracks: string[];
  };
  beefHistory?: {
    active: boolean;
    history: string[];
  };
  songs?: string[]; // IDs of songs owned by this rapper
}

// Beef system interfaces
export interface Beef {
  id: string;
  initiatorId: string;
  targetId: string;
  status: "ongoing" | "won" | "lost" | "draw" | "waiting";
  startWeek: number;
  endWeek?: number;
  initiatorTrack?: {
    title: string;
    lyrics: string;
    quality: number;
    responseWeek: number;
  };
  targetTrack?: {
    title: string;
    lyrics: string;
    quality: number;
    responseWeek: number;
  };
  publicReaction: {
    initiatorFavor: number;
    targetFavor: number;
  };
  impact: {
    initiatorRepGain: number;
    targetRepGain: number;
    initiatorFollowerGain: number;
    targetFollowerGain: number;
  };
}

// Tour and concert system interfaces
export type VenueSize = "small" | "medium" | "large" | "arena" | "stadium";

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  size: VenueSize;
  capacity: number;
  cost: number;
  reputationRequired: number;
  image?: string;
}

export interface Tour {
  id: string;
  name: string;
  startWeek: number;
  endWeek: number;
  currentVenueIndex: number;
  venues: string[]; // venue ids
  status: "planning" | "active" | "completed" | "cancelled";
  ticketsSold: number;
  totalRevenue: number;
  expenses: number;
  profit: number;
}

export interface Concert {
  id: string;
  venueId: string;
  tourId?: string; // optional, can be a standalone concert
  week: number;
  ticketPrice: number;
  ticketsSold: number;
  maxTickets: number;
  revenue: number;
  expenses: number;
  profit: number;
  performanceQuality: number;
  audienceSatisfaction: number;
  reputationGain: number;
  setlist: string[]; // song ids
  status: "scheduled" | "performed" | "cancelled";
}

// Skill training system interfaces
export type SkillName = "creativity" | "marketing" | "networking" | "performance" | "production" | "business";

export interface Skill {
  name: SkillName;
  displayName: string;
  level: number;
  maxLevel: number;
  description: string;
  trainingCost: number;
}

// Team management system interfaces
export type TeamMemberRole = "manager" | "publicist" | "producer" | "tourManager" | "socialMediaManager" | "securityGuard" | "stylist";

export interface TeamMember {
  id: string;
  name: string;
  role: TeamMemberRole;
  hired: boolean;
  hiredWeek?: number; // Week when hired
  hiredDate?: number; // Old field name for week when hired (kept for backwards compatibility)
  contractLength?: number; // In weeks
  contractEnds?: number; // Week when contract expires
  salary: number; // Weekly salary
  quality: number; // 1-100 rating of skill
  experience: number; // 1-100 rating of experience
  specialization?: string; // Additional area of expertise
  description?: string; // Description of role and expertise
  bio?: string;
  image?: string; // Profile picture
  benefits: TeamMemberBenefit[];
  levelRequirement?: number; // Career level required to hire
}

export interface TeamMemberBenefit {
  type: "revenueBoost" | "streamingBoost" | "socialMediaBoost" | "productionSpeed" | "tourRevenue" | "merchandiseSales" | "controversyProtection" | "skillBoost" | "reputationBoost";
  description: string;
  value: number; // Percentage boost or flat value
  affectedArea?: string; // Specific area affected (e.g., "twitter" for social media)
}

// Merchandise system interfaces
export type MerchandiseType = "clothing" | "accessories" | "collectibles" | "digital" | "limited";
export type MerchandiseSize = "xs" | "s" | "m" | "l" | "xl" | "xxl" | "one-size";

export interface MerchandiseItem {
  id: string;
  name: string;
  description: string;
  type: MerchandiseType;
  price: number;
  cost: number; // Production cost per item
  imageUrl: string;
  availableInventory: number;
  totalSold: number;
  revenue: number;
  profit: number;
  dateAdded: number; // Week when added
  isActive: boolean;
  isLimited: boolean;
  limitedQuantity?: number;
  availableSizes?: MerchandiseSize[];
  reputationRequired?: number; // Minimum reputation required to unlock
  isPremiumOnly: boolean; // Whether this item is premium-only
}

export interface MerchandiseWeeklySales {
  week: number;
  totalItems: number;
  totalRevenue: number;
  totalProfit: number;
  itemsSold: Record<string, number>; // Map of item ID to quantity sold
}

// Media Events System
export type MediaEventType = 'festival' | 'talk_show' | 'interview' | 'podcast' | 'award_show';
export type MediaEventSize = 'small' | 'medium' | 'large' | 'major';
export type MediaEventStatus = 'upcoming' | 'invited' | 'confirmed' | 'completed' | 'cancelled';

export interface MediaEventPreparationTask {
  id: string;
  description: string;
  completed: boolean;
  effect?: {
    followerBoost?: number;
    reputationBoost?: number;
    streamBoost?: number;
  };
}

export interface MediaEvent {
  id: string;
  name: string;
  type: MediaEventType;
  size: MediaEventSize;
  host: string;
  description: string;
  week: number;           // Week when the event occurs
  invitationWeek?: number; // Week when the invitation was received
  reputationRequired: number;
  reputationGain: number;
  followerGain: number;
  streamBoost: number;    // Boost to streaming numbers
  payout: number;         // Money earned from the appearance
  cost: number;           // Cost to attend (mostly for festivals)
  status?: MediaEventStatus;
  performanceQuality?: number; // 0-100 rating of performance
  preparationTasks?: MediaEventPreparationTask[];
  highlights?: string[];  // Text highlights from the event
}

// Music Industry News System
export type NewsCategory = 
  | "industry" 
  | "artist" 
  | "controversy" 
  | "award" 
  | "release" 
  | "trend" 
  | "event";

export type NewsImpact = "low" | "medium" | "high";

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: NewsCategory;
  impact: NewsImpact;
  publishedWeek: number;
  publishedYear: number;
  sourceName: string;
  sourceImage?: string;
  featuredImage?: string;
  relatedArtistIds?: string[];
  relatedEventIds?: string[];
  playerMentioned: boolean;
  hasBeenRead: boolean;
  isPremium: boolean;      // Whether this is premium magazine content
  reactions?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  tags?: string[];
}

export interface SkillTraining {
  id: string;
  skillName: SkillName;
  startWeek: number;
  endWeek: number;
  level: number;
  completed: boolean;
  trainingType: "course" | "mentor" | "practice" | "workshop";
  cost: number;
}

// Jobs System
export type JobCategory = 
  | "studio" 
  | "performing" 
  | "teaching" 
  | "media" 
  | "industry"
  | "freelance";

export type JobDifficulty = "entry" | "basic" | "intermediate" | "advanced" | "expert";

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  difficulty: JobDifficulty;
  duration: number; // Duration in weeks
  payRate: number; // Money earned per week
  reputationGain: number; // Reputation gained upon completion
  skillGains: Partial<Record<SkillName, number>>; // Skills improved by doing this job
  requirementsMet: boolean; // Whether player meets requirements for this job
  requirements?: {
    reputation?: number; // Min reputation required
    skills?: Partial<Record<SkillName, number>>; // Min skills required
    careerLevel?: number; // Min career level required
  };
  available: boolean; // Whether this job is currently available
  appliedDate?: number; // Week when the player applied
  acceptedDate?: number; // Week when the job was accepted
  endDate?: number; // Week when the job ends
  status: "available" | "applied" | "working" | "completed" | "failed" | "quit";
  hoursPerWeek: number; // Hours required per week (affects player's ability to do other tasks)
  successChance: number; // Chance of success (0-1)
}

export interface ActiveJob {
  jobId: string;
  startWeek: number;
  endWeek: number; // When the job will end
  weeklyPay: number;
  hoursPerWeek: number;
  totalPay: number; // Total accumulated pay
  weeksWorked: number;
  performance: number; // 0-100 rating of job performance
  warnings: number; // Number of warnings received (can lead to getting fired)
}

export interface JobHistory {
  jobId: string;
  title: string;
  category: JobCategory;
  startWeek: number;
  endWeek: number;
  totalPay: number;
  completed: boolean;
  performance: number; // 0-100 rating
  reference?: string; // Positive reference that can help with future jobs
}

// Hype system for upcoming releases
export type ReleaseType = 'single' | 'album' | 'ep' | 'deluxe' | 'remix' | 'tour';

export interface HypeEvent {
  id: string;
  type: ReleaseType;
  name: string;
  hypeLevel: number; // 0-100
  targetReleaseWeek: number;
  announced: boolean;
  released: boolean;
  maxHype: number;
  decayRate: number; // How fast hype decreases if not maintained
  createdWeek: number;
}

// Media Events System types are already defined above

// Controversy system for scandals and conspiracies
export type ControversyType = 
  | 'offensive_tweet' 
  | 'leaked_audio' 
  | 'public_feud' 
  | 'relationship_drama'
  | 'inappropriate_comments'
  | 'substance_abuse'
  | 'legal_trouble'
  | 'conspiracy_theory';

export type ControversySeverity = 'minor' | 'moderate' | 'major' | 'severe';

export interface Controversy {
  id: string;
  type: ControversyType;
  title: string;
  description: string;
  severity: ControversySeverity;
  week: number;
  resolvedWeek?: number;
  impactOnReputation: number; // Negative value
  impactOnStreams: number; // Can be positive or negative
  impactOnFollowers: number; // Usually negative
  responseOptions: {
    text: string;
    reputationModifier: number;
    streamModifier: number;
    followerModifier: number;
  }[];
  selectedResponse?: number;
  isActive: boolean;
}

// Album system interfaces
export type AlbumType = 'standard' | 'deluxe' | 'remix' | 'ep' | 'compilation';

// Certification types (gold, platinum, etc.)
export type CertificationType = 'gold' | 'platinum' | '2xPlatinum' | '3xPlatinum' | '4xPlatinum' | '5xPlatinum' | 'diamond';

// Certification thresholds (streams/sales needed)
export const CERTIFICATION_THRESHOLDS = {
  gold: 500000,
  platinum: 1000000,
  '2xPlatinum': 2000000,
  '3xPlatinum': 3000000,
  '4xPlatinum': 4000000,
  '5xPlatinum': 5000000,
  diamond: 10000000
};

// Song certification interface
export interface SongCertification {
  id: string;
  type: CertificationType;
  dateAwarded: number; // Week number
  streams: number;
  issuingOrganization: string; // e.g., "RIAA"
}

// Award type for artists
export type AwardType = 
  | 'grammy' 
  | 'bet' 
  | 'vma' 
  | 'ama' 
  | 'billboard' 
  | 'iheartradio'
  | 'apollo'
  | 'worldstar';

// Award category
export type AwardCategory = 
  | 'best_new_artist'
  | 'artist_of_the_year'
  | 'album_of_the_year'
  | 'song_of_the_year'
  | 'best_rap_performance'
  | 'best_rap_album'
  | 'best_rap_song'
  | 'best_music_video'
  | 'best_collaboration'
  | 'best_visual_effects'
  | 'best_choreography'
  | 'most_popular_artist'
  | 'breakthrough_artist';

// Award interface
export interface Award {
  id: string;
  type: AwardType;
  name: string; // e.g., "Grammy Awards 2025"
  category: AwardCategory;
  date: number; // Week number
  year: number; // Calendar year
  isWinner: boolean; // Whether the player won or was just nominated
  songId?: string; // Optional reference to a specific song
  albumId?: string; // Optional reference to a specific album
  competitionLevel: number; // 1-10 scale of how prestigious the award is
  reputationBoost: number; // Reputation boost from winning
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  type: AlbumType;
  coverArt: string;
  releaseDate?: number; // Week number when released
  announced: boolean;
  released: boolean;
  songIds: string[];
  streams: number;
  sales: number;
  revenue: number;
  criticalRating?: number; // 0-10 rating from critics
  fanRating?: number; // 0-10 rating from fans
  description?: string;
  parentAlbumId?: string; // For deluxe/remix albums - points to original album
  features: string[]; // AIRapper ids of featured artists
  exclusiveTracks?: string[]; // Additional tracks for deluxe editions
  remixArtists?: string[]; // For remix albums - artists who contributed remixes
  platformStreams: Record<string, number>; // Streams per platform (Spotify, YouTube Music, etc.)
  chartPosition?: number; // Position on the Billboard charts
  certifications?: SongCertification[]; // Album certifications
}

// Subscription info
export interface SubscriptionInfo {
  isSubscribed: boolean;
  subscriptionType: 'none' | 'standard' | 'premium' | 'platinum';
  subscriptionId?: string;
  expiresAt?: Date;
  benefits: string[];
}

// Market Trends Types
export type TrendType = 'rising' | 'falling' | 'hot' | 'stable';

export interface MarketTrend {
  id: string;
  name: string;
  description: string;
  type: TrendType;
  affectedPlatforms: string[];
  impactFactor: number; // 1-10 scale
  duration: number; // in weeks
  startWeek: number;
  endWeek?: number;
}

// Main game state
export interface GameState {
  screen: GameScreen;
  previousScreen: GameScreen | null;
  character: CharacterInfo | null;
  currentWeek: number;
  currentYear: number;
  songs: Song[];
  musicVideos: MusicVideo[];
  albums?: Album[]; // Added for album system
  socialMedia: SocialMediaPlatform[];
  socialMediaStats?: SocialMediaStats; // Added for enhanced social media system
  streamingPlatforms: StreamingPlatform[];
  videosPlatforms: VideosPlatform[];
  stats: PlayerStats;
  aiRappers: AIRapper[];
  beefs?: Beef[]; // Optional to maintain backward compatibility
  subscriptionInfo: SubscriptionInfo;
  activeRandomEvents: RandomEvent[];
  resolvedRandomEvents: RandomEvent[];
  collaborationRequests: FeatureRequest[];
  shopItems: ShopItem[];
  weeklyStats: WeeklyStats[];
  // New features
  venues?: Venue[];
  tours?: Tour[];
  concerts?: Concert[];
  skills?: Skill[];
  activeSkillTrainings?: SkillTraining[];
  completedSkillTrainings?: SkillTraining[];
  // Hype and controversy systems
  activeHypeEvents?: HypeEvent[]; // Track ongoing hype for releases
  pastHypeEvents?: HypeEvent[]; // Historical hype events
  activeControversies?: Controversy[]; // Current controversies
  pastControversies?: Controversy[]; // Historical controversies
  // Merchandise system
  merchandiseItems?: MerchandiseItem[]; // Available merchandise items to sell
  merchandiseSales?: MerchandiseWeeklySales[]; // Weekly sales history
  // Media events system
  upcomingMediaEvents?: MediaEvent[]; // Upcoming media events (festivals, talk shows, interviews)
  invitedMediaEvents?: MediaEvent[]; // Media events the player has been invited to
  confirmedMediaEvents?: MediaEvent[]; // Media events the player has confirmed attendance
  completedMediaEvents?: MediaEvent[]; // Historical media events the player has participated in
  missedMediaEvents?: MediaEvent[]; // Media events the player missed or declined
  
  // Market trends system
  activeMarketTrends?: MarketTrend[]; // Currently active market trends
  pastMarketTrends?: MarketTrend[]; // Historical market trends
  
  // Awards and certifications system
  awards?: Award[]; // Awards won or nominated for
  nominations?: Award[]; // Separate list of just nominations (not wins)
  upcomingAwardShows?: Award[]; // Upcoming award show events the player might be nominated for
  
  // Team management system
  teamMembers?: TeamMember[]; // Current team members (hired staff)
  availableTeamMembers?: TeamMember[]; // Staff available to hire
  
  // Jobs system
  availableJobs?: Job[]; // Jobs available to apply for
  appliedJobs?: Job[]; // Jobs the player has applied for but not started
  activeJobs?: ActiveJob[]; // Jobs currently being worked
  completedJobs?: JobHistory[]; // Jobs completed in the past
  
  // News and magazine system
  newsArticles?: NewsArticle[]; // News articles from the music industry
  unreadNewsCount?: number; // Count of unread news articles
  
  // Premium store properties
  week?: number; // Alias for currentWeek for NewStorePanel
  userId?: number; // User ID for purchases
  cash?: number; // Alias for stats.wealth
  premiumUser?: boolean; // Whether the user has any premium subscription
  subscriptionActive?: boolean; // Whether the user's subscription is active
  subscriptionTier?: string; // The tier of subscription (standard, premium, platinum)
  
  // Update game state function
  updateGameState?: (updates: Partial<GameState>) => void;
}