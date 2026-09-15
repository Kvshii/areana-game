import React, { useState } from 'react';
import { Achievement, PlayerData } from '../../types/game';
import { COSMETIC_AVATARS, COSMETIC_FRAMES, COSMETIC_TITLES, CosmeticItem } from '../../data/cosmetics';
import { sound } from '../../lib/audio';

interface VaultAchievementsViewProps {
  player: PlayerData;
  achievements: Achievement[];
  onClaimAchievement: (id: string) => void;
  onEquipCosmetic: (item: CosmeticItem) => void;
  onBuyCosmetic: (item: CosmeticItem) => void;
}

export const VaultAchievementsView: React.FC<VaultAchievementsViewProps> = ({
  player,
  achievements,
  onClaimAchievement,
  onEquipCosmetic,
  onBuyCosmetic,
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'avatars' | 'frames' | 'titles'>('achievements');

  const getCosmeticList = (): CosmeticItem[] => {
    switch (activeTab) {
      case 'avatars':
        return COSMETIC_AVATARS;
      case 'frames':
        return COSMETIC_FRAMES;
      case 'titles':
        return COSMETIC_TITLES;
      default:
        return [];
    }
  };

  const isUnlocked = (item: CosmeticItem) => {
    if (item.type === 'avatar') return player.unlockedAvatars.includes(item.id);
    if (item.type === 'frame') return player.unlockedFrames.includes(item.id);
    if (item.type === 'title') return player.unlockedTitles.includes(item.id);
    return false;
  };

  const isEquipped = (item: CosmeticItem) => {
    if (item.type === 'avatar') return player.avatarId === item.id;
    if (item.type === 'frame') return player.frameId === item.id;
    if (item.type === 'title') return player.title === item.name;
    return false;
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 gap-5 select-none">
      {/* Vault Header & Subnav */}
      <div className="w-full rounded-2xl bg-[#1c1f2a] border border-[#262a35] p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col text-center sm:text-left">
            <span className="font-heading text-[11px] text-[#ffb95f] uppercase tracking-wider font-bold">
              Arena Arsenal
            </span>
            <h2 className="font-heading text-xl sm:text-2xl text-[#dfe2f1] font-bold">
              Trophy Vault & Cosmetic Locker
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-[#0a0e18] px-4 py-2 rounded-xl border border-[#313540]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">
                monetization_on
              </span>
              <span className="font-heading text-sm text-[#ffddb8] font-bold">
                {player.coins.toLocaleString()}
              </span>
            </div>
            <span className="text-[#3d494c]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">
                diamond
              </span>
              <span className="font-heading text-sm text-[#d0bcff] font-bold">
                {player.gems}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-4 gap-1.5 bg-[#0a0e18]/80 p-1.5 rounded-xl border border-[#262a35]">
          {(['achievements', 'avatars', 'frames', 'titles'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab);
              }}
              className={`py-2 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_10px_rgba(76,215,246,0.5)]'
                  : 'text-[#869397] hover:text-[#dfe2f1]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {achievements.map((item) => {
            const canClaim = item.unlocked && !item.claimed;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                  item.claimed
                    ? 'bg-[#171b26]/70 border-[#262a35] opacity-80'
                    : canClaim
                    ? 'bg-[#1c1f2a] border-[#ffb95f] shadow-[0_0_16px_rgba(255,185,95,0.25)]'
                    : 'bg-[#171b26] border-[#262a35]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                      item.unlocked
                        ? 'bg-[#e79400]/20 text-[#ffb95f]'
                        : 'bg-[#262a35] text-[#869397]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {item.icon === 'search_check'
                        ? 'search'
                        : item.icon === 'swords'
                        ? 'sports_martial_arts'
                        : item.icon}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading text-sm font-bold text-[#dfe2f1] truncate">
                        {item.title}
                      </h4>
                      {item.unlocked && (
                        <span className="px-2 py-0.2 rounded bg-[#10b981]/20 text-[#10b981] font-heading text-[9px] font-bold">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#bcc9cd] mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Progress & Claim CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-[#262a35] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-[#4cd7f6] font-bold">
                      +{item.xpReward} XP
                    </span>
                    <span className="text-[#3d494c]">•</span>
                    <span className="font-heading text-[#ffb95f] font-bold">
                      +{item.coinReward} 🪙
                    </span>
                  </div>

                  {canClaim ? (
                    <button
                      onClick={() => {
                        sound.playLevelUp();
                        onClaimAchievement(item.id);
                      }}
                      className="px-3.5 py-1.5 bg-[#ffb95f] hover:bg-[#ffa726] text-[#472a00] font-heading text-xs font-bold rounded-lg shadow-[0_0_12px_rgba(255,185,95,0.6)] animate-pulse"
                    >
                      CLAIM REWARD
                    </button>
                  ) : item.claimed ? (
                    <span className="text-[#869397] font-heading text-xs">CLAIMED</span>
                  ) : (
                    <span className="text-[#869397] font-heading text-xs">
                      {item.progress} / {item.target}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Cosmetics Locker (Avatars, Frames, Titles) */}
      {activeTab !== 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {getCosmeticList().map((item) => {
            const owned = isUnlocked(item);
            const equipped = isEquipped(item);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3.5 transition-all ${
                  equipped
                    ? 'bg-[#003640]/30 border-[#4cd7f6] shadow-[0_0_16px_rgba(76,215,246,0.3)]'
                    : 'bg-[#1c1f2a] border-[#262a35]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {item.previewUrl ? (
                    <div className="w-14 h-14 rounded-xl bg-[#0a0e18] border border-[#313540] overflow-hidden flex-shrink-0 shadow-md">
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#262a35] border border-[#313540] flex items-center justify-center text-[#4cd7f6] flex-shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        {item.type === 'frame' ? 'crop_square' : 'military_tech'}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading text-sm sm:text-base font-bold text-[#dfe2f1] truncate">
                        {item.name}
                      </h4>
                      <span
                        className={`font-heading text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          item.rarity === 'Legendary'
                            ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                            : item.rarity === 'Epic'
                            ? 'bg-[#d0bcff]/20 text-[#d0bcff]'
                            : item.rarity === 'Rare'
                            ? 'bg-[#4cd7f6]/20 text-[#4cd7f6]'
                            : 'bg-[#313540] text-[#bcc9cd]'
                        }`}
                      >
                        {item.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-[#bcc9cd] mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-2 border-t border-[#262a35]">
                  <span className="text-xs text-[#869397] font-heading">
                    Req. Lv. {item.requiredLevel}
                  </span>

                  {equipped ? (
                    <span className="px-3 py-1 rounded-lg bg-[#4cd7f6]/20 text-[#4cd7f6] font-heading text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      EQUIPPED
                    </span>
                  ) : owned ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onEquipCosmetic(item);
                      }}
                      className="px-3.5 py-1.5 bg-[#4cd7f6] hover:bg-[#06b6d4] text-[#003640] font-heading text-xs font-bold rounded-lg shadow-md active:scale-95 transition-transform"
                    >
                      EQUIP
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playLevelUp();
                        onBuyCosmetic(item);
                      }}
                      disabled={player.coins < item.costCoins}
                      className="px-3.5 py-1.5 bg-[#ffb95f] hover:bg-[#ffa726] disabled:opacity-50 text-[#472a00] font-heading text-xs font-bold rounded-lg flex items-center gap-1 shadow-md active:scale-95 transition-transform"
                    >
                      <span>BUY FOR {item.costCoins}</span>
                      <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
