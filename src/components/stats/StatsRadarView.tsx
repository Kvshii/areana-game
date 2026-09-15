import React from 'react';
import { PlayerStatistics, StreakData, MatchLog } from '../../types/game';
import { calculatePowerScore } from '../../lib/progression';

interface StatsRadarViewProps {
  stats: PlayerStatistics;
  streak: StreakData;
  matchHistory: MatchLog[];
}

export const StatsRadarView: React.FC<StatsRadarViewProps> = ({ stats, streak, matchHistory }) => {
  const power = calculatePowerScore(
    stats.accuracy,
    stats.avgSpeedSeconds,
    streak.currentStreak,
    stats.totalQuestions,
    stats.bestScores.wordRush,
    stats.bestScores.grammarBattle
  );

  const pillars = [
    { label: 'Vocabulary Nuance', value: power.vocabulary, icon: 'auto_stories', color: 'from-[#06b6d4] to-[#4cd7f6]' },
    { label: 'Syntax & Tense Concord', value: power.syntax, icon: 'swords', color: 'from-[#8b5cf6] to-[#d0bcff]' },
    { label: 'Cognitive Velocity', value: power.velocity, icon: 'bolt', color: 'from-[#f59e0b] to-[#ffb95f]' },
    { label: 'Diagnostic Precision', value: power.precision, icon: 'verified', color: 'from-[#10b981] to-[#34d399]' },
    { label: 'Habit Consistency', value: power.consistency, icon: 'local_fire_department', color: 'from-[#ef4444] to-[#f87171]' },
  ];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 gap-5 select-none">
      {/* 1. Header Overview */}
      <div className="relative w-full rounded-2xl bg-[#1c1f2a] border border-[#262a35] p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4cd7f6] via-[#d0bcff] to-[#ffb95f]" />

        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="font-heading text-[11px] text-[#4cd7f6] uppercase tracking-wider font-bold">
            Biometric Telemetry Radar
          </span>
          <h2 className="font-heading text-xl sm:text-2xl text-[#dfe2f1] font-bold">
            English Power Score (EPS)
          </h2>
          <p className="text-xs text-[#bcc9cd] max-w-md">
            Holistic assessment evaluating vocabulary recall, grammatical structural mastery, answering velocity, and streak discipline.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0a0e18] border border-[#313540] min-w-[140px]">
          <span className="font-heading text-[10px] text-[#869397] uppercase">Global EPS</span>
          <span className="font-heading text-3xl sm:text-4xl text-[#4cd7f6] font-black">
            {power.overallScore}
          </span>
          <span className="text-[10px] text-[#ffb95f] font-heading font-bold">TIER: ELITE SCHOLAR</span>
        </div>
      </div>

      {/* 2. Key Pillars Progress */}
      <div className="w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-5 shadow-xl flex flex-col gap-4">
        <h3 className="font-heading text-base text-[#dfe2f1] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">analytics</span>
          Five-Pillar Diagnostic Analysis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.label}
              className="bg-[#0a0e18]/80 border border-[#262a35] p-3.5 rounded-xl flex flex-col gap-2"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#dfe2f1] font-heading font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
                    {pillar.icon}
                  </span>
                  {pillar.label}
                </span>
                <span className="font-heading text-sm font-bold text-[#4cd7f6]">
                  {pillar.value}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#262a35] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${pillar.color} rounded-full shadow-sm`}
                  style={{ width: `${pillar.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. All-time Match Telemetry Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#1c1f2a] border border-[#262a35] p-3.5 rounded-2xl flex flex-col items-center text-center">
          <span className="font-heading text-[10px] text-[#869397] uppercase">Total Solved</span>
          <span className="font-heading text-xl sm:text-2xl text-[#dfe2f1] font-bold mt-1">
            {stats.totalQuestions}
          </span>
          <span className="text-[10px] text-[#10b981] mt-0.5">{stats.correctAnswers} Correct</span>
        </div>

        <div className="bg-[#1c1f2a] border border-[#262a35] p-3.5 rounded-2xl flex flex-col items-center text-center">
          <span className="font-heading text-[10px] text-[#869397] uppercase">Accuracy</span>
          <span className="font-heading text-xl sm:text-2xl text-[#4cd7f6] font-bold mt-1">
            {stats.accuracy}%
          </span>
          <span className="text-[10px] text-[#bcc9cd] mt-0.5">Arena Target 90%</span>
        </div>

        <div className="bg-[#1c1f2a] border border-[#262a35] p-3.5 rounded-2xl flex flex-col items-center text-center">
          <span className="font-heading text-[10px] text-[#869397] uppercase">Best Combo</span>
          <span className="font-heading text-xl sm:text-2xl text-[#d0bcff] font-bold mt-1">
            {stats.bestCombo}x
          </span>
          <span className="text-[10px] text-[#d0bcff] mt-0.5">Chain Multiplier</span>
        </div>

        <div className="bg-[#1c1f2a] border border-[#262a35] p-3.5 rounded-2xl flex flex-col items-center text-center">
          <span className="font-heading text-[10px] text-[#869397] uppercase">Avg Speed</span>
          <span className="font-heading text-xl sm:text-2xl text-[#ffb95f] font-bold mt-1">
            {stats.avgSpeedSeconds}s
          </span>
          <span className="text-[10px] text-[#ffb95f] mt-0.5">Reaction Time</span>
        </div>
      </div>

      {/* 4. Match Logs History */}
      <div className="w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-5 shadow-xl flex flex-col gap-3">
        <h3 className="font-heading text-base text-[#dfe2f1] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">history</span>
          Recent Arena Encounters
        </h3>

        <div className="flex flex-col gap-2">
          {matchHistory.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#0a0e18]/70 border border-[#262a35] text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#262a35] flex items-center justify-center text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[18px]">
                    {log.mode === 'word-rush'
                      ? 'bolt'
                      : log.mode === 'grammar-battle'
                      ? 'swords'
                      : 'search_check'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-[#dfe2f1] uppercase">
                    {log.mode.replace('-', ' ')}
                  </span>
                  <span className="text-[#869397] text-[10px]">
                    Score {log.score} • {log.accuracy}% Precision
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-heading">
                <span className="text-[#4cd7f6] font-bold">+{log.xpEarned} XP</span>
                <span className="text-[#ffb95f] font-bold">+{log.coinsEarned} 🪙</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
