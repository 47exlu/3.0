import { AIRapper, Job, JobCategory, JobDifficulty, NewsArticle, NewsCategory, NewsImpact, SongTier, TeamMember, TeamMemberBenefit, TeamMemberRole } from "./types";

// Default AI rappers in the game
export const DEFAULT_AI_RAPPERS: AIRapper[] = [
  {
    id: "rapper_1",
    name: "21 Savvage", // Based on 21 Savage
    image: "/assets/covers/rapper_1.jpg",
    bio: "Known for his cold delivery and street tales, 21 Savvage rose from the Atlanta trap scene to become a household name. His authentic style and consistent output have earned him respect throughout the industry.",
    popularity: 85,
    monthlyListeners: 12500000,
    totalStreams: 450000000, // Lifetime streams for established artist
    style: "Trap",
    personality: "mysterious",
    featureCost: 75000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_2",
    name: "Lil Babby", // Based on Lil Baby
    image: "/assets/covers/rapper_2.jpg",
    bio: "In just a few years, Lil Babby has gone from recording in a makeshift studio to being one of rap's most consistent hitmakers. His melodic flow and relatable lyrics resonate with millions of fans worldwide.",
    popularity: 90,
    monthlyListeners: 15000000,
    totalStreams: 520000000,
    style: "Trap",
    personality: "friendly",
    featureCost: 85000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_3",
    name: "Drakke", // Based on Drake
    image: "/assets/covers/rapper_3.jpg",
    bio: "The undisputed king of streaming, Drakke has dominated charts for over a decade. His ability to blend rap with R&B and pop elements has made him the most commercially successful rapper of his generation.",
    popularity: 95,
    monthlyListeners: 40000000, 
    totalStreams: 1200000000, // Billion+ streams for top tier artist
    style: "Hip Hop/R&B",
    personality: "arrogant",
    featureCost: 250000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_4",
    name: "Lil Drukk", // Based on Lil Durk
    image: "/assets/covers/rapper_4.jpg",
    bio: "With his distinct vocal style and genre-bending approach, Lil Drukk has created a unique lane in modern rap. His experimental beats and atmospheric tracks have influenced countless artists.",
    popularity: 80,
    monthlyListeners: 8000000,
    totalStreams: 320000000,
    style: "Trap/Mumble",
    personality: "mysterious",
    featureCost: 65000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_5",
    name: "King Vonn", // Based on King Von
    image: "/assets/covers/rapper_5.jpg",
    bio: "Rising from Chicago's drill scene, King Vonn's raw storytelling and unflinching lyrics paint a vivid picture of street life. His drill anthems have become the soundtrack for a generation.",
    popularity: 75,
    monthlyListeners: 5000000,
    totalStreams: 180000000,
    style: "Drill",
    personality: "controversial",
    featureCost: 45000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_6",
    name: "Naas", // Based on Nas
    image: "/assets/covers/rapper_6.jpg",
    bio: "A veteran in the game, Naas represents the golden age of hip-hop. His complex rhyme schemes and storytelling abilities have earned him respect among purists who value lyrical craft above all.",
    popularity: 65,
    monthlyListeners: 2000000,
    totalStreams: 80000000,
    style: "Old School",
    personality: "humble",
    featureCost: 25000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_7",
    name: "Thugg", // Based on Young Thug
    image: "/assets/covers/rapper_7.jpg",
    bio: "Thugg combines catchy hooks with street credibility. His rise from local fame to national recognition proves his versatility and unique vocal approach in the competitive rap landscape.",
    popularity: 70,
    monthlyListeners: 3500000,
    totalStreams: 120000000,
    style: "Trap/Hip Hop",
    personality: "arrogant",
    featureCost: 35000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_8",
    name: "M.F. Gloom", // Based on MF DOOM
    image: "/assets/covers/rapper_8.jpg",
    bio: "An underground legend, M.F. Gloom prioritizes lyrical prowess over commercial success. His dedicated fanbase values his wordplay and philosophical insights that elevate rap to poetry.",
    popularity: 55,
    monthlyListeners: 1200000,
    totalStreams: 45000000,
    style: "Lyrical",
    personality: "humble",
    featureCost: 15000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_9",
    name: "Post Melon", // Based on Post Malone
    image: "/assets/covers/rapper_9.jpg",
    bio: "Blurring the lines between rap, rock, and pop, Post Melon has created a distinctive sound that appeals to fans across genres. His tattooed image and genre-bending music have made him a cultural icon.",
    popularity: 92,
    monthlyListeners: 38000000,
    totalStreams: 950000000,
    style: "Alternative/Hip Hop",
    personality: "friendly",
    featureCost: 150000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_10",
    name: "Jay-C", // Based on Jay-Z
    image: "/assets/covers/rapper_10.jpg",
    bio: "More than just a rapper, Jay-C is a business mogul who has transcended music to become a cultural institution. His lyrical prowess and entrepreneurial spirit have made him a blueprint for success.",
    popularity: 98,
    monthlyListeners: 45000000,
    totalStreams: 1800000000, // Almost 2 billion streams for legend
    style: "Hip Hop/Business",
    personality: "arrogant",
    featureCost: 500000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_11",
    name: "Eminence", // Based on Eminem
    image: "/assets/covers/rapper_11.jpg",
    bio: "Widely respected as one of the greatest technical rappers of all time, Eminence's lightning-fast delivery and complex rhyme schemes have pushed the boundaries of what's possible in hip-hop.",
    popularity: 94,
    monthlyListeners: 42000000,
    totalStreams: 1600000000, // 1.6 billion streams
    style: "Rap/Lyrical",
    personality: "controversial",
    featureCost: 350000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_12",
    name: "Chant the Rapper", // Based on Chance the Rapper
    image: "/assets/covers/rapper_12.jpg",
    bio: "Starting as a producer before transitioning to rapping, Chant brings a unique musicality to his work. His uplifting messages and innovative production have created a distinctive positive lane in modern rap.",
    popularity: 87,
    monthlyListeners: 30000000,
    totalStreams: 820000000,
    style: "Melodic Rap",
    personality: "friendly",
    featureCost: 90000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_13",
    name: "Doja Feline", // Based on Doja Cat
    image: "/assets/covers/rapper_13.jpg",
    bio: "Blending pop sensibilities with genuine rap skills, Doja Feline has become one of the most versatile artists in the industry. Her viral hits and captivating performances have built a massive following.",
    popularity: 89,
    monthlyListeners: 32000000,
    totalStreams: 880000000,
    style: "Pop/Rap",
    personality: "friendly",
    featureCost: 100000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_14",
    name: "Nikki Mirage", // Based on Nicki Minaj
    image: "/assets/covers/rapper_14.jpg",
    bio: "One of the most successful female rappers of all time, Nikki Mirage combines technical skill with theatrical flair. Her larger-than-life persona and versatile flow have broken barriers in the male-dominated rap industry.",
    popularity: 93,
    monthlyListeners: 36000000,
    totalStreams: 980000000,
    style: "Female Rap",
    personality: "arrogant",
    featureCost: 200000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_15",
    name: "Skepta Cal", // Based on Skepta
    image: "/assets/covers/rapper_15.jpg",
    bio: "Leading the UK grime scene to international recognition, Skepta Cal brings British slang and rapid-fire delivery to create a distinct sound that stands out from American rap styles.",
    popularity: 78,
    monthlyListeners: 7000000,
    totalStreams: 250000000,
    style: "Grime/UK Rap",
    personality: "controversial",
    featureCost: 50000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_16",
    name: "Kendrik", // Based on Kendrick Lamar
    image: "/assets/covers/rapper_16.jpg",
    bio: "Bringing thoughtful lyrics and social commentary to the mainstream, Kendrik proves conscious rap can be commercially successful. His authentic approach and message-driven music resonate across generations.",
    popularity: 82,
    monthlyListeners: 9000000,
    totalStreams: 350000000,
    style: "Conscious Rap",
    personality: "humble",
    featureCost: 60000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_17",
    name: "Gunna Wunna", // Based on Gunna
    image: "/assets/covers/rapper_17.jpg",
    bio: "Rising from the Southern trap scene, Gunna Wunna has quickly made a name for himself with his authentic street narratives and distinctive production style. His lyrics reflect the harsh realities of his upbringing.",
    popularity: 73,
    monthlyListeners: 4500000,
    totalStreams: 160000000,
    style: "Trap",
    personality: "mysterious",
    featureCost: 40000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_18",
    name: "Tech N9na", // Based on Tech N9ne
    image: "/assets/covers/rapper_18.jpg",
    bio: "Known for his mind-boggling speed and technical precision, Tech N9na has carved out a niche with his rapid-fire delivery and complex rhyme patterns. His dedicated fanbase values technical skill above all else.",
    popularity: 79,
    monthlyListeners: 6500000,
    totalStreams: 230000000,
    style: "Speed Rap/Technical",
    personality: "humble",
    featureCost: 55000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_19",
    name: "Juicee", // Based on Juice WRLD
    image: "/assets/covers/rapper_19.jpg",
    bio: "Pioneering the emo-rap movement, Juicee blends emotional vulnerability with trap production. His honest exploration of mental health struggles has created a deep connection with a generation of listeners.",
    popularity: 76,
    monthlyListeners: 5200000,
    totalStreams: 185000000,
    style: "Emo Rap",
    personality: "mysterious",
    featureCost: 48000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_20",
    name: "J. Colee", // Based on J. Cole
    image: "/assets/covers/rapper_20.jpg",
    bio: "Merging jazz influences with hip-hop sensibilities, J. Colee represents the sophisticated side of rap. His smooth delivery and thoughtful lyrics appeal to listeners looking for substance and musical innovation.",
    popularity: 72,
    monthlyListeners: 4000000,
    totalStreams: 145000000,
    style: "Jazz Rap",
    personality: "humble",
    featureCost: 38000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_21",
    name: "Travi$ Scott", // Based on Travis Scott
    image: "/assets/covers/rapper_21.jpg",
    bio: "A hitmaker with an impeccable ear for catchy hooks, Travi$ Scott consistently delivers chart-topping singles. His production skills and musical instincts have created a distinctive sound in modern trap.",
    popularity: 88,
    monthlyListeners: 26000000,
    totalStreams: 780000000,
    style: "Commercial Rap",
    personality: "arrogant",
    featureCost: 120000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_22",
    name: "Megan Thee Thoroughbred", // Based on Megan Thee Stallion
    image: "/assets/covers/rapper_22.jpg",
    bio: "Breaking barriers in the male-dominated rap scene, Megan Thee Thoroughbred combines fierce independence with undeniable skill. Her empowering messages inspire fans while her technical abilities silence critics.",
    popularity: 81,
    monthlyListeners: 8500000,
    totalStreams: 320000000,
    style: "Female Hip Hop",
    personality: "controversial",
    featureCost: 70000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_23",
    name: "Snoop Catt", // Based on Snoop Dogg
    image: "/assets/covers/rapper_23.jpg",
    bio: "Carrying the torch for California rap, Snoop Catt blends G-funk influences with modern production. His laid-back flow and regional pride have made him an icon in his city and beyond.",
    popularity: 84,
    monthlyListeners: 11000000,
    totalStreams: 400000000,
    style: "West Coast",
    personality: "friendly",
    featureCost: 80000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  },
  {
    id: "rapper_24",
    name: "Tyler, The Inventor", // Based on Tyler, The Creator
    image: "/assets/covers/rapper_24.jpg",
    bio: "Bringing a playful energy and innovative approach to hip-hop, Tyler, The Inventor combines clever wordplay with unique production. His creative vision and artistic growth have built a diverse fanbase spanning multiple generations.",
    popularity: 86,
    monthlyListeners: 18000000,
    totalStreams: 650000000,
    style: "Alternative Rap",
    personality: "friendly",
    featureCost: 95000,
    relationship: "neutral",
    collabHistory: {
      count: 0,
      lastWeek: 0,
      tracks: []
    }
  }
];

