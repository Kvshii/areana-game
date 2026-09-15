import {
  PlayerData,
  PlayerStatistics,
  StreakData,
  GameSettings,
  Achievement,
  DailyChallenge,
  MatchLog,
} from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { calculatePowerScore } from './progression';

const STORAGE_KEYS = {
  PLAYER: 'englishArena.player',
  STATISTICS: 'englishArena.statistics',
  STREAK: 'englishArena.streak',
  SETTINGS: 'englishArena.settings',
  ACHIEVEMENTS: 'englishArena.achievements',
  DAILY: 'englishArena.dailyChallenge',
  HISTORY: 'englishArena.history',
};

const DEFAULT_PLAYER: PlayerData = {
  name: 'Alex',
  avatarId: 'alex-cyberhawk',
  frameId: 'frame-holo-cyan',
  title: 'Word Explorer',
  level: 7,
  xp: 1450,
  coins: 840,
  gems: 100,
  unlockedAvatars: ['alex-cyberhawk'],
  unlockedFrames: ['frame-holo-cyan'],
  unlockedTitles: ['title-word-explorer'],
};

const DEFAULT_STATISTICS: PlayerStatistics = {
  totalGames: 24,
  totalQuestions: 148,
  correctAnswers: 132,
  wrongAnswers: 16,
  accuracy: 89.2,
  longestStreak: 8,
  bestCombo: 12,
  avgSpeedSeconds: 1.4,
  powerScore: 784,
  bestScores: {
    wordRush: 2450,
    grammarBattle: 1850,
    mystery: 350,
  },
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 5,
  longestStreak: 8,
  lastActiveDate: new Date().toISOString().split('T')[0],
  weeklyHistory: [true, true, true, true, true, false, false], // Mon - Sun
};

const DEFAULT_SETTINGS: GameSettings = {
  sfxEnabled: true,
  musicEnabled: false,
  animationsEnabled: true,
  difficulty: 'intermediate',
  theme: 'cyberpunk-dark',
};

const DEFAULT_DAILY: DailyChallenge = {
  id: 'daily-grammar-blitz',
  title: 'Grammar Blitz Challenge',
  description: 'Correctly answer 10 irregular tense verb clashes in Rapid Arena.',
  target: 10,
  current: 7,
  completed: false,
  claimed: false,
  xpReward: 120,
  coinReward: 50,
  dateStr: new Date().toISOString().split('T')[0],
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private mode fallback
  }
}

// Player Data
export function getPlayerData(): PlayerData {
  return safeGet<PlayerData>(STORAGE_KEYS.PLAYER, DEFAULT_PLAYER);
}

export function savePlayerData(data: PlayerData): void {
  safeSet(STORAGE_KEYS.PLAYER, data);
}

// Statistics
export function getStatistics(): PlayerStatistics {
  const stats = safeGet<PlayerStatistics>(STORAGE_KEYS.STATISTICS, DEFAULT_STATISTICS);
  // Recalculate power score dynamically
  const streak = getStreakData();
  const power = calculatePowerScore(
    stats.accuracy,
    stats.avgSpeedSeconds,
    streak.currentStreak,
    stats.totalQuestions,
    stats.bestScores.wordRush,
    stats.bestScores.grammarBattle
  );
  stats.powerScore = power.overallScore;
  return stats;
}

export function saveStatistics(stats: PlayerStatistics): void {
  safeSet(STORAGE_KEYS.STATISTICS, stats);
}

// Streak Management
export function getStreakData(): StreakData {
  return safeGet<StreakData>(STORAGE_KEYS.STREAK, DEFAULT_STREAK);
}

export function recordActivityToday(): StreakData {
  const data = getStreakData();
  const today = new Date().toISOString().split('T')[0];

  if (data.lastActiveDate === today) {
    return data;
  }

  const lastDate = new Date(data.lastActiveDate);
  const currentDate = new Date(today);
  const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    data.currentStreak += 1;
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }
  } else if (diffDays > 1) {
    data.currentStreak = 1;
  }

  data.lastActiveDate = today;
  // Update weekday in 7-day array
  const dayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6
  if (data.weeklyHistory) {
    data.weeklyHistory[dayIndex] = true;
  }

  safeSet(STORAGE_KEYS.STREAK, data);
  return data;
}

