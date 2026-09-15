export type GameMode = 'word-rush' | 'grammar-battle' | 'mystery';
export type AppTab = 'arena-hub' | 'game-modes' | 'stats-radar' | 'vault' | 'settings';
export type DifficultyLevel = 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'expert';

export interface PlayerData {
  name: string;
  avatarId: string;
  frameId: string;
  title: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  unlockedAvatars: string[];
  unlockedFrames: string[];
  unlockedTitles: string[];
}

export interface PlayerStatistics {
  totalGames: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  longestStreak: number;
  bestCombo: number;
  avgSpeedSeconds: number;
  powerScore: number;
  bestScores: {
    wordRush: number;
    grammarBattle: number;
    mystery: number;
  };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  weeklyHistory: boolean[]; // 7 days (M, T, W, T, F, S, S)
}

export interface GameSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  difficulty: DifficultyLevel;
  theme: 'cyberpunk-dark' | 'neon-arcade' | 'matrix-green';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
  xpReward: number;
  coinReward: number;
  claimed: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  claimed: boolean;
  xpReward: number;
  coinReward: number;
  dateStr: string;
}

export interface MatchLog {
  id: string;
  timestamp: number;
  mode: GameMode;
  score: number;
  accuracy: number;
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  coinsEarned: number;
  maxCombo: number;
}

export interface WordRushQuestion {
  id: string;
  difficulty: DifficultyLevel;
  category: string;
  question: string;
  sentenceClue?: string;
  options: string[];
  answer: string;
  explanation: string;
  antonym?: string;
  synonym?: string;
  xp: number;
}

export interface GrammarQuestion {
  id: string;
  difficulty: DifficultyLevel;
  category: string;
  targetConcept: string;
  sentencePrompt: string; // "If I ___ known..."
  blankWord: string;
  options: {
    text: string;
    actionName: string;
    icon: string;
  }[];
  answer: string;
  bossTaunt: string;
  tauntTitle: string;
  grammarProtocol: string;
  xp: number;
}

export interface EvidenceLog {
  id: string;
  logCode: string;
  title: string;
  description: string;
  icon: string;
  tagColor?: string;
}

export interface MysteryScene {
  sceneNumber: number;
  totalScenes: number;
  suspectName: string;
  suspectRole: string;
  suspectMood: string;
  avatarUrl: string;
  dialoguePrompt: string;
  clueFocus: string;
  evidenceLogs: EvidenceLog[];
  questionPrompt: string;
  options: {
    id: string;
    text: string;
    tag: string;
    isCorrect: boolean;
    verificationText: string;
    linguisticNote: string;
  }[];
  correctAnswerId: string;
}

export interface MysteryCase {
  id: string;
  caseFileNumber: string;
  title: string;
  accuracyGoal: number;
  scenes: MysteryScene[];
  culpritName: string;
  culpritRole: string;
  solutionNarrative: string;
  xpReward: number;
  coinReward: number;
}

export interface RoundResult {
  mode: GameMode;
  score: number;
  accuracy: number;
  correctCount: number;
  wrongCount: number;
  maxCombo: number;
  speedAvg: number;
  xpEarned: number;
  coinsEarned: number;
  levelUp: boolean;
  prevLevel: number;
  newLevel: number;
  newTitle?: string;
  newUnlocks: {
    type: string;
    name: string;
    detail: string;
  }[];
  learnedTakeaways: {
    title: string;
    concept: string;
    tag: string;
  }[];
}