// Song tier information
export const SONG_TIER_INFO = {
  1: {
    name: "Bad",
    description: "Poor quality song with no success potential",
    successChance: 0,
    popularityWeeks: 8,  // Significantly increased from 1 week
    cost: 500,
    minStreams: 0,
    maxStreams: 10000,
    minQuality: 20
  },
  2: {
    name: "Mid",
    description: "Average song with minimal success chance (1%)",
    successChance: 0.01,
    popularityWeeks: 12, // Significantly increased from 2 weeks
    cost: 1000,
    minStreams: 10000,
    maxStreams: 100000,
    minQuality: 30
  },
  3: {
    name: "Normal",
    description: "Decent song with moderate hit potential (25%)",
    successChance: 0.25,
    popularityWeeks: 20, // Significantly increased from 4 weeks
    cost: 2500,
    minStreams: 100000,
    maxStreams: 1000000,
    minQuality: 50
  },
  4: {
    name: "Hit",
    description: "Excellent song guaranteed for major success",
    successChance: 1.0,
    popularityWeeks: 104, // 2 years
    cost: 10000,
    minStreams: 1000000,
    maxStreams: 900000000,
    minQuality: 75
  },
  5: {
    name: "Banger",
    description: "Legendary song with permanent popularity",
    successChance: 1.0,
    popularityWeeks: -1, // Never expires
    cost: 25000,
    minStreams: 10000000,
    maxStreams: 2000000000, // 2 billion streams cap (instead of unlimited)
    minQuality: 90
  }
} as Record<SongTier, {
  name: string;
  description: string;
  successChance: number;
  popularityWeeks: number;
  cost: number;
  minStreams: number;
  maxStreams: number;
  minQuality: number;
}>;

