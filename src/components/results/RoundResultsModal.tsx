import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RoundResult } from '../../types/game';
import { sound } from '../../lib/audio';

interface RoundResultsModalProps {
  result: RoundResult;
  onContinue: () => void;
  onReplay: () => void;
}

export const RoundResultsModal: React.FC<RoundResultsModalProps> = ({
  result,
  onContinue,
  onReplay,
}) => {
  useEffect(() => {
    sound.playVictory();

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4cd7f6', '#ffb95f', '#d0bcff', '#10b981'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const getStarRating = (accuracy: number) => {
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    return 1;
  };

  const stars = getStarRating(result.accuracy);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0e18]/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#1c1f2a] border border-[#262a35] rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col gap-4 my-auto">
        {/* Background ambient radiance */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4cd7f6] via-[#ffb95f] to-[#d0bcff]" />
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#4cd7f6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#571bc1]/20 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header: Victory Callout & Stars */}
        <div className="flex flex-col items-center text-center gap-1.5 pt-1">
          <span className="bg-[#4cd7f6]/20 text-[#4cd7f6] font-heading text-[10px] sm:text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider font-bold">
            ROUND CLEARED // ARENA TELEMETRY
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl text-[#dfe2f1] font-extrabold tracking-tight">
            VICTORY ROYALE!
          </h2>

          {/* 3 Glowing Stars */}
          <div className="flex items-center gap-2 mt-1">
            {[1, 2, 3].map((starNum) => (
              <span
                key={starNum}
                className={`material-symbols-outlined text-[32px] sm:text-[36px] transition-all transform ${
                  starNum <= stars
                    ? 'text-[#ffb95f] scale-110 drop-shadow-[0_0_12px_rgba(255,185,95,0.8)]'
                    : 'text-[#313540]'
                }`}
              >
                star
              </span>
            ))}
          </div>
          <span className="font-heading text-xs text-[#ffddb8] font-bold uppercase tracking-wider">
            {stars === 3 ? '⭐ FLAWLESS PRECISION' : stars === 2 ? 'GREAT SYNTAX ACCURACY' : 'ROUND COMPLETED'}
          </span>
        </div>

        {/* 2. Holographic Chibi Champion & XP Ascension */}
        <div className="relative w-full bg-[#0a0e18]/80 border border-[#262a35] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <span className="font-heading text-[10px] text-[#4cd7f6] uppercase tracking-wider font-bold">
              Rank Evolution
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-base sm:text-lg text-[#dfe2f1] font-bold">
                Level {result.newLevel}
              </span>
              <span className="text-xs text-[#ffb95f] font-heading font-semibold">
                Ascended!
              </span>
            </div>

            {/* EXP Progress Track */}
            <div className="w-full h-2 bg-[#262a35] rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] rounded-full shadow-[0_0_8px_rgba(76,215,246,0.6)] animate-pulse"
                style={{ width: '82%' }}
              />
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="font-heading text-[#4cd7f6] font-bold">
                +{result.xpEarned} XP
              </span>
              <span className="text-[#3d494c]">•</span>
              <span className="font-heading text-[#ffb95f] font-bold">
                +{result.coinsEarned} 🪙
              </span>
            </div>
          </div>

          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#171b26] border border-[#4cd7f6]/40 overflow-hidden shadow-lg flex-shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1XJIUuvSZjPIj-UIGH8MJnBYNhCZDbQuGdBGxBxcYPc0RDlUrQnEo7J-aSmyAMYCoiWnF25zA-nvl3enoSI93sBSxvOP6YjOlS9krfrJsdAhoWI-l6rIpQtkFNbdj1lSB5XSQnExdIefL4cInH_6XA8u6Ri9iWf8H7P-UfM5betX-tgIIfX6-vAoDibWRNEjtkOZwRNi5nb5ovhzLaZ8jARxbvdU81wx-Xq354gF3X9WVZRMcVHnTmucid6"
              alt="Arena MVP Hologram"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3. Match Performance Telemetry Grid */}
        <div className="grid grid-cols-4 gap-2 w-full">
          <div className="flex flex-col items-center p-2 rounded-xl bg-[#262a35]/80 border border-[#313540] text-center">
            <span className="font-heading text-[9px] text-[#869397] uppercase">Accuracy</span>
            <span className="font-heading text-sm sm:text-base text-[#4cd7f6] font-bold">
              {result.accuracy}%
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-[#262a35]/80 border border-[#313540] text-center">
            <span className="font-heading text-[9px] text-[#869397] uppercase">Max Combo</span>
            <span className="font-heading text-sm sm:text-base text-[#d0bcff] font-bold">
              {result.maxCombo}x
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-[#262a35]/80 border border-[#313540] text-center">
            <span className="font-heading text-[9px] text-[#869397] uppercase">Speed</span>
            <span className="font-heading text-sm sm:text-base text-[#ffb95f] font-bold">
              {result.speedAvg}s
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-[#262a35]/80 border border-[#313540] text-center">
            <span className="font-heading text-[9px] text-[#869397] uppercase">Score</span>
            <span className="font-heading text-sm sm:text-base text-[#10b981] font-bold">
              {result.score}
            </span>
          </div>
        </div>

        {/* 4. What You Mastered Today */}
        <div className="flex flex-col gap-1.5 bg-[#171b26] border border-[#262a35] p-3 rounded-xl">
          <span className="font-heading text-[10px] text-[#bcc9cd] uppercase tracking-wider font-bold">
            What You Mastered Today
          </span>
          {result.learnedTakeaways.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[15px] flex-shrink-0 mt-0.5">
                verified
              </span>
              <p className="text-[#dfe2f1]">
                <strong className="text-[#4cd7f6] font-heading">{item.title}:</strong> {item.concept}
              </p>
            </div>
          ))}
        </div>

        {/* 5. Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onContinue();
            }}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] hover:brightness-110 text-[#003640] font-heading text-sm font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_0_#004e5c] active:translate-y-0.5 transition-all"
          >
            <span>CONTINUE JOURNEY</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onReplay();
            }}
            className="h-12 px-5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-[#dfe2f1] font-heading text-sm font-semibold flex items-center justify-center gap-1.5 border border-[#313540] active:translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">replay</span>
            <span>REPLAY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
