// Progression, Leveling, and Power Score Algorithms
export const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 30, title: 'Language Legend' },
  { minLevel: 25, title: 'English Grandmaster' },
  { minLevel: 20, title: 'English Champion' },
  { minLevel: 15, title: 'Clause Vanguard' },
  { minLevel: 12, title: 'Syntax Sentinel' },
  { minLevel: 10, title: 'Grammar Master' },
  { minLevel: 8, title: 'Syntax Knight' },
  { minLevel: 5, title: 'Word Explorer' },
  { minLevel: 3, title: 'Vocab Scout' },
  { minLevel: 1, title: 'Novice Scholar' },
];

export function getTitleForLevel(level: number): string {
  for (const item of LEVEL_TITLES) {
    if (level >= item.minLevel) return item.title;
  }
  return 'Novice Scholar';
}

/**
 * Calculates XP required to reach the NEXT level from the current level.
 * Formula scales smoothly with level: 250 * level + 100 * level^1.1
 */
export function getXpRequiredForLevel(level: number): number {
  return Math.round(250 * level + 80 * Math.pow(level, 1.25));
}

export interface LevelProgress {
  level: number;
  currentXpInLevel: number;
  xpRequired: number;
  progressPercent: number;
  leveledUp: boolean;
  newLevel: number;
  newTitle?: string;
}

export function computeLevelProgress(totalXp: number): LevelProgress {
  let level = 1;
  let accumulatedXp = 0;

  while (true) {
    const needed = getXpRequiredForLevel(level);
    if (totalXp >= accumulatedXp + needed) {
      accumulatedXp += needed;
      level++;
    } else {
      break;
    }
  }

  const currentXpInLevel = totalXp - accumulatedXp;
  const xpRequired = getXpRequiredForLevel(level);
  const progressPercent = Math.min(100, Math.max(0, (currentXpInLevel / xpRequired) * 100));

  return {
    level,
    currentXpInLevel,
    xpRequired,
    progressPercent,
    leveledUp: false,
    newLevel: level,
    newTitle: getTitleForLevel(level),
  };
}

export interface PowerScoreBreakdown {
  overallScore: number; // 0 - 1000
  vocabulary: number; // 0 - 100%
  syntax: number; // 0 - 100%
  velocity: number; // 0 - 100%
  precision: number; // 0 - 100%
  consistency: number; // 0 - 100%
}

export function calculatePowerScore(
  accuracy: number,
  avgSpeedSeconds: number,
  streakDays: number,
  totalQuestions: number,
  wordRushScore: number,
  grammarScore: number
): PowerScoreBreakdown {
  // Vocabulary pillar based on word rush activity and questions
  const vocabScore = Math.min(96, Math.max(45, Math.round(50 + (wordRushScore / 500) * 10 + Math.min(30, totalQuestions * 0.4))));
  
  // Syntax pillar based on grammar battle score & accuracy
  const syntaxScore = Math.min(98, Math.max(40, Math.round(accuracy * 0.7 + (grammarScore > 0 ? 25 : 10))));

  // Velocity pillar: faster is higher (e.g. 1.2s -> 94%, 3.5s -> 65%)
  const speed = avgSpeedSeconds > 0 ? avgSpeedSeconds : 2.0;
  const velocityScore = Math.min(99, Math.max(30, Math.round(100 - (speed - 0.8) * 16)));

  // Precision pillar: direct accuracy
  const precisionScore = Math.min(100, Math.max(20, Math.round(accuracy || 75)));

  // Consistency pillar: based on streak and total games
  const consistencyScore = Math.min(99, Math.max(35, Math.round(50 + streakDays * 8)));

  // Overall combined score out of 1000
  const overallScore = Math.round(
    vocabScore * 2.5 +
    syntaxScore * 2.5 +
    velocityScore * 2.0 +
    precisionScore * 2.0 +
    consistencyScore * 1.0
  );

  return {
    overallScore: Math.min(995, Math.max(280, overallScore)),
    vocabulary: vocabScore,
    syntax: syntaxScore,
    velocity: velocityScore,
    precision: precisionScore,
    consistency: consistencyScore,
  };
}