// Default shop items (purchasable songs)
export const DEFAULT_SHOP_ITEMS = [
  {
    id: "shop_1",
    name: "Platinum Flow",
    description: "A pre-written hit song guaranteed to top the charts",
    cost: 10000,
    tier: 4 as SongTier,
    purchased: false
  },
  {
    id: "shop_2",
    name: "Diamond Rhymes",
    description: "A legendary banger that will cement your legacy",
    cost: 25000,
    tier: 5 as SongTier,
    purchased: false
  },
  {
    id: "shop_3", 
    name: "Golden Verses",
    description: "Solid lyrics that will give you a normal hit",
    cost: 2500,
    tier: 3 as SongTier,
    purchased: false
  },
  {
    id: "shop_4",
    name: "Silver Bars",
    description: "Decent but mid-level lyrics with minimal success chance",
    cost: 1000,
    tier: 2 as SongTier,
    purchased: false
  },
  {
    id: "shop_5",
    name: "Industry Anthem",
    description: "A powerful hit song crafted by top industry producers",
    cost: 12000,
    tier: 4 as SongTier,
    purchased: false
  },
  {
    id: "shop_6",
    name: "Viral Hooks",
    description: "Catchy hooks designed to go viral on social media",
    cost: 8000,
    tier: 4 as SongTier,
    purchased: false
  },
  {
    id: "shop_7",
    name: "Underground Classic",
    description: "A respected track that will gain cult following",
    cost: 5000,
    tier: 3 as SongTier,
    purchased: false
  },
  {
    id: "shop_8",
    name: "Summer Anthem",
    description: "The perfect track for summer playlists",
    cost: 7500,
    tier: 4 as SongTier,
    purchased: false
  },
  {
    id: "shop_9",
    name: "Timeless Flow",
    description: "A legendary flow that transcends generations",
    cost: 30000,
    tier: 5 as SongTier,
    purchased: false
  },
  {
    id: "shop_10",
    name: "Club Banger",
    description: "Perfect for nightclubs and parties",
    cost: 6000,
    tier: 3 as SongTier,
    purchased: false
  }
];

// Feature request chance by tier and fame level
export const FEATURE_REQUEST_CHANCES = {
  3: {
    low: 0.05,   // 5% chance for tier 3 feature if player is not famous
    medium: 0.2,  // 20% chance for tier 3 feature if player has medium fame
    high: 0.4     // 40% chance for tier 3 feature if player is famous
  },
  4: {
    low: 0.01,   // 1% chance for tier 4 feature if player is not famous
    medium: 0.1,  // 10% chance for tier 4 feature if player has medium fame
    high: 0.6     // 60% chance for tier 4 feature if player is famous
  },
  5: {
    low: 0.001,  // 0.1% chance for tier 5 feature if player is not famous
    medium: 0.005, // 0.5% chance for tier 5 feature if player has medium fame
    high: 0.01    // 1% chance for tier 5 feature if player is famous
  }
};

