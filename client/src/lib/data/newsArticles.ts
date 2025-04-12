import { NewsArticle } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Generate a set of default news articles for the game
export const DEFAULT_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: uuidv4(),
    title: "Streaming Revenue Hits All-Time High in Industry Report",
    content: "The latest annual music industry report reveals streaming revenue has reached unprecedented levels, accounting for over 80% of all recorded music income. This marks a significant shift from physical sales and downloads, which continue their steady decline.\n\nMajor platforms like Spotify, Apple Music, and YouTube Music have seen subscriber growth despite economic headwinds, indicating the resilience of music streaming as an essential service for consumers.\n\nIndependent artists have particularly benefited from this trend, with the report noting a 32% increase in revenue for artists outside the major label system. The democratization of distribution has created more opportunities for emerging artists to find audiences without traditional gatekeepers.\n\nHowever, challenges remain regarding fair compensation. The report highlights ongoing debates about payment models, with many artists and songwriters advocating for user-centric payment systems rather than the pro-rata model currently employed by most services.",
    summary: "Streaming now accounts for 80% of music industry revenue, with independent artists seeing major gains in the digital landscape.",
    category: "industry",
    impact: "major",
    sourceName: "Music Business Weekly",
    sourceImage: "https://ui-avatars.com/api/?name=MBW&background=0D8ABC&color=fff",
    publishedWeek: 1,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: false,
    featuredImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["streaming", "revenue", "industry", "digital"],
    reactions: {
      views: 24389,
      likes: 1823,
      shares: 647,
      comments: 245
    }
  },
  {
    id: uuidv4(),
    title: "Rising Star Takes Social Media By Storm With Viral Challenge",
    content: "Emerging artist LazerBeam has created the industry's latest viral sensation with the #LazerChallenge, which has amassed over 2 billion views across social platforms in just two weeks.\n\nThe challenge, featuring the hook from LazerBeam's debut single \"Light Show,\" has been embraced by celebrities and fans alike, propelling the previously unknown artist to mainstream recognition virtually overnight.\n\nData shows the artist gained 5 million followers across platforms within days of the challenge taking off, and their single shot to the top of streaming charts globally despite minimal promotional budget.\n\n\"This is the new artist discovery model in action,\" says social media strategist Maya Reynolds. \"A catchy hook, simple but engaging visual component, and perfect timing. LazerBeam understood exactly how to engineer virality in today's landscape.\"\n\nThe overnight success highlights how social media continues to reshape traditional artist development, with labels now scrambling to sign the independent artist after initially passing on meetings just months ago.",
    summary: "Unknown artist LazerBeam skyrockets to fame with a viral social media challenge that's gathered 2 billion views in two weeks.",
    category: "artist",
    impact: "moderate",
    sourceName: "Viral Music Feed",
    sourceImage: "https://ui-avatars.com/api/?name=VMF&background=8A2BE2&color=fff",
    publishedWeek: 2,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: false,
    featuredImage: "https://images.unsplash.com/photo-1531594896955-305cf81269f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["viral", "social media", "tiktok", "breakthrough"],
    reactions: {
      views: 56789,
      likes: 4521,
      shares: 2145,
      comments: 782
    }
  },
  {
    id: uuidv4(),
    title: "Major Label CEO Under Fire for Controversial Comments",
    content: "Universal Music Group CEO Raymond Torres has sparked industry-wide backlash after comments made during a private executive dinner were leaked online.\n\nIn the recording, Torres can be heard discussing artist contracts, reportedly saying: \"The beauty of the standard deal is they don't read the fine print. By the time they understand what they've signed, we've already made our money back tenfold.\"\n\nThe comments have ignited fierce criticism from artist advocacy groups and prominent musicians. Grammy-winning artist Mariana Bell called the statements \"a disturbing glimpse into the exploitative mindset that still permeates the upper echelons of the industry.\"\n\nUMG has issued a statement claiming the remarks were \"taken out of context during an academic discussion about historical industry practices that the company has actively worked to reform.\"\n\nIndustry analysts note this controversy comes at a particularly sensitive time, as legislators in several countries are considering regulations to ensure more equitable treatment of music creators.",
    summary: "Universal Music CEO Raymond Torres faces backlash after leaked comments reveal troubling attitudes toward artist contracts.",
    category: "controversy",
    impact: "major",
    sourceName: "Industry Insider",
    sourceImage: "https://ui-avatars.com/api/?name=II&background=FF4500&color=fff",
    publishedWeek: 3,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: false,
    featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["controversy", "labels", "contracts", "ethics"],
    reactions: {
      views: 87234,
      likes: 7834,
      shares: 5690,
      comments: 2341
    }
  },
  {
    id: uuidv4(),
    title: "Grammy Nominations Announced: Newcomers Dominate Major Categories",
    content: "The Recording Academy has revealed nominations for this year's Grammy Awards, with first-time nominees claiming an unprecedented majority of slots in top categories.\n\nIn a significant shift from previous years, four of the five Album of the Year nominees are debut or sophomore releases, while Best New Artist features several artists who built their followings independently before achieving mainstream recognition.\n\n\"This year's nominations reflect the Academy's commitment to recognizing artistic excellence wherever it emerges,\" said Recording Academy CEO Deborah Fullerson. \"The diversity of sounds, backgrounds, and career paths represented shows how much the industry landscape has evolved.\"\n\nNotably absent are several established superstars who released eligible projects during the qualification period, signaling what many see as a generational shift in critical recognition.\n\nThe ceremony, scheduled for February, is expected to feature performances from many of the nominated breakthrough artists, potentially marking a new era for music's biggest night.",
    summary: "First-time nominees dominate major Grammy categories, signaling a shift away from established superstars toward fresh voices.",
    category: "award",
    impact: "moderate",
    sourceName: "Music Recognition Daily",
    sourceImage: "https://ui-avatars.com/api/?name=MRD&background=FFD700&color=000",
    publishedWeek: 5,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: false,
    featuredImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["grammys", "awards", "nominations", "newcomers"],
    reactions: {
      views: 43251,
      likes: 3187,
      shares: 1432,
      comments: 954
    }
  },
  {
    id: uuidv4(),
    title: "Trap Music Fades as Folk-Influenced Sound Rises in Popularity",
    content: "After nearly a decade of dominance, trap music's influence appears to be waning as listeners increasingly embrace folk-influenced production and more introspective lyrics.\n\nStreaming data from major platforms shows a 34% decline in trap music consumption over the past six months, while folk-fusion genres have seen a 47% increase. Radio programmers report similar shifts in audience preferences.\n\n\"There's a clear hunger for authenticity and emotional depth right now,\" says cultural critic Elena Morgan. \"The pandemic seems to have accelerated a shift toward more introspective, lyrically-focused music that speaks to personal and collective trauma.\"\n\nArtists are responding quickly to the trend. Several prominent producers known for trap beats have begun experimenting with acoustic elements, while labels are actively signing singer-songwriters who blend traditional folk structures with modern production techniques.\n\nIndustry analysts predict this could represent a major sonic shift similar to the post-disco era, potentially reshaping the sound of popular music for years to come.",
    summary: "Trap music sees significant decline as folk-influenced sounds surge in popularity, possibly marking a major shift in mainstream music trends.",
    category: "trend",
    impact: "major",
    sourceName: "Sound Patterns",
    sourceImage: "https://ui-avatars.com/api/?name=SP&background=20B2AA&color=fff",
    publishedWeek: 6,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: true,
    featuredImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["trends", "genres", "folk", "trap"],
    reactions: {
      views: 31452,
      likes: 2654,
      shares: 1289,
      comments: 647
    }
  },
  {
    id: uuidv4(),
    title: "Anticipated Album Breaks Pre-Save Records Ahead of Friday Release",
    content: "Superstar artist Nova's upcoming album 'Celestial' has shattered pre-save records across all major streaming platforms, with over 1.2 million fans queuing up the release before its official drop this Friday.\n\nThe unprecedented anticipation follows an innovative rollout campaign that included augmented reality experiences, limited location-based previews, and a documentary series exploring the album's creation process.\n\n\"We've never seen engagement metrics like this,\" said Spotify's VP of Artist Relations in a statement. \"The pre-save numbers are nearly triple our previous record.\"\n\nIndustry forecasters are projecting first-week streaming numbers that could potentially break all-time records, with estimates suggesting the album could achieve the equivalent of 750,000 units in its debut week.\n\nNova's last album, released three years ago, has remained in the Top 200 streaming charts consistently since its release, demonstrating the artist's rare longevity in the streaming era's typically accelerated consumption cycle.",
    summary: "Nova's 'Celestial' breaks pre-save records with 1.2 million fans queuing the album before Friday's release, potentially setting up historic first-week numbers.",
    category: "release",
    impact: "moderate",
    sourceName: "Chart Movements",
    sourceImage: "https://ui-avatars.com/api/?name=CM&background=4682B4&color=fff",
    publishedWeek: 7,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: false,
    featuredImage: "https://images.unsplash.com/photo-1526394931762-8a4116f6e2f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["album", "release", "streaming", "pre-save"],
    reactions: {
      views: 56732,
      likes: 4231,
      shares: 2876,
      comments: 1245
    }
  },
  {
    id: uuidv4(),
    title: "Revolutionary AI Music Tool Sparks Copyright Debates",
    content: "A new artificial intelligence platform called Harmonic Matrix is generating intense discussion across the music industry for its ability to create studio-quality instrumental tracks in virtually any style within seconds.\n\nDeveloped by tech startup NeuralSound, the platform allows users to generate complete arrangements by simply describing the desired style, mood, instrumentation, and structure. The results have been described as \"indistinguishable from human-created productions\" in blind listening tests.\n\nWhile some producers and composers have embraced the tool as a collaboration assistant, others express serious concerns about potential job displacement and copyright implications.\n\n\"This isn't just another plugin—it fundamentally challenges our understanding of musical authorship,\" says entertainment attorney Sophia Chen. \"The legal framework simply isn't prepared for AI that can generate commercially viable music at scale.\"\n\nSeveral major rights organizations have called for regulation, while NeuralSound defends its creation as \"an instrument, not a replacement for human creativity.\"",
    summary: "The new Harmonic Matrix AI tool creates professional-quality instrumentals in seconds, raising serious questions about the future of production and copyright law.",
    category: "industry",
    impact: "major",
    sourceName: "Future Music Tech",
    sourceImage: "https://ui-avatars.com/api/?name=FMT&background=7B68EE&color=fff",
    publishedWeek: 8,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: true,
    featuredImage: "https://images.unsplash.com/photo-1639322537158-9f75b407359a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["AI", "technology", "copyright", "production"],
    reactions: {
      views: 78956,
      likes: 5341,
      shares: 4237,
      comments: 1893
    }
  },
  {
    id: uuidv4(),
    title: "Legendary Producer Returns After Decade-Long Hiatus",
    content: "Iconic producer Marcus James is returning to music after a ten-year absence with a new artist development venture focused on mentoring emerging talent.\n\nJames, whose production credits include multiple diamond-certified albums and countless hit singles across genres, abruptly stepped away from the industry at the height of his career in 2013, citing burnout and creative differences with major labels.\n\nHis new company, Resonance Collective, will focus on developing artists outside the traditional label system, emphasizing artistic freedom and sustainable career development over immediate commercial success.\n\n\"The industry infrastructure hasn't served artists well for a long time,\" James said in a rare interview. \"I'm interested in building something that prioritizes creative longevity and mental wellbeing in an industry that typically burns through both.\"\n\nSeveral influential artists have already expressed support for the initiative, with some hinting at possible collaborations with the producer's new roster of talent.",
    summary: "Legendary producer Marcus James ends his decade-long industry absence with Resonance Collective, a new company focused on artist development outside the traditional label system.",
    category: "industry",
    impact: "moderate",
    sourceName: "Producer's Forum",
    sourceImage: "https://ui-avatars.com/api/?name=PF&background=32CD32&color=fff",
    publishedWeek: 10,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: false,
    featuredImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["producers", "industry", "development", "comeback"],
    reactions: {
      views: 45678,
      likes: 3789,
      shares: 1567,
      comments: 843
    }
  },
  {
    id: uuidv4(),
    title: "Indie Artist Turns Down $10 Million Major Label Deal",
    content: "Independent hip-hop artist J.Nova has declined what industry sources describe as a $10 million offer from Atlantic Records, choosing instead to remain independent with her self-built team.\n\nThe decision has generated significant discussion about artist autonomy in an era where major label deals are still widely considered the ultimate goal for emerging talent.\n\nJ.Nova, who has amassed over 500 million streams across platforms without major backing, explained her decision in a candid social media post: \"They offered life-changing money, but the terms would have changed everything about how I create and connect with my audience. Some opportunities cost more than they pay.\"\n\nThe artist has built a dedicated following through consistent releases and innovative direct-to-fan initiatives, including a subscription platform that reportedly generates over $300,000 monthly in recurring revenue.\n\n\"This signals a fundamental power shift,\" says music business professor Dr. Raymond Wilson. \"When artists can build seven-figure businesses independently, they approach the negotiating table with leverage that simply didn't exist before.\"",
    summary: "Rising indie star J.Nova rejects a $10 million major label offer, highlighting how direct-to-fan business models are giving artists unprecedented negotiating power.",
    category: "artist",
    impact: "moderate",
    sourceName: "Independent Voice",
    sourceImage: "https://ui-avatars.com/api/?name=IV&background=FF6347&color=fff",
    publishedWeek: 12,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: false,
    featuredImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["indie", "labels", "deals", "business"],
    reactions: {
      views: 65432,
      likes: 5421,
      shares: 3298,
      comments: 1521
    }
  },
  {
    id: uuidv4(),
    title: "Controversial Algorithm Change Affects Artist Discovery",
    content: "A recent algorithm update on Spotify has dramatically altered how the platform recommends new music, with data showing significant impacts on emerging artist discovery rates.\n\nThe change, implemented without formal announcement, appears to favor tracks with higher completion rates (songs listeners play all the way through) over those with higher initial engagement but more frequent skips.\n\nFor many developing artists, the effects have been immediate and concerning. Average daily streams for artists with fewer than 50,000 monthly listeners have declined by approximately 28% according to analysis from music data firm Chartmetric.\n\n\"This effectively creates a higher barrier for discovery,\" explains streaming analytics expert Jordan Maxwell. \"The algorithm now requires proof of listener retention before recommending tracks to new audiences, creating a 'chicken and egg' problem for artists still building their sound.\"\n\nSpotify has not officially commented on the specific changes, stating only that they \"regularly refine recommendation systems to improve listener satisfaction.\"",
    summary: "A quiet Spotify algorithm change has significantly reduced discovery opportunities for emerging artists, with new music recommendations now heavily favoring completion rates over other metrics.",
    category: "industry",
    impact: "major",
    sourceName: "Platform Watch",
    sourceImage: "https://ui-avatars.com/api/?name=PW&background=9370DB&color=fff",
    publishedWeek: 14,
    publishedYear: 1,
    hasBeenRead: false,
    isPremium: true,
    featuredImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    tags: ["streaming", "algorithms", "discovery", "spotify"],
    reactions: {
      views: 89765,
      likes: 7652,
      shares: 6543,
      comments: 2876
    }
  }
];