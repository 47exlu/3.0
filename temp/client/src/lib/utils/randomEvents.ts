import { GameState, RandomEvent, Song } from '../types';

// Helper function to add week and type properties to ensure compatibility with RandomEvent interface
const createRandomEvent = (event: any): RandomEvent => {
  return {
    ...event,
    week: 0, // This will be set when the event is triggered
    type: event.id.includes('feature') ? 'opportunity' : 
          event.id.includes('beef') ? 'challenge' :
          'neutral' // Default type
  };
};

// A collection of random events that can occur during the game
export const generateRandomEvents = (): RandomEvent[] => {
  // Define raw event data
  const eventData = [
    {
      id: "event_feature_on_ai_track",
      title: "Featured on Another Artist's Track",
      description: `${getRandomAIRapperName()} wants to feature you on their new track!`,
      // This can happen at lower career levels - you are a feature on THEIR track
      requiresStats: {
        reputation: 20 // Only need some basic reputation
      },
      options: [
        {
          text: "Accept and record the feature verse",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            
            // Modest payment for being a feature
            updatedState.stats = {
              ...updatedState.stats,
              wealth: updatedState.stats.wealth + 5000 + (state.stats.reputation * 100), // Pay scales with your reputation
              reputation: Math.min(100, updatedState.stats.reputation + 8),
              networking: Math.min(100, updatedState.stats.networking + 10)
            };
            
            // Boost to listeners from fans of the other artist discovering you
            updatedState.streamingPlatforms = state.streamingPlatforms.map(platform => ({
              ...platform,
              listeners: Math.floor(platform.listeners * 1.15) // 15% listener boost
            }));
            
            // Social media follower boost
            updatedState.socialMedia = state.socialMedia.map(platform => ({
              ...platform,
              followers: Math.floor(platform.followers * 1.10) // 10% follower boost
            }));
            
            return updatedState;
          }
        },
        {
          text: "Decline to focus on your own music",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            
            // Small boost to creativity for focusing on your work
            updatedState.stats = {
              ...updatedState.stats,
              creativity: Math.min(100, updatedState.stats.creativity + 5)
            };
            
            // Small networking hit
            updatedState.stats = {
              ...updatedState.stats,
              networking: Math.max(0, updatedState.stats.networking - 3)
            };
            
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_feature_request",
      title: "Feature Request on Your Track",
      description: `${getRandomAIRapperName()} wants to be featured on your next track!`,
      // This event requires you to have at least one released song
      requiresStats: {
        careerLevel: 1 // You need to be at least career level 1
      },
      options: [
        {
          text: "Accept the feature request",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            const currentWeek = state.currentWeek;
            
            // Determine song tier based on your current reputation
            const playerReputation = state.stats.reputation;
            const songTier = playerReputation >= 70 ? 4 : 
                            playerReputation >= 40 ? 3 : 2;
            
            // Create a new song with the feature
            const newSong: Song = {
              id: `song_feat_${Date.now()}`,
              title: `New Track ft. ${getRandomAIRapperName()} (${currentWeek})`,
              tier: songTier as any, // Cast to SongTier
              releaseDate: currentWeek,
              streams: 10000 + Math.floor(Math.random() * 15000), // Initial streams
              isActive: true,
              featuring: [getRandomAIRapperName()],
              released: true, // Auto-released with the feature
              icon: "collab" as any, // Cast to SongIcon
              releasePlatforms: ["Spotify", "SoundCloud", "iTunes"], // Standard platforms
              quality: 70 + Math.floor(Math.random() * 20), // Song quality 70-90
              completed: true,
              productionStartWeek: currentWeek - 1,
              productionProgress: 100,
              performanceType: "normal",
              performanceStatusWeek: currentWeek
            };
            
            // Add the new song to your catalog
            if (updatedState.songs) {
              updatedState.songs = [...updatedState.songs, newSong];
            } else {
              updatedState.songs = [newSong];
            }
            
            // Boost networking and small boost to reputation
            updatedState.stats = {
              ...updatedState.stats,
              networking: Math.min(100, updatedState.stats.networking + 10),
              reputation: Math.min(100, updatedState.stats.reputation + 5)
            };
            
            // Small social media boost
            updatedState.socialMedia = state.socialMedia.map(platform => ({
              ...platform,
              followers: Math.floor(platform.followers * 1.1) // 10% follower boost
            }));
            
            return updatedState;
          }
        },
        {
          text: "Decline the feature",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Focus on your solo career
            updatedState.stats = {
              ...updatedState.stats,
              creativity: Math.min(100, updatedState.stats.creativity + 5),
              networking: Math.max(0, updatedState.stats.networking - 2)
            };
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_1",
      title: "Viral Social Media Moment",
      description: "One of your social media posts has gone viral unexpectedly!",
      options: [
        {
          text: "Capitalize on the moment with new content",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Increase followers across platforms
            updatedState.socialMedia = state.socialMedia.map(platform => ({
              ...platform,
              followers: Math.floor(platform.followers * 1.2) // 20% follower boost
            }));
            
            // Boost streaming numbers on latest song
            if (updatedState.songs.length > 0) {
              const latestSongIndex = updatedState.songs.length - 1;
              updatedState.songs[latestSongIndex] = {
                ...updatedState.songs[latestSongIndex],
                streams: Math.floor(updatedState.songs[latestSongIndex].streams * 1.5) // 50% stream boost
              };
            }
            
            // Increase marketing stat
            updatedState.stats = {
              ...updatedState.stats,
              marketing: Math.min(100, updatedState.stats.marketing + 5)
            };
            
            return updatedState;
          }
        },
        {
          text: "Ignore it and focus on your music",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Small boost to creativity
            updatedState.stats = {
              ...updatedState.stats,
              creativity: Math.min(100, updatedState.stats.creativity + 3)
            };
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_2",
      title: "Record Label Offer",
      description: "A record label has approached you with a contract offer!",
      options: [
        {
          text: "Sign the deal for immediate cash and exposure",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Immediate wealth boost
            updatedState.stats = {
              ...updatedState.stats,
              wealth: updatedState.stats.wealth + 50000,
              reputation: Math.min(100, updatedState.stats.reputation + 15)
            };
            
            // Boost streaming platform presence
            updatedState.streamingPlatforms = state.streamingPlatforms.map(platform => ({
              ...platform,
              listeners: Math.floor(platform.listeners * 1.5) // 50% listener boost
            }));
            
            return updatedState;
          }
        },
        {
          text: "Stay independent to maintain creative control",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Boost reputation with fans for staying true
            updatedState.stats = {
              ...updatedState.stats,
              fanLoyalty: Math.min(100, updatedState.stats.fanLoyalty + 10),
              creativity: Math.min(100, updatedState.stats.creativity + 5)
            };
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_3",
      title: "Studio Equipment Failure",
      description: "Your recording equipment has malfunctioned right before an important session!",
      options: [
        {
          text: "Invest in new high-quality equipment",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Expense for new equipment
            updatedState.stats = {
              ...updatedState.stats,
              wealth: Math.max(0, updatedState.stats.wealth - 5000),
              creativity: Math.min(100, updatedState.stats.creativity + 8)
            };
            return updatedState;
          }
        },
        {
          text: "Use a friend's studio temporarily",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Networking boost but slight creativity hit
            updatedState.stats = {
              ...updatedState.stats,
              networking: Math.min(100, updatedState.stats.networking + 5),
              creativity: Math.max(0, updatedState.stats.creativity - 2)
            };
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_4",
      title: "Beef with Another Artist",
      description: `${getRandomAIRapperName()} has dissed you in their latest track!`,
      options: [
        {
          text: "Respond with a diss track",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Create a new diss track
            const newSong: Song = {
              id: `song_diss_${Date.now()}`,
              title: `Diss Track (${state.currentWeek})`,
              tier: 3 as const, // Diss tracks are usually tier 3
              releaseDate: state.currentWeek,
              streams: 50000, // Initial streams
              isActive: true,
              featuring: [],
              released: true, // Auto-released as a diss track response
              icon: "fire" as any, // Diss tracks are hot
              releasePlatforms: ["Spotify", "SoundCloud"], // Standard platforms for quick release
              quality: 75 + Math.floor(Math.random() * 15), // Diss tracks are usually pretty good
              completed: true,
              productionStartWeek: state.currentWeek - 1,
              productionProgress: 100,
              performanceType: "normal" as const,
              performanceStatusWeek: state.currentWeek
            };
            
            updatedState.songs = [...state.songs, newSong];
            
            // Update relationships
            const targetRapperIndex = Math.floor(Math.random() * updatedState.aiRappers.length);
            if (updatedState.aiRappers[targetRapperIndex]) {
              updatedState.aiRappers[targetRapperIndex] = {
                ...updatedState.aiRappers[targetRapperIndex],
                relationshipStatus: "enemy"
              };
            }
            
            // Increase social media attention
            updatedState.socialMedia = state.socialMedia.map(platform => ({
              ...platform,
              followers: Math.floor(platform.followers * 1.1) // 10% follower boost from drama
            }));
            
            return updatedState;
          }
        },
        {
          text: "Ignore it and stay above the drama",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Small reputation boost for maturity
            updatedState.stats = {
              ...updatedState.stats,
              reputation: Math.min(100, updatedState.stats.reputation + 3),
              fanLoyalty: Math.min(100, updatedState.stats.fanLoyalty + 2)
            };
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_5",
      title: "Feature Opportunity",
      description: `A major artist wants to feature you on their upcoming track!`,
      // Make this event only appear for artists with at least some reputation
      requiresStats: {
        reputation: 30 // Only artists with at least 30 reputation get feature opportunities
      },
      options: [
        {
          text: "Accept the feature opportunity",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            
            // Boost reputation and networking
            updatedState.stats = {
              ...updatedState.stats,
              reputation: Math.min(100, updatedState.stats.reputation + 10),
              networking: Math.min(100, updatedState.stats.networking + 8),
              wealth: updatedState.stats.wealth + 15000 // Payment for feature
            };
            
            // Gain new listeners
            updatedState.streamingPlatforms = state.streamingPlatforms.map(platform => ({
              ...platform,
              listeners: Math.floor(platform.listeners * 1.2) // 20% listener boost
            }));
            
            return updatedState;
          }
        },
        {
          text: "Decline to focus on your own music",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Focus on creativity
            updatedState.stats = {
              ...updatedState.stats,
              creativity: Math.min(100, updatedState.stats.creativity + 5)
            };
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_6",
      title: "Controversial Interview",
      description: "During an interview, you made a controversial statement that's getting attention!",
      options: [
        {
          text: "Apologize and clarify your statement",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Minimal reputation damage
            updatedState.stats = {
              ...updatedState.stats,
              reputation: Math.max(0, updatedState.stats.reputation - 2)
            };
            return updatedState;
          }
        },
        {
          text: "Double down and embrace the controversy",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // High risk, high reward
            const reputationChange = Math.random() > 0.5 ? 10 : -15;
            
            updatedState.stats = {
              ...updatedState.stats,
              reputation: Math.max(0, Math.min(100, updatedState.stats.reputation + reputationChange))
            };
            
            // More social media attention regardless
            updatedState.socialMedia = state.socialMedia.map(platform => ({
              ...platform,
              followers: Math.floor(platform.followers * 1.15) // 15% follower boost from controversy
            }));
            
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_7",
      title: "Producer Collaboration Offer",
      description: "A famous producer wants to work with you on your next project!",
      options: [
        {
          text: "Pay for their premium services",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Pay for premium production
            updatedState.stats = {
              ...updatedState.stats,
              wealth: Math.max(0, updatedState.stats.wealth - 10000),
              creativity: Math.min(100, updatedState.stats.creativity + 15)
            };
            return updatedState;
          }
        },
        {
          text: "Negotiate a royalty deal instead",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // No upfront cost but less future revenue
            updatedState.stats = {
              ...updatedState.stats,
              creativity: Math.min(100, updatedState.stats.creativity + 8)
            };
            
            // Lower revenue on streaming platforms
            updatedState.streamingPlatforms = state.streamingPlatforms.map(platform => ({
              ...platform,
              revenue: Math.floor(platform.revenue * 0.9) // 10% revenue reduction for royalties
            }));
            
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_8",
      title: "Marketing Campaign Opportunity",
      description: "A marketing agency offers to run a campaign for your latest release!",
      options: [
        {
          text: "Invest in the full campaign",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Expensive but effective
            updatedState.stats = {
              ...updatedState.stats,
              wealth: Math.max(0, updatedState.stats.wealth - 7500),
              marketing: Math.min(100, updatedState.stats.marketing + 12)
            };
            
            // Boost latest song
            if (updatedState.songs.length > 0) {
              const latestSongIndex = updatedState.songs.length - 1;
              updatedState.songs[latestSongIndex] = {
                ...updatedState.songs[latestSongIndex],
                streams: Math.floor(updatedState.songs[latestSongIndex].streams * 1.4) // 40% stream boost
              };
            }
            
            return updatedState;
          }
        },
        {
          text: "Run a smaller DIY campaign",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Less expensive, less effective
            updatedState.stats = {
              ...updatedState.stats,
              wealth: Math.max(0, updatedState.stats.wealth - 1500),
              marketing: Math.min(100, updatedState.stats.marketing + 5)
            };
            
            // Smaller boost to latest song
            if (updatedState.songs.length > 0) {
              const latestSongIndex = updatedState.songs.length - 1;
              updatedState.songs[latestSongIndex] = {
                ...updatedState.songs[latestSongIndex],
                streams: Math.floor(updatedState.songs[latestSongIndex].streams * 1.15) // 15% stream boost
              };
            }
            
            return updatedState;
          }
        }
      ],
      resolved: false
    },

    {
      id: "event_10",
      title: "Sampling Clearance Issue",
      description: "Your latest track contains a sample that the original artist is contesting!",
      options: [
        {
          text: "Pay for proper clearance",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            // Pay for clearance
            updatedState.stats = {
              ...updatedState.stats,
              wealth: Math.max(0, updatedState.stats.wealth - 12000),
            };
            
            // Small reputation boost for doing the right thing
            updatedState.stats = {
              ...updatedState.stats,
              reputation: Math.min(100, updatedState.stats.reputation + 3),
            };
            
            return updatedState;
          }
        },
        {
          text: "Re-record without the sample",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            
            // Affect your latest song's performance
            if (updatedState.songs.length > 0) {
              const latestSongIndex = updatedState.songs.length - 1;
              updatedState.songs[latestSongIndex] = {
                ...updatedState.songs[latestSongIndex],
                streams: Math.floor(updatedState.songs[latestSongIndex].streams * 0.85) // 15% stream reduction
              };
            }
            
            // Boost creativity from the challenge
            updatedState.stats = {
              ...updatedState.stats,
              creativity: Math.min(100, updatedState.stats.creativity + 5),
            };
            
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_11",
      title: "Music Festival Invitation",
      description: "You've been invited to perform at a major music festival!",
      // Require some career progress for festival invitations
      requiresStats: {
        reputation: 40,
        careerLevel: 2 // At least level 2 for festival invitations
      },
      options: [
        {
          text: "Accept and prepare an amazing show",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            
            // Investment in the performance
            updatedState.stats = {
              ...updatedState.stats,
              wealth: Math.max(0, updatedState.stats.wealth - 5000), // Cost to prepare
              reputation: Math.min(100, updatedState.stats.reputation + 15),
              networking: Math.min(100, updatedState.stats.networking + 10)
            };
            
            // Significant boost to listeners
            updatedState.streamingPlatforms = state.streamingPlatforms.map(platform => ({
              ...platform,
              listeners: Math.floor(platform.listeners * 1.3), // 30% listener boost
              revenue: Math.floor(platform.revenue * 1.25) // 25% revenue boost
            }));
            
            // Social media follower boost
            updatedState.socialMedia = state.socialMedia.map(platform => ({
              ...platform,
              followers: Math.floor(platform.followers * 1.2) // 20% follower boost
            }));
            
            return updatedState;
          }
        },
        {
          text: "Decline to focus on studio work",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            
            // Focus on creating more music
            updatedState.stats = {
              ...updatedState.stats,
              creativity: Math.min(100, updatedState.stats.creativity + 8),
            };
            
            // Small reputation hit for missing opportunity
            updatedState.stats = {
              ...updatedState.stats,
              reputation: Math.max(0, updatedState.stats.reputation - 3),
            };
            
            return updatedState;
          }
        }
      ],
      resolved: false
    },
    {
      id: "event_12",
      title: "Streaming Platform Exclusive Deal",
      description: "A major streaming platform wants to make your next release exclusive for two weeks.",
      // Require higher reputation for platform deals
      requiresStats: {
        reputation: 55,
        careerLevel: 3 // Only established artists get exclusive deals
      },
      options: [
        {
          text: "Accept the exclusive deal",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            
            // Significant upfront payment
            updatedState.stats = {
              ...updatedState.stats,
              wealth: updatedState.stats.wealth + 25000,
            };
            
            // Boost one platform's stats but hurt others
            const platformIndex = Math.floor(Math.random() * updatedState.streamingPlatforms.length);
            updatedState.streamingPlatforms = updatedState.streamingPlatforms.map((platform, index) => {
              if (index === platformIndex) {
                return {
                  ...platform,
                  listeners: Math.floor(platform.listeners * 1.4), // 40% boost to exclusive platform
                  revenue: Math.floor(platform.revenue * 1.5), // 50% revenue boost
                };
              } else {
                return {
                  ...platform,
                  listeners: Math.floor(platform.listeners * 0.9), // 10% reduction to other platforms
                };
              }
            });
            
            return updatedState;
          }
        },
        {
          text: "Release on all platforms simultaneously",
          effect: (state: GameState): GameState => {
            const updatedState = { ...state };
            
            // Fan loyalty boost for not playing favorites
            updatedState.stats = {
              ...updatedState.stats,
              fanLoyalty: Math.min(100, updatedState.stats.fanLoyalty + 8),
            };
            
            // Small boost across all platforms
            updatedState.streamingPlatforms = state.streamingPlatforms.map(platform => ({
              ...platform,
              listeners: Math.floor(platform.listeners * 1.05), // 5% listener boost across all platforms
            }));
            
            return updatedState;
          }
        }
      ],
      resolved: false
    }
  ];
  
  // Convert the raw event data to proper RandomEvent objects with week and type
  return eventData.map(event => createRandomEvent(event));
};

// Helper function to get a random AI rapper name for events
function getRandomAIRapperName(): string {
  const names = [
    "21 Sawage", "Lil Bhaby", "Drakke", "Lil Druk", "King Vhon", "MC Flow", "Young Money", "Rhyme Master",
    "Post Baloney", "Jaye-Z", "Emindeed", "Chancy the Producer", "Doja Mouse", "Micki Nichaj", "Capital Letters", "Mack Lemur"
  ];
  return names[Math.floor(Math.random() * names.length)];
}

// Generate a random event for the current week
export const getRandomEventForWeek = (
  currentEvents: RandomEvent[], 
  resolvedEvents: string[],
  playerStats?: any // Optional player stats to filter events by requirements
): RandomEvent | null => {
  // Get all events that are not currently active or already resolved
  const allBaseEvents = generateRandomEvents();
  let availableEvents = allBaseEvents.filter(event => 
    !currentEvents.some(e => e.id === event.id) && 
    !resolvedEvents.includes(event.id)
  );
  
  // If player stats are provided, filter events by requirements
  if (playerStats) {
    availableEvents = availableEvents.filter(event => {
      // If the event has no requirements, it's always available
      if (!event.requiresStats) {
        return true;
      }
      
      // Check all required stats
      const requirements = event.requiresStats as any;
      for (const stat in requirements) {
        if (
          !playerStats[stat] || 
          playerStats[stat] < requirements[stat]
        ) {
          return false; // Player doesn't meet this requirement
        }
      }
      
      return true; // Player meets all requirements
    });
  }
  
  // Prioritize feature requests for established artists (career level >= 1)
  if (playerStats && playerStats.careerLevel >= 1) {
    const featureRequestEvents = availableEvents.filter(
      event => event.id === "event_feature_request"
    );
    
    // Higher chance based on career level (10% baseline + 2% per career level)
    const featureChance = 0.10 + (playerStats.careerLevel * 0.02);
    
    if (featureRequestEvents.length > 0 && Math.random() < featureChance) {
      const randomIndex = Math.floor(Math.random() * featureRequestEvents.length);
      const baseEvent = featureRequestEvents[randomIndex];
      
      // Create a proper RandomEvent with all required fields
      return createRandomEvent({
        ...baseEvent,
        week: playerStats.currentWeek || 0 // Use current week from player stats
      });
    }
  }
  
  // Add chance for the player to be featured on an AI track if they have reputation >= 20
  if (playerStats && playerStats.reputation >= 20) {
    const aiFeatureEvents = availableEvents.filter(
      event => event.id === "event_feature_on_ai_track"
    );
    
    // Chance scales with reputation (5% baseline + up to 5% more)
    const featureChance = 0.05 + ((playerStats.reputation / 100) * 0.05);
    
    if (aiFeatureEvents.length > 0 && Math.random() < featureChance) {
      const randomIndex = Math.floor(Math.random() * aiFeatureEvents.length);
      const baseEvent = aiFeatureEvents[randomIndex];
      
      // Create a proper RandomEvent with all required fields
      return createRandomEvent({
        ...baseEvent,
        week: playerStats.currentWeek || 0 // Use current week from player stats
      });
    }
  }
  
  // 5% chance of getting a regular event each week
  if (Math.random() < 0.05 && availableEvents.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableEvents.length);
    const baseEvent = availableEvents[randomIndex];
    
    // Create a proper RandomEvent with all required fields
    return createRandomEvent({
      ...baseEvent,
      week: playerStats?.currentWeek || 0 // Use current week from player stats
    });
  }
  
  return null;
};