// Social media post costs and effects
export const SOCIAL_MEDIA_COSTS = {
  "Twitter": {
    postCost: 0,
    followerGainRange: [10, 1000],
    postEngagementRange: [1, 5]  // percent
  },
  "Instagram": {
    postCost: 0,  // Free (was 100)
    followerGainRange: [50, 2000],
    postEngagementRange: [3, 8]  // percent
  },
  "TikTok": {
    postCost: 0,  // Free (was 200)
    followerGainRange: [100, 5000],
    postEngagementRange: [5, 15] // percent
  }
};

// Music video costs and effects
export const VIDEO_COSTS = {
  "YouTube": {
    baseCost: 1000,
    basic: 1000,
    premium: 5000,
    viewsMultiplierBasic: [1, 2],
    viewsMultiplierPremium: [2, 5]
  },
  "VEVO": {
    baseCost: 2000,
    basic: 2000,
    premium: 10000,
    viewsMultiplierBasic: [1.5, 3],
    viewsMultiplierPremium: [3, 8]
  }
};

// Career level thresholds
export const CAREER_LEVELS = [
  { level: 1, name: "Unknown", totalStreamsRequired: 0 },
  { level: 2, name: "Local Artist", totalStreamsRequired: 100000 },
  { level: 3, name: "Rising Star", totalStreamsRequired: 1000000 },
  { level: 4, name: "Regional Act", totalStreamsRequired: 10000000 },
  { level: 5, name: "National Artist", totalStreamsRequired: 50000000 },
  { level: 6, name: "Mainstream", totalStreamsRequired: 100000000 },
  { level: 7, name: "Superstar", totalStreamsRequired: 500000000 },
  { level: 8, name: "Global Icon", totalStreamsRequired: 1000000000 },
  { level: 9, name: "Legend", totalStreamsRequired: 5000000000 },
  { level: 10, name: "GOAT", totalStreamsRequired: 10000000000 }
];

// Venues for concerts and tours
export const DEFAULT_VENUES = [
  {
    id: "venue_1",
    name: "The Basement",
    city: "New York",
    country: "USA",
    size: "small",
    capacity: 200,
    cost: 500,
    reputationRequired: 10,
    image: "/images/venues/small_venue.jpg"
  },
  {
    id: "venue_2",
    name: "Club Echo",
    city: "Los Angeles",
    country: "USA",
    size: "small",
    capacity: 350,
    cost: 800,
    reputationRequired: 20,
    image: "/images/venues/small_venue_2.jpg"
  },
  {
    id: "venue_3",
    name: "Urban Lounge",
    city: "Chicago",
    country: "USA",
    size: "medium",
    capacity: 800,
    cost: 2000,
    reputationRequired: 30,
    image: "/images/venues/medium_venue.jpg"
  },
  {
    id: "venue_4",
    name: "The Metro",
    city: "Atlanta",
    country: "USA",
    size: "medium",
    capacity: 1200,
    cost: 3500,
    reputationRequired: 40,
    image: "/images/venues/medium_venue_2.jpg"
  },
  {
    id: "venue_5",
    name: "House of Blues",
    city: "Miami",
    country: "USA",
    size: "large",
    capacity: 2500,
    cost: 8000,
    reputationRequired: 50,
    image: "/images/venues/large_venue.jpg"
  },
  {
    id: "venue_6",
    name: "Showbox Theater",
    city: "Seattle",
    country: "USA",
    size: "large",
    capacity: 3800,
    cost: 12000,
    reputationRequired: 60,
    image: "/images/venues/large_venue_2.jpg"
  },
  {
    id: "venue_7",
    name: "Crypto Arena",
    city: "Los Angeles",
    country: "USA",
    size: "arena",
    capacity: 15000,
    cost: 50000,
    reputationRequired: 70,
    image: "/images/venues/arena_venue.jpg"
  },
  {
    id: "venue_8",
    name: "Madison Square Garden",
    city: "New York",
    country: "USA",
    size: "arena",
    capacity: 20000,
    cost: 75000,
    reputationRequired: 80,
    image: "/images/venues/arena_venue_2.jpg"
  },
  {
    id: "venue_9",
    name: "SoFi Stadium",
    city: "Los Angeles",
    country: "USA",
    size: "stadium",
    capacity: 70000,
    cost: 250000,
    reputationRequired: 90,
    image: "/images/venues/stadium_venue.jpg"
  },
  {
    id: "venue_10",
    name: "MetLife Stadium",
    city: "New Jersey",
    country: "USA",
    size: "stadium",
    capacity: 82500,
    cost: 350000,
    reputationRequired: 95,
    image: "/images/venues/stadium_venue_2.jpg"
  }
];

