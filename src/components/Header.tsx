import React from 'react';
import { PlayerData, StreakData, AppTab } from '../types/game';
import { sound } from '../lib/audio';

interface HeaderProps {
  player: PlayerData;
  streak: StreakData;
  activeTab: AppTab;
  currentModeTitle?: string;
  onBack?: () => void;
  onOpenProfile: () => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  player,
  streak,
  activeTab,
  currentModeTitle,
  onBack,
  onOpenProfile,
  sfxEnabled,
  onToggleSfx,
}) => {
  const getSubTitle = () => {
    if (currentModeTitle) return currentModeTitle;
    switch (activeTab) {
      case 'arena-hub':
        return 'Arena Hub';
      case 'game-modes':
        return 'Battle Sectors';
      case 'stats-radar':
        return 'Telemetry Radar';
      case 'vault':
        return 'Achievements & Vault';
      case 'settings':
        return 'Combat Config';
      default:
        return 'Arena Hub';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#0a0e18]/90 backdrop-blur-xl border-b border-[#1c1f2a] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Logo & Title / Back button */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {onBack ? (
            <button
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-[#1c1f2a] hover:bg-[#262a35] text-[#4cd7f6] active:translate-y-0.5 transition-all shadow-[0_0_10px_rgba(76,215,246,0.25)] flex-shrink-0"
              title="Return to Hub"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </button>
          ) : null}

          <div
            className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none"
            onClick={onBack}
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1UPUt-Tmv3B3TES_eCZW-ysg73vZ7VUVAVV7bBUwPczFGPtRdtbKR-PH7BE9vtH3lxzoGQenOyBVzQlGDX3hl3E3q0ZbpC_4crKzVicNUVs57ougpV0HnyI5M0uviX83baL3kRgEXI0DZ2DA_flTRqxMo_PVe4YW2Xc6_mGdKx2IIK2ogI945enEprdKp6A4hYFn5nVhc-w12FIMGXQIEzS84dtp8W-xPeaVq-mJF04YQ0gLo4K-_aJ8s4-"
              alt="English Arena Logo"
              className="h-7 sm:h-8 w-auto object-contain flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-[11px] font-heading font-bold text-[#4cd7f6] tracking-wider uppercase truncate">
                Arena HUD
              </span>
              <span className="text-sm sm:text-[17px] font-heading font-bold text-[#dfe2f1] tracking-tight truncate leading-tight">
                {getSubTitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Streak, Coins, Level, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Quick Sound FX toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSfx();
            }}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-[#dfe2f1] text-xs transition-colors"
            title={sfxEnabled ? 'SFX Enabled' : 'SFX Muted'}
            aria-label="Toggle Sound Effects"
          >
            <span className={`material-symbols-outlined text-[17px] ${sfxEnabled ? 'text-[#4cd7f6]' : 'text-[#869397]'}`}>
              {sfxEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Daily Streak Flame Pill */}
          <div
            className="flex items-center gap-1.5 bg-[#262a35]/90 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-[inset_0_0_8px_rgba(231,148,0,0.2)] border border-[#e79400]/30"
            title={`${streak.currentStreak}-Day Streak`}
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#ffb95f]">
              local_fire_department
            </span>
            <span className="text-xs sm:text-sm font-heading font-bold text-[#ffddb8] tracking-wider">
              {streak.currentStreak}D
            </span>
          </div>

          {/* Coins Pill */}
          <div
            className="flex items-center gap-1.5 bg-[#262a35]/90 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-[inset_0_0_8px_rgba(255,185,95,0.2)] border border-[#ffb95f]/30"
            title={`${player.coins} Arena Coins`}
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#ffb95f]">
              monetization_on
            </span>
            <span className="text-xs sm:text-sm font-heading font-bold text-[#ffddb8] tracking-wider">
              {player.coins.toLocaleString()}
            </span>
          </div>

          {/* Level Tracker (Desktop only) */}
          <div className="hidden md:flex flex-col bg-[#262a35]/80 px-2.5 py-1 rounded-lg min-w-[76px]">
            <div className="flex items-center justify-between text-[10px] font-heading font-bold text-[#4cd7f6]">
              <span>LV.{player.level}</span>
              <span className="text-[8px] text-[#bcc9cd] ml-1">EXP</span>
            </div>
            <div className="w-full h-1 bg-[#0a0e18] rounded-full mt-0.5 overflow-hidden">
              <div
                className="bg-[#4cd7f6] h-full rounded-full shadow-[0_0_6px_#4cd7f6] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((player.xp % 500) / 5))}%` }}
              />
            </div>
          </div>

          {/* Player Avatar Profile Pill */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfile();
            }}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#06b6d4] to-[#4cd7f6] p-0.5 shadow-[0_0_12px_rgba(76,215,246,0.5)] active:scale-95 transition-transform flex-shrink-0"
            title="Player Passport & Config"
            aria-label="Profile"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0f131d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                person
              </span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#0a0e18]" />
          </button>
        </div>
      </div>
    </header>
  );
};
