export interface RecordLabel {
  id: string;
  name: string;
  logoPath: string;
  description: string;
  reputation: number;
  marketingPower: number;
  artistDevelopment: number;
  distribution: number;
  royaltyRate: number; // Lower is better for the label, higher for artist
  contractLength: number; // In weeks
  advanceAmount: number;
  genres: string[];
  levelRequired: number;
  signupBonus?: number;
}

export const recordLabels: RecordLabel[] = [
  {
    id: "cosmos-music",
    name: "Cosmos Music Group",
    logoPath: "/record-labels/cosmos-music.svg",
    description: "A forward-thinking label known for innovative marketing and global distribution reach.",
    reputation: 92,
    marketingPower: 95,
    artistDevelopment: 75,
    distribution: 90,
    royaltyRate: 0.18, // 18% to artist
    contractLength: 104, // 2 years
    advanceAmount: 75000,
    genres: ["Hip Hop", "R&B", "Pop"],
    levelRequired: 5
  },
  {
    id: "stellar-entertainment",
    name: "Stellar Entertainment",
    logoPath: "/record-labels/stellar-entertainment.svg",
    description: "Industry powerhouse with unmatched connections and a history of creating superstars.",
    reputation: 97,
    marketingPower: 98,
    artistDevelopment: 85,
    distribution: 95,
    royaltyRate: 0.15, // 15% to artist
    contractLength: 156, // 3 years
    advanceAmount: 250000,
    genres: ["Hip Hop", "Pop", "EDM", "R&B"],
    levelRequired: 8,
    signupBonus: 50000
  },
  {
    id: "horizon-records",
    name: "Horizon Records",
    logoPath: "/record-labels/horizon-records.svg",
    description: "Known for artist-friendly deals and developing long-term careers.",
    reputation: 85,
    marketingPower: 80,
    artistDevelopment: 95,
    distribution: 85,
    royaltyRate: 0.22, // 22% to artist
    contractLength: 78, // 1.5 years
    advanceAmount: 50000,
    genres: ["Hip Hop", "R&B", "Soul", "Jazz"],
    levelRequired: 3
  },
  {
    id: "rhythm-nation",
    name: "Rhythm Nation",
    logoPath: "/record-labels/rhythm-nation.svg",
    description: "Boutique label focused on artistic authenticity and meaningful music.",
    reputation: 80,
    marketingPower: 75,
    artistDevelopment: 90,
    distribution: 80,
    royaltyRate: 0.25, // 25% to artist
    contractLength: 52, // 1 year
    advanceAmount: 25000,
    genres: ["Hip Hop", "Soul", "Indie"],
    levelRequired: 2
  },
  {
    id: "global-beats",
    name: "Global Beats",
    logoPath: "/record-labels/global-beats.svg",
    description: "International label specializing in worldwide promotion and multicultural audiences.",
    reputation: 88,
    marketingPower: 85,
    artistDevelopment: 80,
    distribution: 93,
    royaltyRate: 0.20, // 20% to artist
    contractLength: 104, // 2 years
    advanceAmount: 100000,
    genres: ["Hip Hop", "World", "Pop", "Afrobeat"],
    levelRequired: 6
  },
  {
    id: "future-sounds",
    name: "Future Sounds",
    logoPath: "/record-labels/future-sounds.svg",
    description: "Cutting-edge label focused on digital innovation and emerging platforms.",
    reputation: 82,
    marketingPower: 88,
    artistDevelopment: 70,
    distribution: 85,
    royaltyRate: 0.24, // 24% to artist
    contractLength: 78, // 1.5 years
    advanceAmount: 60000,
    genres: ["Hip Hop", "Electronic", "Alternative", "Experimental"],
    levelRequired: 4
  }
];

/**
 * Get labels that are available based on the rapper's level
 */
export function getLabelsByLevelRequirement(level: number): RecordLabel[] {
  return recordLabels.filter(label => label.levelRequired <= level);
}

/**
 * Get a label by its ID
 */
export function getLabelById(id: string): RecordLabel | undefined {
  return recordLabels.find(label => label.id === id);
}