// Default skills for training
export const DEFAULT_SKILLS = [
  {
    name: "creativity",
    displayName: "Creativity",
    level: 1,
    maxLevel: 10,
    description: "Ability to create unique and engaging music. Higher levels unlock better quality music production.",
    trainingCost: 1000
  },
  {
    name: "marketing",
    displayName: "Marketing",
    level: 1,
    maxLevel: 10,
    description: "Skills for promoting your music. Higher levels increase engagement and follower growth.",
    trainingCost: 1200
  },
  {
    name: "networking",
    displayName: "Networking",
    level: 1,
    maxLevel: 10,
    description: "Building connections in the industry. Higher levels improve chances of successful collaborations.",
    trainingCost: 1500
  },
  {
    name: "performance",
    displayName: "Performance",
    level: 1,
    maxLevel: 10,
    description: "Stage presence and live show skills. Higher levels improve concert revenue and audience satisfaction.",
    trainingCost: 2000
  },
  {
    name: "production",
    displayName: "Production",
    level: 1,
    maxLevel: 10,
    description: "Technical skills for creating beats and music. Higher levels improve song quality.",
    trainingCost: 1800
  },
  {
    name: "business",
    displayName: "Business Acumen",
    level: 1,
    maxLevel: 10,
    description: "Management and financial skills. Higher levels increase revenue and negotiation power.",
    trainingCost: 2500
  }
];

// Available team members that can be hired
export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "manager_1",
    name: "Alex Thompson",
    role: "manager",
    hired: false,
    salary: 2000,
    quality: 65,
    experience: 70,
    specialization: "Indie Artists",
    description: "Entry-level manager who can help you navigate the music industry and negotiate better deals.",
    bio: "Former indie label executive with solid connections in the underground scene. Good starting manager for new artists who value creative control.",
    image: "/assets/team/manager_1.jpg",
    benefits: [
      {
        type: "revenueBoost",
        description: "Negotiates better streaming rates, increasing overall revenue",
        value: 10 // 10% boost to all revenue
      },
      {
        type: "controversyProtection",
        description: "Helps manage public relations during controversies",
        value: 15 // 15% reduction in negative impact from controversies
      }
    ],
    levelRequirement: 2
  },
  {
    id: "manager_2",
    name: "Sophia Rodriguez",
    role: "manager",
    hired: false,
    salary: 5000,
    quality: 85,
    experience: 90,
    specialization: "Mainstream Artists",
    bio: "Industry veteran who's managed several platinum-selling artists. Demands a higher salary but delivers exceptional results for established performers.",
    image: "/assets/team/manager_2.jpg",
    benefits: [
      {
        type: "revenueBoost",
        description: "Secures major deals and partnerships for substantial revenue growth",
        value: 25 // 25% boost to all revenue
      },
      {
        type: "streamingBoost",
        description: "Uses industry connections to get your music on key playlists",
        value: 20 // 20% boost to streaming numbers
      },
      {
        type: "controversyProtection",
        description: "Expert at crisis management and reputation repair",
        value: 30 // 30% reduction in negative impact from controversies
      }
    ],
    levelRequirement: 5
  },
  {
    id: "publicist_1",
    name: "Marcus Green",
    role: "publicist",
    hired: false,
    salary: 1500,
    quality: 60,
    experience: 65,
    specialization: "Social Media",
    bio: "Digital-first publicist who specializes in building organic buzz through social media campaigns and viral marketing tactics.",
    image: "/assets/team/publicist_1.jpg",
    benefits: [
      {
        type: "socialMediaBoost",
        description: "Increases engagement and follower growth across platforms",
        value: 15, // 15% boost to social media growth
        affectedArea: "all"
      },
      {
        type: "streamingBoost",
        description: "Creates campaigns that drive listeners to your music",
        value: 10 // 10% boost to streaming numbers
      }
    ],
    levelRequirement: 2
  },
  {
    id: "publicist_2",
    name: "Victoria Chang",
    role: "publicist",
    hired: false,
    salary: 4000,
    quality: 80,
    experience: 85,
    specialization: "Traditional Media",
    bio: "Connected publicist with strong relationships at major publications, TV shows, and radio stations. Can get you premium coverage others can't access.",
    image: "/assets/team/publicist_2.jpg",
    benefits: [
      {
        type: "socialMediaBoost",
        description: "Gets your content featured by major media accounts",
        value: 25, // 25% boost to social media growth
        affectedArea: "all"
      },
      {
        type: "reputationBoost",
        description: "Secures high-profile interviews and features",
        value: 15 // 15% faster reputation growth
      },
      {
        type: "controversyProtection",
        description: "Skilled at spinning negative stories into positive narratives",
        value: 20 // 20% reduction in negative impact from controversies
      }
    ],
    levelRequirement: 4
  },
  {
    id: "producer_1",
    name: "Jay Beats",
    role: "producer",
    hired: false,
    salary: 2500,
    quality: 70,
    experience: 65,
    specialization: "Trap Production",
    bio: "Up-and-coming producer with a knack for creating catchy trap beats. Can help speed up your production process and improve track quality.",
    image: "/assets/team/producer_1.jpg",
    benefits: [
      {
        type: "productionSpeed",
        description: "Helps create songs faster",
        value: 20 // 20% faster song production
      },
      {
        type: "skillBoost",
        description: "Enhances your production abilities",
        value: 15, // +15% to production skill effectiveness
        affectedArea: "production"
      }
    ],
    levelRequirement: 3
  },
  {
    id: "tourManager_1",
    name: "Derek Williams",
    role: "tourManager",
    hired: false,
    salary: 3000,
    quality: 75,
    experience: 80,
    specialization: "Logistics & Planning",
    bio: "Experienced tour manager who keeps everything running smoothly on the road. Maximizes revenue while controlling costs.",
    image: "/assets/team/tourManager_1.jpg",
    benefits: [
      {
        type: "tourRevenue",
        description: "Optimizes ticket pricing and venue selection",
        value: 20 // 20% increased tour revenue
      },
      {
        type: "productionSpeed",
        description: "Allows you to work on music while touring",
        value: 10 // 10% production speed even during tours
      }
    ],
    levelRequirement: 4
  },
  {
    id: "socialMediaManager_1",
    name: "Zoe Chen",
    role: "socialMediaManager",
    hired: false,
    salary: 1800,
    quality: 75,
    experience: 70,
    specialization: "Content Strategy",
    bio: "Digital native with deep understanding of platform algorithms and trends. Makes your social media presence more professional and engaging.",
    image: "/assets/team/socialMediaManager_1.jpg",
    benefits: [
      {
        type: "socialMediaBoost",
        description: "Creates consistent, high-quality content across platforms",
        value: 30, // 30% boost to social media growth
        affectedArea: "all"
      },
      {
        type: "merchandiseSales",
        description: "Uses social channels to promote merchandise",
        value: 15 // 15% boost to merchandise sales
      }
    ],
    levelRequirement: 3
  }
];

