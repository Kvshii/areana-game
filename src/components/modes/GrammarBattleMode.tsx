import React, { useState } from 'react';
import { GrammarQuestion, RoundResult } from '../../types/game';
import { GRAMMAR_BATTLE_QUESTIONS } from '../../data/grammarQuestions';
import { sound } from '../../lib/audio';

interface GrammarBattleModeProps {
  onCompleteRound: (result: RoundResult) => void;
  onExit: () => void;
  playerCoins: number;
  onDeductCoins: (amount: number) => boolean;
}

export const GrammarBattleMode: React.FC<GrammarBattleModeProps> = ({
  onCompleteRound,
  onExit,
  playerCoins,
  onDeductCoins,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [bossHp, setBossHp] = useState<number>(100);
  const [maxBossHp] = useState<number>(100);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [damageDealt, setDamageDealt] = useState<number | null>(null);
  const [playerDamageTaken, setPlayerDamageTaken] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [bossShaking, setBossShaking] = useState<boolean>(false);
  const [playerShaking, setPlayerShaking] = useState<boolean>(false);
  const [hintActive, setHintActive] = useState<boolean>(false);

  const currentQ: GrammarQuestion = GRAMMAR_BATTLE_QUESTIONS[currentIdx % GRAMMAR_BATTLE_QUESTIONS.length];

  const handleSelectOption = (text: string) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedOption(text);
  };

  const handleUnleashStrike = () => {
    if (!selectedOption || isAnswered) return;

    setIsAnswered(true);
    const isRight = selectedOption.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();
    setIsCorrect(isRight);

    if (isRight) {
      sound.playBossHit();
      sound.playCorrect();
      setBossShaking(true);
      setTimeout(() => setBossShaking(false), 600);

      // Deal critical damage to Boss
      const baseDmg = 25;
      const comboMult = combo >= 3 ? 1.5 : combo >= 1 ? 1.2 : 1.0;
      const totalDmg = Math.round(baseDmg * comboMult);
      setDamageDealt(totalDmg);

      const nextBossHp = Math.max(0, bossHp - totalDmg);
      setBossHp(nextBossHp);

      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      setScore((prev) => prev + totalDmg * 10 + currentQ.xp * 5);
      setCorrectCount((prev) => prev + 1);

      if (nextBossHp <= 0) {
        setTimeout(() => {
          finishBattle(true);
        }, 1200);
      }
    } else {
      sound.playWrong();
      setPlayerShaking(true);
      setTimeout(() => setPlayerShaking(false), 600);

      // Boss retaliation
      const bossAttackDmg = 20;
      setPlayerDamageTaken(bossAttackDmg);
      const nextPlayerHp = Math.max(0, playerHp - bossAttackDmg);
      setPlayerHp(nextPlayerHp);

      setCombo(0);
      setWrongCount((prev) => prev + 1);

      if (nextPlayerHp <= 0) {
        setTimeout(() => {
          finishBattle(false);
        }, 1200);
      }
    }
  };

  const handleNextEncounter = () => {
    sound.playClick();
    if (currentIdx + 1 >= GRAMMAR_BATTLE_QUESTIONS.length || bossHp <= 0) {
      finishBattle(bossHp <= 0);
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setDamageDealt(null);
      setPlayerDamageTaken(null);
      setHintActive(false);
    }
  };

  const handleUseHint = () => {
    if (hintActive || isAnswered) return;
    const deducted = onDeductCoins(15);
    if (deducted) {
      sound.playLevelUp();
      setHintActive(true);
    }
  };

  const handleHealPlayer = () => {
    if (playerHp >= 100) return;
    const deducted = onDeductCoins(25);
    if (deducted) {
      sound.playLevelUp();
      setPlayerHp((prev) => Math.min(100, prev + 30));
    }
  };

  const finishBattle = (victory: boolean) => {
    const finalTotal = correctCount + wrongCount;
    const accuracy = finalTotal > 0 ? Math.round((correctCount / finalTotal) * 100) : 0;
    const xpEarned = victory ? 450 : 150;
    const coinsEarned = victory ? 180 : 50;

    const result: RoundResult = {
      mode: 'grammar-battle',
      score: score + (victory ? 1000 : 0),
      accuracy,
      correctCount,
      wrongCount,
      maxCombo,
      speedAvg: 2.1,
      xpEarned,
      coinsEarned,
      levelUp: true,
      prevLevel: 7,
      newLevel: 8,
      newUnlocks: [
        { type: 'title', name: 'Syntax Knight', detail: 'Conquered Boss Raid Encounter' },
        { type: 'skill', name: 'Clause Mastery', detail: '+20% Damage on Inversion spells' },
        { type: 'item', name: 'Golem Core', detail: `Defeated Lv.8 Boss • +${coinsEarned} Coins` },
      ],
      learnedTakeaways: [
        {
          title: currentQ.category,
          concept: currentQ.grammarProtocol,
          tag: '+120 XP',
        },
        {
          title: 'Conjugation Matrix',
          concept: `Target answer "${currentQ.blankWord}" correctly resolves syntactic clause concordance.`,
          tag: 'SYNTAX PROTOCOL',
        },
      ],
    };

    onCompleteRound(result);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-5 gap-3 sm:gap-4 select-none">
      {/* 1. Arena Boss Raid Duel Arena */}
      <section className="relative w-full rounded-2xl bg-[#1c1f2a]/95 border border-[#262a35] p-3 sm:p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-3 overflow-hidden">
        {/* Background battle lighting */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f43f5e] via-[#571bc1] to-[#4cd7f6]" />
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#f43f5e]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#4cd7f6]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Duel Header: Operative vs Boss */}
        <div className="grid grid-cols-2 gap-3 items-center">
          {/* Player Fighter Card (Left) */}
          <div
            className={`flex items-center gap-2.5 bg-[#0a0e18]/80 p-2 sm:p-2.5 rounded-xl border border-[#313540] transition-transform ${
              playerShaking ? 'animate-shake' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#0a0e18] border border-[#4cd7f6]/50 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKB_vSA6bazJogyPc4FTynyJXg2-IykrXUgC1QbaUh0O0gZ70NnwYFvfWAZXTcFmj-SDZnz6Khq3XrMGoFN9bAcROv6rR0bSJGHhZ-X63KUUGY5DmnhMRQ1RizU2iEBzo6-h_h8L_bgsCOfrZ-JLlD6rAW79wuKEi0ShpW_lnYjV5UFfZG4S_Io6nmyM3gdWLmYKsUevJRDSvFuPbR6_sksIOOwnXVPGNHot3hqs6qt510qh0eY6zu1w"
                  alt="Alex Fighter"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#4cd7f6] text-[#003640] font-heading text-[9px] font-bold px-1 rounded">
                LV.12
              </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-heading font-bold text-[#dfe2f1] truncate">Alex</span>
                <span className="font-heading font-bold text-[#4cd7f6]">{playerHp}/100</span>
              </div>
              <div className="w-full h-2 bg-[#262a35] rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] transition-all duration-500"
                  style={{ width: `${playerHp}%` }}
                />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="px-1.5 py-0.2 rounded bg-[#571bc1]/60 text-[#d0bcff] font-heading text-[8px] font-bold">
                  STREAK FURY
                </span>
                {playerDamageTaken && (
                  <span className="text-[#ffb4ab] font-heading text-[10px] font-bold animate-bounce">
                    -{playerDamageTaken} HP
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Boss Fighter Card (Right) */}
          <div
            className={`flex items-center gap-2.5 bg-[#0a0e18]/80 p-2 sm:p-2.5 rounded-xl border border-[#313540] transition-transform ${
              bossShaking ? 'animate-shake' : ''
            }`}
          >
            <div className="flex flex-col min-w-0 flex-1 text-right">
              <div className="flex justify-between items-center text-[10px] flex-row-reverse">
                <span className="font-heading font-bold text-[#ffb4ab] truncate">Syntax Golem</span>
                <span className="font-heading font-bold text-[#f43f5e]">{bossHp}/{maxBossHp}</span>
              </div>
              <div className="w-full h-2 bg-[#262a35] rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#ffb95f] to-[#f43f5e] transition-all duration-500"
                  style={{ width: `${(bossHp / maxBossHp) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-end gap-1 mt-1">
                {damageDealt && (
                  <span className="text-[#ffb95f] font-heading text-[10px] font-bold animate-bounce">
                    -{damageDealt} CRIT!
                  </span>
                )}
                <span className="px-1.5 py-0.2 rounded bg-[#f43f5e]/30 text-[#ffb4ab] font-heading text-[8px] font-bold">
                  BOSS RAID
                </span>
              </div>
            </div>

            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#0a0e18] border border-[#f43f5e]/50 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2XMlq3RRSSUz9gAcRinPapQUb8MRCVrcB2tNhYIyVJGDbDXRDcEHKFkViArtDa2CUyPoTYwRptRrdnUY9Bc5t9WUVm46TAYiGdHF6d-jlDqLo6wXfx4REElBtpA0e2tr4wOc9tPxYp5iGSTe9KA7JaxTuvVB0wr7AcMFpuuzfAk-9tWbq7rjrtIdy4hekT7nAlqItAzDgrRxbdt5EMb6eC-fR3_CXMj8fLaNW1t6SfDQLEkWCgf5AZg"
                  alt="Syntax Golem Boss"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -left-1 bg-[#f43f5e] text-white font-heading text-[9px] font-bold px-1 rounded">
                LV.15
              </div>
            </div>
          </div>
        </div>

        {/* Boss Dialogue Speech Balloon */}
        <div className="relative bg-[#262a35]/90 border border-[#313540] p-3 rounded-xl flex items-start gap-2 shadow-inner">
          <span className="material-symbols-outlined text-[#f43f5e] text-[20px] flex-shrink-0 mt-0.5">
            chat_bubble
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-[9px] text-[#ffb4ab] uppercase font-bold tracking-wider">
              {currentQ.tauntTitle}
            </span>
            <p className="font-sans text-xs text-[#dfe2f1] italic leading-relaxed">
              {currentQ.bossTaunt}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Grammar Target Card */}
      <section className="flex flex-col w-full bg-[#1c1f2a]/95 border border-[#262a35] rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2.5 py-1 rounded-md bg-[#571bc1]/40 text-[#d0bcff] font-heading text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">swords</span>
            {currentQ.targetConcept}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#ffb95f] font-heading text-[11px] font-bold">
              +{currentQ.xp} XP
            </span>
            <span className="text-[#3d494c]">|</span>
            <span className="text-[#bcc9cd] font-heading text-[10px] uppercase">
              SECTOR {currentIdx + 1}/{GRAMMAR_BATTLE_QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* Sentence Prompt with Cloze Blank */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#0a0e18]/80 border border-[#313540] my-2">
          <p className="font-sans text-sm sm:text-base text-[#dfe2f1] font-medium leading-relaxed">
            {currentQ.sentencePrompt.split('[BLANK]')[0]}
            <span
              className={`inline-block px-2.5 py-0.5 mx-1 rounded border font-heading font-bold transition-all ${
                isAnswered && isCorrect
                  ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]'
                  : isAnswered && !isCorrect
                  ? 'bg-[#f43f5e]/20 border-[#f43f5e] text-[#ffb4ab]'
                  : selectedOption
                  ? 'bg-[#4cd7f6]/20 border-[#4cd7f6] text-[#4cd7f6]'
                  : 'bg-[#262a35] border-[#4cd7f6]/60 text-[#4cd7f6] border-dashed animate-pulse'
              }`}
            >
              {selectedOption || '____?____'}
            </span>
            {currentQ.sentencePrompt.split('[BLANK]')[1]}
          </p>
        </div>

        {/* 4 Combat Action Spell Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mt-2">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === opt.text;
            const isRight = opt.text.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();

            let borderStyle = 'border-[#313540] bg-[#262a35] text-[#dfe2f1] hover:border-[#4cd7f6]/60';

            if (isAnswered) {
              if (isSelected && isCorrect) {
                borderStyle = 'border-[#4cd7f6] bg-[#003640] text-[#4cd7f6] shadow-[0_0_12px_rgba(76,215,246,0.5)]';
              } else if (isSelected && !isCorrect) {
                borderStyle = 'border-[#f43f5e] bg-[#313540] text-[#ffb4ab]';
              } else if (isRight) {
                borderStyle = 'border-[#10b981] bg-[#064e3b]/40 text-[#10b981]';
              } else {
                borderStyle = 'border-[#1c1f2a] bg-[#171b26] text-[#869397] opacity-50';
              }
            } else if (isSelected) {
              borderStyle = 'border-[#4cd7f6] bg-[#0a0e18] text-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.3)]';
            }

            return (
              <button
                key={opt.text}
                onClick={() => handleSelectOption(opt.text)}
                disabled={isAnswered}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all active:translate-y-0.5 text-left ${borderStyle}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#171b26] flex items-center justify-center text-[#4cd7f6] flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px]">{opt.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading text-[10px] text-[#869397] uppercase">
                      ACT 0{idx + 1} • {opt.actionName}
                    </span>
                    <span className="font-heading text-sm sm:text-base font-bold truncate">
                      “{opt.text}”
                    </span>
                  </div>
                </div>

                {isSelected && !isAnswered && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_6px_#4cd7f6]" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Tactical Explanation Codex */}
      {isAnswered && (
        <section className="flex flex-col w-full bg-[#0a0e18] border border-[#262a35] rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1c1f2a]">
            <span
              className={`material-symbols-outlined text-[20px] ${
                isCorrect ? 'text-[#4cd7f6]' : 'text-[#ffb4ab]'
              }`}
            >
              {isCorrect ? 'check_circle' : 'warning'}
            </span>
            <span
              className={`font-heading text-sm font-bold ${
                isCorrect ? 'text-[#4cd7f6]' : 'text-[#ffb4ab]'
              }`}
            >
              {isCorrect ? 'CRITICAL HIT IMPACT: -35 HP to Syntax Golem!' : 'DEFLECTION: Boss Retaliation!'}
            </span>
          </div>

          <div className="mt-2.5 text-xs text-[#dfe2f1] leading-relaxed">
            <span className="font-heading text-[#d0bcff] font-bold block mb-1">
              Grammar Protocol Matrix:
            </span>
            {currentQ.grammarProtocol}
          </div>
        </section>
      )}

      {/* 4. Combat Inventory & Unleash Button */}
      <section className="flex flex-col w-full gap-2.5">
        {/* Support items bar */}
        <div className="flex items-center justify-between bg-[#171b26] border border-[#262a35] p-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="font-heading text-[10px] text-[#869397] uppercase">Tactical Arsenal:</span>
            <button
              onClick={handleUseHint}
              disabled={hintActive || isAnswered || playerCoins < 15}
              className="flex items-center gap-1 bg-[#262a35] hover:bg-[#313540] disabled:opacity-50 text-[#dfe2f1] px-2.5 py-1 rounded-lg text-xs font-heading font-semibold"
            >
              <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">lightbulb</span>
              <span>Hint (-15🪙)</span>
            </button>
            <button
              onClick={handleHealPlayer}
              disabled={playerHp >= 100 || playerCoins < 25}
              className="flex items-center gap-1 bg-[#262a35] hover:bg-[#313540] disabled:opacity-50 text-[#dfe2f1] px-2.5 py-1 rounded-lg text-xs font-heading font-semibold"
            >
              <span className="material-symbols-outlined text-[14px] text-[#10b981]">local_pharmacy</span>
              <span>Heal +30HP (-25🪙)</span>
            </button>
          </div>

          <span className="font-heading text-xs text-[#ffb95f] font-bold">
            {playerCoins} 🪙
          </span>
        </div>

        {hintActive && (
          <div className="bg-[#571bc1]/20 border border-[#571bc1]/40 p-2.5 rounded-xl text-xs text-[#d0bcff]">
            💡 Tactical Hint: Look closely at the timeline of the condition clause versus the main outcome. Bare root or past perfect?
          </div>
        )}

        {/* Strike execution button */}
        {!isAnswered ? (
          <button
            onClick={handleUnleashStrike}
            disabled={!selectedOption}
            className={`w-full h-12 sm:h-13 rounded-xl font-heading text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              selectedOption
                ? 'bg-gradient-to-r from-[#f43f5e] via-[#8b5cf6] to-[#4cd7f6] text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] active:translate-y-0.5'
                : 'bg-[#1c1f2a] border border-[#262a35] text-[#869397] opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span>UNLEASH GRAMMAR STRIKE</span>
          </button>
        ) : (
          <button
            onClick={handleNextEncounter}
            className="w-full h-12 sm:h-13 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] font-heading text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_0_#004e5c] active:translate-y-0.5 transition-all"
          >
            <span>
              {bossHp <= 0 || currentIdx + 1 >= GRAMMAR_BATTLE_QUESTIONS.length
                ? 'FINISH BOSS RAID'
                : 'NEXT ATTACK PHASE'}
            </span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        )}
      </section>
    </div>
  );
};
