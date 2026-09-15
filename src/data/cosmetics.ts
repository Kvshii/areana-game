export interface CosmeticItem {
  id: string;
  name: string;
  type: 'avatar' | 'frame' | 'title';
  description: string;
  previewUrl?: string;
  costCoins: number;
  costGems: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  requiredLevel: number;
}

export const COSMETIC_AVATARS: CosmeticItem[] = [
  {
    id: 'alex-cyberhawk',
    name: 'Alex Cyberhawk',
    type: 'avatar',
    description: 'Cyberpunk esports anime student protagonist with luminous cyan visor headphones.',
    previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKB_vSA6bazJogyPc4FTynyJXg2-IykrXUgC1QbaUh0O0gZ70NnwYFvfWAZXTcFmj-SDZnz6Khq3XrMGoFN9bAcROv6rR0bSJGHhZ-X63KUUGY5DmnhMRQ1RizU2iEBzo6-h_h8L_bgsCOfrZ-JLlD6rAW79wuKEi0ShpW_lnYjV5UFfZG4S_Io6nmyM3gdWLmYKsUevJRDSvFuPbR6_sksIOOwnXVPGNHot3hqs6qt510qh0eY6zu1w',
    costCoins: 0,
    costGems: 0,
    rarity: 'Common',
    requiredLevel: 1,
  },
  {
    id: 'neon-knight',
    name: 'Neon Knight MVP',
    type: 'avatar',
    description: 'Chibi cyber arena champion wielding dual hexagonal energy shields.',
    previewUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XJIUuvSZjPIj-UIGH8MJnBYNhCZDbQuGdBGxBxcYPc0RDlUrQnEo7J-aSmyAMYCoiWnF25zA-nvl3enoSI93sBSxvOP6YjOlS9krfrJsdAhoWI-l6rIpQtkFNbdj1lSB5XSQnExdIefL4cInH_6XA8u6Ri9iWf8H7P-UfM5betX-tgIIfX6-vAoDibWRNEjtkOZwRNi5nb5ovhzLaZ8jARxbvdU81wx-Xq354gF3X9WVZRMcVHnTmucid6',
    costCoins: 350,
    costGems: 20,
    rarity: 'Epic',
    requiredLevel: 5,
  },
  {
    id: 'detective-oxford',
    name: 'Inspector Oxford',
    type: 'avatar',
    description: 'Moody film-noir investigator fluent in subtext, clues, and linguistic deduction.',
    previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAn50c49-sLPjAOM34UwE5KOYwmtix2naXK0n0nLK5aJ77yn9KxUBpz1Cd_zf3M1J72yIzcK850oTt96f0n_lledgSpoSirFU5DwxAiNOriJaoHD7zE-GP0XfcOzwqrtEUJZp61rMLNraq2YwmNbe8G6wDKVkWrjuRD7FIjPlpHgP1O5Rkt2GVhhgmm3-yMRF7Kb_FMFTZDv2fY3OmeNABW5woOPy3sUaa_Mdrz3wBYJ8JM7TNhFd9oQ',
    costCoins: 500,
    costGems: 50,
    rarity: 'Rare',
    requiredLevel: 7,
  },
  {
    id: 'syntax-sorcerer',
    name: 'Syntax Sorcerer',
    type: 'avatar',
    description: 'Grand master of irregular verbs and complex conditional clauses.',
    previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2XMlq3RRSSUz9gAcRinPapQUb8MRCVrcB2tNhYIyVJGDbDXRDcEHKFkViArtDa2CUyPoTYwRptRrdnUY9Bc5t9WUVm46TAYiGdHF6d-jlDqLo6wXfx4REElBtpA0e2tr4wOc9tPxYp5iGSTe9KA7JaxTuvVB0wr7AcMFpuuzfAk-9tWbq7rjrtIdy4hekT7nAlqItAzDgrRxbdt5EMb6eC-fR3_CXMj8fLaNW1t6SfDQLEkWCgf5AZg',
    costCoins: 1200,
    costGems: 100,
    rarity: 'Legendary',
    requiredLevel: 10,
  },
];

export const COSMETIC_FRAMES: CosmeticItem[] = [
  {
    id: 'frame-holo-cyan',
    name: 'Holo-Cyan Prism',
    type: 'frame',
    description: 'Electric cyan energy border with subtle animated corner ticks.',
    costCoins: 0,
    costGems: 0,
    rarity: 'Common',
    requiredLevel: 1,
  },
  {
    id: 'frame-violet-plasma',
    name: 'Plasma Violet Ring',
    type: 'frame',
    description: 'Arcane purple energy ring designed for grammar tacticians.',
    costCoins: 250,
    costGems: 15,
    rarity: 'Rare',
    requiredLevel: 4,
  },
  {
    id: 'frame-gold-champions',
    name: 'Golden Champions Crest',
    type: 'frame',
    description: 'Gleaming 24K gold laurels awarded to streak maintainers.',
    costCoins: 800,
    costGems: 50,
    rarity: 'Epic',
    requiredLevel: 8,
  },
  {
    id: 'frame-cyber-legend',
    name: 'Singularity Overdrive',
    type: 'frame',
    description: 'Tri-color prism shield with hyper-dense reactive luminescence.',
    costCoins: 2000,
    costGems: 150,
    rarity: 'Legendary',
    requiredLevel: 15,
  },
];

export const COSMETIC_TITLES: CosmeticItem[] = [
  {
    id: 'title-word-explorer',
    name: 'Word Explorer',
    type: 'title',
    description: 'Recognized seeker of rare roots and nuanced vocabulary.',
    costCoins: 0,
    costGems: 0,
    rarity: 'Common',
    requiredLevel: 1,
  },
  {
    id: 'title-syntax-knight',
    name: 'Syntax Knight',
    type: 'title',
    description: 'Warrior equipped to pierce irregular verbs and subjunctive traps.',
    costCoins: 200,
    costGems: 10,
    rarity: 'Rare',
    requiredLevel: 5,
  },
  {
    id: 'title-linguistic-detective',
    name: 'Master Detective',
    type: 'title',
    description: 'Solves real-world cases with precise comprehension and deductive instinct.',
    costCoins: 450,
    costGems: 30,
    rarity: 'Epic',
    requiredLevel: 7,
  },
  {
    id: 'title-language-legend',
    name: 'Language Legend',
    type: 'title',
    description: 'Unmatched titan of the Global English Arena.',
    costCoins: 1500,
    costGems: 100,
    rarity: 'Legendary',
    requiredLevel: 20,
  },
];