// Default jobs available in the game
export const DEFAULT_JOBS: Job[] = [
  {
    id: "job_studio_assistant_1",
    title: "Studio Assistant",
    description: "Help recording artists set up equipment and handle basic tasks in a local recording studio.",
    category: "studio",
    difficulty: "entry",
    duration: 4, // 4 weeks
    payRate: 300, // $ per week
    reputationGain: 5,
    skillGains: {
      creativity: 1,
      networking: 2,
      production: 3
    },
    requirementsMet: true,
    requirements: {
      reputation: 0,
      careerLevel: 0
    },
    available: true,
    status: "available",
    hoursPerWeek: 15,
    successChance: 0.95
  },
  {
    id: "job_sound_technician_1",
    title: "Sound Technician",
    description: "Operate sound equipment for small live performances and events.",
    category: "performing",
    difficulty: "basic",
    duration: 6,
    payRate: 450,
    reputationGain: 8,
    skillGains: {
      production: 2,
      performance: 2,
      networking: 1
    },
    requirementsMet: true,
    requirements: {
      reputation: 10,
      careerLevel: 1
    },
    available: true,
    status: "available",
    hoursPerWeek: 20,
    successChance: 0.9
  },
  {
    id: "job_beatmaker_1",
    title: "Freelance Beat Producer",
    description: "Create and sell beats to up-and-coming artists in your local scene.",
    category: "freelance",
    difficulty: "basic",
    duration: 8,
    payRate: 500,
    reputationGain: 10,
    skillGains: {
      creativity: 4,
      production: 3,
      business: 1
    },
    requirementsMet: true,
    requirements: {
      reputation: 15,
      skills: {
        creativity: 20,
        production: 15
      },
      careerLevel: 1
    },
    available: true,
    status: "available",
    hoursPerWeek: 25,
    successChance: 0.85
  },
  {
    id: "job_music_blogger_1",
    title: "Music Blogger",
    description: "Write articles and reviews for a hip-hop blog, covering new releases and upcoming artists.",
    category: "media",
    difficulty: "entry",
    duration: 10,
    payRate: 350,
    reputationGain: 12,
    skillGains: {
      marketing: 3,
      networking: 2,
      business: 1
    },
    requirementsMet: true,
    requirements: {
      reputation: 5,
      careerLevel: 0
    },
    available: true,
    status: "available",
    hoursPerWeek: 10,
    successChance: 0.95
  },
  {
    id: "job_radio_host_1",
    title: "College Radio Host",
    description: "Host a weekly hip-hop show on your local college radio station.",
    category: "media",
    difficulty: "intermediate",
    duration: 12,
    payRate: 600,
    reputationGain: 25,
    skillGains: {
      networking: 4,
      marketing: 3,
      performance: 2
    },
    requirementsMet: false,
    requirements: {
      reputation: 30,
      careerLevel: 2
    },
    available: true,
    status: "available",
    hoursPerWeek: 15,
    successChance: 0.8
  },
  {
    id: "job_venue_promoter_1",
    title: "Venue Promoter",
    description: "Promote events and concerts at a local music venue, handling ticket sales and marketing.",
    category: "industry",
    difficulty: "intermediate",
    duration: 8,
    payRate: 700,
    reputationGain: 20,
    skillGains: {
      marketing: 5,
      networking: 4,
      business: 3
    },
    requirementsMet: false,
    requirements: {
      reputation: 40,
      skills: {
        marketing: 25,
        networking: 20
      },
      careerLevel: 2
    },
    available: true,
    status: "available",
    hoursPerWeek: 30,
    successChance: 0.75
  },
  {
    id: "job_music_teacher_1",
    title: "Music Production Teacher",
    description: "Teach basic music production skills at a community center to aspiring producers.",
    category: "teaching",
    difficulty: "intermediate",
    duration: 10,
    payRate: 550,
    reputationGain: 15,
    skillGains: {
      creativity: 2,
      production: 3,
      business: 1
    },
    requirementsMet: false,
    requirements: {
      reputation: 25,
      skills: {
        production: 35
      },
      careerLevel: 2
    },
    available: true,
    status: "available",
    hoursPerWeek: 12,
    successChance: 0.9
  },
  {
    id: "job_social_media_manager_1",
    title: "Artist Social Media Manager",
    description: "Manage social media accounts for a small roster of local artists, increasing their online presence.",
    category: "industry",
    difficulty: "advanced",
    duration: 14,
    payRate: 900,
    reputationGain: 30,
    skillGains: {
      marketing: 6,
      networking: 4,
      business: 3
    },
    requirementsMet: false,
    requirements: {
      reputation: 60,
      skills: {
        marketing: 40,
        networking: 30
      },
      careerLevel: 3
    },
    available: true,
    status: "available",
    hoursPerWeek: 25,
    successChance: 0.7
  },
  {
    id: "job_studio_producer_1",
    title: "Assistant Producer",
    description: "Work alongside an established producer in a professional recording studio, helping with various aspects of music production.",
    category: "studio",
    difficulty: "advanced",
    duration: 16,
    payRate: 1200,
    reputationGain: 40,
    skillGains: {
      creativity: 5,
      production: 8,
      networking: 3
    },
    requirementsMet: false,
    requirements: {
      reputation: 70,
      skills: {
        creativity: 45,
        production: 50
      },
      careerLevel: 3
    },
    available: true,
    status: "available",
    hoursPerWeek: 40,
    successChance: 0.65
  },
  {
    id: "job_label_scout_1",
    title: "Record Label Talent Scout",
    description: "Discover new talent for an independent record label, attending shows and reviewing demos.",
    category: "industry",
    difficulty: "expert",
    duration: 20,
    payRate: 1500,
    reputationGain: 50,
    skillGains: {
      networking: 7,
      business: 5,
      marketing: 3
    },
    requirementsMet: false,
    requirements: {
      reputation: 85,
      skills: {
        networking: 60,
        business: 45
      },
      careerLevel: 4
    },
    available: true,
    status: "available",
    hoursPerWeek: 35,
    successChance: 0.6
  },
  {
    id: "job_tour_dj_1",
    title: "Supporting Tour DJ",
    description: "Perform as an opening DJ for a popular artist's regional tour dates.",
    category: "performing",
    difficulty: "expert",
    duration: 12,
    payRate: 2000,
    reputationGain: 60,
    skillGains: {
      performance: 10,
      networking: 8,
      marketing: 4
    },
    requirementsMet: false,
    requirements: {
      reputation: 100,
      skills: {
        performance: 70,
        networking: 50
      },
      careerLevel: 4
    },
    available: true,
    status: "available",
    hoursPerWeek: 50,
    successChance: 0.5
  },
  {
    id: "job_ghostwriter_1",
    title: "Ghostwriter",
    description: "Write lyrics for established artists without public credit. High pay but no public recognition.",
    category: "freelance",
    difficulty: "expert",
    duration: 6,
    payRate: 2500,
    reputationGain: 0, // No reputation gain since it's ghost work
    skillGains: {
      creativity: 12,
      production: 5
    },
    requirementsMet: false,
    requirements: {
      reputation: 50,
      skills: {
        creativity: 75
      },
      careerLevel: 4
    },
    available: true,
    status: "available",
    hoursPerWeek: 30,
    successChance: 0.7
  }
];

