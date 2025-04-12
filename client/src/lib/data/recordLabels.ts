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
    description: "A forward-thinking independent label with a diverse roster of artists. Known for supporting creative freedom and prioritizing artist development.",
    reputation: 70,
    marketingPower: 65,
    artistDevelopment: 80,
    distribution: 75,
    royaltyRate: 0.25, // 25% to artist, 75% to label
    contractLength: 104, // 2 years
    advanceAmount: 50000,
    genres: ["Hip-Hop", "R&B", "Pop"],
    levelRequired: 3,
    signupBonus: 5000
  },
  {
    id: "stellar-entertainment",
    name: "Stellar Entertainment",
    logoPath: "/record-labels/stellar-entertainment.svg",
    description: "A major entertainment company with global reach. Offers industry-leading marketing and promotion but with stricter creative control.",
    reputation: 95,
    marketingPower: 90,
    artistDevelopment: 70,
    distribution: 95,
    royaltyRate: 0.18, // 18% to artist, 82% to label
    contractLength: 156, // 3 years
    advanceAmount: 200000,
    genres: ["Hip-Hop", "Pop", "Electronic", "R&B"],
    levelRequired: 6
  },
  {
    id: "horizon-records",
    name: "Horizon Records",
    logoPath: "/record-labels/horizon-records.svg",
    description: "A medium-sized label known for breaking emerging artists. Strong A&R team with good connections to radio and streaming platforms.",
    reputation: 75,
    marketingPower: 80,
    artistDevelopment: 75,
    distribution: 80,
    royaltyRate: 0.22, // 22% to artist, 78% to label
    contractLength: 130, // 2.5 years
    advanceAmount: 100000,
    genres: ["Hip-Hop", "R&B", "Pop", "Trap"],
    levelRequired: 4
  },
  {
    id: "urban-dynasty",
    name: "Urban Dynasty",
    logoPath: "/record-labels/urban-dynasty.svg",
    description: "A powerhouse in urban music. Elite-level marketing and promotion with deep industry connections.",
    reputation: 90,
    marketingPower: 95,
    artistDevelopment: 65,
    distribution: 90,
    royaltyRate: 0.20, // 20% to artist, 80% to label
    contractLength: 156, // 3 years
    advanceAmount: 250000,
    genres: ["Hip-Hop", "Trap", "R&B"],
    levelRequired: 7
  },
  {
    id: "pulse-records",
    name: "Pulse Records",
    logoPath: "/record-labels/pulse-records.svg",
    description: "A boutique label focused on innovation and digital-first strategies. Offers higher royalty rates but smaller advances.",
    reputation: 65,
    marketingPower: 70,
    artistDevelopment: 85,
    distribution: 75,
    royaltyRate: 0.30, // 30% to artist, 70% to label
    contractLength: 78, // 1.5 years
    advanceAmount: 40000,
    genres: ["Hip-Hop", "Alternative", "Electronic", "Indie"],
    levelRequired: 2
  },
  {
    id: "street-level",
    name: "Street Level Entertainment",
    logoPath: "/record-labels/street-level.svg",
    description: "A grassroots label with strong underground connections. Focuses on authentic hip-hop and street culture.",
    reputation: 60,
    marketingPower: 60,
    artistDevelopment: 75,
    distribution: 65,
    royaltyRate: 0.28, // 28% to artist, 72% to label
    contractLength: 52, // 1 year
    advanceAmount: 25000,
    genres: ["Hip-Hop", "Trap", "Drill"],
    levelRequired: 1,
    signupBonus: 2500
  }
];

export function getLabelsByLevelRequirement(level: number): RecordLabel[] {
  return recordLabels.filter(label => label.levelRequired <= level);
}

export function getLabelById(id: string): RecordLabel | undefined {
  return recordLabels.find(label => label.id === id);
}