// Settings
export function getSettings(): GameSettings {
  return safeGet<GameSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: GameSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}

// Achievements
export function getAchievements(): Achievement[] {
  return safeGet<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
}

export function saveAchievements(list: Achievement[]): void {
  safeSet(STORAGE_KEYS.ACHIEVEMENTS, list);
}

export function unlockAchievement(achievementId: string): Achievement | null {
  const list = getAchievements();
  const target = list.find((a) => a.id === achievementId);
  if (target && !target.unlocked) {
    target.unlocked = true;
    target.unlockedAt = 'Just Now';
    target.progress = target.target;
    saveAchievements(list);
    return target;
  }
  return null;
}

export function claimAchievement(achievementId: string): { xp: number; coins: number } | null {
  const list = getAchievements();
  const target = list.find((a) => a.id === achievementId);
  if (target && target.unlocked && !target.claimed) {
    target.claimed = true;
    saveAchievements(list);

    const player = getPlayerData();
    player.xp += target.xpReward;
    player.coins += target.coinReward;
    savePlayerData(player);

    return { xp: target.xpReward, coins: target.coinReward };
  }
  return null;
}

// Daily Challenge
export function getDailyChallenge(): DailyChallenge {
  const today = new Date().toISOString().split('T')[0];
  const stored = safeGet<DailyChallenge>(STORAGE_KEYS.DAILY, DEFAULT_DAILY);
  if (stored.dateStr !== today) {
    const refreshed: DailyChallenge = {
      ...DEFAULT_DAILY,
      dateStr: today,
      current: 0,
      completed: false,
      claimed: false,
    };
    safeSet(STORAGE_KEYS.DAILY, refreshed);
    return refreshed;
  }
  return stored;
}

export function advanceDailyChallenge(amount: number = 1): DailyChallenge {
  const challenge = getDailyChallenge();
  if (challenge.completed) return challenge;

  challenge.current = Math.min(challenge.target, challenge.current + amount);
  if (challenge.current >= challenge.target) {
    challenge.completed = true;
  }
  safeSet(STORAGE_KEYS.DAILY, challenge);
  return challenge;
}

export function claimDailyReward(): { xp: number; coins: number } | null {
  const challenge = getDailyChallenge();
  if (challenge.completed && !challenge.claimed) {
    challenge.claimed = true;
    safeSet(STORAGE_KEYS.DAILY, challenge);

    const player = getPlayerData();
    player.xp += challenge.xpReward;
    player.coins += challenge.coinReward;
    savePlayerData(player);

    return { xp: challenge.xpReward, coins: challenge.coinReward };
  }
  return null;
}

// Match Logs
export function getMatchHistory(): MatchLog[] {
  return safeGet<MatchLog[]>(STORAGE_KEYS.HISTORY, [
    {
      id: 'log-prev-1',
      timestamp: Date.now() - 3600000 * 2,
      mode: 'word-rush',
      score: 1840,
      accuracy: 94,
      correctCount: 19,
      totalCount: 20,
      xpEarned: 280,
      coinsEarned: 110,
      maxCombo: 8,
    },
    {
      id: 'log-prev-2',
      timestamp: Date.now() - 3600000 * 18,
      mode: 'grammar-battle',
      score: 2150,
      accuracy: 90,
      correctCount: 9,
      totalCount: 10,
      xpEarned: 320,
      coinsEarned: 140,
      maxCombo: 6,
    },
  ]);
}

export function addMatchLog(log: MatchLog): void {
  const history = getMatchHistory();
  history.unshift(log);
  if (history.length > 25) {
    history.pop();
  }
  safeSet(STORAGE_KEYS.HISTORY, history);
}

// Reset Entire Game Progress
export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PLAYER);
  localStorage.removeItem(STORAGE_KEYS.STATISTICS);
  localStorage.removeItem(STORAGE_KEYS.STREAK);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  localStorage.removeItem(STORAGE_KEYS.DAILY);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}