// Sample music industry news articles
export const DEFAULT_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news_industry_streaming_1",
    title: "Streaming Platforms Raise Royalty Rates After Artist Outcry",
    content: `In a significant industry shift, major streaming platforms have announced an increase in royalty rates paid to artists following months of protests and advocacy from musicians at all levels.

The movement, which gained momentum after several high-profile artists removed their catalogs from streaming services, has resulted in a 15% increase in per-stream payments, according to industry insiders.

"This is a step in the right direction," said industry analyst Maria Chen. "Artists have been vocal about the unsustainability of previous rates, especially for independent musicians trying to make a living."

Streaming platforms issued a joint statement emphasizing their commitment to supporting the creative community while maintaining a sustainable business model. The new rates will take effect at the beginning of next quarter.

Independent artists have cautiously welcomed the news, though many argue that further improvements are needed for streaming to become truly equitable for creators.`,
    summary: "Major streaming services have increased artist payouts by 15% following industry pressure and artist protests.",
    category: "industry",
    impact: "high",
    publishedWeek: 0,
    publishedYear: 0,
    sourceName: "Music Industry Today",
    sourceImage: "https://placekitten.com/50/50", // Placeholder image
    featuredImage: "https://placekitten.com/800/400", // Placeholder image
    playerMentioned: false,
    hasBeenRead: false,
    isPremium: false,
    reactions: {
      views: 25000,
      likes: 1800,
      shares: 520,
      comments: 340
    },
    tags: ["streaming", "royalties", "industry change"]
  },
  {
    id: "news_controversy_1",
    title: "Chart-Topping Producer Accused of Stealing Beats from Underground Artists",
    content: `A major controversy has erupted in the music world as acclaimed producer DJ SoundMaster faces allegations of plagiarizing beats from lesser-known artists.

Several underground producers have come forward with evidence suggesting that at least five tracks on recent platinum-selling albums produced by DJ SoundMaster bear striking similarities to their previously published work.

"The patterns are identical, just sped up and with different effects layered on top," claimed independent producer KLBeats, who shared side-by-side comparisons that have gone viral on social media.

DJ SoundMaster has denied the allegations, stating that "similar beat patterns exist throughout music history" and that "any resemblance is coincidental."

Major labels associated with the affected albums have declined to comment, but industry insiders suggest that settlements may already be in negotiation behind closed doors.

The controversy highlights ongoing issues around credit and compensation in the production world, particularly as AI-generated music and sampling techniques continue to blur the lines of originality.`,
    summary: "Famous producer accused of stealing beats from underground artists for multiple hit songs.",
    category: "controversy",
    impact: "medium",
    publishedWeek: 0,
    publishedYear: 0,
    sourceName: "Beat Street Magazine",
    sourceImage: "https://placekitten.com/51/51", // Placeholder image
    featuredImage: "https://placekitten.com/800/401", // Placeholder image
    playerMentioned: false,
    hasBeenRead: false,
    isPremium: false,
    reactions: {
      views: 42000,
      likes: 3200,
      shares: 1800,
      comments: 950
    },
    tags: ["controversy", "production", "plagiarism"]
  },
  {
    id: "news_trend_tiktok_1",
    title: "15-Second Hooks: How TikTok is Reshaping Song Structure",
    content: `Music producers and songwriters are increasingly crafting songs with TikTok virality in mind, leading to a fundamental shift in song structure across the industry.

A new study from Universal Sound Analysis reveals that hit songs from the past year are 20% more likely to feature their strongest hook within the first 15 seconds compared to hits from five years ago.

"We're seeing the 'TikTok effect' change how songs are written," explains music theorist Dr. James Wilson. "Artists are frontloading songs with catchy, loop-worthy sections that can be easily clipped for social platforms."

The trend extends beyond just placement, affecting composition itself. Verses are getting shorter, pre-choruses are being eliminated, and many songs now begin with the chorus rather than building up to it.

"It's not necessarily a negative development," notes songwriter Jamie Harris, who has penned several recent chart-toppers. "It's pushing us to be more creative and capture attention faster. Every second counts."

Some industry veterans have criticized the trend as sacrificing artistic integrity for viral potential, while others see it as a natural evolution of the art form in response to changing consumption habits.`,
    summary: "New research shows how TikTok is changing song structures, with hooks appearing earlier and songs designed for short clips.",
    category: "trend",
    impact: "medium",
    publishedWeek: 0,
    publishedYear: 0,
    sourceName: "Digital Music Trends",
    sourceImage: "https://placekitten.com/52/52", // Placeholder image
    featuredImage: "https://placekitten.com/800/402", // Placeholder image
    playerMentioned: false,
    hasBeenRead: false,
    isPremium: true,
    reactions: {
      views: 18000,
      likes: 1200,
      shares: 750,
      comments: 230
    },
    tags: ["TikTok", "song structure", "production trends"]
  },
  {
    id: "news_award_grammys_1",
    title: "Grammy Awards Announce Major Category Revamp",
    content: `The Recording Academy has unveiled significant changes to the Grammy Awards categories, responding to years of criticism about representation and relevance in the music industry's most prestigious award show.

Among the most notable changes is the addition of a new "Best Alternative Hip-Hop" category, the expansion of the urban and electronic music fields, and the redefinition of criteria for the "Best New Artist" category to better accommodate artists who gained fame through non-traditional paths.

"These changes reflect our commitment to evolving alongside the industry and ensuring all genres and creators are recognized appropriately," said Recording Academy CEO Marcus Williams in the announcement.

The reforms also include a more transparent nomination process, with greater diversity among voting members and the elimination of the controversial "secret committees" that previously had final say on nominations in key categories.

Industry response has been largely positive, with many artists and executives praising the changes as a step toward addressing long-standing complaints about bias and outdated categorizations in the awards system.

The changes will take effect beginning with next year's ceremony, which marks the 67th annual Grammy Awards.`,
    summary: "The Grammy Awards are adding new categories and changing voting rules to better reflect the current music landscape.",
    category: "award",
    impact: "high",
    publishedWeek: 0,
    publishedYear: 0,
    sourceName: "Award Watch",
    sourceImage: "https://placekitten.com/53/53", // Placeholder image
    featuredImage: "https://placekitten.com/800/403", // Placeholder image
    playerMentioned: false,
    hasBeenRead: false,
    isPremium: false,
    reactions: {
      views: 32000,
      likes: 2100,
      shares: 890,
      comments: 560
    },
    tags: ["Grammy Awards", "awards", "music industry"]
  },
  {
    id: "news_artist_comeback_1",
    title: "After 5-Year Hiatus, Enigmatic Producer Returns with Surprise Album",
    content: `The music world was stunned this week when reclusive producer Nightshade released a surprise album after disappearing from the public eye five years ago.

The album, titled "Reemergence," appeared on streaming platforms without warning or promotional campaign, quickly becoming the most talked-about release of the year. Critics are already hailing it as a potential masterpiece that pushes genre boundaries.

Nightshade, known for pioneering the neo-ambient trap movement before abruptly canceling a world tour and deleting all social media in 2020, has offered no explanation for the long absence or sudden return.

The album features collaborations with several high-profile artists who kept the project secret, an impressive feat in the leak-prone music industry. Its experimental sound combines elements of the producer's earlier work with entirely new sonic directions.

"It's like they never left, yet evolved a decade's worth in those five years," wrote influential music critic Alana Torres in her 5-star review.

Industry analysts are now watching closely to see if Nightshade will follow the release with any public appearances or tour announcements.`,
    summary: "Influential producer Nightshade has unexpectedly returned after 5 years with a surprise new album featuring multiple high-profile collaborations.",
    category: "artist",
    impact: "medium",
    publishedWeek: 0,
    publishedYear: 0,
    sourceName: "Music Pulse",
    sourceImage: "https://placekitten.com/54/54", // Placeholder image
    featuredImage: "https://placekitten.com/800/404", // Placeholder image
    playerMentioned: false,
    hasBeenRead: false,
    isPremium: false,
    reactions: {
      views: 38000,
      likes: 4500,
      shares: 2200,
      comments: 870
    },
    tags: ["comeback", "album release", "Nightshade"]
  }
];
