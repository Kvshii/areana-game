import React from 'react';
import { GameMode } from '../../types/game';
import { sound } from '../../lib/audio';

interface GameModesViewProps {
  onSelectMode: (mode: GameMode) => void;
}

export const GameModesView: React.FC<GameModesViewProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 gap-5 select-none">
      {/* Header */}
      <div className="w-full rounded-2xl bg-[#1c1f2a] border border-[#262a35] p-5 shadow-xl flex flex-col gap-1">
        <span className="font-heading text-[11px] text-[#4cd7f6] uppercase tracking-wider font-bold">
          Battle Arenas
        </span>
        <h2 className="font-heading text-xl sm:text-2xl text-[#dfe2f1] font-bold">
          Select Your Combat Sector
        </h2>
        <p className="text-xs sm:text-sm text-[#bcc9cd]">
          Engage in rapid vocabulary blitzes, conquer grammatical boss raids, or solve detective mysteries.
        </p>
      </div>

      {/* 3 Major Modes Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* 1. WORD RUSH */}
        <div className="relative w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-5 shadow-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#4cd7f6]/60 transition-all">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#4cd7f6]" />

          <div className="flex items-start gap-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0a0e18] border border-[#4cd7f6]/40 overflow-hidden shadow-lg flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSP08lubcnJGLxDhvOCB44GWnl6HbKHkU_taUZUk8Hpa5z4BgK5a6JKLJ9vtVp42Xudf8fz3mOQkPDfacZXnPyJmFPT_eXr-ja_wxMwF-pg9quSehXhNfDQ9RqYKI5OIhcq2zOMnLeKiIWk86vfzdeoAuTKPT607nQLg82KxyE1WrP_K7pI32zJdFHn6axa210LAJ9aX4CL7gOcFEgBqZHiH_CHh95yirPEVc4F4QvyBIJoc9vDSYlEA"
                alt="Word Rush"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] font-heading text-[10px] font-bold uppercase">
                  ARCADE SPEED
                </span>
                <span className="text-[10px] text-[#ffb95f] font-heading font-semibold">
                  15S COUNTDOWN
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl text-[#dfe2f1] font-bold">
                ⚡ Word Rush: High-Velocity Arcade
              </h3>
              <p className="text-xs text-[#bcc9cd] line-clamp-2">
                Test your vocabulary speed, root word analysis, and antonym reaction. Chain rapid correct answers to unlock 5x score frenzy multipliers!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('word-rush');
            }}
            className="w-full sm:w-auto h-11 px-6 bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] hover:brightness-110 text-[#003640] font-heading text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_0_#004e5c] active:translate-y-0.5 transition-all flex-shrink-0"
          >
            <span>START RUSH</span>
            <span className="material-symbols-outlined text-[18px]">bolt</span>
          </button>
        </div>

        {/* 2. GRAMMAR BATTLE */}
        <div className="relative w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-5 shadow-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#d0bcff]/60 transition-all">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#8b5cf6]" />

          <div className="flex items-start gap-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0a0e18] border border-[#d0bcff]/40 overflow-hidden shadow-lg flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2XMlq3RRSSUz9gAcRinPapQUb8MRCVrcB2tNhYIyVJGDbDXRDcEHKFkViArtDa2CUyPoTYwRptRrdnUY9Bc5t9WUVm46TAYiGdHF6d-jlDqLo6wXfx4REElBtpA0e2tr4wOc9tPxYp5iGSTe9KA7JaxTuvVB0wr7AcMFpuuzfAk-9tWbq7rjrtIdy4hekT7nAlqItAzDgrRxbdt5EMb6eC-fR3_CXMj8fLaNW1t6SfDQLEkWCgf5AZg"
                alt="Grammar Battle"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#571bc1]/40 text-[#d0bcff] font-heading text-[10px] font-bold uppercase">
                  BOSS RAID DUEL
                </span>
                <span className="text-[10px] text-[#ffb4ab] font-heading font-semibold">
                  TURN-BASED COMBAT
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl text-[#dfe2f1] font-bold">
                🧩 Grammar Battle: Boss Raid Encounter
              </h3>
              <p className="text-xs text-[#bcc9cd] line-clamp-2">
                Duel against the Syntax Golem and the Lord of Irregular Verbs. Cast precise grammatical counter-spells across conditionals, inversions, and passive voices.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('grammar-battle');
            }}
            className="w-full sm:w-auto h-11 px-6 bg-[#8b5cf6] hover:bg-[#a855f7] text-white font-heading text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_0_#3c0091] active:translate-y-0.5 transition-all flex-shrink-0"
          >
            <span>ENTER RAID</span>
            <span className="material-symbols-outlined text-[18px]">swords</span>
          </button>
        </div>

        {/* 3. ENGLISH MYSTERY */}
        <div className="relative w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-5 shadow-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#ffb95f]/60 transition-all">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#e79400]" />

          <div className="flex items-start gap-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0a0e18] border border-[#ffb95f]/40 overflow-hidden shadow-lg flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAn50c49-sLPjAOM34UwE5KOYwmtix2naXK0n0nLK5aJ77yn9KxUBpz1Cd_zf3M1J72yIzcK850oTt96f0n_lledgSpoSirFU5DwxAiNOriJaoHD7zE-GP0XfcOzwqrtEUJZp61rMLNraq2YwmNbe8G6wDKVkWrjuRD7FIjPlpHgP1O5Rkt2GVhhgmm3-yMRF7Kb_FMFTZDv2fY3OmeNABW5woOPy3sUaa_Mdrz3wBYJ8JM7TNhFd9oQ"
                alt="English Mystery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#e79400]/30 text-[#ffddb8] font-heading text-[10px] font-bold uppercase">
                  STORY INVESTIGATION
                </span>
                <span className="text-[10px] text-[#10b981] font-heading font-semibold">
                  DEDUCTION ENGINE
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl text-[#dfe2f1] font-bold">
                🕵️ English Mystery: Linguistic Deduction
              </h3>
              <p className="text-xs text-[#bcc9cd] line-clamp-2">
                Examine crime scene reports, interrogate contradictory suspects, and catch grammatical slips to expose the culprits in rich narrative cases.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('mystery');
            }}
            className="w-full sm:w-auto h-11 px-6 bg-gradient-to-r from-[#e79400] to-[#ffb95f] hover:brightness-110 text-[#472a00] font-heading text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_0_#945c00] active:translate-y-0.5 transition-all flex-shrink-0"
          >
            <span>SOLVE CASE</span>
            <span className="material-symbols-outlined text-[18px]">search</span>
          </button>
        </div>
      </div>
    </div>
  );
};
