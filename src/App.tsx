import React, { useState, useEffect } from 'react';
import {
  AppTab,
  GameMode,
  PlayerData,
  StreakData,
  PlayerStatistics,
  GameSettings,
  Achievement,
  DailyChallenge,
  MatchLog,
  RoundResult,
} from './types/game';
import {
  getPlayerData,
  savePlayerData,
  getStreakData,
  recordActivityToday,
  getStatistics,
  saveStatistics,
  getSettings,
  saveSettings,
  getAchievements,
  claimAchievement,
  getDailyChallenge,
  advanceDailyChallenge,
  getMatchHistory,
  addMatchLog,
  resetProgress,
} from './lib/storage';
import { computeLevelProgress } from './lib/progression';
import { sound } from './lib/audio';
import { CosmeticItem } from './data/cosmetics';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ArenaHub } from './components/dashboard/ArenaHub';
import { GameModesView } from './components/modes/GameModesView';
import { WordRushMode } from './components/modes/WordRushMode';
import { GrammarBattleMode } from './components/modes/GrammarBattleMode';
import { MysteryMode } from './components/modes/MysteryMode';
import { RoundResultsModal } from './components/results/RoundResultsModal';
import { StatsRadarView } from './components/stats/StatsRadarView';
import { VaultAchievementsView } from './components/vault/VaultAchievementsView';
import { SettingsView } from './components/settings/SettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('arena-hub');
  const [activeGameMode, setActiveGameMode] = useState<GameMode | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

  // Core Persistent State
  const [player, setPlayer] = useState<PlayerData>(getPlayerData);
  const [streak, setStreak] = useState<StreakData>(getStreakData);
  const [stats, setStats] = useState<PlayerStatistics>(getStatistics);
  const [settings, setSettings] = useState<GameSettings>(getSettings);
  const [achievements, setAchievements] = useState<Achievement[]>(getAchievements);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(getDailyChallenge);
  const [matchHistory, setMatchHistory] = useState<MatchLog[]>(getMatchHistory);

  // Initialize and check streak on mount
  useEffect(() => {
    const updatedStreak = recordActivityToday();
    setStreak(updatedStreak);
    sound.setSfxEnabled(settings.sfxEnabled);
    sound.setMusicEnabled(settings.musicEnabled);
  }, []);

  // Update Settings
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    sound.setSfxEnabled(newSettings.sfxEnabled);
    sound.setMusicEnabled(newSettings.musicEnabled);
  };

  const handleToggleSfx = () => {
    const next = !settings.sfxEnabled;
    handleUpdateSettings({ ...settings, sfxEnabled: next });
  };

  // Launch Game Mode
  const handleLaunchMode = (mode: GameMode) => {
    sound.playClick();
    setActiveGameMode(mode);
  };

  // Complete Round & Process Meta-Progression
  const handleCompleteRound = (result: RoundResult) => {
    // 1. Process XP and Level Progression
    const updatedXp = player.xp + result.xpEarned;
    const updatedCoins = player.coins + result.coinsEarned;
    const levelInfo = computeLevelProgress(updatedXp);

    const prevLevel = player.level;
    const newLevel = levelInfo.level;
    const didLevelUp = newLevel > prevLevel;

    const updatedPlayer: PlayerData = {
      ...player,
      xp: updatedXp,
      coins: updatedCoins,
      level: newLevel,
      title: levelInfo.newTitle || player.title,
    };

    setPlayer(updatedPlayer);
    savePlayerData(updatedPlayer);

    // 2. Process Statistics
    const totalQ = stats.totalQuestions + result.correctCount + result.wrongCount;
    const totalCorrect = stats.correctAnswers + result.correctCount;
    const newAccuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 1000) / 10 : stats.accuracy;
    const newMaxCombo = Math.max(stats.bestCombo, result.maxCombo);

    const updatedStats: PlayerStatistics = {
      ...stats,
      totalGames: stats.totalGames + 1,
      totalQuestions: totalQ,
      correctAnswers: totalCorrect,
      wrongAnswers: stats.wrongAnswers + result.wrongCount,
      accuracy: newAccuracy,
      bestCombo: newMaxCombo,
      bestScores: {
        ...stats.bestScores,
        [result.mode === 'word-rush'
          ? 'wordRush'
          : result.mode === 'grammar-battle'
          ? 'grammarBattle'
          : 'mystery']: Math.max(
          stats.bestScores[
            result.mode === 'word-rush'
              ? 'wordRush'
              : result.mode === 'grammar-battle'
              ? 'grammarBattle'
              : 'mystery'
          ],
          result.score
        ),
      },
    };

    setStats(updatedStats);
    saveStatistics(updatedStats);

    // 3. Match Log History
    const log: MatchLog = {
      id: `match-${Date.now()}`,
      timestamp: Date.now(),
      mode: result.mode,
      score: result.score,
      accuracy: result.accuracy,
      correctCount: result.correctCount,
      totalCount: result.correctCount + result.wrongCount,
      xpEarned: result.xpEarned,
      coinsEarned: result.coinsEarned,
      maxCombo: result.maxCombo,
    };
    addMatchLog(log);
    setMatchHistory(getMatchHistory());

    // 4. Advance Daily Challenge
    if (!dailyChallenge.completed) {
      const advanced = advanceDailyChallenge(result.correctCount);
      setDailyChallenge(advanced);
    }

    // 5. Populate Result with real Level info
    const enrichedResult: RoundResult = {
      ...result,
      prevLevel,
      newLevel,
      levelUp: didLevelUp,
    };

    setRoundResult(enrichedResult);
  };

  const handleClaimAchievement = (id: string) => {
    const reward = claimAchievement(id);
    if (reward) {
      setPlayer(getPlayerData());
      setAchievements(getAchievements());
    }
  };

  const handleEquipCosmetic = (item: CosmeticItem) => {
    const p = { ...player };
    if (item.type === 'avatar') p.avatarId = item.id;
    if (item.type === 'frame') p.frameId = item.id;
    if (item.type === 'title') p.title = item.name;
    setPlayer(p);
    savePlayerData(p);
  };

  const handleBuyCosmetic = (item: CosmeticItem) => {
    if (player.coins < item.costCoins) return;
    const p = { ...player };
    p.coins -= item.costCoins;
    if (item.type === 'avatar') {
      p.unlockedAvatars.push(item.id);
      p.avatarId = item.id;
    } else if (item.type === 'frame') {
      p.unlockedFrames.push(item.id);
      p.frameId = item.id;
    } else if (item.type === 'title') {
      p.unlockedTitles.push(item.id);
      p.title = item.name;
    }
    setPlayer(p);
    savePlayerData(p);
  };

  const handleDeductCoins = (amount: number): boolean => {
    if (player.coins < amount) return false;
    const p = { ...player, coins: player.coins - amount };
    setPlayer(p);
    savePlayerData(p);
    return true;
  };

  const handleUpdatePlayerName = (newName: string) => {
    const p = { ...player, name: newName };
    setPlayer(p);
    savePlayerData(p);
  };

  const handleResetProgress = () => {
    resetProgress();
    setPlayer(getPlayerData());
    setStreak(getStreakData());
    setStats(getStatistics());
    setAchievements(getAchievements());
    setDailyChallenge(getDailyChallenge());
    setMatchHistory(getMatchHistory());
    setActiveGameMode(null);
    setRoundResult(null);
    setActiveTab('arena-hub');
  };

  const getCurrentModeTitle = () => {
    if (!activeGameMode) return undefined;
    switch (activeGameMode) {
      case 'word-rush':
        return 'Word Rush // Arcade';
      case 'grammar-battle':
        return 'Grammar Battle // Boss Raid';
      case 'mystery':
        return 'English Mystery // Case File';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0e18] text-[#dfe2f1] font-sans antialiased overflow-x-hidden flex flex-col">
      {/* 1. Universal Top Header */}
      <Header
        player={player}
        streak={streak}
        activeTab={activeTab}
        currentModeTitle={getCurrentModeTitle()}
        onBack={activeGameMode ? () => setActiveGameMode(null) : undefined}
        onOpenProfile={() => setActiveTab('settings')}
        sfxEnabled={settings.sfxEnabled}
        onToggleSfx={handleToggleSfx}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 w-full pt-16 sm:pt-20 md:pt-32 pb-20 sm:pb-24">
        {/* If Active Game Mode is running */}
        {activeGameMode === 'word-rush' && (
          <WordRushMode
            onCompleteRound={handleCompleteRound}
            onExit={() => setActiveGameMode(null)}
            sfxEnabled={settings.sfxEnabled}
            onToggleSfx={handleToggleSfx}
          />
        )}

        {activeGameMode === 'grammar-battle' && (
          <GrammarBattleMode
            onCompleteRound={handleCompleteRound}
            onExit={() => setActiveGameMode(null)}
            playerCoins={player.coins}
            onDeductCoins={handleDeductCoins}
          />
        )}

        {activeGameMode === 'mystery' && (
          <MysteryMode
            onCompleteRound={handleCompleteRound}
            onExit={() => setActiveGameMode(null)}
          />
        )}

        {/* Otherwise render Tab View */}
        {!activeGameMode && (
          <>
            {activeTab === 'arena-hub' && (
              <ArenaHub
                player={player}
                streak={streak}
                stats={stats}
                dailyChallenge={dailyChallenge}
                onLaunchMode={handleLaunchMode}
                onOpenDaily={() => handleLaunchMode('grammar-battle')}
              />
            )}

            {activeTab === 'game-modes' && (
              <GameModesView onSelectMode={handleLaunchMode} />
            )}

            {activeTab === 'stats-radar' && (
              <StatsRadarView
                stats={stats}
                streak={streak}
                matchHistory={matchHistory}
              />
            )}

            {activeTab === 'vault' && (
              <VaultAchievementsView
                player={player}
                achievements={achievements}
                onClaimAchievement={handleClaimAchievement}
                onEquipCosmetic={handleEquipCosmetic}
                onBuyCosmetic={handleBuyCosmetic}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                player={player}
                settings={settings}
                onUpdatePlayerName={handleUpdatePlayerName}
                onUpdateSettings={handleUpdateSettings}
                onResetProgress={handleResetProgress}
              />
            )}
          </>
        )}
      </main>

      {/* 3. Global Round Results Modal */}
      {roundResult && (
        <RoundResultsModal
          result={roundResult}
          onContinue={() => {
            setRoundResult(null);
            setActiveGameMode(null);
          }}
          onReplay={() => {
            const m = roundResult.mode;
            setRoundResult(null);
            setActiveGameMode(m);
          }}
        />
      )}

      {/* 4. Bottom Navigation (Mobile) + Sub-Bar (Desktop) */}
      {!activeGameMode && (
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveGameMode(null);
            setActiveTab(tab);
          }}
        />
      )}
    </div>
  );
}
