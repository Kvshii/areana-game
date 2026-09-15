import React from 'react';
import { PlayerData, StreakData, DailyChallenge, PlayerStatistics, GameMode } from '../../types/game';
import { computeLevelProgress, calculatePowerScore } from '../../lib/progression';
import { sound } from '../../lib/audio';

interface ArenaHubProps {
  player: PlayerData;
  streak: StreakData;
  stats: PlayerStatistics;
  dailyChallenge: DailyChallenge;
  onLaunchMode: (mode: GameMode) => void;
  onOpenDaily: () => void;
}

export const ArenaHub: React.FC<ArenaHubProps> = ({
  player,
  streak,
  stats,
  dailyChallenge,
  onLaunchMode,
  onOpenDaily,
}) => {
  const levelInfo = computeLevelProgress(player.xp);
  const powerScore = calculatePowerScore(
    stats.accuracy,
    stats.avgSpeedSeconds,
    streak.currentStreak,
    stats.totalQuestions,
    stats.bestScores.wordRush,
    stats.bestScores.grammarBattle
  );

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6

  // Circular gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (powerScore.overallScore / 1000) * circumference;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6 select-none">
      {/* 1. Top Hero Welcome & Player Telemetry Card */}
      <div className="relative w-full rounded-2xl bg-[#171b26]/90 border border-[#262a35] backdrop-blur-xl p-4 sm:p-5 shadow-xl overflow-hidden flex flex-col gap-3">
        {/* Ambient background glows */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#571bc1]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-[#0a0e18] border border-[#4cd7f6]/40 overflow-hidden shadow-[0_0_16px_rgba(76,215,246,0.3)]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKB_vSA6bazJogyPc4FTynyJXg2-IykrXUgC1QbaUh0O0gZ70NnwYFvfWAZXTcFmj-SDZnz6Khq3XrMGoFN9bAcROv6rR0bSJGHhZ-X63KUUGY5DmnhMRQ1RizU2iEBzo6-h_h8L_bgsCOfrZ-JLlD6rAW79wuKEi0ShpW_lnYjV5UFfZG4S_Io6nmyM3gdWLmYKsUevJRDSvFuPbR6_sksIOOwnXVPGNHot3hqs6qt510qh0eY6zu1w"
                  alt="Player Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#4cd7f6] text-[#003640] font-heading text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded shadow-sm">
                LV.{player.level}
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-heading text-[10px] sm:text-[11px] text-[#4cd7f6] tracking-wider uppercase font-bold">
                Operative Ready
              </span>
              <h2 className="font-heading text-lg sm:text-xl text-[#dfe2f1] font-bold truncate">
                Welcome back, {player.name}!
              </h2>
              <span className="text-xs text-[#bcc9cd] flex items-center gap-1 truncate">
                <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">
                  military_tech
                </span>
                {player.title} • <span className="text-[#ffddb8] font-bold">Rank #42 Arena Tier</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end flex-shrink-0">
            <span className="font-heading text-[10px] text-[#bcc9cd] uppercase">Match Rank</span>
            <div className="flex items-center gap-1.5 bg-[#0a0e18]/80 border border-[#313540] px-2.5 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
                shield
              </span>
              <span className="font-heading text-xs sm:text-sm text-[#4cd7f6] font-bold">
                SILVER I
              </span>
            </div>
          </div>
        </div>

        {/* Animated XP Level Track */}
        <div className="relative z-10 flex flex-col gap-1.5 bg-[#0a0e18]/70 border border-[#1c1f2a] p-3 rounded-xl">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#bcc9cd] flex items-center gap-1 font-heading font-medium">
              <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">bolt</span>
              Level {player.level + 1} Ascension
            </span>
            <span className="font-heading text-xs font-bold text-[#4cd7f6]">
              {levelInfo.currentXpInLevel.toLocaleString()}{' '}
              <span className="text-[#869397] font-normal">/ {levelInfo.xpRequired.toLocaleString()} XP</span>
            </span>
          </div>

          <div className="relative w-full h-2.5 bg-[#262a35] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#06b6d4] via-[#4cd7f6] to-[#acedff] rounded-full shadow-[0_0_12px_rgba(76,215,246,0.6)] transition-all duration-1000 ease-out"
              style={{ width: `${levelInfo.progressPercent}%` }}
            >
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 animate-pulse" />
            </div>
          </div>

          <div className="flex justify-between items-center font-heading text-[10px] text-[#869397]">
            <span>LV.{player.level} {player.title.toUpperCase()}</span>
            <span>{(levelInfo.xpRequired - levelInfo.currentXpInLevel).toLocaleString()} XP TO NEXT ASCENSION</span>
          </div>
        </div>
      </div>

      {/* 2. Active Streak & Calendar Widget */}
      <div className="w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-4 sm:p-5 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#e79400]/20 flex items-center justify-center text-[#ffb95f] shadow-[0_0_12px_rgba(231,148,0,0.3)]">
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
                local_fire_department
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[10px] text-[#ffb95f] uppercase font-bold tracking-wider">
                Active Synergy
              </span>
              <span className="font-heading text-base sm:text-lg text-[#dfe2f1] font-bold">
                {streak.currentStreak}-Day Heat Streak!
              </span>
            </div>
          </div>

          <div className="bg-[#262a35] px-2.5 py-1 rounded-full text-right flex items-center gap-1 border border-[#571bc1]/30">
            <span className="material-symbols-outlined text-[15px] text-[#d0bcff]">
              diamond
            </span>
            <span className="font-heading text-xs text-[#d0bcff] font-bold">+100 in 2d</span>
          </div>
        </div>

        {/* Day Tracker Calendar Dots (M - S) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 bg-[#0a0e18]/60 p-2 sm:p-2.5 rounded-xl border border-[#1c1f2a]">
          {daysOfWeek.map((day, idx) => {
            const isCompleted = idx < todayIndex;
            const isToday = idx === todayIndex;
            const isMilestone = idx === 6;

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span
                  className={`font-heading text-[10px] ${
                    isToday ? 'text-[#4cd7f6] font-bold' : 'text-[#869397]'
                  }`}
                >
                  {day}
                </span>
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
                    isToday
                      ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_12px_rgba(76,215,246,0.6)] animate-pulse'
                      : isCompleted
                      ? 'bg-[#ffb95f]/20 text-[#ffb95f] shadow-[0_0_8px_rgba(255,185,95,0.25)]'
                      : isMilestone
                      ? 'bg-[#571bc1]/30 text-[#d0bcff] border border-[#d0bcff]/40 shadow-[0_0_8px_rgba(139,92,246,0.3)]'
                      : 'bg-[#262a35] text-[#3d494c]'
                  }`}
                >
                  {isToday ? (
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                      local_fire_department
                    </span>
                  ) : isCompleted ? (
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px]">
                      check
                    </span>
                  ) : isMilestone ? (
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px]">
                      featured_seasonal_and_gifts
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[13px] sm:text-[14px]">
                      lock
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Daily Challenge Quest Box */}
      <div className="relative w-full rounded-2xl bg-[#1c1f2a] border border-[#262a35] p-4 sm:p-5 shadow-xl overflow-hidden flex flex-col gap-3">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e79400] via-[#4cd7f6] to-[#571bc1]" />

        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-[#e79400]/25 text-[#ffb95f] font-heading text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                Daily English Bounty
              </span>
              <span className="text-[#ffb4ab] font-heading text-[10px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">timer</span> 4h 18m left
              </span>
            </div>
            <h3 className="font-heading text-base sm:text-lg text-[#dfe2f1] font-bold truncate">
              {dailyChallenge.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#bcc9cd] line-clamp-1">
              {dailyChallenge.description}
            </p>
          </div>

          <div className="flex flex-col items-end flex-shrink-0 bg-[#0a0e18]/80 border border-[#313540] px-2.5 py-1 rounded-xl">
            <span className="font-heading text-[9px] text-[#869397] uppercase">Bounty</span>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xs text-[#4cd7f6] font-bold">
                +{dailyChallenge.xpReward} XP
              </span>
              <span className="text-[#3d494c]">•</span>
              <span className="font-heading text-xs text-[#ffb95f] font-bold">
                +{dailyChallenge.coinReward} 🪙
              </span>
            </div>
          </div>
        </div>

        {/* Progress & Action */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between items-center font-heading text-[10px]">
              <span className="text-[#bcc9cd] uppercase tracking-wider">Sector Progress</span>
              <span className="text-[#4cd7f6] font-bold">
                {dailyChallenge.current} / {dailyChallenge.target} CLEARED
              </span>
            </div>
            <div className="w-full h-2 bg-[#0a0e18] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4cd7f6] rounded-full shadow-[0_0_8px_rgba(76,215,246,0.5)] transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((dailyChallenge.current / dailyChallenge.target) * 100))}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenDaily();
            }}
            className="relative px-3.5 sm:px-4 py-2 bg-[#4cd7f6] hover:bg-[#06b6d4] active:scale-95 text-[#003640] font-heading text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1 shadow-[0_4px_0_#004e5c] transition-all flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">play_arrow</span>
            RESUME
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ffb95f] rounded-full animate-ping" />
          </button>
        </div>
      </div>

      {/* 4. Battle Arenas Header */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
            sports_esports
          </span>
          <h3 className="font-heading text-lg sm:text-xl text-[#dfe2f1] font-bold">
            Battle Arenas
          </h3>
        </div>
        <span className="font-heading text-[11px] text-[#869397] tracking-wider uppercase font-semibold">
          Live Matchmaking
        </span>
      </div>

      {/* Mode 1: WORD RUSH Card */}
      <div className="relative w-full rounded-2xl bg-[#1c1f2a] border border-[#262a35] p-4 sm:p-5 shadow-xl overflow-hidden flex flex-col gap-3 group hover:border-[#4cd7f6]/50 transition-all">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#4cd7f6]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-[#4cd7f6]/20 text-[#4cd7f6] font-heading text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                POPULAR • 2x XP
              </span>
              <span className="bg-[#0a0e18] text-[#ffb95f] font-heading text-[10px] px-2 py-0.5 rounded-full uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">speed</span> 15s Rounds
              </span>
            </div>
            <h4 className="font-heading text-base sm:text-lg text-[#dfe2f1] font-bold flex items-center gap-1.5">
              ⚡ WORD RUSH
            </h4>
            <p className="text-xs sm:text-sm text-[#bcc9cd] line-clamp-2">
              Fast-paced vocabulary arcade battle. Match antonyms, chained roots, and synonyms under high-frequency countdown pressure!
            </p>
          </div>

          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#0a0e18] border border-[#4cd7f6]/30 flex-shrink-0 overflow-hidden shadow-md">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSP08lubcnJGLxDhvOCB44GWnl6HbKHkU_taUZUk8Hpa5z4BgK5a6JKLJ9vtVp42Xudf8fz3mOQkPDfacZXnPyJmFPT_eXr-ja_wxMwF-pg9quSehXhNfDQ9RqYKI5OIhcq2zOMnLeKiIWk86vfzdeoAuTKPT607nQLg82KxyE1WrP_K7pI32zJdFHn6axa210LAJ9aX4CL7gOcFEgBqZHiH_CHh95yirPEVc4F4QvyBIJoc9vDSYlEA"
              alt="Word Rush Artwork"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Multiplier live cue & Play button */}
        <div className="relative z-10 flex items-center justify-between gap-3 pt-2 bg-[#0a0e18]/60 p-3 rounded-xl border border-[#262a35]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-heading text-[9px] text-[#869397] uppercase">Current Frenzy</span>
              <span className="font-heading text-sm sm:text-base text-[#4cd7f6] font-bold">5.4x MAX</span>
            </div>
            <div className="h-7 w-[1px] bg-[#313540]" />
            <div className="flex flex-col">
              <span className="font-heading text-[9px] text-[#869397] uppercase">Online Challengers</span>
              <span className="font-heading text-xs sm:text-sm text-[#dfe2f1] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" /> 1,284
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onLaunchMode('word-rush');
            }}
            className="h-10 sm:h-11 px-4 sm:px-5 bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] hover:brightness-110 text-[#003640] font-heading text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-[0_4px_0_#004e5c] active:translate-y-0.5 active:shadow-[0_1px_0_#004e5c] transition-all"
          >
            <span>PLAY NOW</span>
            <span className="material-symbols-outlined text-[18px]">swords</span>
          </button>
        </div>
      </div>

      {/* Mode 2: GRAMMAR BATTLE Card */}
      <div className="relative w-full rounded-2xl bg-[#1c1f2a] border border-[#262a35] p-4 sm:p-5 shadow-xl overflow-hidden flex flex-col gap-3 group hover:border-[#d0bcff]/50 transition-all">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#571bc1]/25 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-[#571bc1]/40 text-[#d0bcff] font-heading text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                BOSS RAID
              </span>
              <span className="bg-[#0a0e18] text-[#ffb4ab] font-heading text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">
                HARD TIER
              </span>
            </div>
            <h4 className="font-heading text-base sm:text-lg text-[#dfe2f1] font-bold flex items-center gap-1.5">
              🧩 GRAMMAR BATTLE
            </h4>
            <p className="text-xs sm:text-sm text-[#bcc9cd] line-clamp-2">
              Turn-based duel versus the Syntax Sorcerer. Dispel corrupted clauses, subjunctive mood traps, and passive voice spells.
            </p>
          </div>

          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#0a0e18] border border-[#d0bcff]/30 flex-shrink-0 overflow-hidden shadow-md">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2XMlq3RRSSUz9gAcRinPapQUb8MRCVrcB2tNhYIyVJGDbDXRDcEHKFkViArtDa2CUyPoTYwRptRrdnUY9Bc5t9WUVm46TAYiGdHF6d-jlDqLo6wXfx4REElBtpA0e2tr4wOc9tPxYp5iGSTe9KA7JaxTuvVB0wr7AcMFpuuzfAk-9tWbq7rjrtIdy4hekT7nAlqItAzDgrRxbdt5EMb6eC-fR3_CXMj8fLaNW1t6SfDQLEkWCgf5AZg"
              alt="Grammar Battle Artwork"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Boss HP Preview Bar */}
        <div className="relative z-10 flex flex-col gap-1 bg-[#0a0e18]/60 p-3 rounded-xl border border-[#262a35]">
          <div className="flex justify-between items-center font-heading text-[10px]">
            <span className="text-[#ffb4ab] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">skull</span> SYNTAX SORCERER [BOSS]
            </span>
            <span className="text-[#bcc9cd]">3,420 / 8,000 HP</span>
          </div>
          <div className="w-full h-2 bg-[#262a35] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#f43f5e] to-[#ffb95f] rounded-full shadow-[0_0_8px_rgba(244,63,94,0.4)]"
              style={{ width: '42%' }}
            />
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-heading text-[11px] text-[#d0bcff] font-semibold">
              ⚔️ 2.5x Critical strikes on Subjunctive triggers
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onLaunchMode('grammar-battle');
              }}
              className="h-9 px-3.5 bg-[#8b5cf6] hover:bg-[#a855f7] text-white font-heading text-xs font-bold rounded-lg flex items-center gap-1 shadow-[0_3px_0_#3c0091] active:translate-y-0.5 transition-all"
            >
              <span>ENTER RAID</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 3: ENGLISH MYSTERY Card */}
      <div className="relative w-full rounded-2xl bg-[#1c1f2a] border border-[#262a35] p-4 sm:p-5 shadow-xl overflow-hidden flex flex-col gap-3 group hover:border-[#ffb95f]/50 transition-all">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#e79400]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-[#e79400]/30 text-[#ffddb8] font-heading text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                STORY MODE
              </span>
              <span className="bg-[#0a0e18] text-[#bcc9cd] font-heading text-[10px] px-2 py-0.5 rounded-full uppercase">
                CHAPTER 3
              </span>
            </div>
            <h4 className="font-heading text-base sm:text-lg text-[#dfe2f1] font-bold flex items-center gap-1.5">
              🕵️ ENGLISH MYSTERY
            </h4>
            <p className="text-xs sm:text-sm text-[#bcc9cd] line-clamp-2">
              'The Stolen Diamond of Oxford'. Interrogate suspects using deductive reading comprehension, listening wiretaps, and idiom decoding.
            </p>
          </div>

          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#0a0e18] border border-[#ffb95f]/30 flex-shrink-0 overflow-hidden shadow-md">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAn50c49-sLPjAOM34UwE5KOYwmtix2naXK0n0nLK5aJ77yn9KxUBpz1Cd_zf3M1J72yIzcK850oTt96f0n_lledgSpoSirFU5DwxAiNOriJaoHD7zE-GP0XfcOzwqrtEUJZp61rMLNraq2YwmNbe8G6wDKVkWrjuRD7FIjPlpHgP1O5Rkt2GVhhgmm3-yMRF7Kb_FMFTZDv2fY3OmeNABW5woOPy3sUaa_Mdrz3wBYJ8JM7TNhFd9oQ"
              alt="English Mystery Artwork"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Case progress & Continue */}
        <div className="relative z-10 flex items-center justify-between bg-[#0a0e18]/60 p-3 rounded-xl border border-[#262a35]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-[#ffb95f]">
              search_check
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-[9px] text-[#869397] uppercase">Evidence Collected</span>
              <span className="font-heading text-xs sm:text-sm text-[#dfe2f1] font-bold">6 / 9 Clues Solved</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onLaunchMode('mystery');
            }}
            className="h-9 px-3.5 bg-[#313540] hover:bg-[#353944] text-[#dfe2f1] hover:text-[#ffb95f] font-heading text-xs font-bold rounded-lg flex items-center gap-1 shadow-[0_3px_0_#1c1f2a] active:translate-y-0.5 transition-all"
          >
            <span>INVESTIGATE</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 5. English Power Score & Tactical Radar Summary */}
      <div className="w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-4 sm:p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#4cd7f6]/10 flex items-center justify-center text-[#4cd7f6] shadow-[0_0_12px_rgba(76,215,246,0.2)]">
              <span className="material-symbols-outlined text-[22px]">analytics</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[10px] text-[#4cd7f6] uppercase font-bold tracking-wider">
                Telemetry Evaluation
              </span>
              <h3 className="font-heading text-base sm:text-lg text-[#dfe2f1] font-bold">
                English Power Score
              </h3>
            </div>
          </div>
          <span className="font-heading text-[10px] text-[#bcc9cd] bg-[#262a35] px-2.5 py-0.5 rounded">
            SEASON 4
          </span>
        </div>

        {/* Score Dial & 4 Mini Meters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-[#0a0e18]/80 border border-[#1c1f2a] p-4 rounded-xl">
          {/* Circular Gauge */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-[#262a35]"
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-[#4cd7f6] transition-all duration-1000 ease-out"
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-heading text-2xl sm:text-3xl text-[#dfe2f1] font-extrabold leading-none">
                {powerScore.overallScore}
              </span>
              <span className="font-heading text-[9px] text-[#4cd7f6] tracking-widest uppercase mt-0.5 font-bold">
                / 1000 EPS
              </span>
            </div>
          </div>

          {/* 4 Pillars Breakdown */}
          <div className="flex-1 grid grid-cols-2 gap-3 w-full">
            {/* Vocab */}
            <div className="flex flex-col gap-1.5 bg-[#262a35]/60 p-2 sm:p-2.5 rounded-lg border border-[#313540]/40">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading text-[10px] text-[#bcc9cd]">VOCABULARY</span>
                <span className="font-heading text-[11px] text-[#4cd7f6] font-bold">
                  {powerScore.vocabulary}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4cd7f6] rounded-full shadow-[0_0_6px_rgba(76,215,246,0.6)]"
                  style={{ width: `${powerScore.vocabulary}%` }}
                />
              </div>
            </div>

            {/* Syntax */}
            <div className="flex flex-col gap-1.5 bg-[#262a35]/60 p-2 sm:p-2.5 rounded-lg border border-[#313540]/40">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading text-[10px] text-[#bcc9cd]">SYNTAX</span>
                <span className="font-heading text-[11px] text-[#ffb95f] font-bold">
                  {powerScore.syntax}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ffb95f] rounded-full shadow-[0_0_6px_rgba(255,185,95,0.6)]"
                  style={{ width: `${powerScore.syntax}%` }}
                />
              </div>
            </div>

            {/* Velocity */}
            <div className="flex flex-col gap-1.5 bg-[#262a35]/60 p-2 sm:p-2.5 rounded-lg border border-[#313540]/40">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading text-[10px] text-[#bcc9cd]">VELOCITY</span>
                <span className="font-heading text-[11px] text-[#4cd7f6] font-bold">
                  {powerScore.velocity}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4cd7f6] rounded-full shadow-[0_0_6px_rgba(76,215,246,0.6)]"
                  style={{ width: `${powerScore.velocity}%` }}
                />
              </div>
            </div>

            {/* Precision */}
            <div className="flex flex-col gap-1.5 bg-[#262a35]/60 p-2 sm:p-2.5 rounded-lg border border-[#313540]/40">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading text-[10px] text-[#bcc9cd]">PRECISION</span>
                <span className="font-heading text-[11px] text-[#d0bcff] font-bold">
                  {powerScore.precision}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d0bcff] rounded-full shadow-[0_0_6px_rgba(208,188,255,0.6)]"
                  style={{ width: `${powerScore.precision}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Quick Jump: Practice Daily Mix */}
      <div className="w-full pt-1 pb-4">
        <button
          onClick={() => {
            sound.playClick();
            onLaunchMode('word-rush');
          }}
          className="group relative w-full h-13 sm:h-14 rounded-2xl bg-gradient-to-r from-[#06b6d4] via-[#4cd7f6] to-[#8b5cf6] p-0.5 shadow-[0_6px_24px_rgba(76,215,246,0.35)] active:translate-y-0.5 transition-all"
        >
          <div className="w-full h-full bg-[#0a0e18] rounded-[14px] flex items-center justify-between px-4 sm:px-5 group-hover:bg-transparent transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#4cd7f6]/20 text-[#4cd7f6] flex items-center justify-center group-hover:bg-[#003640] group-hover:text-[#4cd7f6] transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[19px] sm:text-[20px]">
                  shuffle
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading text-[10px] text-[#4cd7f6] group-hover:text-[#003640] tracking-wider uppercase font-bold">
                  Instant Warmup
                </span>
                <span className="font-heading text-xs sm:text-sm text-[#dfe2f1] group-hover:text-[#003640] font-bold">
                  Practice Daily Mix (5 Mins)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[#4cd7f6] group-hover:text-[#003640] font-heading font-bold text-xs sm:text-sm">
              <span>START</span>
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
