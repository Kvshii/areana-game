import React, { useState } from 'react';
import { GameSettings, PlayerData } from '../../types/game';
import { sound } from '../../lib/audio';

interface SettingsViewProps {
  player: PlayerData;
  settings: GameSettings;
  onUpdatePlayerName: (newName: string) => void;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  player,
  settings,
  onUpdatePlayerName,
  onUpdateSettings,
  onResetProgress,
}) => {
  const [callsign, setCallsign] = useState<string>(player.name);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callsign.trim()) return;
    sound.playClick();
    onUpdatePlayerName(callsign.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 gap-5 select-none">
      {/* Header */}
      <div className="w-full rounded-2xl bg-[#1c1f2a] border border-[#262a35] p-5 shadow-xl flex flex-col gap-1">
        <span className="font-heading text-[11px] text-[#4cd7f6] uppercase tracking-wider font-bold">
          System Protocols
        </span>
        <h2 className="font-heading text-xl sm:text-2xl text-[#dfe2f1] font-bold">
          Combat Configuration & Profile
        </h2>
      </div>

      {/* Operative Passport ID */}
      <div className="w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-5 shadow-xl flex flex-col gap-4">
        <h3 className="font-heading text-sm text-[#dfe2f1] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">badge</span>
          Operative Call-Sign
        </h3>

        <form onSubmit={handleSaveName} className="flex gap-2">
          <input
            type="text"
            value={callsign}
            maxLength={16}
            onChange={(e) => setCallsign(e.target.value)}
            className="flex-1 bg-[#0a0e18] border border-[#313540] rounded-xl px-3.5 py-2 text-sm text-[#dfe2f1] font-heading font-semibold focus:outline-none focus:border-[#4cd7f6]"
            placeholder="Enter Call-Sign"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#4cd7f6] hover:bg-[#06b6d4] text-[#003640] font-heading text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            UPDATE
          </button>
        </form>

        {savedSuccess && (
          <span className="text-xs text-[#10b981] font-heading font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check</span>
            Call-sign updated successfully!
          </span>
        )}
      </div>

      {/* Sound & Audio Controls */}
      <div className="w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-5 shadow-xl flex flex-col gap-4">
        <h3 className="font-heading text-sm text-[#dfe2f1] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">volume_up</span>
          Audio Telemetry & Synthesizer
        </h3>

        <div className="flex flex-col gap-3">
          {/* SFX Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0e18]/80 border border-[#262a35]">
            <div className="flex flex-col">
              <span className="font-heading text-xs sm:text-sm font-bold text-[#dfe2f1]">
                Procedural Sound Effects (SFX)
              </span>
              <span className="text-[11px] text-[#869397]">
                Real-time Web Audio synths for correct strikes, combos, and damage.
              </span>
            </div>
            <button
              onClick={() => {
                const next = !settings.sfxEnabled;
                onUpdateSettings({ ...settings, sfxEnabled: next });
                if (next) sound.playCorrect();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.sfxEnabled ? 'bg-[#4cd7f6]' : 'bg-[#313540]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.sfxEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Background Ambient Synth Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0e18]/80 border border-[#262a35]">
            <div className="flex flex-col">
              <span className="font-heading text-xs sm:text-sm font-bold text-[#dfe2f1]">
                Arena Cyber Ambience
              </span>
              <span className="text-[11px] text-[#869397]">
                Continuous low-pass harmonic drone synthesized procedurally.
              </span>
            </div>
            <button
              onClick={() => {
                const next = !settings.musicEnabled;
                onUpdateSettings({ ...settings, musicEnabled: next });
                sound.setMusicEnabled(next);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.musicEnabled ? 'bg-[#d0bcff]' : 'bg-[#313540]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Difficulty Tier Preference */}
      <div className="w-full rounded-2xl bg-[#171b26] border border-[#262a35] p-5 shadow-xl flex flex-col gap-3">
        <h3 className="font-heading text-sm text-[#dfe2f1] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">tune</span>
          Arena Combat Difficulty
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {(['beginner', 'intermediate', 'advanced'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => {
                sound.playClick();
                onUpdateSettings({ ...settings, difficulty: tier });
              }}
              className={`py-2 rounded-xl border text-xs font-heading font-bold uppercase transition-all ${
                settings.difficulty === tier
                  ? 'bg-[#4cd7f6] border-[#4cd7f6] text-[#003640] shadow-[0_0_10px_rgba(76,215,246,0.4)]'
                  : 'bg-[#0a0e18] border-[#313540] text-[#869397] hover:text-[#dfe2f1]'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Game Data (Dangerous Zone) */}
      <div className="w-full rounded-2xl bg-[#171b26] border border-[#f43f5e]/30 p-5 shadow-xl flex flex-col gap-3">
        <h3 className="font-heading text-sm text-[#ffb4ab] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          Data Core Reset
        </h3>
        <p className="text-xs text-[#bcc9cd]">
          Reset all statistics, achievements, coins, and current level to factory default in localStorage.
        </p>

        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-fit px-4 py-2 bg-[#f43f5e]/20 hover:bg-[#f43f5e]/30 border border-[#f43f5e]/40 text-[#ffb4ab] rounded-xl text-xs font-heading font-bold transition-colors"
          >
            PURGE LOCAL DATA
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[#0a0e18] p-3 rounded-xl border border-[#f43f5e]">
            <span className="text-xs text-[#ffb4ab]">Are you certain? This cannot be undone.</span>
            <button
              onClick={() => {
                onResetProgress();
                setShowConfirmReset(false);
              }}
              className="px-3 py-1 bg-[#f43f5e] text-white rounded-lg text-xs font-heading font-bold"
            >
              CONFIRM RESET
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1 bg-[#262a35] text-[#bcc9cd] rounded-lg text-xs font-heading"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>

      {/* System credits */}
      <div className="text-center text-[11px] text-[#869397] font-heading pt-2 pb-6">
        ENGLISH ARENA • V4.2 PRODUCTION RELEASE • CLIENT PERSISTENCE ENGINE
      </div>
    </div>
  );
};
