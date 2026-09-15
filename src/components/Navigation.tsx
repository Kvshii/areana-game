import React from 'react';
import { AppTab } from '../types/game';
import { sound } from '../lib/audio';

interface NavigationProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

interface NavItem {
  id: AppTab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'arena-hub', label: 'Arena', icon: 'stadium' },
  { id: 'game-modes', label: 'Battle', icon: 'sports_esports' },
  { id: 'stats-radar', label: 'Radar', icon: 'radar' },
  { id: 'vault', label: 'Vault', icon: 'emoji_events' },
  { id: 'settings', label: 'Config', icon: 'manage_accounts' },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50 bg-[#0a0e18]/95 backdrop-blur-xl border-t border-[#1c1f2a] shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around h-16 px-2 pb-safe">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(item.id);
                }}
                className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[44px] gap-1 transition-all ${
                  isActive
                    ? 'text-[#4cd7f6] scale-105'
                    : 'text-[#869397] hover:text-[#dfe2f1]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-heading text-[10px] uppercase font-bold tracking-wider">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-5 h-1 bg-[#4cd7f6] rounded-full shadow-[0_0_8px_#4cd7f6]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Sub-Bar Navigation */}
      <div className="hidden md:flex fixed top-20 left-0 right-0 z-40 bg-[#0f131d]/90 backdrop-blur-md border-b border-[#1c1f2a]">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between h-12">
          <div className="flex items-center gap-1 sm:gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#1c1f2a] text-[#4cd7f6] shadow-[inset_0_0_12px_rgba(76,215,246,0.25)] border border-[#4cd7f6]/40'
                      : 'text-[#869397] hover:text-[#dfe2f1] hover:bg-[#171b26]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[17px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs font-heading text-[#869397]">
            <span className="flex items-center gap-1 text-[#10b981]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              ARENA ENGINE V4.2
            </span>
            <span className="text-[#3d494c]">|</span>
            <span>RANKED SEASON 4</span>
          </div>
        </div>
      </div>
    </>
  );
};
