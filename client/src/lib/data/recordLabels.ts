// Record label data with alternative names to avoid copyright issues
export interface RecordLabel {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  subsidiaryOf?: string;
  founded: number;
  headquarters: string;
  netWorth: number; // In millions
  specializes: string[];
  signedArtists?: string[];
  reputation: number; // 1-100
  levelRequirement: number; // Company level required to compete
}

export const recordLabels: RecordLabel[] = [
  {
    id: "universal-alternative",
    name: "Cosmos Music Group",
    description: "The largest music company in the world, with a diverse portfolio of artists across all genres.",
    logoUrl: "/record-labels/cosmos-music.svg",
    founded: 1934,
    headquarters: "Los Angeles, CA",
    netWorth: 33000,
    specializes: ["Pop", "Hip-Hop", "R&B", "Rock", "Country", "Electronic"],
    reputation: 95,
    levelRequirement: 10
  },
  {
    id: "sony-alternative",
    name: "Stellar Entertainment",
    description: "A global music conglomerate known for its innovative approaches to artist development and marketing.",
    logoUrl: "/record-labels/stellar-entertainment.svg",
    founded: 1929,
    headquarters: "New York, NY",
    netWorth: 21000,
    specializes: ["Pop", "Rock", "Classical", "Electronic", "Hip-Hop"],
    reputation: 92,
    levelRequirement: 9
  },
  {
    id: "warner-alternative",
    name: "Horizon Records",
    description: "One of the big three recording companies, known for its diverse artist roster and global reach.",
    logoUrl: "/record-labels/horizon-records.svg",
    founded: 1958,
    headquarters: "Los Angeles, CA",
    netWorth: 14500,
    specializes: ["Rock", "Alternative", "Pop", "Hip-Hop", "Electronic"],
    reputation: 90,
    levelRequirement: 8
  },
  {
    id: "def-jam-alternative",
    name: "Urban Dynasty",
    description: "The premier hip-hop and urban music label, known for discovering and developing iconic artists.",
    logoUrl: "/record-labels/urban-dynasty.svg",
    founded: 1983,
    headquarters: "New York, NY",
    netWorth: 2000,
    specializes: ["Hip-Hop", "R&B", "Rap"],
    reputation: 88,
    levelRequirement: 7,
    subsidiaryOf: "cosmos-music-group"
  },
  {
    id: "interscope-alternative",
    name: "Pulse Records",
    description: "A powerhouse label known for its boundary-pushing artists and innovative marketing strategies.",
    logoUrl: "/record-labels/pulse-records.svg",
    founded: 1990,
    headquarters: "Santa Monica, CA",
    netWorth: 1800,
    specializes: ["Pop", "Hip-Hop", "Alternative", "Rock", "Electronic"],
    reputation: 87,
    levelRequirement: 7,
    subsidiaryOf: "cosmos-music-group"
  },
  {
    id: "atlantic-alternative",
    name: "Oceanic Sound",
    description: "A historic label with a reputation for artist development and long-term career building.",
    logoUrl: "/record-labels/oceanic-sound.svg",
    founded: 1947,
    headquarters: "New York, NY",
    netWorth: 1500,
    specializes: ["R&B", "Soul", "Jazz", "Rock", "Hip-Hop"],
    reputation: 86,
    levelRequirement: 6,
    subsidiaryOf: "horizon-records"
  },
  {
    id: "columbia-alternative",
    name: "Discovery Records",
    description: "One of the oldest American record labels, known for its prestigious history and diverse roster.",
    logoUrl: "/record-labels/discovery-records.svg",
    founded: 1889,
    headquarters: "New York, NY",
    netWorth: 1400,
    specializes: ["Rock", "Pop", "Hip-Hop", "Country", "Classical"],
    reputation: 85,
    levelRequirement: 6,
    subsidiaryOf: "stellar-entertainment"
  },
  {
    id: "capitol-alternative",
    name: "Summit Music",
    description: "A historic label known for its iconic headquarters and influential artist roster.",
    logoUrl: "/record-labels/summit-music.svg",
    founded: 1942,
    headquarters: "Hollywood, CA",
    netWorth: 1300,
    specializes: ["Pop", "Rock", "Alternative", "Hip-Hop"],
    reputation: 84,
    levelRequirement: 6,
    subsidiaryOf: "cosmos-music-group"
  },
  {
    id: "roc-nation-alternative",
    name: "Dynasty Collective",
    description: "An entertainment company founded by a hip-hop legend, representing artists, producers, and athletes.",
    logoUrl: "/record-labels/dynasty-collective.svg",
    founded: 2008,
    headquarters: "New York, NY",
    netWorth: 1100,
    specializes: ["Hip-Hop", "R&B", "Pop", "Sports Management"],
    reputation: 83,
    levelRequirement: 5
  },
  {
    id: "epic-alternative",
    name: "Legendary Records",
    description: "A label focused on developing superstar artists with global appeal.",
    logoUrl: "/record-labels/legendary-records.svg",
    founded: 1953,
    headquarters: "New York, NY",
    netWorth: 950,
    specializes: ["Pop", "R&B", "Hip-Hop"],
    reputation: 82,
    levelRequirement: 5,
    subsidiaryOf: "stellar-entertainment"
  },
  {
    id: "republic-alternative",
    name: "Nation Records",
    description: "A powerhouse label known for its hit-making ability and marketing prowess.",
    logoUrl: "/record-labels/nation-records.svg",
    founded: 1995,
    headquarters: "New York, NY",
    netWorth: 900,
    specializes: ["Pop", "Hip-Hop", "Country", "Rock"],
    reputation: 81,
    levelRequirement: 5,
    subsidiaryOf: "cosmos-music-group"
  },
  {
    id: "300-entertainment-alternative",
    name: "Tricentum Music",
    description: "An independent label focusing on the digital age, with innovative approaches to artist development.",
    logoUrl: "/record-labels/tricentum-music.svg",
    founded: 2012,
    headquarters: "New York, NY",
    netWorth: 800,
    specializes: ["Hip-Hop", "Rap", "R&B"],
    reputation: 79,
    levelRequirement: 4
  },
  {
    id: "xo-alternative",
    name: "Midnight Sound",
    description: "A label known for its moody aesthetic and alternative R&B sound.",
    logoUrl: "/record-labels/midnight-sound.svg",
    founded: 2012,
    headquarters: "Toronto, Canada",
    netWorth: 750,
    specializes: ["R&B", "Alternative R&B", "Pop"],
    reputation: 78,
    levelRequirement: 4,
    subsidiaryOf: "stellar-entertainment"
  },
  {
    id: "quality-control-alternative",
    name: "Standard Excellence",
    description: "A hip-hop powerhouse known for developing trap artists and creating cultural moments.",
    logoUrl: "/record-labels/standard-excellence.svg",
    founded: 2013,
    headquarters: "Atlanta, GA",
    netWorth: 700,
    specializes: ["Hip-Hop", "Trap", "Rap"],
    reputation: 77,
    levelRequirement: 4
  },
  {
    id: "motown-alternative",
    name: "Metro Sound",
    description: "A historic label that defined the sound of a generation and broke racial barriers in music.",
    logoUrl: "/record-labels/metro-sound.svg",
    founded: 1959,
    headquarters: "Detroit, MI (originally), Los Angeles, CA (currently)",
    netWorth: 650,
    specializes: ["R&B", "Soul", "Pop", "Hip-Hop"],
    reputation: 80,
    levelRequirement: 3,
    subsidiaryOf: "cosmos-music-group"
  },
  {
    id: "indie-alternative-1",
    name: "Nexus Recordings",
    description: "An independent label known for fostering artistic freedom and alternative sounds.",
    logoUrl: "/record-labels/nexus-recordings.svg",
    founded: 1996,
    headquarters: "Seattle, WA",
    netWorth: 220,
    specializes: ["Alternative", "Indie Rock", "Folk"],
    reputation: 70,
    levelRequirement: 2
  },
  {
    id: "indie-alternative-2",
    name: "Future Frequency",
    description: "A forward-thinking label specializing in electronic and experimental music.",
    logoUrl: "/record-labels/future-frequency.svg",
    founded: 2005,
    headquarters: "Los Angeles, CA",
    netWorth: 180,
    specializes: ["Electronic", "EDM", "Experimental"],
    reputation: 68,
    levelRequirement: 2
  },
  {
    id: "indie-alternative-3",
    name: "Street Level Entertainment",
    description: "An independent hip-hop label focused on authentic street sounds and emerging talent.",
    logoUrl: "/record-labels/street-level.svg",
    founded: 2010,
    headquarters: "Atlanta, GA",
    netWorth: 150,
    specializes: ["Hip-Hop", "Trap", "Drill"],
    reputation: 65,
    levelRequirement: 1
  }
];

// Label logos will be created as SVGs to ensure high quality and avoid copyright issues
export const generateLabelLogo = (labelId: string): string => {
  // In a real implementation, this would return a path to the actual logo file
  // For now, we'll just return a placeholder
  return `/record-labels/${labelId}.svg`;
};

// Get label by ID
export const getLabelById = (id: string): RecordLabel | undefined => {
  return recordLabels.find(label => label.id === id);
};

// Get labels by reputation range
export const getLabelsByReputation = (min: number, max: number): RecordLabel[] => {
  return recordLabels.filter(label => label.reputation >= min && label.reputation <= max);
};

// Get labels by level requirement
export const getLabelsByLevelRequirement = (level: number): RecordLabel[] => {
  return recordLabels.filter(label => label.levelRequirement <= level);
};

// Get major labels (top tier)
export const getMajorLabels = (): RecordLabel[] => {
  return recordLabels.filter(label => label.reputation >= 85);
};

// Get indie labels
export const getIndieLabels = (): RecordLabel[] => {
  return recordLabels.filter(label => label.reputation < 75);
};